#!/bin/bash

echo "THIS SCRIPT IS NOT TO BE RUN LOCALLY!"
echo "RUN THIS FROM THE PROJECT ROOT AND NOT THE 'scripts' FOLDER!"

set -euo pipefail

sudo apt -y update
sudo apt -y upgrade
sudo apt -y install \
    build-essential \
    git \
    nginx \
    python3 \
    python3-pip \
    python3-setuptools

echo "Setting up Python. We're not using virtual environments here. Don't care."
sudo ln -s /usr/bin/python3 /usr/bin/python
pip install poetry gunicorn

echo "Installing Node in case we need it for some reason"
curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - && sudo apt-get install -y nodejs
sudo npm i -g yarn http-server

echo "Cleaning up"
sudo apt -y autoremove

echo "Setting up server reqirements"
yarn
yarn setup:server

echo "Setting up the Gunicorn service"
sudo cp ./scripts/gunicorn.service /etc/systemd/system/gunicorn.service
sudo cp ./scripts/gunicorn.socket /etc/systemd/system/gunicorn.socket

echo "Setting up the Nginx service"
sudo cp ./scripts/nginx.icd10ninja /etc/nginx/sites-available/icd10ninja
sudo ln -s /etc/nginx/sites-available/icd10ninja /etc/nginx/sites-enabled/icd10ninja
