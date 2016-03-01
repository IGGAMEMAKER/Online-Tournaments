function setInviter(inviter, inviter_type){
	setCookie('inviter', inviter);
	setCookie('inviter_type', inviter_type||0);
	alert(inviter, inviter_type);
}

var inviter = {
	group: function(groupName){
		setInviter(groupName, 1);
	}
	, human: function (username){
		setInviter(username, 0);
	}
}