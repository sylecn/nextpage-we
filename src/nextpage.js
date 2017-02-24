document.addEventListener("keypress", function (e) {
    console.log("keypress: " + e.charCode + ", " + e.keyCode);
    if (e.charCode === 110) {
	document.location.href = "https://www.emacsos.com/baidu.html"
    }
});
