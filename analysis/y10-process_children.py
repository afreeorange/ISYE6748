import json

layer_1_data = json.loads(open("../data/layers/layer_1.json").read())
layer_1_data_filtered = json.loads(open("../data/layers/layer_1__filtered.json").read())
layer_2_data = json.loads(open("../data/layers/layer_2.json").read())
layer_2_data_filtered = json.loads(open("../data/layers/layer_2__filtered.json").read())
layer_3_data = json.loads(open("../data/layers/layer_3.json").read())
layer_3_data_filtered = json.loads(open("../data/layers/layer_3__filtered.json").read())

_l2_list = [_ for __, _ in layer_2_data.items()]
_l2_list_filtered = [_ for __, _ in layer_2_data_filtered.items()]
_l3_list = [_ for __, _ in layer_3_data.items()]
_l3_list_filtered = [_ for __, _ in layer_3_data_filtered.items()]

# ----------------- Layer 1 -----------------

for layer, info in layer_1_data.items():
    children = [_["code"] for _ in _l2_list if _["hierarchy"][1] == layer]
    layer_1_data[layer]["children"] = children

for layer, info in layer_1_data_filtered.items():
    children = [_["code"] for _ in _l2_list_filtered if _["hierarchy"][1] == layer]
    layer_1_data_filtered[layer]["children"] = children

print(f"Appending children to Layer 1 data")
with open("../data/layers/layer_1.json", "w") as f:
    f.write(
        json.dumps(
            layer_1_data,
            indent=2,
            sort_keys=True,
        )
    )
with open("../data/layers/layer_1__filtered.json", "w") as f:
    f.write(
        json.dumps(
            layer_1_data_filtered,
            indent=2,
            sort_keys=True,
        )
    )

# ----------------- Layer 2 -----------------

for layer, info in layer_2_data.items():
    children = [_["code"] for _ in _l3_list if _["hierarchy"][1] == layer]
    layer_2_data[layer]["children"] = children

for layer, info in layer_2_data_filtered.items():
    children = [_["code"] for _ in _l3_list_filtered if _["hierarchy"][1] == layer]
    layer_2_data_filtered[layer]["children"] = children

print(f"Appending children to Layer 2 data")
with open("../data/layers/layer_2.json", "w") as f:
    f.write(
        json.dumps(
            layer_2_data,
            indent=2,
            sort_keys=True,
        )
    )
with open("../data/layers/layer_2__filtered.json", "w") as f:
    f.write(
        json.dumps(
            layer_2_data_filtered,
            indent=2,
            sort_keys=True,
        )
    )


# ----------------- Layer 3 -----------------

for layer, info in layer_3_data.items():
    layer_3_data[layer]["children"] = []

for layer, info in layer_3_data_filtered.items():
    layer_3_data_filtered[layer]["children"] = []

print(f"Appending children to Layer 3 data")
with open("../data/layers/layer_3.json", "w") as f:
    f.write(
        json.dumps(
            layer_3_data,
            indent=2,
            sort_keys=True,
        )
    )

with open("../data/layers/layer_3__filtered.json", "w") as f:
    f.write(
        json.dumps(
            layer_3_data_filtered,
            indent=2,
            sort_keys=True,
        )
    )
