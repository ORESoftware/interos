#!/usr/bin/env bash

set -e;

# if we stop/rm containers that do not exist we get errors but we can ignore them

docker stop interos | cat
docker rm --force interos | cat

docker stop selenium | cat
docker rm --force selenium | cat

docker network rm interos | cat
docker network create interos | cat

docker run --net=interos -d -p 4444:4444 --name selenium selenium/standalone-chrome

docker build -t interos .
docker run -it --net=interos -p 3000:3000 --name interos interos
