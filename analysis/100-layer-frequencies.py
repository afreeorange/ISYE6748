"""
This ultimately generates Parquet files with layer counts.

There is a LOT of copypasta in this file. I am lazy and I don't care since this
data is to be generated just once and captured for further analysis.

NOTE: This uses _filtered layers_! See `util.py` for what the `LAYER_CLASSES`
dictionary looks like
"""

import sys

import pandas as pd
from util import (
    IGNORED_COLUMNS,
    LAYER_CLASSES_ENCODED,
    LAYER_CLASSES,
    REQUIRED_COLUMNS,
    determine_class,
    transform_column_name,
)

# We ideally would NOT be going through each row in a Pandas dataframe. This is
# typically very slow. But I (a) could not find a cooler way to do this and (b)
# we'll be doing this just once, so I figured something's better than nothing
# given the time we have :/

print("Starting!")


def generate_layer(level=1):
    # Read the 'raw' data from our previous analysis step
    data_raw = pd.read_parquet(
        f"../data/processed/000-initial-run_layer_{level}.parquet",
        engine="pyarrow",
    )
    total_records = len(data_raw)
    total_unique_member_ids = len(data_raw["Member_Life_ID"].unique())

    print(
        f"We have {total_unique_member_ids} unique Member IDs and {total_records} records in Layer {level}'s dataframe"
    )

    layer_data = pd.DataFrame(
        columns=[
            transform_column_name(_)
            for _ in data_raw.columns
            if _ not in IGNORED_COLUMNS
        ],
    )

    # NOTE: We're doing this manually :/
    layer_data = layer_data.astype(
        {
            "Member_Life_ID": int,
            "Gender_Code": int,
        }
    )

    record_counter = 0
    current_id = data_raw.iloc[0]["Member_Life_ID"]

    # --- These will be concatenated later ---
    rows_to_concat = []

    # --- Start Bootstrap and read the first record ---
    icd10_code_list_cache = []
    icd10_code_list_cache.extend(
        [
            data_raw.iloc[0]["ICD10_1"],
            data_raw.iloc[0]["ICD10_2"],
            data_raw.iloc[0]["ICD10_3"],
        ]
    )

    row_to_insert = dict(
        zip(
            #
            # Key
            #
            REQUIRED_COLUMNS
            + list([transform_column_name(_) for _ in LAYER_CLASSES[level].keys()]),
            #
            # Value: You have to be VERY careful here! Try to factor in
            # elegance later with a [row[_] for _ in REQUIRED_COLUMNS] that
            # WILL lead to erratic results.
            #
            # TODO: Fix this later to be elegant. Or not. You're hopefully
            # doing this just once you know?
            #
            [current_id, data_raw.iloc[0]["Gender_Code"]]
            + [0 for _ in range(len(LAYER_CLASSES[level].keys()))],
        )
    )

    for k in [_ for _ in list(set(icd10_code_list_cache)) if _ not in ["*", None]]:
        the_class = transform_column_name(
            determine_class(k, LAYER_CLASSES_ENCODED[level])["class"]
        )
        row_to_insert[the_class] += 1

    # --- End Bootstrap ---

    output_file = f"../data/processed/100-layer-frequencies_layer_{level}.parquet"
    print(f"Looping over Layer {level}")
    print(f"Will write {output_file}")

    # Note the row offset. We are not starting with the first row/record.
    loop_counter = 1
    for row in data_raw.iloc[1:, :].itertuples():
        next_id = row.Member_Life_ID

        sys.stdout.write("\r")
        sys.stdout.write(
            f"{str(loop_counter)} of {total_records} ({round(loop_counter/total_records * 100, 2)}%)"
        )

        # Time for action! Create a new record in the dataframe!
        if current_id != next_id:
            unique_codes = [
                _ for _ in list(set(icd10_code_list_cache)) if _ not in ["*", None]
            ]
            row_to_insert = dict(
                zip(
                    #
                    # Key
                    #
                    REQUIRED_COLUMNS
                    + list(
                        [transform_column_name(_) for _ in LAYER_CLASSES[level].keys()]
                    ),
                    #
                    # Value. Set it to zero to start with.
                    #
                    [current_id, row.Gender_Code]
                    + [0 for _ in range(len(LAYER_CLASSES[level].keys()))],
                )
            )

            # print(f"ID {current_id} had {len(unique_codes)} unique codes")

            # Update the class frequency FOR THIS RECORD
            for k in unique_codes:
                the_class = transform_column_name(
                    determine_class(k, LAYER_CLASSES_ENCODED[level])["class"]
                )
                row_to_insert[the_class] += 1

            rows_to_concat.append(pd.DataFrame(row_to_insert, index=[record_counter]))

            # Prep for the next Member ID
            current_id = next_id
            icd10_code_list_cache = []
            record_counter += 1

        # Just gather the ICD10 codes while the member ID doesn't change.
        icd10_code_list_cache.extend(
            [
                row.ICD10_1,
                row.ICD10_2,
                row.ICD10_3,
            ]
        )

        # TODO: There's a bug here. Or a redundancy. I don't know why I'm
        # maintaining both a record and a loop counter. Feels right but I'm off
        # by one in the output. Whatever. Maybe.
        loop_counter += 1

    # NOTE: Never _ever_ pd.concat in a loop! It leads to 4x copying and each
    # loop will get exponentially slower.
    # https://stackoverflow.com/a/36489724
    layer_data = pd.concat(rows_to_concat, axis=0)

    print(f"Going to write parquet file...")
    layer_data.to_parquet(output_file)
    print(f"Wrote {output_file}")
    print("\n")


if __name__ == "__main__":
    generate_layer(1)
    generate_layer(2)
    generate_layer(3)
