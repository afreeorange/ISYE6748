import numpy as np

from data_maps import DISTANCES_ITEM, INDICES_ITEM, LAYER_DATA


def _process_recommendations(
    member_life_id,
    limit,
    orig_df,
    updated_df,
):

    # # Print the diagnosed ICD classes
    # for ICD_class in orig_df[orig_df[member_life_id] > 0][
    #     member_life_id
    # ].index.tolist():
    #     print(ICD_class)

    recommended_ICD = []

    for ICD_class in orig_df[orig_df[member_life_id] == 0].index.tolist():

        index_df = orig_df.index.tolist().index(ICD_class)
        predicted_count = updated_df.iloc[
            index_df, updated_df.columns.tolist().index(member_life_id)
        ]
        recommended_ICD.append((ICD_class, predicted_count))

    sorted_ICD = sorted(recommended_ICD, key=lambda x: x[1], reverse=True)

    ret = []
    for recommended_ICD in sorted_ICD[:limit]:
        ret.append([recommended_ICD[0], recommended_ICD[1]])

    return ret


def _recommend_conditions_at_layer(
    member_life_id,
    limit,
    matrix_of_frequencies,
    item_item_similarity_indices,
    item_item_similarity_distances,
    use_global_baseline=True,
):
    df_flip = matrix_of_frequencies.set_index("Member_Life_ID").transpose()
    df_flip.columns.name = ""
    orig_df = df_flip
    updated_df = orig_df.copy()

    # --------- Baseline Estimate Calculation ---------

    # These can be done just once and cached but computing them is pretty
    # fast with the size of the dataset we have.
    global_mean = np.nanmean(orig_df)
    icd_mean = orig_df.mean(axis=1)
    patient_mean = orig_df.mean(axis=0)

    # Compute how much this particular patient has deviated away from the
    # global mean of class frequencies
    deviation_of_patient = patient_mean[member_life_id] - global_mean

    # Compute the deviation of each layer class from the global mean
    deviation_of_icd = icd_mean - global_mean

    # Create a VECTOR of baseline estimates for each class for this patient
    baseline_estimate = global_mean + deviation_of_patient + deviation_of_icd

    # --------- End ---------

    # Look up the index of this patient
    member_life_id_index = orig_df.columns.tolist().index(member_life_id)

    for index, layer_class in list(enumerate(orig_df.index)):

        # We're trying to predict
        if orig_df.iloc[index, member_life_id_index] == 0:
            # Get indices and distances from that ICD class
            similar_ICD_indices = item_item_similarity_indices.iloc[index].tolist()
            similar_ICD_distances = item_item_similarity_distances.iloc[index].tolist()

            # Remove ICD class itself from its similarity list
            if index in similar_ICD_indices:
                ICD_id = similar_ICD_indices.index(index)
                similar_ICD_indices.remove(index)
                similar_ICD_distances.pop(ICD_id)

            # Similarity = (1 - Cosine Distance)
            similar_ICD_similarity = [1 - x for x in similar_ICD_distances]
            numerator = 0
            denominator = 0

            # Loop over each similar ICD class in the similarity list
            for s in range(0, len(similar_ICD_similarity)):
                adjusted_r = (
                    orig_df.iloc[similar_ICD_indices[s], member_life_id_index]
                    - baseline_estimate[similar_ICD_indices[s]]
                )
                numerator = numerator + similar_ICD_similarity[s] * adjusted_r
                denominator = denominator + similar_ICD_similarity[s]

            # This is very unlikely since we won't have classes in a similarity
            # vector that are **exactly** similar to each other but we're just
            # being defensive.
            #
            # In the highly unlikely case that this happens, just return the
            # global baseline estimate as the predicted frequency and call it a
            # day.
            if denominator > 0:
                if use_global_baseline:
                    predicted_freq = baseline_estimate[index] + (
                        numerator / denominator
                    )
                else:
                    predicted_freq = numerator / denominator
            else:
                predicted_freq = baseline_estimate[index]

            # place the predicted frequency into the copy of the original dataset
            updated_df.iloc[index, member_life_id_index] = predicted_freq

    return _process_recommendations(
        member_life_id,
        limit,
        orig_df,
        updated_df,
    )


def pick_a_random_member():
    return np.random.choice(LAYER_DATA[1]["Member_Life_ID"])


def recommend_patient_conditions(member_life_id, limit):
    return {
        1: _recommend_conditions_at_layer(
            member_life_id,
            limit,
            matrix_of_frequencies=LAYER_DATA[1],
            item_item_similarity_indices=INDICES_ITEM[1],
            item_item_similarity_distances=DISTANCES_ITEM[1],
            # NOTE: We do not use the global baseline at any layer since we
            # determined that offered a relatively poor performance. See the
            # report!
            use_global_baseline=False,
        ),
        2: _recommend_conditions_at_layer(
            member_life_id,
            limit,
            matrix_of_frequencies=LAYER_DATA[2],
            item_item_similarity_indices=INDICES_ITEM[2],
            item_item_similarity_distances=DISTANCES_ITEM[2],
            use_global_baseline=False,
        ),
        3: _recommend_conditions_at_layer(
            member_life_id,
            limit,
            matrix_of_frequencies=LAYER_DATA[3],
            item_item_similarity_indices=INDICES_ITEM[3],
            item_item_similarity_distances=DISTANCES_ITEM[3],
            use_global_baseline=False,
        ),
    }
