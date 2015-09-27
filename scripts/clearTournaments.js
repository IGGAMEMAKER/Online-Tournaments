db = db.getSiblingDB('test')
print(db.getCollectionNames());

db.tournamentregs.drop();
db.tournaments.update({status:null}, {$set:{players:0}}, {multi:true});
//db.tournaments.update({}, {$set:{players:0, status:null}});