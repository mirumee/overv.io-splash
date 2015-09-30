(function() {
    var ua = detect.parse(navigator.userAgent);
    var html = document.getElementsByTagName("html")[0];

    if (
        ua.browser.family == "IE" ||
        ua.device.manufacturer == "Nokia" ||
        ua.browser.family == "Safari" && ua.browser.version < 8 ||
        ua.browser.family == "Mobile Safari" && ua.browser.version < 8
    ) {
        html.className += " no-transform3D";
    }

    if (
        ua.os.family == "Android"
    ) {
        html.className += " android";
    }
})();
