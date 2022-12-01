# Layer Data

This is here and not in `../data` because of Python's import mechanism's nonsense.

- `layer_{1,2,3}.json` and `layer_{1,2,3}__filtered.json` are generated just _once_.
- The text files (like `layer_1_raw.txt`) are the Sources of Truth for each layer _except_ for Layer 3.
- **Important**: Do _not_ touch the JSON files by hand! Use the appropriate scripts in the folder above to do so.
- **Important**: The classes and their descriptions in the raw text files are separated by _four spaces_.

**SUPER IMPORTANT**: Layer _weights_ are edited _by hand_ and _are integers_! Save your work!

```bash
# Do this from one level above
python x10-process_layer_1_data.py
python x10-process_layer_2_data.py
python x10-process_layer_3_data.py
```

This will output two sets of JSON files: full and filtered. The latter will have a suffix `__filtered`. These contain all the layer classes _without_ some classes that we are choosing to ignore. You can see a list of these in `ignored_classes.json`.

### Note on Layer 3 Raw Data

Used `scraping_data/extract.py` to generate `layer_3_raw.json` from [this source](https://www.icd10data.com/ICD10CM/Codes).

### How these files are used

The _filtered_ JSON files (the ones with `__filtered` in their names and which exclude certain classes) are used to drive the web interface and the generation of production parquet files.
