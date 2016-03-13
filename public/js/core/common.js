var serverConfig = {
    maxServerId: 2,
    appIds: ["10001", "10002"],
    operators: ["diandian", "qq"]
};

function createOperatorOptions() {
    return new Ext.data.SimpleStore({
        fields: ['id', 'operatorOptions'],
        data: [[1, "所有"]]
    });
}

function getServerOperator(option) {
    if (option === "所有") {
        //return "all";
        return "xiaomi";
    } else if (option === "小米") {
        return "xiaomi";
    }
}

function isToday(t) {
    var s = t.split(" ");
    var s1 = s[0].split("-");
    var s2 = s[1].split(":");
    var d = new Date(s1[0], s1[1] - 1, s1[2], s2[0], s2[1], s2[2]);
    var today = new Date();

    return d.getYear() === today.getYear() ||
        d.getMonth() >= today.getMonth() ||
        d.getDate() >= today.getDate();
}

function dateFormat(date) {
    if (!date) {
        return "";
    }

    var myDate = new Date(date);
    var timeString = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate() + " "
        + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
    return timeString;
};

function timeFormat(date) {
    if (!date) {
        return "";
    }

    var myDate = new Date(date);
    var timeString = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
    return timeString;
};

