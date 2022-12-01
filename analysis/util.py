"""
37N4INJAk#*%aI0b
NOTE: YOU MUST RUN JSON GENERATION BEFORE DOING ANYTHING HERE!

Just a giant kitchen-drawer of constants and helpers we use in our notebooks.
"""

import json
from string import ascii_letters, digits
import numpy as np
import pandas as pd

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from scipy import sparse


# ------------------ The data and where it is ------------------

# Change this to 'full' or 'sample' for all the 8M rows or 5000 of them
DATASET_TYPE = "full"
RAW_DATA_DIR = "../data/raw"
PROCESSED_DATA_DIR = "../data/processed"
SIMILARITY_TABLE_DATA_DIR = "../data/similarity_matrices"

# ------------------ Ignore These Classes in Layers ------------------

# This is only used in JSON generation. All other scripts just use **filtered**
# layers!

IGNORED_CLASSES = {
    int(k): v
    for k, v in json.loads(open("../data/layers/ignored_classes.json").read()).items()
}

# ------------------ Begin Layer Lookups ------------------

# NOTE: Observe that we are using the filtered JSON files!
# You must run the JSON generation before doing anything else!
LAYER_1_CLASSES = json.loads(open("../data/layers/layer_1__filtered.json").read())
LAYER_2_CLASSES = json.loads(open("../data/layers/layer_2__filtered.json").read())
LAYER_3_CLASSES = json.loads(open("../data/layers/layer_3__filtered.json").read())

LAYER_CLASSES = {
    1: LAYER_1_CLASSES,
    2: LAYER_2_CLASSES,
    3: LAYER_3_CLASSES,
}

GIANT_MAP_OF_ALL_CLASSES = LAYER_1_CLASSES | LAYER_2_CLASSES | LAYER_3_CLASSES
GIANT_LIST_OF_ALL_CLASS_NAMES = list(GIANT_MAP_OF_ALL_CLASSES.keys())

# Create an encoded lookup. Python is cool because tuples are hashable 💗 What
# sucks about what we're about to do is we're going to look through the entire
# list (so O(n)) but this might be OK since we're just doing this once.

# ------------------ Layer Encoding Helpers ------------------


def encode(icd10_code):
    """
    Generate a numeric representation (which we're calling an "encoding") of
    the given ICD10 code.

    I am being lazy and assuming that you will _at least_ get two characters.
    This appears to work for the dataset we've been given.
    """
    # sys.stdout.write(f"Encoding {icd10_code}")

    ret = 0

    # TODO: This is shit. Maybe. We HEAVILY weight the parent Layer 1 class
    # here so we don't get garbage output for stuff like "O9A" (change the
    # weight to 100 and see what happens).
    try:
        ret = (
            10000 * ord(icd10_code[0])
            + 10 * ord(icd10_code[1])
            + 1 * ord(icd10_code[2])
        )
    except IndexError:
        ret = 10000 * ord(icd10_code[0]) + 10 * ord(icd10_code[1])

    # sys.stdout.write(f" as {ret}\n")

    return ret


def encode_layer(class_string):
    """
    Return a tuple that contains the numerically encoded values of the
    supplied class. The class could be a range ("A00-A99") or a single
    class ("A00").
    """
    parts = class_string.split("-")

    # This is a special case for Layer 3 classes that look like "ABC123" and
    # are not ranges like Layers 1 and 2.
    if len(parts) < 2:
        return (encode(parts[0]), encode(parts[0]))

    return (encode(parts[0]), encode(parts[1]))


# ------------------ Encoded Layers ------------------

LAYER_1_ENCODED = {}
for k in LAYER_CLASSES[1].keys():
    encoded_limits = encode_layer(k)

    LAYER_1_ENCODED[encoded_limits[0]] = {
        "class": k,
        "start": encoded_limits[0],
        "end": encoded_limits[1],
    }

LAYER_2_ENCODED = {}
for k in LAYER_CLASSES[2].keys():
    encoded_limits = encode_layer(k)

    LAYER_2_ENCODED[encoded_limits[0]] = {
        "class": k,
        "start": encoded_limits[0],
        "end": encoded_limits[1],
    }

LAYER_3_ENCODED = {}
for k in LAYER_CLASSES[3].keys():
    encoded_limits = encode_layer(k)

    LAYER_3_ENCODED[encoded_limits[0]] = {
        "class": k,
        "start": encoded_limits[0],
        "end": encoded_limits[1],
    }

LAYER_CLASSES_ENCODED = {
    1: LAYER_1_ENCODED,
    2: LAYER_2_ENCODED,
    3: LAYER_3_ENCODED,
}

# ------------------ The Fields/Columns we're dealing with ------------------

# Add any features ("contexts" in recsys) that we think we need here later.
REQUIRED_COLUMNS = [
    "Member_Life_ID",
    "Gender_Code",
]

IGNORED_COLUMNS = [
    "ICD10_1",
    "ICD10_2",
    "ICD10_3",
]


# Characters we're allowing in column names
ALLOWED_CHARS = ascii_letters + digits + "_-"


# ------------------ Exported/Used Helpers ------------------


def determine_class(icd10_code, encoded_layer):
    """
    Determine the correct class (range like A00-A99 or single like A34) that
    the given ICD10 code belongs to. You need to supply the encoded layer
    object as the second argument. You can do this with the `encode_layer`
    function.

    NOTE: This _will_ bomb if you give it an ICD9 code like 234 or 470 or
    something that starts with a number and not a letter!
    """
    encoded_icd10 = encode(icd10_code)

    maxes = []

    for encoded_range_start in encoded_layer.keys():
        if encoded_icd10 >= encoded_range_start:
            maxes.append(encoded_range_start)

    return encoded_layer[max(maxes)]


def transform_column_name(name):
    """
    Clean the column/field name in a way that makes them addressible as
    the properties of named tupled (e.g. `row.Medical_Life_ID`). If you don't
    do this, Pandas will use its own assignment (e.g. `_1`, `_2`, etc) for
    any columns/fields that contain spaces or other unsanctioned chars.
    """
    foo = name.replace(" ", "_").replace("-", "_")
    foo = "".join(_ for _ in foo if _ in ALLOWED_CHARS)

    return foo


def normalize_dataframe(data_matrix):
    """
    Normalize a given data matrix.

    TODO: This is where we would perform a centered-cosine transformation in
    case we need it.
    """
    magnitude = np.sqrt(np.square(data_matrix).sum(axis=1))
    data_matrix_items = data_matrix.divide(magnitude, axis="index")

    return data_matrix_items


def generate_similarity_matrix(data_matrix, use_knn=False, neighbours=5):
    """
    Generate a similarity matrix. That's all.

    In our case, we use this function to create and cache patient/user and
    disease/item similarities. If `use_knn` is set to `True`, it will use an
    alternative similarity method in scikit-learn. You can specify the number
    of neighbours with that alternative invocation.
    """
    if not use_knn:
        sparse_matrix = sparse.csr_matrix(data_matrix)

        return pd.DataFrame(
            columns=data_matrix.columns,
            data=cosine_similarity(sparse_matrix.transpose()),
            index=data_matrix.columns,
        )

    knn = NearestNeighbors(metric="cosine", algorithm="brute")
    knn.fit(data_matrix.values)
    distances, indices = knn.kneighbors(
        data_matrix.values,
        n_neighbors=neighbours,
    )

    return distances, indices


# Test the helper stuff here. What's here now is not an exhaustive set of
# tests! Add the weirdest test cases here. Stress this module out!
if __name__ == "__main__":

    def _belongs_to_class(icd10_code, encoded_layer, _class):
        """
        Use to test how well class encoding functions work. This is used to test
        how well we wrote the constants and helpers in this module and is not used
        outside (it can't... look at where it is lol).
        """
        return (
            True
            if determine_class(icd10_code, encoded_layer)["class"] == _class
            else False
        )

    SAMPLE_ICD_CODES = [
        "A78",
        "B00",
        "B95",
        "B99",
        "C00",
        "C7A",
        "G67",
        "D99",
        "O91",
        "O94",
        "O9A",
        "O9B",
        "Z18",
    ]

    print("--- Layer 1 ---")
    for code in SAMPLE_ICD_CODES:
        print(
            f"{code} encoded as {encode(code)} belongs to {determine_class(code, LAYER_1_ENCODED)}"
        )

    print("--- Layer 2 ---")
    for code in SAMPLE_ICD_CODES:
        print(
            f"{code} encoded as {encode(code)} belongs to {determine_class(code, LAYER_2_ENCODED)}"
        )

    print("--- Layer 3 ---")
    for code in SAMPLE_ICD_CODES:
        print(
            f"{code} encoded as {encode(code)} belongs to {determine_class(code, LAYER_3_ENCODED)}"
        )

    print("--- Belongs to Class ---")
    print(
        f"{'A74'} in {'A00-A99'} {_belongs_to_class('A74', LAYER_1_ENCODED, 'A00-B99')}"
    )
    print(
        f"{'O9A'} in {'O00-O9A'} {_belongs_to_class('O9A', LAYER_1_ENCODED, 'O00-O9A')}"
    )
    print(
        f"{'G8A'} in {'O00-O9A'} {_belongs_to_class('G8A', LAYER_1_ENCODED, 'O00-O9A')}"
    )
    # print(json.dumps(LAYER_1_ENCODED, indent=2))
