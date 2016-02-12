if (document.location.hostname == "localhost") {
	console.log("is localhost")
	VK.init({	apiId: 5205914 });
} else {
	console.log("is not localhost")
	VK.init({	apiId: 5205759 });
}