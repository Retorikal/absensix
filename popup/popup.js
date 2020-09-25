configVal = [1, 5, 5]; // default config

window.onload = function () {
	document.getElementById("updateButton").addEventListener("click", updateConfig);
	
	chrome.storage.local.get({"log_str": "", "start_offset" : 1, "end_offset" : 5, "repeat_delay" : 5}, function(vals){
    	configVal[0] = vals.start_offset;
    	configVal[1] = vals.end_offset;
		configVal[2] = vals.repeat_delay;

		populateFields();
		
		download("absensix_log.txt", vals.log_str);
	});
	
}

function populateFields (){
	document.getElementById("start_offset").value = configVal[0];
	document.getElementById("end_offset").value = configVal[1];
	document.getElementById("repeat_delay").value = configVal[2]; 
}

function updateConfig() {
    configVal[0] = parseInt(document.getElementById("start_offset").value);
    configVal[1] = parseInt(document.getElementById("end_offset").value);
    configVal[2] = Math.abs(document.getElementById("repeat_delay").value);

    chrome.storage.local.set({ 
    	"start_offset": configVal[0],
    	"end_offset": configVal[1],
    	"repeat_delay": configVal[2] }, 
    	function(){}
	);

	populateFields();

    //Sending message to content
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, configVal);
        console.log(configVal);
    });
}

function download(filename, text) {
	var element = document.querySelector("a.link");
	element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
	element.setAttribute("download", filename);
}