

function log(msg){ console.log(msg); }

function now(){ return new Date(); }


function catcher(err){
	log('catched error!');
	if (err){
		log(err.stack||err);
	} else {
		log('null error');
	}
}

function updated(count){
	//console.log('Updated : ' + JSON.stringify(count), STREAM_USERS );
	return count.n>0;
}

function p_printer (obj) {
	return new Promise(function(resolve, reject){
		printer(obj);
		return resolve(obj);
	})
}

function printer(obj) { 
	//log('obj:');
	log(obj);
}

function removed(count){
	//console.error(count.result);
	return count.result.n>0;
}

this.log = log;
this.now = now;
this.catcher = catcher;

this.updated = updated;
this.removed = removed;

this.p_printer = p_printer;