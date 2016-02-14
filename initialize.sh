#!/bin/bash

clear
echo "Set up initial MongoDB."

mongod --fork --logpath /dev/null
mongo coderdojo initialize.js
#sudo mongo coderdojo initilize.js

cd Administrator/
echo "Start Admin Server."
forever start bin/www.js

cd WebRTC/
echo "Start Communication Server."
export XIRSYS=70c9a87c-6338-11e5-b7f9-407599caac9d
forever start bin/www.js