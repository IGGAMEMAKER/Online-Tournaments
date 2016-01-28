#!/bin/bash          
#STR="Hello World!"
#echo $STR

#TODAY=$(date +"%Y%m%d%H%M%S")
TODAY=$(date +"%Y-%m-%d")
echo $TODAY
FOLDER="/tournaments/backups/remote/"$TODAY
echo $FOLDER
sudo mkdir -p $FOLDER
FULL=$FOLDER"/"
echo $FULL
