exports.now = function () {
    return new Date().getTime();
};

exports.beginningOfToday = function () {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

exports.isToday = function (t) {
    var d = new Date(t);
    var today = new Date();

    return d.getYear() === today.getYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
};

exports.timeFormat = function (t) {
    if (!t) {
        return "";
    }

    var d = new Date(t);
    var timeString =  d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " "
        + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    return timeString;
};

exports.timeTwoFormat = function (t) {
	if (!t) {
		return "";
	}

	var d = new Date(t);
	var timeString =  d.getFullYear() + "-" + formatTime(d.getMonth()+1) + "-" + formatTime(d.getDate()) + " "
		+ formatTime(d.getHours()) + ":" + formatTime(d.getMinutes()) + ":" + formatTime(d.getSeconds());

	return timeString;
};

var formatTime = function(day){
	return day < 10 ? ("0" + day) : day.toString();
};

exports.dateFormat = function (t) {
    if (!t) {
        return "";
    }

    var d = new Date(t);
    var timeString =  d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();

    return timeString;
};

exports.dayInterval = function (t) {
    var d = new Date(t);
    var today = new Date();
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return Math.floor((today.getTime() - d.getTime()) / 86400000);
};
