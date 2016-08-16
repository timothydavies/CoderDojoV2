#!/bin/bash

clear
echo "Terminate Process"

./shutdownComServer.sh
./shutdownAdminServer.sh
#./shurdownMongoDB.sh

echo "Terminate the whole system."