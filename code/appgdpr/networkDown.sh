#!/bin/bash

# Exit on first error
set -ex

# Bring the test network down
pushd ../test-network
./network.sh down
popd

# clean out any old identites in the wallets
rm -rf javascript/wallet/*



#clean database
rm -rf javascript/dblogs/*
sudo -u postgres psql -c 'drop database IF EXISTS sieve'