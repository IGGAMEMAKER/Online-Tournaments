function isDate(date){
	console.log(date);
	var isDateBool = date instanceof Date && !isNaN(date.valueOf());
	console.log(isDateBool);
	return isDateBool;
}


isDate(new Date('2111-11-11T11:11'));
