echo "START SH SCRIPT WORKS!!"
gnome-terminal -x sh -c 'node /home/gaginho/project/NODE/script.js; exec bash'
echo 'SCRIPT script.js WORKS!!'
gnome-terminal -x sh -c 'node /home/gaginho/project/NODE/AccountServer.js; exec bash'
echo 'SCRIPT AccountServer.js WORKS!!'
gnome-terminal -x sh -c 'node /home/gaginho/project/NODE/client-bot.js; exec bash'
echo 'SCRIPT client-bot.js WORKS!!'
