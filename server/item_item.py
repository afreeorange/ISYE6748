from constants import GIANT_LIST_OF_ALL_CLASS_NAMES, GIANT_MAP_OF_ALL_CLASSES
from data_maps import DISTANCES_ITEM, INDICES_ITEM
from exceptions import ClassNotFoundException


# Change the values in similarity indices to their ICD classes, and append with
# their distances to target ICD
def recommend_similar_classes_at_layer(icd_class, layer_number, limit=None):
    indices = INDICES_ITEM[layer_number]
    distances = DISTANCES_ITEM[layer_number]

    # get an index for the ICD code
    target_ICD_index = indices.index.tolist().index(icd_class)

    # make list for its similar ICD codes, applying a limit if specified
    similar_ICD = indices.loc[icd_class].tolist()[: limit + 1 if limit else None]

    # the list for distances of similar ICD codes
    ICD_distances = distances.loc[icd_class].tolist()

    # Get the position of the ICD code itself in indices and remove it from
    # the indices and distances.
    ICD_index = similar_ICD.index(target_ICD_index)
    similar_ICD.remove(target_ICD_index)
    ICD_distances.pop(ICD_index)

    similar_list = []
    j = 0

    for i in similar_ICD:
        # NOTE: distance and similarity are not the same!
        # Similarity = (1 - Distance)
        similarity = 1 - ICD_distances[j]
        similar_list.append([indices.index[i], similarity])

        j += 1

    return similar_list


def recommend_similar_classes(icd_class, limit: int | None = None):
    ret = {
        1: [],
        2: [],
        3: [],
    }

    if icd_class not in GIANT_LIST_OF_ALL_CLASS_NAMES:
        raise ClassNotFoundException(f"Could not find ICD10 code {icd_class}")

    # Now we use our handy-dandy hierarchy property to build the
    # recommendations at each layer!
    hierarchy = GIANT_MAP_OF_ALL_CLASSES[icd_class]["hierarchy"]

    for i, parent_class in enumerate(hierarchy):
        layer_number = len(hierarchy) - i
        ret[layer_number] = recommend_similar_classes_at_layer(
            parent_class,
            layer_number,
            limit,
        )

    return ret
