var USD_TO_RUR=1;
// $("#userLogin").attr("value", login)
// $("#targets").attr("value", login)
// $("#sumAttribute").attr("value", 500)

//$("#depResult").html("Сумма в рублях: " + 10*USD_TO_RUR + "р")

$("#depositLink3").html("Пополнить счёт на 200 руб")

//$("#depositLink1").html("Пополнить счёт на "+ 10+"$");

var input = document.getElementById('deposit');
input.oninput = function (){
	var sum = input.value;
	console.log(sum);
	// var user = login;
	var moneyRu = sum * USD_TO_RUR;
	moneyRu = Math.ceil((moneyRu)*100)/100;
	///$("#depResult").html("Сумма в рублях: " + moneyRu + "р")
	// $("#sumAttribute").attr("value", sum)

	$("#depositLink3").attr("href", "/Payment?ammount="+moneyRu+"&buyType=2")
	$("#depositLink3").html("Пополнить счёт на " + moneyRu + " руб")

	//document.getElementById('depResult').innerHTML = "Сумма в рублях: "+ sum*USD_TO_RUR+"р";
	//$("#depositLink1").html("Пополнить счёт на "+ sum+"$");
	// $("#depositLink1").attr("value", "Пополнить счёт на "+ sum+"p")
}