import json

# ------------------ Layer Data ------------------

IGNORED_CLASSES = {
    int(k): v for k, v in json.loads(open("./data/ignored_classes.json").read()).items()
}

LAYER_1_CLASSES = json.loads(open("./data/layer_1__filtered.json").read())
LAYER_2_CLASSES = json.loads(open("./data/layer_2__filtered.json").read())
LAYER_3_CLASSES = json.loads(open("./data/layer_3__filtered.json").read())

LAYER_CLASSES = {
    1: LAYER_1_CLASSES,
    2: LAYER_2_CLASSES,
    3: LAYER_3_CLASSES,
}

GIANT_MAP_OF_ALL_CLASSES = LAYER_1_CLASSES | LAYER_2_CLASSES | LAYER_3_CLASSES
GIANT_LIST_OF_ALL_CLASS_NAMES = list(GIANT_MAP_OF_ALL_CLASSES.keys())

# ------------------ Miscellanea ------------------

# Prefix for all endpoints.
# NOTE: We could've done this with Flask Blueprints but I'm being lazy here...
API_PREFIX = "/api"

MAX_LIMIT_USER_SIMILARITY = 20
MAX_LIMIT_ITEM_SIMILARITY = 20
