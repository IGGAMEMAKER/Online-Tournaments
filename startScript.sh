echo "START SH SCRIPT WORKS!!"
gnome-terminal -x sh -c 'node /home/gaginho/project/NODE/DBServer.js; exec bash'
echo 'SCRIPT DBServer.js WORKS!!'
gnome-terminal -x sh -c 'node /home/gaginho/project/NODE/FrontendServer.js; exec bash'
echo 'SCRIPT FrontendServer.js WORKS!!'
gnome-terminal -x sh -c 'node /home/gaginho/project/NODE/BalanceServer.js; exec bash'
echo 'SCRIPT BalanceServer.js WORKS!!'
