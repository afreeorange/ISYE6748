import json
from glob import glob

from bs4 import BeautifulSoup
from util import (
    LAYER_1_ENCODED,
    LAYER_2_ENCODED,
    LAYER_3_ENCODED,
    IGNORED_CLASSES,
    determine_class,
    transform_column_name,
)

OUTPUT = {}

for p in [_ for _ in glob("../data/layers/layer_3_scraped_data/*.html")]:
    print(f"Processing {p}")

    with open(p) as fp:
        soup = BeautifulSoup(fp, "html.parser")
        the_list = soup.find_all("ul", class_="i51")

        if len(the_list) == 0:
            print(f"! Could not find anything in this file")

        _ul = the_list[0]
        for _li in _ul.find_all("li"):
            code_and_desc = _li.text
            desc = code_and_desc[6:]
            code = _li.a.text

            layer_1_parent = determine_class(code, LAYER_1_ENCODED)["class"]
            layer_2_parent = determine_class(code, LAYER_2_ENCODED)["class"]

            OUTPUT[transform_column_name(code.strip())] = {
                "description": desc.strip(),
                "weight": 1,
                # Hierarchy is **in reverse**!
                "hierarchy": [
                    code.replace("-", "_"),
                    layer_2_parent.replace("-", "_"),
                    layer_1_parent.replace("-", "_"),
                ],
                "code": code.replace("-", "_"),
                "displayCode": code,
                "layer": 3,
            }

print(f"Writing layer_3.json")

with open("../data/layers/layer_3.json", "w") as f:
    f.write(json.dumps(OUTPUT, indent=2, sort_keys=True))

FILTERED_OUTPUT = {k: v for k, v, in OUTPUT.items() if k not in IGNORED_CLASSES[3]}

print(f"Writing layer_3__filtered.json")

with open("../data/layers/layer_3__filtered.json", "w") as f:
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
