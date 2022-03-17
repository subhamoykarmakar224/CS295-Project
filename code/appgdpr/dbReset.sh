#!/bin/bash


# Exit on first error
set -e
sudo -u postgres psql -c 'drop database IF EXISTS sieve'
sudo -u postgres psql -c 'create database sieve'
sudo -u postgres psql -c 'GRANT ALL PRIVILEGES ON DATABASE sieve TO sieve'
#change directory to howevermany entries we want to test after
sudo -u postgres psql -d sieve -c '\i /home/farquad/Documents/gdprsearch/sieve/data/mall_data50kSieveComplete.sql'
sudo service postgresql restart