#!/bin/bash

clear
echo "The Admin Server is starting."

cd Administrator/
npm start

cd ..

echo "The Communication Server is starting."
cd WebRTC/
export XIRSYS=d61e9bc4-ef33-11e5-99b3-f77709746db4
npm start
cd ..
