module.exports = {
	happened_today: function(){
		return dayQuery(new Date(),1);
	},
	happened_this_week: function(){
		var tomorrow = new Date();
		tomorrow.setDate((new Date()).getDate()+1);
		return dayQuery(tomorrow,-7);
	},
	happened_this_month: function(){
		var tomorrow = new Date();
		tomorrow.setDate((new Date()).getDate()+1);
		return dayQuery(tomorrow,-30);
	},
	happened_since: function(date){
		return queryPeriod(date, new Date());
	},
	happened_in_period: function(d1, d2){
		return queryPeriod(d1, d2);
	},
	happened_during_N_days: function(N){
		return dayQuery(new Date(), -N);
	}

}

function dayQuery(date, days){
	var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	var tmrw 	= new Date(date.getFullYear(), date.getMonth(), date.getDate());
	tmrw.setDate(tmrw.getDate() + days);

	//console.log(today, tmrw);

	var query = {
		// $gte : ISODate("2015-11-02T00:00:00Z"), 
		// $lt : ISODate("2014-07-03T00:00:00Z")
		$gte : today<tmrw ? today:tmrw, 
		$lt : tmrw>today ? tmrw: today
	}
	return query;
}

function queryPeriod(d1, d2){
	var today = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
	var tmrw 	= new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
	//tmrw.setDate(tmrw.getDate() + days);

	//console.log(today, tmrw);

	var query = {
		$gte : today<tmrw ? today:tmrw, 
		$lt : tmrw>today ? tmrw: today
	}
	return query;
}