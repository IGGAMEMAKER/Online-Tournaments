function setInviter(inviter, inviter_type){
	setCookie('inviter', inviter);
	setCookie('inviter_type', inviter_type||0);
	// alert(inviter, inviter_type);
}


function parseQueryString(queryString) {
	var params = {};
	var queries, temp, i, l;

	// Split into key/value pairs
	// queries = queryString.split("&");//amp;
	queries = queryString.split(/&(?:amp;)?/gi);

	// Convert the array of strings into an object
	for ( i = 0, l = queries.length; i < l; i++ ) {
		temp = queries[i].split('=');
		params[temp[0]] = temp[1];
	}

	return params;
};

function getInviterFromUrl(){
	var queryString = window.location.search;
	queryString = queryString.substring(1);
	
	var query = parseQueryString(queryString);
	
	// console.log('parse in out', queryString, query);
	return query['inviter'];
}

var inviter = {
	group: function(groupName){ setInviter(groupName, 1); } 
	, human: function (username){ setInviter(username, 0); }
}

//function human(username){ setInviter(username, 0); }

// console.log(inviter);
// alert('inviter.js');