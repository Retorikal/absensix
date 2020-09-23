document.onload = function(){
	console.log("Loaded");
	document.getElementById('button').addEventListener('click', helo);
}

function helo(){
    console.log("helo");
}