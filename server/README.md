# ICD10.ninja - Server

👉 This is stuff for project maintainers. If you just want to start this server, go one level above this folder and type `yarn start:server` and head to http://localhost:5000.

## Local Development

You will need Python 3.10+ and [Poetry](https://python-poetry.org/) installed whichever way you please (we like [`pyenv`](https://github.com/pyenv/pyenv)). Then,

```bash
# Set the virtual environment to be in this folder.
# Helps with IntelliSense in your favorite editor.
poetry config virtualenvs.in-project true

# Install dependencies locally
poetry install --no-root

# Run the local server
FLASK_DEBUG=1 poetry run flask --app server run

# If you add any dependencies, make sure you export poetry dependencies
# in pip format for the server. This is because this is easier (for me)
# to NOT deal with another 'thing' (poetry) I have to install on the
# deployed server. Yay Python...
poetry export --without-hashes --format=requirements.txt > requirements.txt
```

### The Endpoints

This is a very simple REST API that offers three endpoints. You can see the shapes of the responses in `../client/services/api/types.ts`.

#### `/similar_conditions/<string:icd10_code>`

This will return the top 10 ICD10 Codes that are similar to `icd10_code` based on a Normalized Cosine Similarity metric at each layer (1, 2, and 3).

#### `/similar_patients/<int:member_life_id>`

If the `member_life_id` is found, this will return information on the patient/member's current conditions at each layer (under the `thisPatient` key) and provide a list of similar patients and their conditions (under the `similarPatients` key).

#### `/patient_conditions/<int:member_life_id>`

If the `member_life_id` is found, this will return the _predicted_ conditions for a patient/member with the supplied `member_life_id` at each layer.

### Similarity Matrices and their Variants

We use Cosine Similarity and have three variants for item-item similarity:

1. Unadjusted
2. Centered
3. Normalized

All these reference files will be in the `./data` folder if you run `yarn setup:server` from the root of this repository (one level above!)

If you're running this locally, we encourage you to study and tweak `./data_maps.py` to see the effect of switching out the item-item similarity matrices on the predictions via the web interface ❤️

## Deployment

Deployed at https://icd10.ninja/api. Here's how everything's set up.

```
                                                   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
                                                   ┃  ┌───────────────────────────────────┐ ┃
                          Server - API - /api/* ┌──╋──▶      Load Balancer (EC2-ALB)      │ ┃
                                                │  ┃  └─────────────────┬─────────────────┘ ┃
                                                │  ┃                    │                   ┃
                                                │  ┃  ┌─────────────────▼─────────────────┐ ┃
                                                │  ┃  │       Reverse Proxy (Nginx)       │ ┃
┌─────────────────┐   ┌──────────────────┐      │  ┃  └─────────────────┬─────────────────┘ ┃
│  DNS (Route53)  ├───▶ CDN (CloudFront) │──────┤  ┃                    │                   ┃
└─────────────────┘   └──────────────────┘      │  ┃  ┌─────────────────▼─────────────────┐ ┃
                                                │  ┃  │   Application Server (Gunicorn)   │ ┃
                                                │  ┃  └───────────────────────────────────┘ ┃
                                                │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                                │
                                                │     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
                             Client - SPA  - /* └─────▶                S3                 ┃
                                                      ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

Deployed to EC2 instances behind an Application Load Balancer (ALB). We're using the Ubuntu 22.04 LTS AMI. Did not use Docker/ECS or Fargate because we needed an instance with a pretty large amount of memory (32GiB+).

### Server Provisioning

Clone this repo as user `ubuntu` and run the provisioning script as `root`.

```bash
# As ubuntu
cd
git clone https://github.com/afreeorange/ISYE6748.git project
sudo su -
cd project
./scripts/provision-server.sh
```

It will set up the Application Server and the Reverse Proxy. Once it is finished,

```bash
# Test the connection. The API should say hello.
curl --unix-socket /run/gunicorn.sock localhost

# Then use `journalctl` tail any service unit
journalctl -u gunicorn.service -f
journalctl -u nginx.service -f
```
