#!/bin/bash

clear
echo "Set up initial MongoDB."

mongod --fork --logpath /dev/null

#sudo mongo

echo "Modify database coderdojo."

echo "Create initial Administrator."

#mongo coderdojo firstItem.js 
mongo c initialize.js

echo "finish"