			function authInfo(response) {    
				if(response.status=='connected') {	// если пользователь залогинен в ВК     
					if(typeof(response.session.user) == 'undefined') { // этого поля нет 
						//тогда, когда пользователь был залогинен ранее
						VK.Api.call('users.get', { uid: response.session.mid }, function(r) { 
							$('#VKInfo').html(r.response[0].first_name+' '+r.response[0].last_name); 
							$('#VKInfo').append('user_id: '+response.session.mid); });
					}else {
						// если авторизация прошла только что (от VK.Auth.login(authInfo);), то имя и фамилия уже будут в ответе   
						$('#VKInfo').html(response.session.user.first_name+' '+response.session.user.last_name);
						$('#VKInfo').append('user_id: '+response.session.mid);}
				}else {
					VK.Auth.login(authInfo); // опционально можем спалиться и вызвать всплывающее окно авторизации
				}
			}

			//$(function() { VK.Auth.getLoginStatus(authInfo); }); // проверяем наличие входа в ВК, ответ отправляем в функцию обработчик