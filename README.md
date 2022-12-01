# A Collaborative Filtering-based Approach to Patient Journey Mapping and Disease Prediction

by Nikhil Anand (`@nanand33`) William Lam (`@wlam39`), and Shrea Shyam (`@sshyam3`)

Team Repository for the Applied Practicum at [Georgia Tech's Analytics Program](https://www.analytics.gatech.edu/) 🐝

👉 **Note**: If you have _any problems whatsoever_ with running things in this repository, please [email Nikhil](mailto:mail@nikhil.io).

## About this Project

Please see our [Midterm Presentation](https://github.com/afreeorange/ISYE6748/blob/master/Mid-term%20Presentation/Presentation.pdf) for an overview and [the Final Report](https://github.com/afreeorange/ISYE6748/blob/master/Final%20Report/Report.pdf) for our details on our implementation.

The results of our analysis and modeling are expressed via a Web Application (an SPA built with React) and an API server (a Flask application in Python). We will describe how to run these locally but if you don't want to bother, both are publicly available at [https://icd10.ninja](https://icd10.ninja).

## Running Our Application Locally

You will need:

- `bash` v4+. If you're on Windows, you can use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).
- [Node](https://nodejs.org/en/download/) v18+ with `yarn` v1.10+ installed globally (`npm i -g yarn`)
- [Python](https://www.python.org/downloads/) v3.10+ with `poetry` installed globally (`pip install poetry`)

We like `nvm` and `pyenv` to manage our environments but you can use whatever you'd like. Here's some copypasta to get our app running on your machine:

```bash
# Let's start with the Client. This will run `yarn` to install dependencies,
# copy some required static assets into place and run a local server at
#
#   http://localhost:3000
#
yarn start:client

# Same deal with the Server. This will run `poetry` to install dependencies,
# copy some required static assets into place and run a local server at
#
#   http://localhost:5000
#
yarn start:server
```

That's it! Now navigate to http://localhost:3000 to use our spiffy app 🥳

## Analysis and Modeling

All the notebooks and scripts we used to generate data for our analysis, conduct analysis, and evaluate our approches are in the `./analysis`. Please see [`./analysis/README.md`](https://github.com/afreeorange/ISYE6748/blob/master/analysis/README.md) for further information.

## Data

The `./data` folder contains _all_ the data we used and generated for this project. Please see [`./data/README.md`](https://github.com/afreeorange/ISYE6748/blob/master/data/README.md) for further information.

## Client/Frontend

The `./client` folder contains a React-based SPA. You can see `./client/README.md` for some commands. You are encouraged to run `yarn start:client` from this folder, however.

## Server/Backend

The `./server` folder contains a Flask-based server that implements our modeling approach via a few REST endpoints. See [`./server/README.md`](https://github.com/afreeorange/ISYE6748/blob/master/server/README.md) for a listing of these endpoints and more information.

## Other Stuff

You will also find our Final Report, Midterm Presentation, and other assorted references in their appropriately named folders. The `./scripts` folder contains many conveniences that help you start the client and server, deploy the web app, and so on.

## License

[GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)
