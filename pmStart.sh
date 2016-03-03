pm2 delete all
#NODE_ENV=production
pm2 start site.js --name site -i 1
sleep 1
##pm2 start Statistics.js --name ST
pm2 start DBServer.js --name DB
sleep 1
#pm2 start TournamentServer.js --name TS

pm2 start GameFrontendServer.js --name GFS
#pm2 start Servers/PingPongServer.js --name PP
pm2 start Servers/QuestionServer.js --name QS
##pm2 start Servers/BattleServer.js --name BT
pm2 list
pm2 logs --err all
