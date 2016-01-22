/*$.ajax({
	  url: url,
	  method: 'POST',
	  data: { login: login, tournamentID:tID },
	  success: function( data ) {
			var msg = JSON.parse(data);//JSON.stringify(data);
			var txt='';
		}})*/

/*var input = document.getElementById('cashout');
input.oninput = function (){
	var sum = input.value;
	var user = login;
	var moneyRu = sum * USD_TO_RUR;
	//var link ="https://paysto.com/ru/upBalance?PAYSTO_SHOP_ID=22855&PAYSTO_SUM="+moneyRu+"&PAYSTO_PAYER_ID="+login;
	console.log(link + " " + sum + " " + user + " " + moneyRu + "p")

	$("#depositLink1").attr("href", link);
	$("#depResult").html("Сумма в рублях: " + moneyRu + "р")

	//document.getElementById('depResult').innerHTML = "Сумма в рублях: "+ sum*USD_TO_RUR+"р";
	$("#depositLink1").html("Пополнить счёт на "+ sum+"$");
}*/

function cashout(){
	//alert("hey!");
	var input = document.getElementById('cashout');
	var money = parseInt(input.value);
	var cardNumber = document.getElementById('cardNumber').value;
	if (money<30) return alert("Минимальная сумма вывода - 30$");
	
	if (!cardNumber || isNaN(cardNumber)) {
		return alert("Введите ТОЛЬКО цифры");
	}

	$.ajax({
		url: "Cashout",
		method: 'POST',
		data:{login:login, money:money, cardNumber:cardNumber},
		success: function(data){
			alert("Ваш запрос на вывод средств принят, вы получите ваши деньги в течение 7 дней, в противном случае, свяжитесь с техподдержкой сайта");
		}
	});
}