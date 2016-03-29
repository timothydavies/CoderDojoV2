
mongo coderdojo initialize.js
cd WebRTC/
echo "Start Communication Server."
npm install --loglevel silent
npm update --loglevel silent
export XIRSYS=d61e9bc4-ef33-11e5-99b3-f77709746db4
sudo start xvfb
java -jar ./test/selenium-server-standalone-2.35.0.jar Dw-ebdriver.chrome.driver=./test/chromedriver &
npm start
sudo chmod 0777 ./node_modules/mocha/bin/mocha
npm test