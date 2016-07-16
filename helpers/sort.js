var sort_by = function(field, reverse, primer){

   var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     }
};

module.exports = {
	winners: function(scores){
		var obj = [];
		for (var a in scores){ obj.push( { value:scores[a], login: a } );	}

		obj.sort(sort_by('value', true, parseInt));
		return obj;
	}
};
