function cashout(){
	//alert("hey!");
	var input = document.getElementById('cashout');
	var money = parseInt(input.value);
	var cardNumber = document.getElementById('cardNumber').value;
	if (money<500) return alert("Минимальная сумма вывода - 500 рублей");
	
	if (!cardNumber) { // || isNaN(cardNumber)
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