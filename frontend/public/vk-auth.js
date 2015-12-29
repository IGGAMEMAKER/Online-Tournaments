//if (location.href())
if (document.location.hostname == "localhost") {
	VK.init({	apiId: 5205914 });
} else {
	VK.init({	apiId: 5205759 });
}
	//alert("Local server!");
//alert(document.location.hostname);


function authInfo(response) {
	if (response.session) {
		console.log('user : ', response.session)
		//alert('user: '+response.session.mid);
		VK.Api.call('users.get', {user_ids: response.session.mid}, function(r) { 
		  if(r.response) { 
		    alert('Привет, ' + r.response[0].first_name + '  ' + r.response[0].last_name); 
		  } 
		});
	} else {
		alert('not auth');
	}
}

//VK.Auth.getLoginStatus(authInfo);

//VK.Auth.login(authInfo);
//VK.UI.button('login_button');


/*
<script type="text/javascript" src="//vk.com/js/api/openapi.js?121"></script>


</script>
*/