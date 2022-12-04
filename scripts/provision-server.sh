#!/bin/bash
set -euo pipefail

echo "THIS SCRIPT IS NOT TO BE RUN ON YOUR LAPTOP! IT IS MEANT FOR AWS!"
if [[ $(id -u) -ne 0 ]]; then
    echo "THIS SCRIPT NEEDS TO BE RUN AS ROOT!"
    exit 1
fi
sleep 3

echo "RUN THIS FROM THE PROJECT ROOT AND NOT THE 'scripts' FOLDER!"

apt -y update
apt -y upgrade
apt -y install \
    build-essential \
    git \
    nginx \
    python3 \
    python3-pip \
    python3-setuptools \
    python3-poetry \
    gunicorn

echo "Installing Node in case we need it for some reason"
curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - && sudo apt-get install -y nodejs
sudo npm i -g yarn http-server

echo "Cleaning up"
apt -y autoremove

echo "Setting up server"
pip install flask pandas numpy scipy pyarrow
ON_PROVISIONED_SERVER=1 yarn setup:server

echo "Setting up the Gunicorn service"
cp ./scripts/gunicorn.service /etc/systemd/system/gunicorn.service
cp ./scripts/gunicorn.socket /etc/systemd/system/gunicorn.socket

echo "Setting up the Nginx service"
cp ./scripts/nginx.icd10ninja /etc/nginx/sites-available/icd10ninja
rm /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/icd10ninja /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/icd10ninja /etc/nginx/sites-enabled/icd10ninja

echo "Reloading all daemons"
systemctl daemon-reload

echo "Starting socket"
systemctl start gunicorn.socket

echo "Starting Application Server"
systemctl start gunicorn.service

echo "Starting Reverse Proxy"
systemctl start nginx

echo "Enabling services to autostart"
systemctl enable gunicorn.service
systemctl enable gunicorn.socket
systemctl enable nginx
