#!/bin/bash


# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
#CC_SRC_LANGUAGE=${1:-"go"}
CC_SRC_LANGUAGE=${1:-"javascript"}
CC_SRC_LANGUAGE=`echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:]`

CC_SRC_PATH="../chaincode/fabcar/javascript/"

# clean out any old identites in the wallets
rm -rf javascript/wallet/*

#clear database
sudo -u postgres psql -c 'drop database IF EXISTS sieve'
sudo -u postgres psql -c 'create database sieve'
sudo -u postgres psql -c 'GRANT ALL PRIVILEGES ON DATABASE sieve TO sieve'
sudo -u postgres psql -d sieve -c '\i /home/farquad/Documents/gdprsearch/sieve/data/mall_data10kCompleteSieve.sql '

# add logResults channel on kafka
$HOME/Documents/kafka_2.13-3.1.0/bin/kafka-topics.sh --create --topic logResults --bootstrap-server localhost:9092


# launch network; create channel and join peer to channel
pushd ../test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn fabcar -ccv 1 -cci initLedger -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_PATH}
popd
