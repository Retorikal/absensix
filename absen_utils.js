/* Feedback function
 * Params: msg: message
 * Retval: none
 */
function report(msg) {
	document.title = "ab¢six: " + msg
}

/* Function to acquire today's <td> cell on the calendar.
 * Params: none
 * Retval: <td> cell
 */
function getTodayNode() {
	var calendar = document.getElementsByTagName("table")[0];
	var currentDate = calendar.getElementsByClassName("bg-info"); // Di web SiX warna tanggal hari ini beda

	return currentDate[0];
}

/* Function to parse time in string format to Date object
 * Params: time string with : as separator. Ex: '13:51'
 * Retval: converted time in Date object
 */
function parseTime(str) {
	let time = new Date();
	let [hours, minutes] = str.split(':');

	time.setHours(hours);
	time.setMinutes(minutes);
	time.setSeconds('00');

	return time;
}

/* Function to acquire current active course.
 * Params: <td> element containing today's courses
 * Retval: active course <a> element
 */
function getActiveCourse(todayCourses) {
	// Get current time
	// currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });
	currentTime = new Date()

	let courses = todayCourses.getElementsByClassName('linkpertemuan');
	for (let i = 0; i < courses.length; i++) {
		// Get course start and end time
		courseDuration = courses[i].innerText.split(' ')[0];
		courseStart = parseTime(courseDuration.split('-')[0]);
		courseEnd = parseTime(courseDuration.split('-')[1]);

		// Raw course string with format: [<code> <name>]
		raw = courses[i].getAttribute('data-kuliah').split(limit=1);
		courseCode = raw[0];
		courseName = raw[1];

		// Return course if current time exist in the course time range
		if (currentTime > courseStart && currentTime < courseEnd) {
			return courses[i];
		}
	}

	// If no active course found, raise an error
	throw 'No active course found';
}

/* Function to do HTML GET request.
 * Params:
 * 		url: target url
 * 		callback: function with 1 string input, will receive the acquired HTML string
 * Retval: none (Prepare a callback function to handle acquired values)
 */
function getHTMLtxt(url, callback) {
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			callback("<div>" + this.responseText + "</div>");
		}
	};

	//xhttp.open("GET", "/app/mahasiswa:13318056+2020-1/kelas/pertemuan/mhs/460679/93642", true);
	xhttp.open("GET", url, true);
	xhttp.send();
}

/* Function to initiate attend attempt.
 * Params:
 *		a_node: attendance link <a> node DOM object
 * Retval: none
 * TODO:
 * 		Call getHTMLtxt(url, callback) for every set interval
 */
function markPresent(a_node) {
	var url = a_node.getAttribute("data-url").split('?')[0] // ditch all GET params bcs gaperlu
	var success = null;
	/* Error codes
	* -1 	= Others
	* 0 	= Success
	* 1 	= Attendance not yet open
	* 2 	= Already attended
	*/

	var callback = function (txt) {
		var todayDOM = $.parseHTML(txt)[0]; // Ini fungsi jquery. Iya syntaxnya pake "$" gitu :/ SiX uda paketan sama jquery jadi sans
		var submit_form = todayDOM.getElementsByTagName("form")[0];

		if (submit_form == undefined) { // Tombolnya gaada, absensi belum dibuka
			success = 1;
			report("Attendance not open");
		} else {
			action_string = submit_form.textContent.trim()

			if (action_string == "Tandai Hadir") { // Bisa menandai hadir. Langsung gow
				let in_tok = submit_form.getElementById("form__token");
				let submit_xhttp = new XMLHttpRequest();
				let submit_params = ""

				submit_params += "form[hadir]=&";
				submit_params += "form[returnTo]=" + url + "&";
				submit_params += "form[_token]=" + url + in_tok.getAttribute("value");

				submit_xhttp.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 302) {
						if (this.responseText.search("Tandai Tidak Hadir") != -1) {
							success = 0;
							report("Success");
						}
					}
				};

				submit_xhttp.open('POST', url, true);
				submit_xhttp.send(submit_params);
			} else { // Tulisanya "Tandai Tidak Hadir"; berati sudah diabsen
				success = 2;
				report("Already attended");
			}
		}
	};

	getHTMLtxt(url, callback);
}