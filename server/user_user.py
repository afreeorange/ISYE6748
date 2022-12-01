from data_maps import DISTANCES_USER, INDICES_USER, LAYER_DATA
from exceptions import MemberNotFoundException


# Change the values in similarity indices to their member life IDs, and append
# with their distances to target member ID
def recommend_similar_patients_at_layer(
    member_life_id,
    layer_number,
    limit: int | None = None,
):
    indices = INDICES_USER[layer_number]
    distances = DISTANCES_USER[layer_number]
    layer_data = LAYER_DATA[layer_number]

    # Throw an exception if a non-existing member ID is provided
    if member_life_id not in indices.index.tolist():
        raise MemberNotFoundException(f"Could not find member with ID {member_life_id}")

    # Get an index for the ID
    target_ID_index = indices.index.tolist().index(member_life_id)

    # Make a list for its similar IDs, applying a limit if specified
    similar_ID = indices.loc[member_life_id].tolist()[: limit + 1 if limit else None]

    # Make a list for distances of similar patients
    ID_distances = distances.loc[member_life_id].tolist()

    # Get the position of the member ID itself in indices and remove it from
    # the indices and distances.
    ID_index = similar_ID.index(target_ID_index)
    similar_ID.remove(target_ID_index)
    ID_distances.pop(ID_index)

    similar_list = []
    j = 0

    for i in similar_ID:
        # NOTE: distance and similarity are not the same!
        # Similarity = (1 - Distance)
        similarity_score = 1 - ID_distances[j]
        similar_patient_id = indices.index[i]

        # Look up the ICD class frequencies of similar patients
        similar_patient_ICD_list = layer_data[
            layer_data["Member_Life_ID"] == similar_patient_id
        ].to_dict("records")[0]

        # We don't need this field
        del similar_patient_ICD_list["Member_Life_ID"]

        similar_list.append(
            {
                "id": str(similar_patient_id),
                "score": similarity_score,
                "layerInfo": [[x, y] for x, y in similar_patient_ICD_list.items()],
            }
        )

        j += 1

    return similar_list


def recommend_similar_patients(member_life_id: int, limit: int | None = None):
    ret = {
        1: [],
        2: [],
        3: [],
    }

    # Check if the member exists. Just check the first layer since we're
    # guaranteed that a given Member ID exists in all layer data files. How do
    # we know this? See 110-frequency-checks.ipynb
    if len(LAYER_DATA[1][LAYER_DATA[1]["Member_Life_ID"] == member_life_id]) == 0:
        raise MemberNotFoundException(
            f"Could not find a member with ID {member_life_id}"
        )

    for layer_number in ret.keys():
        ret[layer_number] = recommend_similar_patients_at_layer(
            member_life_id,
            layer_number,
            limit,
        )

    def __get_record_at_layer(layer_number):
        return [
            [k, v]
            for k, v in LAYER_DATA[layer_number][
                LAYER_DATA[layer_number]["Member_Life_ID"] == member_life_id
            ]
            .drop(["Member_Life_ID"], axis=1)
            .to_dict("records")[0]
            .items()
        ]

    return {
        "thisPatient": {
            "id": str(member_life_id),
            # Messy but copypasta. We're just getting this patient's record
            # at each layer, that's all.
            "layerInfo": {
                1: __get_record_at_layer(1),
                2: __get_record_at_layer(2),
                3: __get_record_at_layer(3),
            },
        },
        "similarPatients": ret,
    }
