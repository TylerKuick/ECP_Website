#!/bin/bash
cd ~ 
sudo yum update -y
sudo amazon-linux-extras install epel -y
sudo yum install stress -y
sudo yum install -y httpd
sudo systemctl start httpd
sudo systemctl enable httpd
sudo yum install -y git
sudo yum install -y curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 16.0.0
git clone https://github.com/TylerKuick/ECP_Website
cd ~/ECP_Website/front-end
sudo cp -r dist/* /var/www/html
sudo systemctl restart httpd