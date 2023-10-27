#!/bin/bash

sudo fallocate -l 1G /swapfile1
sudo chmod 600 /swapfile1

sudo mkswap /swapfile1
sudo swapon /swapfile1


echo "swap is up: 1G"
#!/bin/bash