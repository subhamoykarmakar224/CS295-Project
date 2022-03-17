#!/bin/bash


# Exit on first error
set -e
sudo -u postgres psql -c 'drop database IF EXISTS the_db'
sudo -u postgres psql -c 'create database the_db'
#sudo -u postgres psql -c 'GRANT ALL PRIVILEGES ON DATABASE sieve TO sieve'
#change directory to howevermany entries we want to test after
sudo -u postgres psql -d the_db -c '\i /home/farquad/Documents/gdprsearch/sieve/data/mall_data50kbase.sql'
sudo service postgresql restart