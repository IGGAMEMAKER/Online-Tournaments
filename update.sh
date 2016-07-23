git fetch --all
git reset --hard origin/master
cd frontend
printf "webpack starting... Press Ctrl+C to stop if it fails \n"
webpack
sleep 1
printf "5 seconds till start\n"
sleep 1
printf "4 seconds till start\n"
sleep 1
printf "3 seconds till start\n"
sleep 1
printf "2 seconds till start\n"
sleep 1
printf "1 seconds till start\n"
sleep 1
#cd ../