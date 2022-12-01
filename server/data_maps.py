import pandas as pd

# ------------------ Layer Data ------------------

"""
These are simply the "utility matrices" we described in our awesome report.
Just simple ratings/frequencies of ICD10 Classes for each patient/member.
"""

LAYER_DATA = {
    1: pd.read_parquet(
        "./data/100-layer-frequencies_layer_1.parquet",
        engine="pyarrow",
    ).drop("Gender_Code", axis=1),
    2: pd.read_parquet(
        "./data/100-layer-frequencies_layer_2.parquet",
        engine="pyarrow",
    ).drop("Gender_Code", axis=1),
    3: pd.read_parquet(
        "./data/100-layer-frequencies_layer_3.parquet",
        engine="pyarrow",
    ).drop("Gender_Code", axis=1),
}

# ------------------ Item-Item Similarity Data ------------------

"""
NOTE: This pertains to the next few variables. We use Cosine Similarity and
have THREE variants:

1. Unadjusted
2. Centered
3. Normalized

All these reference files are in the `./data` folder.

We use the Normalized variant here. This is because we evaluated all three
variants and found that the Normalized variant was 'production-worthy' because
it had the lowest RMSE and MAE. You certainly can change these mappings and use
the web interface to see what happens to the predictions.
"""

DISTANCES_ITEM = {
    1: pd.read_parquet(
        "./data/normalized_item_distances_layer_1.parquet",
        engine="pyarrow",
    ),
    2: pd.read_parquet(
        "./data/normalized_item_distances_layer_2.parquet",
        engine="pyarrow",
    ),
    3: pd.read_parquet(
        "./data/normalized_item_distances_layer_3.parquet",
        engine="pyarrow",
    ),
}
INDICES_ITEM = {
    1: pd.read_parquet(
        "./data/normalized_item_indices_layer_1.parquet",
        engine="pyarrow",
    ),
    2: pd.read_parquet(
        "./data/normalized_item_indices_layer_2.parquet",
        engine="pyarrow",
    ),
    3: pd.read_parquet(
        "./data/normalized_item_indices_layer_3.parquet",
        engine="pyarrow",
    ),
}

# ------------------ User-User Similarity Data ------------------

DISTANCES_USER = {
    1: pd.read_parquet(
        "./data/user_distances_layer_1.parquet",
        engine="pyarrow",
    ),
    2: pd.read_parquet(
        "./data/user_distances_layer_2.parquet",
        engine="pyarrow",
    ),
    3: pd.read_parquet(
        "./data/user_distances_layer_3.parquet",
        engine="pyarrow",
    ),
}
INDICES_USER = {
    1: pd.read_parquet(
        "./data/user_indices_layer_1.parquet",
        engine="pyarrow",
    ),
    2: pd.read_parquet(
        "./data/user_indices_layer_2.parquet",
        engine="pyarrow",
    ),
    3: pd.read_parquet(
        "./data/user_indices_layer_3.parquet",
        engine="pyarrow",
    ),
}
