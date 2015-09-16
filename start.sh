forever start -o Logs/logs.txt -e Logs/err.txt DBServer.js
forever start -o Logs/logs.txt -e Logs/err.txt FrontendServer.js
forever start -o Logs/logs.txt -e Logs/err.txt BalanceServer.js
forever start -o Logs/logs.txt -e Logs/err.txt TournamentServer.js
forever start -o Logs/GFS.txt -e Logs/err.txt GameFrontendServer.js
forever start -o Logs/PPServer.txt -e Logs/err.txt PingPongServer.js
forever start -o Logs/logs.txt -e Logs/err.txt TournamentManager.js
forever start -o Logs/logs.txt -e Logs/err.txt initializer.js
sudo forever start -o Logs/Site.txt -e Logs/err.txt site.js
