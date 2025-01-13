#!/bin/bash
set -euo pipefail

echo "THIS SCRIPT IS NOT TO BE RUN ON YOUR LAPTOP! IT IS MEANT FOR AWS!"
if [[ $(id -u) -ne 0 ]]; then
    echo "THIS SCRIPT NEEDS TO BE RUN AS ROOT!"
    exit 1
fi

echo "RUN THIS FROM THE PROJECT ROOT AND NOT THE 'scripts' FOLDER!"

# ----------

echo "Updating system, installing some necessary stuff, cleaning up"
apt -y update
apt -y upgrade
apt -y install \
    build-essential \
    python3 \
    nginx \
    gunicorn
apt -y autoremove

# ----------

echo "Installing uv"
curl -LsSf https://astral.sh/uv/install.sh | sh
# shellcheck disable=SC1091
source "$HOME/.local/bin/env"

# ----------

echo "Setting up server"
pushd server
uv sync
popd
mkdir -p server/data
cp -v data/layers/*.json server/data/
cp -v data/processed/100-layer-frequencies* server/data/
cp -v data/similarity_matrices/*.parquet server/data/
echo "Done"

# ----------

echo "Setting up Application Server and Reverse Proxy"
cat <<EOF >/etc/systemd/system/gunicorn.service
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/project/server
ExecStart=/home/ubuntu/project/server/.venv/bin/gunicorn \
          --access-logfile - \
          --bind unix:/run/gunicorn.sock \
          server:app

[Install]
WantedBy=multi-user.target
EOF

cat <<EOF >/etc/systemd/system/gunicorn.socket
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target
EOF

cat <<EOF >/etc/nginx/sites-available/icd10ninja
server {
    listen 80;
    server_name icd10.ninja;

    # Don't care about favicons
    location = /favicon.ico { access_log off; log_not_found off; }

    # Proxy all calls to the Gunicorn socket
    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }
}
EOF
rm /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/icd10ninja /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/icd10ninja /etc/nginx/sites-enabled/icd10ninja

# ----------

echo "Reloading all daemons"
systemctl daemon-reload

echo "Starting socket"
systemctl start gunicorn.socket

echo "Starting Application Server"
systemctl start gunicorn.service

echo "Starting Reverse Proxy"
systemctl start nginx
systemctl restart nginx # Superstition

echo "Enabling services to autostart"
systemctl enable gunicorn.service
systemctl enable gunicorn.socket
systemctl enable nginx
