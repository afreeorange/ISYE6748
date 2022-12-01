# Analysis Code for Our Project

```bash
# Install requirements
pip install -r requirements.txt

# If you add any, make sure you do this:
pip freeze > requirements.txt
```

## Development

Run these in order. We will generate JSON files and Parquet files **in that order**.

- All the generated _JSON_ data should be in `./layers`. Read the `README` in that folder to see how the generated files are used.
- All the generated _Parquet_ data should be in `../data/processed`. The names of these files will correspond to the names of the scripts that created them.

```bash
# ------------------ JSON Files: This must be done first! ------------------

# Generate the reference JSON files for each layer
python x10-process_layer_1_data.py
python x10-process_layer_2_data.py
python x10-process_layer_3_data.py

# Generate the children for each layer as a separate step
python y10-process_children.py

# Generate a giant list of classes and a giant map of classes
python y20-smush_layers.py

# ------------------ Parquet Files  ------------------

# Generate the dataframes with dropped columns and other basic data manipulations
000-initial-run.ipynb

# Generate the dataframes with layer frequencies. This should take ~20-30 minutes.
python 100-layer-frequencies.py

# Now check if all is well with this notebook
110-frequency-checks.ipynb

# Run this notebook to generate the user-user and item-item similarity matrices
400-similarity-matrices.ipynb

# Run this notebook to generate evaluation metrics
500-evaluation.ipynb
```
