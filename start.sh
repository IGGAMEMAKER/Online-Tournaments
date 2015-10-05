sudo forever start --uid "site" -a site.js
forever start --uid "DB" -a DBServer.js --minUptime 300
forever start --uid "FS" -a FrontendServer.js
forever start --uid "BS" -a BalanceServer.js
forever start --uid "TS" -a TournamentServer.js
forever start --uid "GFS" -a GameFrontendServer.js
forever start --uid "MS" -a MoneyServer.js
sh gameServers.sh
sudo forever list
