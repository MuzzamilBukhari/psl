"""
Seed data: default PSL signs.

Keyframes use a JSON-serializable format that mirrors the JS SIGNS dictionary.
Each keyframe has:
  - d:   duration in ms
  - rh:  right hand target offset from a landmark [landmark, [x, y, z]]
  - lh:  left hand target offset from a landmark [landmark, [x, y, z]]
  - headX / headY: head rotation angles (radians)

The frontend IK engine uses these to reconstruct 3D positions at runtime.
"""

SEED_SIGNS = [
    {
        "key": "hello",
        "label": "Hello",
        "description": "Open hand near forehead, wave side to side",
        "category": "greeting",
        "keyframes": [
            {"d": 400, "rh": ["head", [0.15, 0.05, 0.22]]},
            {"d": 250, "rh": ["head", [0.25, 0.05, 0.25]]},
            {"d": 250, "rh": ["head", [0.05, 0.05, 0.22]]},
            {"d": 250, "rh": ["head", [0.25, 0.05, 0.25]]},
        ],
    },
    {
        "key": "thank_you",
        "label": "Thank You",
        "description": "Flat hand touches chin, moves forward and down",
        "category": "social",
        "keyframes": [
            {"d": 400, "rh": ["head", [0.05, -0.1, 0.2]]},
            {"d": 500, "rh": ["chest", [0.05, 0.1, 0.4]]},
        ],
    },
    {
        "key": "school",
        "label": "School",
        "description": "Both hands flat, clap together twice",
        "category": "education",
        "keyframes": [
            {"d": 300, "rh": ["chest", [-0.15, 0.12, 0.35]], "lh": ["chest", [0.15, 0.12, 0.35]]},
            {"d": 200, "rh": ["chest", [-0.03, 0.12, 0.38]], "lh": ["chest", [0.03, 0.12, 0.38]]},
            {"d": 200, "rh": ["chest", [-0.15, 0.12, 0.35]], "lh": ["chest", [0.15, 0.12, 0.35]]},
            {"d": 200, "rh": ["chest", [-0.03, 0.12, 0.38]], "lh": ["chest", [0.03, 0.12, 0.38]]},
        ],
    },
    {
        "key": "yes",
        "label": "Yes",
        "description": "Head nods up and down",
        "category": "affirmation",
        "keyframes": [
            {"d": 200, "headX": 0.15},
            {"d": 200, "headX": -0.1},
            {"d": 200, "headX": 0.15},
            {"d": 200, "headX": 0.0},
        ],
    },
    {
        "key": "no",
        "label": "No",
        "description": "Head shakes side to side with finger wag",
        "category": "negation",
        "keyframes": [
            {"d": 250, "rh": ["head", [0.08, 0.05, 0.3]], "headY": 0.0},
            {"d": 200, "rh": ["head", [0.18, 0.05, 0.3]], "headY": 0.15},
            {"d": 200, "rh": ["head", [-0.02, 0.05, 0.3]], "headY": -0.15},
            {"d": 200, "rh": ["head", [0.18, 0.05, 0.3]], "headY": 0.15},
        ],
    },
    {
        "key": "i",
        "label": "I / Me",
        "description": "Point index finger to own chest",
        "category": "pronoun",
        "keyframes": [
            {"d": 400, "rh": ["chest", [0.0, 0.0, 0.2]]},
            {"d": 250, "rh": ["chest", [0.0, 0.02, 0.18]]},
        ],
    },
    {
        "key": "you",
        "label": "You",
        "description": "Point index finger forward at person",
        "category": "pronoun",
        "keyframes": [
            {"d": 400, "rh": ["chest", [0.0, 0.08, 0.5]]},
            {"d": 250, "rh": ["chest", [0.0, 0.08, 0.55]]},
        ],
    },
    {
        "key": "name",
        "label": "Name",
        "description": "H-handshape taps on other palm",
        "category": "social",
        "keyframes": [
            {"d": 350, "rh": ["chest", [-0.08, 0.15, 0.45]], "lh": ["chest", [0.08, 0.0, 0.42]]},
            {"d": 200, "rh": ["chest", [-0.08, 0.03, 0.44]], "lh": ["chest", [0.08, 0.0, 0.42]]},
            {"d": 200, "rh": ["chest", [-0.08, 0.15, 0.45]], "lh": ["chest", [0.08, 0.0, 0.42]]},
            {"d": 200, "rh": ["chest", [-0.08, 0.03, 0.44]], "lh": ["chest", [0.08, 0.0, 0.42]]},
        ],
    },
    {
        "key": "good",
        "label": "Good",
        "description": "Thumbs up, push forward",
        "category": "emotion",
        "keyframes": [
            {"d": 350, "rh": ["chest", [-0.05, 0.05, 0.25]]},
            {"d": 400, "rh": ["chest", [-0.05, 0.1, 0.45]]},
        ],
    },
    {
        "key": "bad",
        "label": "Bad",
        "description": "Hand at chin, flip outward and down",
        "category": "emotion",
        "keyframes": [
            {"d": 350, "rh": ["head", [0.05, -0.1, 0.2]]},
            {"d": 400, "rh": ["chest", [0.05, -0.05, 0.35]]},
        ],
    },
    {
        "key": "how",
        "label": "How",
        "description": "Both palms up, questioning gesture",
        "category": "question",
        "keyframes": [
            {"d": 400, "rh": ["chest", [-0.22, 0.0, 0.35]], "lh": ["chest", [0.22, 0.0, 0.35]]},
            {"d": 400, "rh": ["chest", [-0.28, 0.12, 0.4]], "lh": ["chest", [0.28, 0.12, 0.4]]},
        ],
    },
    {
        "key": "please",
        "label": "Please",
        "description": "Open hand circles on chest",
        "category": "social",
        "keyframes": [
            {"d": 300, "rh": ["chest", [0.0, 0.05, 0.2]]},
            {"d": 300, "rh": ["chest", [0.08, 0.1, 0.2]]},
            {"d": 300, "rh": ["chest", [0.0, 0.15, 0.2]]},
            {"d": 300, "rh": ["chest", [-0.08, 0.1, 0.2]]},
        ],
    },
    {
        "key": "sorry",
        "label": "Sorry",
        "description": "Fist on chest, circular motion, head bows",
        "category": "social",
        "keyframes": [
            {"d": 300, "rh": ["chest", [0.0, 0.05, 0.2]], "headX": 0.12},
            {"d": 300, "rh": ["chest", [0.08, 0.1, 0.2]], "headX": 0.12},
            {"d": 300, "rh": ["chest", [0.0, 0.15, 0.2]], "headX": 0.12},
            {"d": 300, "rh": ["chest", [-0.08, 0.1, 0.2]], "headX": 0.12},
        ],
    },
    {
        "key": "help",
        "label": "Help",
        "description": "Right hand on left fist, both lift up",
        "category": "action",
        "keyframes": [
            {"d": 400, "rh": ["chest", [0.0, -0.05, 0.3]], "lh": ["chest", [0.0, -0.08, 0.28]]},
            {"d": 450, "rh": ["chest", [0.0, 0.2, 0.35]], "lh": ["chest", [0.0, 0.17, 0.32]]},
        ],
    },
    {
        "key": "food",
        "label": "Food / Eat",
        "description": "Bunched fingers move to mouth",
        "category": "basic_needs",
        "keyframes": [
            {"d": 300, "rh": ["head", [0.05, -0.12, 0.18]]},
            {"d": 250, "rh": ["head", [0.03, -0.05, 0.22]]},
            {"d": 300, "rh": ["head", [0.05, -0.12, 0.18]]},
        ],
    },
    {
        "key": "water",
        "label": "Water / Drink",
        "description": "C-hand tilts to mouth like drinking",
        "category": "basic_needs",
        "keyframes": [
            {"d": 350, "rh": ["head", [0.1, -0.1, 0.22]]},
            {"d": 400, "rh": ["head", [0.05, -0.03, 0.18]]},
            {"d": 350, "rh": ["head", [0.1, -0.1, 0.22]]},
        ],
    },
    {
        "key": "home",
        "label": "Home",
        "description": "Both hands form roof shape, move apart",
        "category": "places",
        "keyframes": [
            {"d": 400, "rh": ["head", [-0.08, 0.12, 0.22]], "lh": ["head", [0.08, 0.12, 0.22]]},
            {"d": 400, "rh": ["head", [-0.3, 0.0, 0.22]], "lh": ["head", [0.3, 0.0, 0.22]]},
        ],
    },
    {
        "key": "love",
        "label": "Love",
        "description": "Cross both arms over chest in hug",
        "category": "emotion",
        "keyframes": [
            {"d": 350, "rh": ["chest", [-0.35, 0.05, 0.22]], "lh": ["chest", [0.35, 0.05, 0.22]]},
            {"d": 500, "rh": ["chest", [0.12, 0.05, 0.18]], "lh": ["chest", [-0.12, 0.05, 0.18]]},
        ],
    },
    {
        "key": "friend",
        "label": "Friend",
        "description": "Index fingers hook together",
        "category": "social",
        "keyframes": [
            {"d": 350, "rh": ["chest", [-0.1, 0.1, 0.38]], "lh": ["chest", [0.1, 0.1, 0.38]]},
            {"d": 300, "rh": ["chest", [-0.02, 0.1, 0.38]], "lh": ["chest", [0.02, 0.1, 0.38]]},
            {"d": 300, "rh": ["chest", [-0.1, 0.1, 0.38]], "lh": ["chest", [0.1, 0.1, 0.38]]},
        ],
    },
    {
        "key": "peace",
        "label": "Peace",
        "description": "V-sign (peace) raised up",
        "category": "social",
        "keyframes": [
            {"d": 400, "rh": ["head", [0.12, 0.0, 0.25]]},
            {"d": 400, "rh": ["head", [0.12, 0.2, 0.3]]},
        ],
    },
    {
        "key": "welcome",
        "label": "Welcome",
        "description": "Both arms open wide",
        "category": "greeting",
        "keyframes": [
            {"d": 400, "rh": ["chest", [-0.2, 0.1, 0.25]], "lh": ["chest", [0.2, 0.1, 0.25]]},
            {"d": 500, "rh": ["chest", [-0.45, 0.15, 0.2]], "lh": ["chest", [0.45, 0.15, 0.2]]},
        ],
    },
    {
        "key": "learn",
        "label": "Learn / Study",
        "description": "Pick from palm and bring to forehead",
        "category": "education",
        "keyframes": [
            {"d": 350, "rh": ["chest", [0.0, 0.05, 0.3]], "lh": ["chest", [0.05, 0.0, 0.3]]},
            {"d": 400, "rh": ["head", [0.0, 0.05, 0.2]]},
        ],
    },
    {
        "key": "what",
        "label": "What",
        "description": "Both palms up, shrug",
        "category": "question",
        "keyframes": [
            {"d": 350, "rh": ["chest", [-0.25, 0.0, 0.32]], "lh": ["chest", [0.25, 0.0, 0.32]]},
            {"d": 350, "rh": ["chest", [-0.3, 0.15, 0.38]], "lh": ["chest", [0.3, 0.15, 0.38]]},
        ],
    },
    {
        "key": "want",
        "label": "Want",
        "description": "Both hands reach out, pull toward self",
        "category": "action",
        "keyframes": [
            {"d": 400, "rh": ["chest", [-0.12, 0.05, 0.5]], "lh": ["chest", [0.12, 0.05, 0.5]]},
            {"d": 400, "rh": ["chest", [-0.05, 0.0, 0.2]], "lh": ["chest", [0.05, 0.0, 0.2]]},
        ],
    },
]

SEED_SYNONYMS = [
    {"word": "hi", "maps_to": "hello"},
    {"word": "hey", "maps_to": "hello"},
    {"word": "greetings", "maps_to": "hello"},
    {"word": "thanks", "maps_to": "thank_you"},
    {"word": "thankyou", "maps_to": "thank_you"},
    {"word": "thx", "maps_to": "thank_you"},
    {"word": "ok", "maps_to": "good"},
    {"word": "okay", "maps_to": "good"},
    {"word": "fine", "maps_to": "good"},
    {"word": "great", "maps_to": "good"},
    {"word": "nice", "maps_to": "good"},
    {"word": "me", "maps_to": "i"},
    {"word": "my", "maps_to": "i"},
    {"word": "mine", "maps_to": "i"},
    {"word": "your", "maps_to": "you"},
    {"word": "yours", "maps_to": "you"},
    {"word": "eat", "maps_to": "food"},
    {"word": "hungry", "maps_to": "food"},
    {"word": "drink", "maps_to": "water"},
    {"word": "thirsty", "maps_to": "water"},
    {"word": "house", "maps_to": "home"},
    {"word": "study", "maps_to": "school"},
    {"word": "education", "maps_to": "school"},
    {"word": "know", "maps_to": "learn"},
    {"word": "teach", "maps_to": "learn"},
    {"word": "ask", "maps_to": "what"},
    {"word": "pardon", "maps_to": "sorry"},
    {"word": "excuse", "maps_to": "sorry"},
    {"word": "like", "maps_to": "love"},
    {"word": "dear", "maps_to": "love"},
]

SEED_STOP_WORDS = (
    "is am are was were the a an to of and in on it do does did be been "
    "being have has had this that for with at by from or but not so if "
    "then very just also as"
).split()
