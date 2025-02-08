# A Collaborative Filtering-based Approach to Patient Journey Mapping and Disease Prediction

by Nikhil Anand (`@nanand33`) William Lam (`@wlam39`), and Shrea Shyam (`@sshyam3`)

Team Repository for the Applied Practicum at [Georgia Tech's Analytics Program](https://www.analytics.gatech.edu/) 🐝 If you have any problems whatsoever with running things, please [email Nikhil](mailto:mail@nikhil.io?subject=icd10.ninja%20Repository).

## About this Project

Please see our [Midterm Presentation](https://icd10.ninja/midterm-report.pdf) for an overview and [the Final Report](https://icd10.ninja/report.pdf) for our details on our implementation.

The results of our analysis and modeling are expressed via a Web Application (an SPA built with React) and an API server (a Flask application in Python). We will describe how to run these locally but if you don't want to bother, both are publicly available at [https://icd10.ninja](https://icd10.ninja)

## Running Our Application Locally

You will need:

- `bash`
- [Node](https://nodejs.org/en/download/) v21+ with [`pnpm`](https://pnpm.io/)
- [Python](https://www.python.org/downloads/) v3.10+ with [`uv` installed](https://docs.astral.sh/uv/getting-started/installation/) (you can use the latter to install Python itself).

Once you're set with these, open two terminal sessions.

```bash
# In one session, let's start with the Client. This will install
# dependencies, copy some required static assets into place and run a
# local server at
#
#   http://localhost:5173
#
./scripts/setup-client.sh
./scripts/start-client.sh

# In the other session, start the Server. This will run `uv` to install
# dependencies, copy some required static assets into place and run a
# local server at
#
#   http://localhost:5000
#
./scripts/setup-server.sh
./scripts/start-server.sh
```

That's it! Now navigate to http://localhost:5173 to use our spiffy app 🥳

## Repository Structure

| Folder      | Description                                                                                                            | README                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `analysis`  | All the notebooks and scripts we used to generate data for our analysis, conduct analysis, and evaluate our approches. | [Link](https://github.com/afreeorange/ISYE6748/blob/master/analysis/README.md)  |
| `client`    | The Frontend Client, an SPA written in React, and deployed to https://icd10.ninja                                      |                                                                                 |
| `data`      | All the data we both used and generated for the project.                                                               | [Link](https://github.com/afreeorange/ISYE6748/blob/master/data/README.md)      |
| `documents` | Reports, presentations, references, notes.                                                                             | [Link](https://github.com/afreeorange/ISYE6748/blob/master/documents/README.md) |
| `scripts`   | All scripts required to run this project locally and deploy it wherever. To be run from the root of this repo.         |                                                                                 |
| `server`    | A Flask-based server that implements our modeling approach via a few REST endpoints.                                   | [Link](https://github.com/afreeorange/ISYE6748/blob/master/server/README.md)    |

## License

[GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)
