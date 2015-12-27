service mongod stop
fuser -k 27017/tcp
cd /mongo
mongod --config conf
