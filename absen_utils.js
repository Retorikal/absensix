/* Feedback function
 * Params: msg: message
 * Retval: none
 */
function report(msg) {
	$.notify("ab¢6: " + msg)
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

/* Function to acquire today's courses.
 * Params: none
 * Retval: Array containing list of (startTime, endTime, link string, courseCode, courseName)
 */
function getTodayCourses(debug = false) {
	let calendar = document.getElementsByTagName("table")[0];
	let todayCourseTD = calendar.getElementsByClassName("bg-info")[0];
	let coursesList = [];

	if (debug) // Won't get anything on weekends. Use debug = true to get whatever <td> there is.
		todayCourseTD = calendar.getElementsByTagName("td")[0];

	if (todayCourseTD == undefined) {
		throw "No active date on calendar."
	}

	let courses = todayCourseTD.getElementsByClassName('linkpertemuan');
	for (let i = 0; i < courses.length; i++) {
		course = []

		// Get course start and end time
		let courseDuration = courses[i].innerText.split(' ')[0];
		let courseStart = parseTime(courseDuration.split('-')[0]);
		let courseEnd = parseTime(courseDuration.split('-')[1]);

		// Course URL
		let courseUrl = courses[i].getAttribute("data-url").split('?')[0] // ditch all GET params bcs gaperlu

		// Raw course string with format: [<code> <name>]
		let raw = courses[i].getAttribute('data-kuliah').match(/^(\S+)\s(.*)/).slice(1) // Some regex magic. Don't ask. It works.
		let courseCode = raw[0];
		let courseName = raw[1];

		// course.push(courseDuration);
		course.push(courseStart);
		course.push(courseEnd);
		course.push(courseUrl);
		course.push(courseCode);
		course.push(courseName);

		coursesList.push(course)
	}

	// If no active course found, raise an error
	if (coursesList == []) {
		throw 'No course found';
	}

	return coursesList;
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
 *		course: array containing (startTime, endTime, link string, courseCode, courseName)
 * Retval: none
 * TODO:
 * 		Call getHTMLtxt(url, callback) for every set interval
 */
function markPresent(course) {
	var success = null;
	var url = course[2];
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

// Calculate time until classes, return value in miliseconds
function untilEvent(course) {
	var clock = new Date();
	var untilHor = course[0].getHours() - clock.getHours();
	var untilMin = course[0].getMinutes() - clock.getMinutes();
	return ((untilHor * 60) + untilMin) * 60 * 1000;
}

// ========== SETUP ==========
report("Auto-attendance has been loaded.");

try {
	courses = getTodayCourses();
	timeUntilEvent = [];
	courses.forEach(course => { timeUntilEvent.push(untilEvent(course)); })
}
catch {
	report("There is no active date today.");
}

// ========== MAIN ==========
for (let i = 0; i < timeUntilEvent.length; i++) {
	if (timeUntilEvent[i] > 0) {
		setTimeout(markPresent(courses[i]), timeUntilEvent[i])
		// if markPresent success code returns 1 = Attendance not yet open
		// setTimeout(markPresent(courses[i]), 2_min_delay)
		// success code not yet returned, need revision
	}
	// update the delay to next Event
	courses.forEach(course => { timeUntilEvent.push(untilEvent(course)); })
}
