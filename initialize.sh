#!/bin/bash

clear
echo "Set up initial MongoDB."

#mongod --fork --logpath /dev/null
mongo coderdojo initialize.js
#sudo mongo coderdojo initilize.js

cd Administrator/
npm install
npm update
echo "Start Admin Server."
npm start
 cd ..
cd WebRTC/
echo "Start Communication Server."
npm install
npm update
export XIRSYS=d61e9bc4-ef33-11e5-99b3-f77709746db4
npm start