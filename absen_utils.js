/* Feedback function
 * Params: msg: message
 * Retval: none
 */
function report(msg, silent = false) {
	console.log("ab¢6: " + msg);
	if(!silent){
		$.notify("ab¢6: " + msg);
	}
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
		course.push(null); // Success status for attend attempt

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
 *		course: array containing (startTime, endTime, link string, courseCode, courseName, status)
 * Retval: none
 * TODO:
 * 		Call getHTMLtxt(url, callback) for every set interval
 */
function markPresent(course) {
	var url = course[2];
	/* Error codes
	* -1 	= Others
	* 0 	= Success
	* 1 	= Attendance not yet open
	* 2 	= Already attended
	* 3		= Already past course end time
	*/

	var callback = function (txt) {
		var todayDOM = $.parseHTML(txt)[0]; // Ini fungsi jquery. Iya syntaxnya pake "$" gitu :/ SiX uda paketan sama jquery jadi sans
		var submit_form = todayDOM.getElementsByTagName("form")[0];

		var now = (new Date()).getTime();
		var end = course[1].getTime();

		if (submit_form == undefined) { // Tombolnya gaada
			if (now > end){ // Udah lewat. Error code buat nyerah
				course[5] = 3;
				report(course[3] + ": Attendance probably already ended. Sorry.");
			} else { // Belum dibuka
				course[5] = 1;
				report(course[3] + ": Attendance not open");
			}
		} else {
			action_string = submit_form.textContent.trim()

			if (action_string == "Tandai Hadir") { // Bisa menandai hadir. Langsung gow
				let in_tok = submit_form.getElementsByTagName("input")[1]
				let submit_xhttp = new XMLHttpRequest();
				let submit_params = ""

				submit_xhttp.open('POST', url, true);
				submit_xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				submit_params += encodeURI("form[hadir]") + "=&";
				submit_params += encodeURI("form[returnTo]") + "=" + encodeURIComponent(url) + "&";
				submit_params += encodeURI("form[_token]") + "=" + encodeURIComponent(in_tok.getAttribute("value"));

				submit_xhttp.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						if (this.responseText.search("Tandai Tidak Hadir") != -1) {
							course[5] = 0;
							report(course[3] + ": Success");
						}
					} else if (this.status == 200){
					} else if (this.status == 404){
						course[5] = -1;
						report(course[3] + ": A not found error has occured");
					} else {
						course[5] = -1;
						report(course[3] + ": An unknown error has occured");
					}
				};

				submit_xhttp.send(submit_params);
			} else { // Tulisanya "Tandai Tidak Hadir"; berati sudah diabsen
				course[5] = 2;
				report(course[3] + ": Already attended");
			}
		}
	};

	var primeRetry = function(course){
		setTimeout(() => {
			if(course[5] != 0 || course[5] != 2 || course[5] != 3){ // if not yet succeded, known already attended, or already passed, schedule a retry..
				getHTMLtxt(url, callback);
				primeRetry(course);
			}
		}, 8 * 60 * 1000); // .. in 8 minutes. TODO: make retry delay global var
	}

	// There will be 1 extra retry after success by default. If nothing else can be done, the retry will be silent.
	getHTMLtxt(url, callback);
	primeRetry(course);
}

/* Function to get time difference between now and course start
 * Params:
 *		course: array containing (startTime, endTime, link string, courseCode, courseName, status)
 * Retval: array containing time difference in ms: (to course start (+ 2 minute offset)), and (to course finish).
 * TODO: when exposing configuration, time offset needs to be set
 */
function untilEvent(course) {
	var now = new Date().getTime();
	var targetStart = course[0].getTime();
	var targetEnd = course[1].getTime();
	return [(targetStart - now) + (1000 * 60 * 2), (targetEnd - now)];
}

/* Main routine
 * Params: none
 * Retval: none
 */
function main(courses){
	for (let i = courses.length - 1; i >= 0; i--) { // Reverse iteration to prevent index shift while performing element removal 
		t_diff = untilEvent(courses[i]);

		if (t_diff[0] > 0) { // Course still coming later
			report(courses[i][3] + ": Scheduled attendance", silent = true);
			setTimeout(() => {markPresent(courses[i])}, t_diff[0]);
		} else if (t_diff[0] <= 0 && t_diff[1] >= 0) { // Course currently active, immediately initiate attempt
			report("Attending " + courses[i][3]);
			markPresent(courses[i]);
		} else { // Course has passed, remove element
			report("Skipping " + courses[i][3]);
			courses.splice(i, 1);
		}
	}
}

// ========== EXEC ==========
report("Auto-attendance has been loaded.");

try {
	courses = getTodayCourses();
	main(courses);
}
catch {
	report("There is no active date today.");
}

