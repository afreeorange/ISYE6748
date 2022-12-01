"""
Generate two giant things:

1) A map/dictionary of ALL layers
2) A list of ALL layers

Stands to reason that this might be convenient for various reasons. It's
easy to generate, only has to be done once, so let's do it 🤷
"""

import json

layer_1_data = json.loads(open("../data/layers/layer_1.json").read())
layer_2_data = json.loads(open("../data/layers/layer_2.json").read())
layer_3_data = json.loads(open("../data/layers/layer_3.json").read())

# Just lexicographically sort by the ICD10 code or class and call it a day...
GIANT_LIST_OF_LAYERS = sorted(
    (
        [_ for _ in layer_1_data.values()]
        + [_ for _ in layer_2_data.values()]
        + [_ for _ in layer_3_data.values()]
    ),
    key=lambda _: _["code"],
)

# ACHTUNG: You'll need Python 3.9+ for this beauty to work!
GIANT_MAP_OF_LAYERS = layer_1_data | layer_2_data | layer_3_data

print(
    f"I will smush {len(layer_1_data.values())} codes in Layer 1, {len(layer_2_data.values())} codes in Layer 2, and {len(layer_3_data.values())} codes in Layer 3"
)

print(
    f"I found {len(GIANT_LIST_OF_LAYERS)} total keys for the the giant list of layers"
)

print(f"Making a giant list of layers")
with open("../data/layers/all_layers_list.json", "w") as f:
    f.write(
        json.dumps(
            GIANT_LIST_OF_LAYERS,
            indent=2,
            sort_keys=True,
        )
    )

print(f"Making a giant map of layers")
with open("../data/layers/all_layers_map.json", "w") as f:
    f.write(
        json.dumps(
            GIANT_MAP_OF_LAYERS,
            indent=2,
            sort_keys=True,
        )
    )
