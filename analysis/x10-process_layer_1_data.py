import json

from util import (
    IGNORED_CLASSES,
    LAYER_1_ENCODED,
    determine_class,
    transform_column_name,
)

layer_1_data = open("../data/layers/layer_1_raw.txt").readlines()

OUTPUT = {}

for _ in layer_1_data:
    __ = _.split("    ")
    code = __[0]
    desc = __[1].strip()

    layer_1_parent = determine_class(code, LAYER_1_ENCODED)["class"]

    OUTPUT[transform_column_name(code.strip())] = {
        "description": desc.strip(),
        "weight": 1,
        # Hierarchy is **in reverse**!
        "hierarchy": [code.replace("-", "_")],
        "code": code.replace("-", "_"),
        "displayCode": code,
        "layer": 1,
    }

print(f"Writing layer_1.json")

with open("../data/layers/layer_1.json", "w") as f:
    f.write(
        json.dumps(
            OUTPUT,
            indent=2,
            sort_keys=True,
        )
    )

FILTERED_OUTPUT = {k: v for k, v in OUTPUT.items() if k not in IGNORED_CLASSES[1]}

print(f"Writing layer_1__filtered.json")

with open("../data/layers/layer_1__filtered.json", "w") as f:
    f.write(
        json.dumps(
            FILTERED_OUTPUT,
            indent=2,
            sort_keys=True,
        )
    )

print(f"Done!")
print(f"There are {len(OUTPUT.keys())} classes in the full output.")
print(f"There are {len(FILTERED_OUTPUT.keys())} keys in the filtered output.")
