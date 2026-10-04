# Kenya JMuBEN coffee leaf sample

Real field photos used only to test the rust yes or no model.

- Source: JMuBEN and JMuBEN2, Mutira plantation, Kirinyaga county, Kenya, Mendeley Data doi 10.17632/tgv3zb82nd.1 and 10.17632/t2r6rszp5c.1, CC BY. Read through the Hugging Face copy Project-AgML/arabica_coffee_leaf_disease_classification (CC BY 4.0, 58,549 images). Only a random sample of single rows was fetched, a few MB.
- What it is: Fujifilm X-T4 photos taken on sunny, windy and cloudy days, both leaf sides, cropped to the centre square, labelled by a pathologist in the field. In this copy every image is 128x128, so lesions are small.
- What it does not cover: whole plants, hands, phone cameras, and severity (the severity column is empty).
- Known problems: many photos may come from the same leaf, so neighbouring rows were not taken together. Near-duplicates under flips and 90 degree turns were removed by image hash.
- Use: test only. Never train on it.

Photos kept: 193 (82 rust). Small balanced test set (`in_eval` = 1): 193.

Photos kept by label:

- cercospora: 28
- healthy: 11
- miner: 36
- phoma: 36
- rust: 82

Rebuild: `uv run scripts/prepare_field.py kenya`
