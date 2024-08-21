(function () {
  let msgs = [];

  let log = function (msg) {
    msgs.push(msg);
    if (typeof console !== 'undefined') {
      console.log(msg);
    } else if (typeof print !== 'undefined') {
      print(msg);
    }
  };

  /**
   * join potential relative URL to absolute URL, using given baseURL.
   */
  let joinURL = function (baseURL, hrefValue) {
    const url = new URL(hrefValue, baseURL);
    return url.toString();
  };

  let testJoinURL = function () {
    if (! joinURL("https://example.com/abc.html", "/def.html") === "https://example.com/def.html") {
      log("joinURL abs path fail");
    }
    if (! joinURL("https://example.com/p1/abc.html", "/def.html") === "https://example.com/def.html") {
      log("joinURL abs path fail");
    }
    if (! joinURL("https://example.com/p1/abc.html", "def.html") === "https://example.com/p1/def.html") {
      log("joinURL rel path fail");
    }
    if (! joinURL("https://example.com/p1/abc.html", "p2/def.html") === "https://example.com/p1/p2/def.html") {
      log("joinURL rel path fail");
    }
    if (! joinURL("https://example.com/p1/abc.html", "https://example.com/p2/def.html") === "https://example.com/p2/def.html") {
      log("joinURL full url fail");
    }
    if (! joinURL("https://example.com/p1/abc.html", "https://example.com/def.html") === "https://example.com/def.html") {
      log("joinURL full url fail");
    }
  };

  testJoinURL();

  if (msgs.length === 0) {
    log("all pass.");
  } else {
    if (typeof exit !== 'undefined') {
      exit(1);
    } else if (typeof process !== 'undefined') {
      process.exit(1);
    }
  }
}());
