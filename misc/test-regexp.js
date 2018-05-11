// -*- mode: js -*-

// this pattern matches the following cases
// 1. just "next" or "next page";
//    or those wrapped between HTML tag delimiters (e.g. >next<).
// 2. <space>"next"<space> or those wrapped between HTML tag delimiters;
//    <space>"next" <single space> right arrow symbol;
//    <space>"next" + image suffix (.gif/png etc).
// 3. just a single right arrow, in unicode or HTML entity.
// 4. "下一页" "下页" etc
// 5. "Next Chapter" "Thread Next" etc
// 6. endswith "&nbsp;»"
var nextPattern = /(?:(^|>)(next[ _]page|Nächste Seite|la page suivante|следующей страницы)(<|$)|(^|>\s*)(next|nächste|Suivant|Следующая)(\s*<|$|( |&nbsp;)?(?:→|›|▸|»|›|&(gt|#62|#x3e);)|1?\.(?:gif|jpg|png|webp))|^(→|›|▸|»|››| ?(&(gt|#62|#x3e);)+ ?)$|(下|后)一?(?:页|糗事|章|回|頁|张)|^(Next Chapter|Thread Next|Go to next page)|&nbsp;»[ \t\n]*$)/i;

var goodMatch = [
    "next", "Next", "next page", "next_page",
    "<span class=\"foo\">next</span>", "<span class=\"foo\">next page</span>",
    "next<img src=\"abc.png\" />", "<img src=\"abc.png\" />next",

    "next →", "next ›", "next »", "next &gt;", "Next &gt;&gt;&gt;",
    "Next &gt;", "Next &#62;", "Next&nbsp;&#62;", "Next&nbsp;&gt;",
    "next.gif", "next1.png", "next.webp",

    "››", "&gt;", " &gt;&gt; ", "»", "›", "→", "&#62;", "&#x3e;",
    "&nbsp;»", "URL-based access control\n              &nbsp;»",
    "URL-based access control\n              &nbsp;»\n            ",

    "下一页", "下页", "下一章",
    "Thread Next",
    "Next Chapter",
    "Next Chapter &gt;",
    "Go to next page",

    "...<span style=\"display: block; margin-left: 53px; text-decoration: underline;\">  Next  </span>", // google search
    "Next Page<img src=\"/images/arrows/arrows-66.gif\" alt=\"arrow\" border=\"0\" height=\"13\" hspace=\"2\" vspace=\"0\" width=\"12\" align=\"baseline\">",
    "下一页&nbsp;»",  //verycd
    "下一页&nbsp;&raquo;"
];

var badMatch = [
    "on next chapter we will",
    "nextit",
    "nextpage",
    "next time you",
    "who is next",
    "who cares who is next anyway"
];

var msgs = [];

var log = function (msg) {
    msgs.push(msg);
    if (typeof console !== 'undefined') {
        console.log(msg);
    } else if (typeof print !== 'undefined') {
        print(msg);
    }
};

goodMatch.forEach(function (v) {
    if (! nextPattern.test(v)) {
	log("should catch: " + v);
    }
});

badMatch.forEach(function (v) {
    if (nextPattern.test(v)) {
	log("should not catch: " + v);
    }
});

(function () {
    /**
     * return True if href is link to top level index page or same level index
     * page.
     */
    let hrefIsLinkToIndexPage = function (href) {
        return (href.match(/^(\/?|\.\/)index\....l?$/i) || href.match(/^\/$/i));
    };

    const goodMatch = ["/",
                       "/index.html", "/index.htm", "/index.php",
                       "index.html", "index.htm", "index.php",
                       "./index.html", "./index.htm", "./index.php"];
    const badMatch = ["/tutorial/index.html"];
    goodMatch.forEach(function (v) {
        if (! hrefIsLinkToIndexPage(v)) {
	    log("should catch: " + v);
        }
    });

    badMatch.forEach(function (v) {
        if (hrefIsLinkToIndexPage(v)) {
	    log("should not catch: " + v);
        }
    });
})();

if (msgs.length === 0) {
    log("all pass.");
} else {
    if (typeof exit !== 'undefined') {
        exit(1);
    } else if (typeof process !== 'undefined') {
        process.exit(1);
    }
}
