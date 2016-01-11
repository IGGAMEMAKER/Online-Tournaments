function is_numeric_id(login){

	var arr1 = login.split("id");
	var is_numeric= arr1.length==2 && arr1[0]=="" && !isNaN(arr1[1]);
	if (is_numeric)
		console.log("input: ", login, is_numeric?"is_numeric ||":"no ||", "output:", arr1);
	/*if (){
		console.log("2 blocks");
	}*/
	//if (arr1[0]=="id")
}

is_numeric_id("id123123");
is_numeric_id("idasd3123");
is_numeric_id("id12id3123");
is_numeric_id("g.iosebashvili");
is_numeric_id("123id");
