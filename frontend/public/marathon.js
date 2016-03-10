

function draw_current_accelerators(msg){
	// Marathon page
	var marathon = msg.result;
	// saveInStorage('marathon', marathon);
	console.log('draw_current_accelerators', marathon);

	if (exists('accelerator0') && marathon && marathon.accelerator){
		var accelerator = marathon.accelerator;

		console.log('it means, that i am on marathon page');
		var acceleratorIndex = parseInt(accelerator.index);
		console.log('acceleratorIndex', acceleratorIndex)
		// var acceleratorIndex = 0
		for (var i = acceleratorIndex; i >= 0; i--) {
			$("#accelerator"+i).hide();
		};

		$("#todayConditions").html("Вы обладаете ускорителем " + accelerator.value);
		// alert('exists');
	}
}

function get_marathon_user() {
	setAsync('marathon_user', {}, draw_current_accelerators);
}

get_marathon_user();

// function setAsync(url, data, success, method){
//   $.ajax({
//     url: url,
//     method: method || 'POST',
//     data:data,
//     success: success|| printer
//   });
// }