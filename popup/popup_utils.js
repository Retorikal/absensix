document.getElementById("updateButton").addEventListener("click", updateConfig);
function updateConfig() {
    var configVal = [1, 5, 5]; // default config
    configVal[0] = document.getElementById("start_offset").value;
    configVal[1] = document.getElementById("end_offset").value;
    configVal[2] = document.getElementById("repeat_delay").value;
    //Sending message to content
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, configVal);
    });
}