sudo forever start site.js
forever start DBServer.js --minUptime 300
forever start FrontendServer.js
forever start BalanceServer.js
forever start TournamentServer.js
forever start GameFrontendServer.js
sh gameServers.sh
