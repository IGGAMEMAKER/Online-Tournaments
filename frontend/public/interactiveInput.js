	var RED = "#fdd";// "#FF0000";
	var WHITE = "#FFFFFF";
	var GREEN = "#dfd";//"#00FF00";

	var submitButton = 'register';

	var validityData = {
		password:0,
		email:0,
		login:0
	}
	var EMPTY= "*";
	/*var EMAIL_INVALID= "email is incorrect";
	var LOGIN_INVALID= "login can only contain letters or numbers. Special symbols are prohibited";
	var PASS_INVALID= "password can only contain letters or numbers. Special symbols are prohibited";*/

	var EMAIL_INVALID = "Некорректный email";
	var LOGIN_INVALID = "Некорректный логин. Используйте только латиницу и цифры. Специальные символы запрещены";
	var PASS_INVALID  = "Некорректный пароль. Используйте только латиницу и цифры. Специальные символы запрещены";

	var CORRECT = "OK!";

	var OK = 1;
	var FAIL = 0;

	var MIN_PASS_LENGTH=6;
	var MAX_PASS_LENGTH=35;

	var PASS_LENGTH = "Допустимая длина пароля от " + MIN_PASS_LENGTH + " до " + MAX_PASS_LENGTH + "символов";

	function valid_field(field, isValid){
		var value = document.getElementById(field).value;

		var colour = WHITE;
		var text = EMPTY;

		if (value.length==0){
			colour = WHITE;
			text = EMPTY;
		}	else {
			if (isValid(value)){
				colour=GREEN;
				text = CORRECT;
			}
			else{
				colour=RED;
				switch(field){
					case 'email' : text = EMAIL_INVALID; break;
					case 'password' : text = PASS_INVALID; break;
				}
			}
		}

		if (text!=CORRECT){
			HideSubmitButton(field, text);
		} else {

			ShowSubmitButton(field);
		}

		document.getElementById(field).setAttribute("style", "background-color:"+colour);
	}

	function emailListener(){
		var field = "email";
		//alert( document.getElementById("email").value );
		var value = document.getElementById("email").value;

		var colour = WHITE;
		var text=EMPTY;

		if (value.length==0){
			colour = WHITE;
			text = EMPTY;
		}
		else{
			if (validator.isEmail(value)){
				colour=GREEN;
				text = CORRECT;
			}
			else{
				colour=RED;
				text = EMAIL_INVALID;
			}
		}

		if (text!=CORRECT){
			HideSubmitButton(field, text);
		} else {

			ShowSubmitButton(field);
		}

		document.getElementById("email").setAttribute("style", "background-color:"+colour);
		//document.getElementById("emailValidator").innerHTML=text;//("value", 1);
	}

	function PassListener(){
		var field = "password";
		var value = document.getElementById(field).value;

		var colour = WHITE;
		var text=EMPTY;

		if (value.length==0){
			colour = WHITE;
			text = EMPTY;
		}
		else{
			if (value.length<MIN_PASS_LENGTH || value.length>MAX_PASS_LENGTH) { 
				colour = RED; text = PASS_LENGTH;
			} else{
				var obj = checkPassword(value);
				colour = obj.colour;
				text = obj.text;
			}
		}
		
		if (text!=CORRECT){
			HideSubmitButton(field, text);
		} else {
			ShowSubmitButton(field);
		}
		document.getElementById(field).setAttribute("style", "background-color:"+colour);
		document.getElementById(field + "Validator").innerHTML=text;
	}

	function checkPassword(value){
		/*if (validator.isAlphanumeric(value)){
			return {
				colour:GREEN,
				text : CORRECT
			}
		}
		else{
			return {
				colour:RED,
				text : PASS_INVALID
			}
		}*/

		return (validator.isAlphanumeric(value) && value.length >= MIN_PASS_LENGTH && value.length <= MAX_PASS_LENGTH);
	}

	function drawTypeButton(){
		$('#invalid').hide();
		$('#typeData').hide();
		$('#validOK').hide();
	}

	function drawValidButton(){
		$('#invalid').hide();
		$('#typeData').hide();
		$('#validOK').show();
	}

	function drawDangerButton(text){
		if (text) $('#invalid').html(text);

		$('#invalid').show();
		$('#typeData').hide();
		$('#validOK').hide();
	}

	//document.getElementById(submitButton).setAttribute("disabled", "disabled");
	function HideSubmitButton(fieldName, text){
		validityData[fieldName+""]=FAIL;
		//document.getElementById(submitButton).setAttribute("style", "visibility:hidden");
		
		document.getElementById(submitButton).setAttribute("disabled", "disabled");
		
		if (text!=EMPTY) return drawDangerButton(text);
		drawTypeButton();
	}


	function ValidData(){
		return validityData.email == OK && validityData.password == OK;// &&  validityData.login == OK;
	}

	function ShowSubmitButton(fieldName){
		validityData[fieldName]=OK;
		if (ValidData()){
			//document.getElementById(submitButton).setAttribute("style", "visibility:visible");
			document.getElementById(submitButton).removeAttribute("disabled");
			drawValidButton();
			return;
		}
		drawTypeButton();
	}

	function emailListener1(){
		return valid_field("email", validator.isEmail);
	}

	function passwordIsValid(password){
		var a = checkPassword(password);
		console.log('checkPassword', password, a);
		return a;
	}

	function passListener1(){
		return valid_field("password", passwordIsValid);
	}


	function submitForm(event){
		event.preventDefault();
		console.log(asd);
	}

	/*document.getElementById("email").addEventListener("input", emailListener);
	document.getElementById("email").addEventListener("onchange", emailListener);

	document.getElementById("password").addEventListener("input", PassListener);
	document.getElementById("password").addEventListener("onchange", PassListener);*/
	document.getElementById("email").addEventListener("input", emailListener1);
	document.getElementById("email").addEventListener("onchange", emailListener1);

	document.getElementById("password").addEventListener("input", passListener1);
	document.getElementById("password").addEventListener("onchange", passListener1);

	/*document.getElementById("loginValidator").setAttribute("style", "color:"+RED);
	document.getElementById("emailValidator").setAttribute("style", "color:"+RED);
	document.getElementById("passwordValidator").setAttribute("style", "color:"+RED);*/

	//document.getElementById(submitButton).addEventListener("submit", submitForm);