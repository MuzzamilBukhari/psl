import re
from dataclasses import dataclass, field

# ── Default stop words (can be overridden from DB) ──────────────────────────
DEFAULT_STOP_WORDS = set(
    "is am are was were the a an to of and in on it do does did be been "
    "being have has had this that for with at by from or but not so if "
    "then very just also as".split()
)

# ── Default synonym map (can be overridden from DB) ──────────────────────────
DEFAULT_SYNONYMS: dict[str, str] = {
    "hi": "hello", "hey": "hello", "greetings": "hello",
    "thanks": "thank_you", "thankyou": "thank_you", "thx": "thank_you",
    "ok": "good", "okay": "good", "fine": "good", "great": "good",
    "nice": "good",
    "me": "i", "my": "i", "mine": "i",
    "your": "you", "yours": "you",
    "eat": "food", "hungry": "food",
    "drink": "water", "thirsty": "water",
    "house": "home",
    "study": "school", "education": "school",
    "know": "learn", "teach": "learn",
    "ask": "what",
    "pardon": "sorry", "excuse": "sorry",
    "like": "love", "dear": "love",
}

# ── Phrase templates (regex → gloss list) ────────────────────────────────────
PHRASE_TEMPLATES = [
    (
        r"^(?:hello|hi|hey)\s+(?:my name is|i am|i am called)\s+(.+)$",
        lambda m: ["hello", "i", "name"] + _clean_words(m.group(1)),
        "PSL intro template",
        ["template:introduction", "unknown tokens fingerspelled"],
    ),
    (
        r"^(?:what(?:'s| is)?\s+your\s+name|your\s+name\s+what)$",
        lambda m: ["you", "name", "what"],
        "PSL question template",
        ["question word moved to end"],
    ),
    (
        r"^(?:how are you|how r you)$",
        lambda m: ["you", "how"],
        "PSL question template",
        ["question phrase simplified"],
    ),
    (
        r"^(?:i am|im)\s+(?:fine|good|okay|ok)$",
        lambda m: ["i", "good"],
        "PSL state template",
        ["state phrase normalized"],
    ),
    (
        r"^(?:please\s+)?help\s+me$",
        lambda m: ["please", "help", "i"],
        "PSL request template",
        ["request phrase normalized"],
    ),
]


@dataclass
class TranslationResult:
    tokens: list[str]
    mode: str
    notes: list[str]
    fingerspelled_count: int = 0

    def dict(self) -> dict:
        return {
            "tokens": self.tokens,
            "mode": self.mode,
            "notes": self.notes,
            "fingerspelled_count": self.fingerspelled_count,
        }


def _clean_words(text: str) -> list[str]:
    """Lowercase, strip punctuation, split into words."""
    return [w for w in re.sub(r"[^\w\s]", " ", text.lower()).split() if w]


class NLPEngine:
    """
    Text-to-PSL-Gloss translation engine.

    Mirrors the JS prototype logic but is fully configurable:
    - stop_words and synonyms can be injected from the DB at runtime
    - known_signs is used to count fingerspelled tokens
    """

    def __init__(
        self,
        stop_words: set[str] | None = None,
        synonyms: dict[str, str] | None = None,
        known_signs: set[str] | None = None,
    ):
        self.stop_words = stop_words if stop_words is not None else DEFAULT_STOP_WORDS
        self.synonyms = synonyms if synonyms is not None else DEFAULT_SYNONYMS
        self.known_signs = known_signs or set()

    def translate(self, text: str) -> TranslationResult:
        normalized = re.sub(r"\s+", " ", text.strip().lower())

        # Layer 1: phrase templates
        for pattern, builder, mode, notes in PHRASE_TEMPLATES:
            m = re.match(pattern, normalized)
            if m:
                tokens = builder(m)
                fs = sum(1 for t in tokens if t not in self.known_signs)
                return TranslationResult(tokens=tokens, mode=mode, notes=notes, fingerspelled_count=fs)

        # Layer 2: stop-word removal + synonym mapping
        words = _clean_words(normalized)
        tokens = [
            self.synonyms.get(w, w)
            for w in words
            if w not in self.stop_words
        ]

        notes = ["lexical mapping"]
        fs = sum(1 for t in tokens if t not in self.known_signs)
        if fs:
            notes.append("unknown tokens fingerspelled")

        return TranslationResult(tokens=tokens, mode="lexical", notes=notes, fingerspelled_count=fs)
