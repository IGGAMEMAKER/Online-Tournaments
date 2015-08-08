echo "START SH SCRIPT WORKS!!"
gnome-terminal -x sh -c 'node /home/gaginho/project/NODE/GameFrontendServer.js; exec bash'
echo 'SCRIPT GameFrontendServer.js WORKS!!'
gnome-terminal -x sh -c 'node /home/gaginho/project/NODE/GameServer.js; exec bash'
echo 'SCRIPT GameServer.js WORKS!!'
gnome-terminal -x sh -c 'node /home/gaginho/project/NODE/TournamentManager.js; exec bash'
echo 'SCRIPT TournamentManager.js WORKS!!'
gnome-terminal -x sh -c 'node /home/gaginho/project/NODE/initializer.js; exec bash'
echo 'SCRIPT initializer.js WORKS!!'
