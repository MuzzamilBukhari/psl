"""
Seed data: default PSL signs.

Keyframes use a JSON-serializable format that mirrors the frontend engine:
  - d:    duration in ms
  - rh:   right hand target offset from a landmark [landmark, [x, y, z]]
  - lh:   left hand target offset from a landmark [landmark, [x, y, z]]
  - rhs:  right-hand handshape name (frontend HANDSHAPES registry)
  - lhs:  left-hand handshape name
  - headX / headY: head rotation angles (radians)

Handshapes prefixed "psl_" are data-derived: median per-finger curls computed
from the PSL MediaPipe landmark dataset (real signer recordings, wordDataset /
rightHandDataset tables). Other keyframe positions are authored approximations
— validate against PSL dictionary videos (psl.org.pk) before claiming fidelity.

Landmarks: head, neck, chest, spine, hips, rShoulder, lShoulder.
"""

SEED_SIGNS = [
    # ── Greetings & social ────────────────────────────────────────────────────
    {"key": "hello", "label": "Hello", "category": "greeting",
     "description": "Open hand near forehead, wave side to side",
     "keyframes": [
         {"d": 400, "rh": ["head", [0.15, 0.05, 0.22]], "rhs": "open"},
         {"d": 250, "rh": ["head", [0.25, 0.05, 0.25]], "rhs": "open"},
         {"d": 250, "rh": ["head", [0.05, 0.05, 0.22]], "rhs": "open"},
         {"d": 250, "rh": ["head", [0.25, 0.05, 0.25]], "rhs": "open"}]},
    {"key": "thank_you", "label": "Thank You", "category": "social",
     "description": "Flat hand touches chin, moves forward (dataset handshape)",
     "keyframes": [
         {"d": 400, "rh": ["head", [0.05, -0.1, 0.2]], "rhs": "psl_thanks"},
         {"d": 500, "rh": ["chest", [0.05, 0.1, 0.4]], "rhs": "psl_thanks"}]},
    {"key": "welcome", "label": "Welcome", "category": "greeting",
     "description": "Both arms open wide",
     "keyframes": [
         {"d": 400, "rh": ["chest", [-0.2, 0.1, 0.25]], "rhs": "open", "lh": ["chest", [0.2, 0.1, 0.25]], "lhs": "open"},
         {"d": 500, "rh": ["chest", [-0.45, 0.15, 0.2]], "rhs": "open", "lh": ["chest", [0.45, 0.15, 0.2]], "lhs": "open"}]},
    {"key": "please", "label": "Please", "category": "social",
     "description": "Open hand circles on chest",
     "keyframes": [
         {"d": 300, "rh": ["chest", [0.0, 0.05, 0.2]], "rhs": "flat"},
         {"d": 300, "rh": ["chest", [0.08, 0.1, 0.2]], "rhs": "flat"},
         {"d": 300, "rh": ["chest", [0.0, 0.15, 0.2]], "rhs": "flat"},
         {"d": 300, "rh": ["chest", [-0.08, 0.1, 0.2]], "rhs": "flat"}]},
    {"key": "sorry", "label": "Sorry", "category": "social",
     "description": "Fist on chest, circular motion, head bows",
     "keyframes": [
         {"d": 300, "rh": ["chest", [0.0, 0.05, 0.2]], "rhs": "fist", "headX": 0.12},
         {"d": 300, "rh": ["chest", [0.08, 0.1, 0.2]], "rhs": "fist", "headX": 0.12},
         {"d": 300, "rh": ["chest", [0.0, 0.15, 0.2]], "rhs": "fist", "headX": 0.12},
         {"d": 300, "rh": ["chest", [-0.08, 0.1, 0.2]], "rhs": "fist", "headX": 0.12}]},
    {"key": "friend", "label": "Friend", "category": "social",
     "description": "Index fingers hook together",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.1, 0.1, 0.38]], "rhs": "point", "lh": ["chest", [0.1, 0.1, 0.38]], "lhs": "point"},
         {"d": 300, "rh": ["chest", [-0.02, 0.1, 0.38]], "rhs": "point", "lh": ["chest", [0.02, 0.1, 0.38]], "lhs": "point"},
         {"d": 300, "rh": ["chest", [-0.1, 0.1, 0.38]], "rhs": "point", "lh": ["chest", [0.1, 0.1, 0.38]], "lhs": "point"}]},
    {"key": "name", "label": "Name", "category": "social",
     "description": "Two-finger hand taps other palm (dataset handshape)",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.08, 0.15, 0.45]], "rhs": "psl_name", "lh": ["chest", [0.08, 0.0, 0.42]], "lhs": "flat"},
         {"d": 200, "rh": ["chest", [-0.08, 0.03, 0.44]], "rhs": "psl_name", "lh": ["chest", [0.08, 0.0, 0.42]], "lhs": "flat"},
         {"d": 200, "rh": ["chest", [-0.08, 0.15, 0.45]], "rhs": "psl_name", "lh": ["chest", [0.08, 0.0, 0.42]], "lhs": "flat"},
         {"d": 200, "rh": ["chest", [-0.08, 0.03, 0.44]], "rhs": "psl_name", "lh": ["chest", [0.08, 0.0, 0.42]], "lhs": "flat"}]},
    {"key": "peace", "label": "Peace", "category": "social",
     "description": "V-sign raised up",
     "keyframes": [
         {"d": 400, "rh": ["head", [0.12, 0.0, 0.25]], "rhs": "v"},
         {"d": 400, "rh": ["head", [0.12, 0.2, 0.3]], "rhs": "v"}]},

    # ── Pronouns & possessives ───────────────────────────────────────────────
    {"key": "i", "label": "I / Me", "category": "pronoun",
     "description": "Index finger points to own chest (dataset handshape)",
     "keyframes": [
         {"d": 400, "rh": ["chest", [0.0, 0.0, 0.2]], "rhs": "psl_me"},
         {"d": 250, "rh": ["chest", [0.0, 0.02, 0.18]], "rhs": "psl_me"}]},
    {"key": "you", "label": "You", "category": "pronoun",
     "description": "Index finger points forward (dataset handshape)",
     "keyframes": [
         {"d": 400, "rh": ["chest", [0.0, 0.08, 0.5]], "rhs": "psl_you"},
         {"d": 250, "rh": ["chest", [0.0, 0.08, 0.55]], "rhs": "psl_you"}]},
    {"key": "my", "label": "My / Mine", "category": "pronoun",
     "description": "Flat palm rests on chest (dataset handshape)",
     "keyframes": [
         {"d": 400, "rh": ["chest", [0.0, 0.08, 0.18]], "rhs": "psl_my"},
         {"d": 300, "rh": ["chest", [0.0, 0.04, 0.15]], "rhs": "psl_my"}]},
    {"key": "your", "label": "Your / Yours", "category": "pronoun",
     "description": "Open palm pushes toward person (dataset handshape)",
     "keyframes": [
         {"d": 400, "rh": ["chest", [0.0, 0.1, 0.4]], "rhs": "psl_your"},
         {"d": 300, "rh": ["chest", [0.0, 0.1, 0.55]], "rhs": "psl_your"}]},

    # ── Questions ────────────────────────────────────────────────────────────
    {"key": "what", "label": "What", "category": "question",
     "description": "Hands turn palms-up questioning (dataset handshape)",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.25, 0.0, 0.32]], "rhs": "psl_what", "lh": ["chest", [0.25, 0.0, 0.32]], "lhs": "psl_what"},
         {"d": 350, "rh": ["chest", [-0.3, 0.15, 0.38]], "rhs": "psl_what", "lh": ["chest", [0.3, 0.15, 0.38]], "lhs": "psl_what"}]},
    {"key": "how", "label": "How", "category": "question",
     "description": "Both palms up, questioning gesture",
     "keyframes": [
         {"d": 400, "rh": ["chest", [-0.22, 0.0, 0.35]], "rhs": "open", "lh": ["chest", [0.22, 0.0, 0.35]], "lhs": "open"},
         {"d": 400, "rh": ["chest", [-0.28, 0.12, 0.4]], "rhs": "open", "lh": ["chest", [0.28, 0.12, 0.4]], "lhs": "open"}]},
    {"key": "where", "label": "Where", "category": "question",
     "description": "Index finger wags side to side",
     "keyframes": [
         {"d": 300, "rh": ["chest", [0.0, 0.25, 0.4]], "rhs": "point"},
         {"d": 200, "rh": ["chest", [-0.08, 0.25, 0.4]], "rhs": "point"},
         {"d": 200, "rh": ["chest", [0.08, 0.25, 0.4]], "rhs": "point"},
         {"d": 200, "rh": ["chest", [-0.08, 0.25, 0.4]], "rhs": "point"}]},
    {"key": "who", "label": "Who", "category": "question",
     "description": "Index finger near chin",
     "keyframes": [
         {"d": 400, "rh": ["head", [0.03, -0.12, 0.18]], "rhs": "point"},
         {"d": 250, "rh": ["head", [0.03, -0.08, 0.18]], "rhs": "point"}]},
    {"key": "when", "label": "When", "category": "question",
     "description": "Index finger circles",
     "keyframes": [
         {"d": 300, "rh": ["chest", [0.0, 0.2, 0.4]], "rhs": "point"},
         {"d": 250, "rh": ["chest", [0.08, 0.28, 0.4]], "rhs": "point"},
         {"d": 250, "rh": ["chest", [0.0, 0.34, 0.4]], "rhs": "point"},
         {"d": 250, "rh": ["chest", [-0.08, 0.28, 0.4]], "rhs": "point"}]},
    {"key": "why", "label": "Why", "category": "question",
     "description": "Touch forehead, then Y-hand out",
     "keyframes": [
         {"d": 350, "rh": ["head", [0.05, 0.02, 0.15]], "rhs": "point"},
         {"d": 400, "rh": ["chest", [0.0, 0.2, 0.4]], "rhs": "y"}]},

    # ── Affirmation / negation ───────────────────────────────────────────────
    {"key": "yes", "label": "Yes", "category": "affirmation",
     "description": "Head nods up and down",
     "keyframes": [
         {"d": 200, "headX": 0.15}, {"d": 200, "headX": -0.1},
         {"d": 200, "headX": 0.15}, {"d": 200, "headX": 0.0}]},
    {"key": "no", "label": "No", "category": "negation",
     "description": "Head shakes side to side with finger wag",
     "keyframes": [
         {"d": 250, "rh": ["head", [0.08, 0.05, 0.3]], "rhs": "point", "headY": 0.0},
         {"d": 200, "rh": ["head", [0.18, 0.05, 0.3]], "rhs": "point", "headY": 0.15},
         {"d": 200, "rh": ["head", [-0.02, 0.05, 0.3]], "rhs": "point", "headY": -0.15},
         {"d": 200, "rh": ["head", [0.18, 0.05, 0.3]], "rhs": "point", "headY": 0.15}]},

    # ── Emotions & qualities ─────────────────────────────────────────────────
    {"key": "good", "label": "Good", "category": "emotion",
     "description": "Thumbs up, push forward (dataset handshape)",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.05, 0.05, 0.25]], "rhs": "psl_good"},
         {"d": 400, "rh": ["chest", [-0.05, 0.1, 0.45]], "rhs": "psl_good"}]},
    {"key": "bad", "label": "Bad", "category": "emotion",
     "description": "Hand at chin, flip outward and down",
     "keyframes": [
         {"d": 350, "rh": ["head", [0.05, -0.1, 0.2]], "rhs": "flat"},
         {"d": 400, "rh": ["chest", [0.05, -0.05, 0.35]], "rhs": "flat"}]},
    {"key": "love", "label": "Love", "category": "emotion",
     "description": "Cross both arms over chest in hug",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.35, 0.05, 0.22]], "rhs": "fist", "lh": ["chest", [0.35, 0.05, 0.22]], "lhs": "fist"},
         {"d": 500, "rh": ["chest", [0.12, 0.05, 0.18]], "rhs": "fist", "lh": ["chest", [-0.12, 0.05, 0.18]], "lhs": "fist"}]},
    {"key": "happy", "label": "Happy", "category": "emotion",
     "description": "Open hands sweep upward on chest",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.12, 0.0, 0.25]], "rhs": "open", "lh": ["chest", [0.12, 0.0, 0.25]], "lhs": "open"},
         {"d": 350, "rh": ["chest", [-0.12, 0.2, 0.3]], "rhs": "open", "lh": ["chest", [0.12, 0.2, 0.3]], "lhs": "open"},
         {"d": 300, "rh": ["chest", [-0.12, 0.05, 0.27]], "rhs": "open", "lh": ["chest", [0.12, 0.05, 0.27]], "lhs": "open"},
         {"d": 350, "rh": ["chest", [-0.12, 0.22, 0.3]], "rhs": "open", "lh": ["chest", [0.12, 0.22, 0.3]], "lhs": "open"}]},
    {"key": "sad", "label": "Sad", "category": "emotion",
     "description": "Open hands slide down in front of face, head drops",
     "keyframes": [
         {"d": 350, "rh": ["head", [-0.08, 0.05, 0.25]], "rhs": "open", "lh": ["head", [0.08, 0.05, 0.25]], "lhs": "open"},
         {"d": 500, "rh": ["chest", [-0.08, 0.1, 0.28]], "rhs": "open", "lh": ["chest", [0.08, 0.1, 0.28]], "lhs": "open", "headX": 0.15}]},
    {"key": "big", "label": "Big", "category": "quality",
     "description": "Hands spread far apart",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.1, 0.1, 0.35]], "rhs": "c", "lh": ["chest", [0.1, 0.1, 0.35]], "lhs": "c"},
         {"d": 450, "rh": ["chest", [-0.4, 0.12, 0.35]], "rhs": "c", "lh": ["chest", [0.4, 0.12, 0.35]], "lhs": "c"}]},
    {"key": "small", "label": "Small", "category": "quality",
     "description": "Flat hands move close together",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.2, 0.1, 0.35]], "rhs": "flat", "lh": ["chest", [0.2, 0.1, 0.35]], "lhs": "flat"},
         {"d": 450, "rh": ["chest", [-0.05, 0.1, 0.35]], "rhs": "flat", "lh": ["chest", [0.05, 0.1, 0.35]], "lhs": "flat"}]},
    {"key": "hot", "label": "Hot", "category": "quality",
     "description": "C-hand at mouth flicks away",
     "keyframes": [
         {"d": 300, "rh": ["head", [0.05, -0.1, 0.18]], "rhs": "c"},
         {"d": 350, "rh": ["chest", [0.15, 0.15, 0.4]], "rhs": "open"}]},
    {"key": "cold", "label": "Cold", "category": "quality",
     "description": "Both fists shake near chest (shivering)",
     "keyframes": [
         {"d": 250, "rh": ["chest", [-0.12, 0.1, 0.3]], "rhs": "fist", "lh": ["chest", [0.12, 0.1, 0.3]], "lhs": "fist"},
         {"d": 180, "rh": ["chest", [-0.16, 0.1, 0.3]], "rhs": "fist", "lh": ["chest", [0.08, 0.1, 0.3]], "lhs": "fist"},
         {"d": 180, "rh": ["chest", [-0.08, 0.1, 0.3]], "rhs": "fist", "lh": ["chest", [0.16, 0.1, 0.3]], "lhs": "fist"},
         {"d": 180, "rh": ["chest", [-0.16, 0.1, 0.3]], "rhs": "fist", "lh": ["chest", [0.08, 0.1, 0.3]], "lhs": "fist"}]},
    {"key": "little", "label": "Little / Few", "category": "quality",
     "description": "Index and thumb pinch small amount (dataset handshape)",
     "keyframes": [
         {"d": 400, "rh": ["chest", [-0.05, 0.15, 0.35]], "rhs": "psl_little"},
         {"d": 300, "rh": ["chest", [-0.05, 0.12, 0.35]], "rhs": "psl_little"}]},

    # ── Actions ──────────────────────────────────────────────────────────────
    {"key": "help", "label": "Help", "category": "action",
     "description": "Thumbs-up fist on flat palm, both lift up",
     "keyframes": [
         {"d": 400, "rh": ["chest", [0.0, -0.05, 0.3]], "rhs": "thumbs_up", "lh": ["chest", [0.0, -0.08, 0.28]], "lhs": "flat"},
         {"d": 450, "rh": ["chest", [0.0, 0.2, 0.35]], "rhs": "thumbs_up", "lh": ["chest", [0.0, 0.17, 0.32]], "lhs": "flat"}]},
    {"key": "want", "label": "Want", "category": "action",
     "description": "Both hands reach out, pull toward self",
     "keyframes": [
         {"d": 400, "rh": ["chest", [-0.12, 0.05, 0.5]], "rhs": "half_curl", "lh": ["chest", [0.12, 0.05, 0.5]], "lhs": "half_curl"},
         {"d": 400, "rh": ["chest", [-0.05, 0.0, 0.2]], "rhs": "half_curl", "lh": ["chest", [0.05, 0.0, 0.2]], "lhs": "half_curl"}]},
    {"key": "learn", "label": "Learn / Study", "category": "education",
     "description": "Pick from palm and bring to forehead",
     "keyframes": [
         {"d": 350, "rh": ["chest", [0.0, 0.05, 0.3]], "rhs": "o", "lh": ["chest", [0.05, 0.0, 0.3]], "lhs": "flat"},
         {"d": 400, "rh": ["head", [0.0, 0.05, 0.2]], "rhs": "o"}]},
    {"key": "know", "label": "Know / Understand", "category": "education",
     "description": "Fingers touch forehead (dataset handshape)",
     "keyframes": [
         {"d": 400, "rh": ["head", [0.06, 0.03, 0.16]], "rhs": "psl_know"},
         {"d": 300, "rh": ["head", [0.06, 0.0, 0.18]], "rhs": "psl_know"}]},
    {"key": "go", "label": "Go", "category": "action",
     "description": "Index finger points and moves away",
     "keyframes": [
         {"d": 350, "rh": ["chest", [0.0, 0.1, 0.3]], "rhs": "point"},
         {"d": 400, "rh": ["chest", [0.0, 0.15, 0.55]], "rhs": "point"}]},
    {"key": "come", "label": "Come", "category": "action",
     "description": "Open hand pulls toward body",
     "keyframes": [
         {"d": 350, "rh": ["chest", [0.0, 0.1, 0.5]], "rhs": "open"},
         {"d": 400, "rh": ["chest", [0.0, 0.05, 0.2]], "rhs": "half_curl"}]},
    {"key": "stop", "label": "Stop", "category": "action",
     "description": "Flat hand raised, palm forward",
     "keyframes": [
         {"d": 350, "rh": ["chest", [0.0, 0.25, 0.45]], "rhs": "flat"},
         {"d": 300, "rh": ["chest", [0.0, 0.25, 0.5]], "rhs": "flat"}]},
    {"key": "sit", "label": "Sit", "category": "action",
     "description": "Both flat hands press downward",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.15, 0.05, 0.35]], "rhs": "flat", "lh": ["chest", [0.15, 0.05, 0.35]], "lhs": "flat"},
         {"d": 400, "rh": ["chest", [-0.15, -0.12, 0.35]], "rhs": "flat", "lh": ["chest", [0.15, -0.12, 0.35]], "lhs": "flat"}]},
    {"key": "sleep", "label": "Sleep", "category": "action",
     "description": "Flat palm to cheek, head tilts",
     "keyframes": [
         {"d": 400, "rh": ["head", [0.12, -0.05, 0.15]], "rhs": "flat"},
         {"d": 500, "rh": ["head", [0.12, -0.05, 0.15]], "rhs": "flat", "headX": 0.1, "headY": 0.15}]},
    {"key": "work", "label": "Work", "category": "action",
     "description": "Fist taps other wrist twice",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.05, 0.12, 0.38]], "rhs": "fist", "lh": ["chest", [0.08, 0.0, 0.35]], "lhs": "fist"},
         {"d": 250, "rh": ["chest", [-0.02, 0.03, 0.37]], "rhs": "fist", "lh": ["chest", [0.08, 0.0, 0.35]], "lhs": "fist"},
         {"d": 250, "rh": ["chest", [-0.05, 0.12, 0.38]], "rhs": "fist", "lh": ["chest", [0.08, 0.0, 0.35]], "lhs": "fist"},
         {"d": 250, "rh": ["chest", [-0.02, 0.03, 0.37]], "rhs": "fist", "lh": ["chest", [0.08, 0.0, 0.35]], "lhs": "fist"}]},
    {"key": "pray", "label": "Pray / Dua", "category": "action",
     "description": "Both open palms held up together",
     "keyframes": [
         {"d": 400, "rh": ["chest", [-0.06, 0.1, 0.3]], "rhs": "open", "lh": ["chest", [0.06, 0.1, 0.3]], "lhs": "open"},
         {"d": 500, "rh": ["chest", [-0.06, 0.18, 0.28]], "rhs": "open", "lh": ["chest", [0.06, 0.18, 0.28]], "lhs": "open", "headX": 0.1}]},
    {"key": "read", "label": "Read", "category": "education",
     "description": "Two fingers scan across other palm",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.02, 0.12, 0.38]], "rhs": "v", "lh": ["chest", [0.08, 0.05, 0.35]], "lhs": "flat"},
         {"d": 300, "rh": ["chest", [0.05, 0.02, 0.38]], "rhs": "v", "lh": ["chest", [0.08, 0.05, 0.35]], "lhs": "flat"},
         {"d": 300, "rh": ["chest", [-0.02, 0.12, 0.38]], "rhs": "v", "lh": ["chest", [0.08, 0.05, 0.35]], "lhs": "flat"}]},
    {"key": "write", "label": "Write", "category": "education",
     "description": "Pinched fingers move across other palm",
     "keyframes": [
         {"d": 350, "rh": ["chest", [0.0, 0.08, 0.38]], "rhs": "o", "lh": ["chest", [0.08, 0.02, 0.35]], "lhs": "flat"},
         {"d": 350, "rh": ["chest", [-0.08, 0.05, 0.38]], "rhs": "o", "lh": ["chest", [0.08, 0.02, 0.35]], "lhs": "flat"}]},
    {"key": "book", "label": "Book", "category": "education",
     "description": "Palms together open like a book",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.03, 0.1, 0.35]], "rhs": "flat", "lh": ["chest", [0.03, 0.1, 0.35]], "lhs": "flat"},
         {"d": 450, "rh": ["chest", [-0.18, 0.1, 0.35]], "rhs": "open", "lh": ["chest", [0.18, 0.1, 0.35]], "lhs": "open"}]},

    # ── Everyday things ──────────────────────────────────────────────────────
    {"key": "food", "label": "Food / Eat", "category": "basic_needs",
     "description": "Bunched fingers move to mouth (dataset handshape)",
     "keyframes": [
         {"d": 300, "rh": ["head", [0.05, -0.12, 0.18]], "rhs": "psl_eat"},
         {"d": 250, "rh": ["head", [0.03, -0.05, 0.22]], "rhs": "psl_eat"},
         {"d": 300, "rh": ["head", [0.05, -0.12, 0.18]], "rhs": "psl_eat"}]},
    {"key": "water", "label": "Water / Drink", "category": "basic_needs",
     "description": "C-hand tilts to mouth like drinking",
     "keyframes": [
         {"d": 350, "rh": ["head", [0.1, -0.1, 0.22]], "rhs": "c"},
         {"d": 400, "rh": ["head", [0.05, -0.03, 0.18]], "rhs": "c"},
         {"d": 350, "rh": ["head", [0.1, -0.1, 0.22]], "rhs": "c"}]},
    {"key": "phone", "label": "Phone / Call", "category": "things",
     "description": "Y-hand held to ear (dataset handshape)",
     "keyframes": [
         {"d": 400, "rh": ["head", [0.14, -0.05, 0.12]], "rhs": "psl_phone"},
         {"d": 400, "rh": ["head", [0.13, -0.03, 0.13]], "rhs": "psl_phone"}]},
    {"key": "money", "label": "Money", "category": "things",
     "description": "Bunched fingers tap other palm",
     "keyframes": [
         {"d": 350, "rh": ["chest", [0.0, 0.1, 0.36]], "rhs": "o", "lh": ["chest", [0.06, 0.02, 0.34]], "lhs": "flat"},
         {"d": 250, "rh": ["chest", [0.02, 0.04, 0.35]], "rhs": "o", "lh": ["chest", [0.06, 0.02, 0.34]], "lhs": "flat"},
         {"d": 250, "rh": ["chest", [0.0, 0.1, 0.36]], "rhs": "o", "lh": ["chest", [0.06, 0.02, 0.34]], "lhs": "flat"}]},
    {"key": "car", "label": "Car / Drive", "category": "things",
     "description": "Two fists steer a wheel",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.15, 0.05, 0.4]], "rhs": "fist", "lh": ["chest", [0.15, 0.05, 0.4]], "lhs": "fist"},
         {"d": 300, "rh": ["chest", [-0.15, 0.12, 0.4]], "rhs": "fist", "lh": ["chest", [0.15, -0.02, 0.4]], "lhs": "fist"},
         {"d": 300, "rh": ["chest", [-0.15, -0.02, 0.4]], "rhs": "fist", "lh": ["chest", [0.15, 0.12, 0.4]], "lhs": "fist"}]},
    {"key": "home", "label": "Home", "category": "places",
     "description": "Both hands form roof shape, move apart",
     "keyframes": [
         {"d": 400, "rh": ["head", [-0.08, 0.12, 0.22]], "rhs": "flat", "lh": ["head", [0.08, 0.12, 0.22]], "lhs": "flat"},
         {"d": 400, "rh": ["head", [-0.3, 0.0, 0.22]], "rhs": "flat", "lh": ["head", [0.3, 0.0, 0.22]], "lhs": "flat"}]},
    {"key": "school", "label": "School", "category": "education",
     "description": "Both hands flat, clap together twice",
     "keyframes": [
         {"d": 300, "rh": ["chest", [-0.15, 0.12, 0.35]], "rhs": "flat", "lh": ["chest", [0.15, 0.12, 0.35]], "lhs": "flat"},
         {"d": 200, "rh": ["chest", [-0.03, 0.12, 0.38]], "rhs": "flat", "lh": ["chest", [0.03, 0.12, 0.38]], "lhs": "flat"},
         {"d": 200, "rh": ["chest", [-0.15, 0.12, 0.35]], "rhs": "flat", "lh": ["chest", [0.15, 0.12, 0.35]], "lhs": "flat"},
         {"d": 200, "rh": ["chest", [-0.03, 0.12, 0.38]], "rhs": "flat", "lh": ["chest", [0.03, 0.12, 0.38]], "lhs": "flat"}]},

    # ── People ───────────────────────────────────────────────────────────────
    {"key": "doctor", "label": "Doctor", "category": "people",
     "description": "Two fingers tap other wrist (pulse check)",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.02, 0.12, 0.38]], "rhs": "v", "lh": ["chest", [0.1, 0.02, 0.35]], "lhs": "flat"},
         {"d": 250, "rh": ["chest", [0.04, 0.04, 0.36]], "rhs": "v", "lh": ["chest", [0.1, 0.02, 0.35]], "lhs": "flat"},
         {"d": 250, "rh": ["chest", [-0.02, 0.12, 0.38]], "rhs": "v", "lh": ["chest", [0.1, 0.02, 0.35]], "lhs": "flat"}]},
    {"key": "police", "label": "Police", "category": "people",
     "description": "Flat hand salute at forehead",
     "keyframes": [
         {"d": 400, "rh": ["head", [0.12, 0.05, 0.15]], "rhs": "flat"},
         {"d": 350, "rh": ["head", [0.14, 0.06, 0.15]], "rhs": "flat"}]},

    # ── Time ─────────────────────────────────────────────────────────────────
    {"key": "today", "label": "Today / Now", "category": "time",
     "description": "Both palms up, drop down in place",
     "keyframes": [
         {"d": 350, "rh": ["chest", [-0.15, 0.15, 0.35]], "rhs": "open", "lh": ["chest", [0.15, 0.15, 0.35]], "lhs": "open"},
         {"d": 350, "rh": ["chest", [-0.15, 0.02, 0.35]], "rhs": "open", "lh": ["chest", [0.15, 0.02, 0.35]], "lhs": "open"}]},
    {"key": "tomorrow", "label": "Tomorrow", "category": "time",
     "description": "Thumb at cheek arcs forward",
     "keyframes": [
         {"d": 350, "rh": ["head", [0.1, -0.08, 0.15]], "rhs": "thumbs_up"},
         {"d": 450, "rh": ["head", [0.12, -0.02, 0.35]], "rhs": "thumbs_up"}]},
    {"key": "yesterday", "label": "Yesterday", "category": "time",
     "description": "Thumb at cheek arcs back toward shoulder",
     "keyframes": [
         {"d": 350, "rh": ["head", [0.1, -0.08, 0.2]], "rhs": "thumbs_up"},
         {"d": 450, "rh": ["rShoulder", [-0.05, 0.1, 0.05]], "rhs": "thumbs_up"}]},

    # ── Numbers ──────────────────────────────────────────────────────────────
    {"key": "one", "label": "One (1)", "category": "number",
     "description": "Index finger raised",
     "keyframes": [
         {"d": 400, "rh": ["rShoulder", [-0.1, 0.2, 0.3]], "rhs": "one"},
         {"d": 300, "rh": ["rShoulder", [-0.1, 0.22, 0.3]], "rhs": "one"}]},
    {"key": "two", "label": "Two (2)", "category": "number",
     "description": "Index and middle fingers raised",
     "keyframes": [
         {"d": 400, "rh": ["rShoulder", [-0.1, 0.2, 0.3]], "rhs": "two"},
         {"d": 300, "rh": ["rShoulder", [-0.1, 0.22, 0.3]], "rhs": "two"}]},
    {"key": "three", "label": "Three (3)", "category": "number",
     "description": "Thumb, index and middle raised",
     "keyframes": [
         {"d": 400, "rh": ["rShoulder", [-0.1, 0.2, 0.3]], "rhs": "three"},
         {"d": 300, "rh": ["rShoulder", [-0.1, 0.22, 0.3]], "rhs": "three"}]},
    {"key": "four", "label": "Four (4)", "category": "number",
     "description": "Four fingers raised, thumb tucked",
     "keyframes": [
         {"d": 400, "rh": ["rShoulder", [-0.1, 0.2, 0.3]], "rhs": "four"},
         {"d": 300, "rh": ["rShoulder", [-0.1, 0.22, 0.3]], "rhs": "four"}]},
    {"key": "five", "label": "Five (5)", "category": "number",
     "description": "All five fingers spread",
     "keyframes": [
         {"d": 400, "rh": ["rShoulder", [-0.1, 0.2, 0.3]], "rhs": "five"},
         {"d": 300, "rh": ["rShoulder", [-0.1, 0.22, 0.3]], "rhs": "five"}]},
]

# ── PSL Urdu fingerspelling alphabet (37 letters, data-derived handshapes) ───
URDU_LETTERS = [
    "ء", "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش",
    "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ل", "م", "ن", "و", "ٹ", "پ",
    "چ", "ڈ", "ڑ", "ژ", "ک", "گ", "ہ", "ی", "ے",
]

SEED_SIGNS += [
    {
        "key": f"urdu_{letter}",
        "label": letter,
        "description": f"PSL fingerspelling: Urdu letter {letter} (data-derived handshape)",
        "category": "urdu_alphabet",
        "keyframes": [
            {"d": 400, "rh": ["rShoulder", [-0.12, 0.18, 0.28]], "rhs": f"urdu_{letter}"},
            {"d": 300, "rh": ["rShoulder", [-0.12, 0.16, 0.3]], "rhs": f"urdu_{letter}"},
        ],
    }
    for letter in URDU_LETTERS
]

SEED_SYNONYMS = [
    # greetings / social
    {"word": "hi", "maps_to": "hello"},
    {"word": "hey", "maps_to": "hello"},
    {"word": "greetings", "maps_to": "hello"},
    {"word": "salam", "maps_to": "hello"},
    {"word": "thanks", "maps_to": "thank_you"},
    {"word": "thankyou", "maps_to": "thank_you"},
    {"word": "thx", "maps_to": "thank_you"},
    {"word": "pardon", "maps_to": "sorry"},
    {"word": "excuse", "maps_to": "sorry"},
    # qualities / emotions
    {"word": "ok", "maps_to": "good"},
    {"word": "okay", "maps_to": "good"},
    {"word": "fine", "maps_to": "good"},
    {"word": "great", "maps_to": "good"},
    {"word": "nice", "maps_to": "good"},
    {"word": "glad", "maps_to": "happy"},
    {"word": "joy", "maps_to": "happy"},
    {"word": "unhappy", "maps_to": "sad"},
    {"word": "cry", "maps_to": "sad"},
    {"word": "large", "maps_to": "big"},
    {"word": "huge", "maps_to": "big"},
    {"word": "tiny", "maps_to": "small"},
    {"word": "warm", "maps_to": "hot"},
    {"word": "cool", "maps_to": "cold"},
    {"word": "freezing", "maps_to": "cold"},
    {"word": "few", "maps_to": "little"},
    {"word": "bit", "maps_to": "little"},
    # pronouns
    {"word": "me", "maps_to": "i"},
    {"word": "mine", "maps_to": "my"},
    {"word": "yours", "maps_to": "your"},
    # actions
    {"word": "eat", "maps_to": "food"},
    {"word": "hungry", "maps_to": "food"},
    {"word": "drink", "maps_to": "water"},
    {"word": "thirsty", "maps_to": "water"},
    {"word": "understand", "maps_to": "know"},
    {"word": "knows", "maps_to": "know"},
    {"word": "teach", "maps_to": "learn"},
    {"word": "leave", "maps_to": "go"},
    {"word": "going", "maps_to": "go"},
    {"word": "coming", "maps_to": "come"},
    {"word": "halt", "maps_to": "stop"},
    {"word": "wait", "maps_to": "stop"},
    {"word": "tired", "maps_to": "sleep"},
    {"word": "rest", "maps_to": "sleep"},
    {"word": "job", "maps_to": "work"},
    {"word": "prayer", "maps_to": "pray"},
    {"word": "namaz", "maps_to": "pray"},
    {"word": "dua", "maps_to": "pray"},
    {"word": "reading", "maps_to": "read"},
    {"word": "writing", "maps_to": "write"},
    {"word": "pen", "maps_to": "write"},
    # things / places / people
    {"word": "house", "maps_to": "home"},
    {"word": "study", "maps_to": "school"},
    {"word": "education", "maps_to": "school"},
    {"word": "mobile", "maps_to": "phone"},
    {"word": "call", "maps_to": "phone"},
    {"word": "telephone", "maps_to": "phone"},
    {"word": "cash", "maps_to": "money"},
    {"word": "pay", "maps_to": "money"},
    {"word": "rupees", "maps_to": "money"},
    {"word": "vehicle", "maps_to": "car"},
    {"word": "drive", "maps_to": "car"},
    {"word": "dr", "maps_to": "doctor"},
    {"word": "medical", "maps_to": "doctor"},
    {"word": "books", "maps_to": "book"},
    # question words
    {"word": "ask", "maps_to": "what"},
    # emotion
    {"word": "like", "maps_to": "love"},
    {"word": "dear", "maps_to": "love"},
    # time
    {"word": "now", "maps_to": "today"},
    # numbers
    {"word": "1", "maps_to": "one"},
    {"word": "2", "maps_to": "two"},
    {"word": "3", "maps_to": "three"},
    {"word": "4", "maps_to": "four"},
    {"word": "5", "maps_to": "five"},
]

SEED_STOP_WORDS = (
    "is am are was were the a an to of and in on it do does did be been "
    "being have has had this that for with at by from or but not so if "
    "then very just also as"
).split()
