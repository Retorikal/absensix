var configVal = [1, 5, 5]; // default config

window.onload = function () {
	console.log("Updating");
	document.getElementById("updateButton").addEventListener("click", updateConfig);
	populateFields();
}

function populateFields (){
	document.getElementById("start_offset").value = configVal[0];
	document.getElementById("end_offset").value = configVal[1];
	document.getElementById("repeat_delay").value = configVal[2]; 
}

function updateConfig() {
    configVal[0] = document.getElementById("start_offset").value;
    configVal[1] = document.getElementById("end_offset").value;
    configVal[2] = Math.abs(document.getElementById("repeat_delay").value);

	populateFields();

    //Sending message to content
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, configVal);
        console.log(configVal);
    });
}