#!/usr/bin/env bash
mkdir dapp && cd dapp 
npm init -y
npm install react react-dom react-router-dom react-scripts drizzle
mkdir public 
mkdir src && cd src 
ln -s ../../build/contracts contracts