function saveInStorage(field, data){
	var item = data;
	if (typeof(data)=='object') {
		//console.log('object');
		item = JSON.stringify(data);
	}
	localStorage.setItem(field, item);
	//storage[field] = item;
}
function getFromStorage(field){
	//return storage[field];
	return localStorage.getItem(field);
}

function getObject(arrName){
  return JSON.parse( getFromStorage(arrName) );
}

function setInObject(arrName, id , value){
  var array = getObject(arrName);
  //prt(arrName, id, value);
  array[id] = value;
  saveInStorage(arrName, array);
}

function clearStorage(){
	localStorage.clear();
	saveInStorage('tournaments',[]);	// list of tournamentIDs
	saveInStorage('addresses',{}); 		// addresses of tournaments, reachable by tournamentIDs from 'tournaments' value
	saveInStorage('money',0);
}

//clearStorage();