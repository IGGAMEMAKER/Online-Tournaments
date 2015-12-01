//var d = new Date("2012-02-29")
var d = new Date();
console.log(d)
// Wed Feb 29 2012 11:00:00 GMT+1100 (EST)

d.setDate(d.getDate() + 1)
console.log(d)
// Thu Mar 01 2012 11:00:00 GMT+1100 (EST)

console.log(d.getDate())
console.log('-------------');


create_daily_for_week();

function create_daily_for_week(){
	for (var i=0; i<7; i++){
		var d = new Date();
		console.log(d)
		// Wed Feb 29 2012 11:00:00 GMT+1100 (EST)

		d.setDate(d.getDate() + i+27)
		console.log(d)
		// Thu Mar 01 2012 11:00:00 GMT+1100 (EST)

		console.log(d.getDate())

		//console.log(getTodayQuery(d));
	}

}


function getTodayQuery(date){
	var currentDate = new Date();
	if (date) currentDate = date;
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

	var next = day+1;
	if (day<=9) day = '0'+day;
	if (next<=9) next = '0'+next;

	var c = "T00:00:00.000Z";
	var dtToday = year+"-"+month+"-"+day;
	var dtTommorow = year+"-" + month+"-"+ next;
	console.log('dtToday: ' + dtToday + '  dtTommorow: ' + dtTommorow);
	//var query = {
	var today = {
		// $gte : ISODate("2015-11-02T00:00:00Z"), 
		// $lt : ISODate("2014-07-03T00:00:00Z")

		$gte : new Date(dtToday + c), 
		$lt : new Date(dtTommorow + c) 
	}
	return today;
	//}
}
