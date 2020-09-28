console.log("logging in");

window.onload = function () {
	chrome.storage.local.get({"autorelog": false}, function(vals){
		if(vals.autorelog){
			login();
		}
	});
}

function login(){
	document.forms[0].getComponentByTag("button").requestSubmit();
}