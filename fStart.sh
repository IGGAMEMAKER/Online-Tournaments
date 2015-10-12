sudo fuser -k 80/tcp
sudo fuser -k 3000/tcp
sudo fuser -k 5000/tcp
sudo fuser -k 5001/tcp
sudo fuser -k 5002/tcp
sudo fuser -k 5004/tcp
sudo fuser -k 5006/tcp
sudo fuser -k 5007/tcp
sudo fuser -k 5008/tcp
sudo fuser -k 5009/tcp
sudo fuser -k 5010/tcp
sudo forever stopall
#sudo forever start --uid "site" -o Logs/site.log -e Logs/siteErr.log -a site.js
sudo node monitorTest.js
#sudo forever start -o Logs/monitorTest.log -e Logs/monitorTestErr.log monitorTest.js
sudo forever list
