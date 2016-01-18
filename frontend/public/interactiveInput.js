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
		document.getElementById("emailValidator").innerHTML=text;//("value", 1);
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

	function LoginListener(){
		var field = "login";
		var value = document.getElementById("login").value;

		var colour = WHITE;
		var text=EMPTY;

		if (value.length==0){
			colour = WHITE;
			text = EMPTY;
		}
		else{
			if (validator.isAlphanumeric(value)){
				colour=GREEN;
				text = CORRECT;
			}
			else{
				colour=RED;
				text = LOGIN_INVALID;
			}
		}
		if (text!=CORRECT){
			HideSubmitButton(field, text);
		} else {
			ShowSubmitButton(field);
		}

		drawLoginValidity()
		document.getElementById("login").setAttribute("style", "background-color:"+colour);

		document.getElementById("loginValidator").innerHTML=text;
	}


	function checkPassword(value){
		if (validator.isAlphanumeric(value)){
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
		}
	}

	function drawTypeButton(){
		$('#invalid').hide();
		$('#typeData').show();
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
		return validityData.email == OK;// &&validityData.password == OK &&  validityData.login == OK;
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


	function submitForm(event){
		event.preventDefault();
		console.log(asd);
	}

	document.getElementById("email").addEventListener("input", emailListener);
	document.getElementById("email").addEventListener("onchange", emailListener);

	/*document.getElementById("login").addEventListener("input", LoginListener);
	document.getElementById("login").addEventListener("onchange", LoginListener);

	document.getElementById("password").addEventListener("input", PassListener);
	document.getElementById("password").addEventListener("onchange", PassListener);

	document.getElementById("login").setAttribute("placeholder","MorganFreeman223");
	document.getElementById("password").setAttribute("placeholder","********");*/
	document.getElementById("email").setAttribute("placeholder","chikenFreeze@gmail.com");

	/*document.getElementById("loginValidator").setAttribute("style", "color:"+RED);
	document.getElementById("emailValidator").setAttribute("style", "color:"+RED);
	document.getElementById("passwordValidator").setAttribute("style", "color:"+RED);*/

	//document.getElementById(submitButton).addEventListener("submit", submitForm);