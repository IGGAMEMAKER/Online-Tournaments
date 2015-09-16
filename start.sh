forever start -e Logs/err.txt DBServer.js
forever start -e Logs/err.txt FrontendServer.js
forever start -e Logs/err.txt BalanceServer.js
forever start -e Logs/err.txt TournamentServer.js
forever start -e Logs/err.txt GameFrontendServer.js
forever start -e Logs/err.txt PingPongServer.js
forever start -e Logs/err.txt TournamentManager.js
forever start -e Logs/err.txt initializer.js
sudo forever start -e Logs/err.txt site.js
