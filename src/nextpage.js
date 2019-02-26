// Copyright (C) 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019
// Yuanle Song <sylecn@gmail.com>
//
// The JavaScript code in this page is free software: you can
// redistribute it and/or modify it under the terms of the GNU
// General Public License (GNU GPL) as published by the Free Software
// Foundation, either version 3 of the License, or (at your option)
// any later version.  The code is distributed WITHOUT ANY WARRANTY;
// without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// As additional permission under GNU GPL version 3 section 7, you
// may distribute non-source (e.g., minimized or compacted) forms of
// that code without the copy of the GNU GPL normally required by
// section 4, provided you include this license notice and a URL
// through which recipients can access the Corresponding Source.

/* global KeyEvent, store */
(function () {
    'use strict';
    let i;
    let variables = {};

    let debugging = function () {return variables.debugging;};
    let debugKeyEvents = function () {return variables.debugKeyEvents;};
    let debugGotoNextPage = function () {return variables.debugGotoNextPage;};
    let debugSpecialCase = function () {return variables.debugSpecialCase;};
    let debugATag = function () {return variables.debugATag;};
    let debugDomainCheck = function () {return variables.debugDomainCheck;};
    let debugContentEditable = function () {
        return variables.debugContentEditable;
    };
    let debugIFrame = function () {return variables.debugIFrame;};
    // eslint-disable-next-line no-console
    let log = console.log;

    /**
     * return true if user is typing, e.g. when active element is input/ta
     * etc.
     */
    let userIsTyping = function () {
        var focusElement = document.activeElement;
        // walk down the frames to get the bottom level activeElement
        while (focusElement.tagName.match(/^FRAME$/i)) {
            focusElement = focusElement.contentDocument.activeElement;
        }
        if (focusElement.tagName.match(/^(INPUT|TEXTAREA|SELECT)$/i)) {
            return true;
        }
        if (debugContentEditable()) {
            log(focusElement.tagName +
                "\nfocusElement.contentEditable=" +
                focusElement.contentEditable);
        }
        // when contentEditable is set to true, a BODY tag or DIV tag will
        // become editable, so treat them just like other input controls.
        if (focusElement.contentEditable === "true") {
            return true;
        }
        // IFRAME is a also an input control when inner document.designMode is
        // set to "on". Some blog/webmail rich editor use IFRAME instead of
        // TEXTAREA.
        if (debugIFrame()) {
            if (focusElement.tagName === "IFRAME") {
                log(focusElement.tagName +
                    "\nfocusElement.contentEditable=" +
                    focusElement.contentEditable +
                    "\ndocument.designMode=" +
                    focusElement.contentDocument.designMode +
                    "\nbody.contentEditable=" +
                    focusElement.contentDocument.body.contentEditable);
            }
        }
        // Note: some website is using IFRAME for textarea, but designMode is
        // not set to "on", including: gmail, qq mail. I don't know how they
        // make that work.
        if (focusElement.tagName === "IFRAME" &&
            (focusElement.contentDocument.designMode.toLowerCase() === "on" ||
             focusElement.contentDocument.body.contentEditable)) {
            return true;
        }

        return false;
    };

    /**
     * Some websites use the same hotkeys as nextpage. To prevent nextpage
     * from capturing the hotkeys, add the website and key binding they
     * use in this alist.
     *
     * the key of the alist is a regexp that matches to document URL.
     * the value of the alist is a list of keys to ignore.
     *
     * the key of the alist can be a literal string as well, which will be
     * converted to regexp by calling new RegExp(str).
     *
     * nextpage will stop when it finds the first match, so you should put
     * more specific regexp earlier in the list.
     */
    // TODO make this list configurable.
    let ignoreBindingAList = [
        [/https?:\/\/www\.google\.com\/reader\/view/i, ['SPC', '1', '2']],
        [/https?:\/\/www\.google\.com\/transliterate/i, "*"],
        [/http:\/\/typing.sjz.io\//i, "*"],
        // exception rule, pipermail mailing list is not webmail.
        [/mail\..*\/pipermail/i, ""],
        // ignore common webmail hosts, nextpage bindings can do little on
        // these domains.
        [/\W(web)?mail\.[^.]+\.(com|org|net|edu)/i, "*"]
    ];

    /**
     * return true if this key should be ignored on current website.
     * return false otherwise.
     */
    let shouldIgnoreKey = function (key) {
        const url = utils.getURL();
        for (let v of ignoreBindingAList) {
            if (url.match(v[0])) {
                if (v[1] === "") {
                    // user explicitly says do not ingore any key
                    return false;
                }
                if (v[1] === "*" || utils.inArray(key, v[1])) {
                    if (debugging()) {
                        log("ignore " + key + " for " + v[0]);
                    }
                    return true;
                }
                return false;
            }
        }
        return false;
    };

    /**
     * return true if nextpage should ignore keypress events for this website.
     * some website has special key handing. some websites just don't need
     * nextpage.
     */
    let skipWebsite = function (e) {
        // ignore keyevents in XUL, only catch keyevents in content.
        if (e.target["namespaceURI"] ===
            "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul") {
            return true;
        }
        let ignoreOnWebsites = variables.ignoreOnWebsites;
        if (ignoreOnWebsites) {
            const url = utils.getURL();
            for (let i = 0; i < ignoreOnWebsites.length; ++i) {
                if (url.match(ignoreOnWebsites[i])) {
                    if (debugging()) {
                        log("ignore on " + ignoreOnWebsites[i]);
                    }
                    return true;
                }
            }
        }
        return false;
    };

    let utils = {
        /**
         * copy given text to clipboard. requires firefox 22, chrome 58.
         */
        copyToClipboard: function (text) {
            let copyTextToClipboard = function (e) {
                e.preventDefault();
                e.clipboardData.setData('text/plain', text);
            };
            try {
                document.addEventListener('copy', copyTextToClipboard);
                try {
                    document.execCommand('copy');
                } catch (e) {
                    // eslint-disable-next-line no-console
                    log("copy to clipboard failed: " + e);
                }
            } finally {
                document.removeEventListener('copy', copyTextToClipboard);
            }
        },

        /**
         * test whether an element is in an array
         * @return true if it is.
         * @return false otherwise.
         */
        inArray: function (element, array) {
            var i;
            for (i = 0; i < array.length; i++) {
                if (element === array[i]) {
                    return true;
                }
            }
            return false;
        },

        /**
         * integer to ASCII
         */
        itoa: function (i) {
            return String.fromCharCode(i);
        },

        /**
         * ASCII to integer
         */
        atoi: function (a) {
            return a.charCodeAt();
        },

        /**
         * describe mouse click in emacs notation. return a string.
         * examples: <mouse-1>, <mouse-5>, <C-mouse-1>, <M-mouse2>
         */
        describeMouseEventInEmacsNotation: function (e) {
            var button = "mouse-" + (e.button + 1);
            var ctrl = e.ctrlKey ? "C-": "";
            var meta = (e.altKey || e.metaKey) ? "M-": "";
            var shift = e.shiftKey ? "S-": "";
            var re = '<' + ctrl + meta + shift + button + '>';
            return re;
        },

        /**
         * describe wheel event in emacs notation. return a string.
         * example: <wheel-down>, <C-wheel-down>
         *
         * Since emacs doesn't support wheel events, I made up wheel-up,
         * wheel-down names.
         */
        describeWheelEventInEmacsNotation: function (e) {
            let direction = "";
            if (e.deltaY < 0) {
                direction = "-up";
            } else if (e.deltaY > 0) {
                direction = "-down";
            } else if (e.deltaX < 0) {
                direction = "-left";
            } else if (e.deltaX > 0) {
                direction = "-right";
            }
            const wheel = "wheel" + direction;
            const ctrl = e.ctrlKey ? "C-": "";
            const meta = (e.altKey || e.metaKey) ? "M-": "";
            const shift = e.shiftKey ? "S-": "";
            const re = '<' + ctrl + meta + shift + wheel + '>';
            return re;
        },

        /**
         * describe key pressed in emacs notation. return a string.
         * examples: n, N, C-a, M-n, SPC, DEL, <f2>, <insert>, C-M-n
         * <C-backspace>, <C-S-f7>, C-M-*, M-S-RET, <backspace>, <C-M-S-return>
         * @param e a KeyEvent
         * @return a string that describes which key was pressed.
         */
        describeKeyInEmacsNotation: function (e) {
            // /**/if (debugging()) {
            //     log("keyCode charCode:" + e.keyCode + " " + e.charCode);
            // }
            var getNameForKeyCode = function (keyCode) {
                switch (keyCode) {
                case KeyEvent.DOM_VK_INSERT : return "insert";
                case KeyEvent.DOM_VK_DELETE : return "delete";
                case KeyEvent.DOM_VK_HOME : return "home";
                case KeyEvent.DOM_VK_END : return "end";
                case KeyEvent.DOM_VK_PAGE_UP : return "prior";
                case KeyEvent.DOM_VK_PAGE_DOWN : return "next";

                case KeyEvent.DOM_VK_BACK_SPACE : return "backspace";
                case KeyEvent.DOM_VK_ESCAPE: return "escape";

                case KeyEvent.DOM_VK_F1 : return "f1";
                case KeyEvent.DOM_VK_F2 : return "f2";
                case KeyEvent.DOM_VK_F3 : return "f3";
                case KeyEvent.DOM_VK_F4 : return "f4";
                case KeyEvent.DOM_VK_F5 : return "f5";
                case KeyEvent.DOM_VK_F6 : return "f6";
                case KeyEvent.DOM_VK_F7 : return "f7";
                case KeyEvent.DOM_VK_F8 : return "f8";
                case KeyEvent.DOM_VK_F9 : return "f9";
                case KeyEvent.DOM_VK_F10 : return "f10";
                case KeyEvent.DOM_VK_F11 : return "f11";
                case KeyEvent.DOM_VK_F12 : return "f12";

                case KeyEvent.DOM_VK_LEFT : return "left";
                case KeyEvent.DOM_VK_UP : return "up";
                case KeyEvent.DOM_VK_RIGHT : return "right";
                case KeyEvent.DOM_VK_DOWN : return "down";

                case KeyEvent.DOM_VK_RETURN : return "RET";

                default: return "KEYCODE" + keyCode;
                }
            };
            var keyIsChar = (e.charCode != 0);
            var keyname = keyIsChar ? this.itoa(e.charCode) :
                getNameForKeyCode(e.keyCode);
            if (keyname === " ") keyname = "SPC";  //SPC is emacs syntax and it's
            //more readable.
            // /**/if (debugging()) {
            //     log("keyname:" + keyname);
            // }
            var ctrl = e.ctrlKey ? "C-": "";
            var meta = (e.altKey || e.metaKey) ? "M-": "";
            var shift = e.shiftKey ? "S-": "";
            var re = keyIsChar ? ctrl + meta + keyname :
                '<' + ctrl + meta + shift + keyname + '>';
            return re;
        },

        /**
         * @return current page's URL as a string.
         */
        getURL: function (win) {
            if (! win) {
                win = window;
            }
            return win.location.toString();
        },

        /**
         * @return <meta> tag with given name. in jQuery syntax:
         * $("meta[name=$name]").attr("content")
         * @return false if the name is not found.
         */
        getMeta: function (name, doc) {
            var i;
            if (! doc) {
                doc = window.document;
            }
            var metas = doc.getElementsByTagName("meta");
            for (i = 0; i < metas.length; ++i) {
                if (metas[i].getAttribute("name") === name) {
                    return metas[i].getAttribute("content");
                }
            }
            return false;
        },

        // convert anchor (link) object to string
        linkToString: function (l) {
            let re = "link = {\n";
            let prop = ["rel", "accessKey", "title", "href", "onclick",
                        "innerHTML", "id", "name"];
            for (let i = 0; i < prop.length; i++) {
                if (l.hasAttribute(prop[i])) {
                    re += prop[i] + ": " + l.getAttribute(prop[i]) + ",\n";
                }
            }
            return re + "}";
        }
    };

    // ================================
    //  special cases for some website
    // ================================

    /*
     * hook functions for special cases defined in getNextPageLink's
     * preGeneric and postGeneric.
     *
     * all hook functions are called with two arguments: url and doc.
     * hook function should return false if no link is found, otherwise,
     * it should return the link object.
     */

    // ninenines hosts doc for a few erlang libraries.
    // example url:
    // https://ninenines.eu/docs/en/cowboy/2.3/guide/getting_started/
    let getLinkForNinenines = function (url, doc) {
        let navNodes = doc.getElementsByTagName("nav");
        for (let navNode of navNodes) {
            if (navNode.getAttribute("style") !== "margin:1em 0") {
                continue;
            }
            let links = navNode.getElementsByTagName("a");
            for (let link of links) {
                if (link.getAttribute("style") === "float:right") {
                    return link;
                }
            }
            return false;
        }
        return false;
    };

    let getLinkForDiscuz = function (url, doc) {
        var generator;
        var className;
        if (window.discuzVersion == "X2") {
            className = "nxt";
        } else {
            generator = utils.getMeta("generator");
            if (! generator) {
                return false;
            }
            if (generator.match(/^Discuz! X/)) {
                className = "nxt";
            } else if (generator.match(/^Discuz! /)) {
                className = "next";
            } else {
                return false;
            }
        }
        var nodes = doc.getElementsByClassName(className);
        if (nodes.length < 1) {
            return false;
        }
        return nodes[0];
    };

    let getLinkForOsdirML = function (url, doc) {
        // last <a> in div.osDirPrevNext. I wish I have jQuery at my disposal.
        // $("div.osDirPrevNext > a:last")
        var nodes = doc.getElementsByClassName("osDirPrevNext");  // FF3 only.
        if (nodes.length < 1) {
            return false;
        }
        var links = nodes[0].getElementsByTagName("a");
        var link = links[links.length - 1];
        // /**/log('innerHTML' + link.innerHTML);
        if (link.innerHTML === "&gt;&gt;") {
            return link;
        }
        return false;
    };

    let getLinkForDerkeilerML = function (url, doc) {
        // when there is a ul.links element, locate it first. then find li
        // node that contains "Next (in|by) thread:", then search in this node
        // for a link. see bug #139, #208.
        var nodes = doc.getElementsByClassName("links");
        var links;
        if (nodes.length > 0) {
            nodes = nodes[0].getElementsByTagName("li");
        } else {
            nodes = doc.getElementsByTagName("li");
        }
        for (i = 0; i < nodes.length; ++i) {
            if (nodes[i].innerHTML.match(/Next (in|by) thread:/)) {
                links = nodes[i].getElementsByTagName("a");
                if (links.length > 0) {
                    return links[0];
                }
            }
        }
        return false;
    };

    let getLinkForWikiSource = function (url, doc) {
        var nodes = doc.getElementsByTagName("td");
        var links;
        for (i = 0; i < nodes.length; ++i) {
            if (nodes[i].innerHTML.match(/→/)) {
                links = nodes[i].getElementsByTagName("a");
                if (links.length > 0) {
                    return links[0];
                }
            }
        }
        return false;
    };

    let getLinkForOpenstackDoc = function (url, doc) {
        var inode = doc.getElementsByClassName("fa-angle-double-right");
        if (inode.length < 1) {
            return false;
        }
        return inode[0].parentElement;
    };

    let getLinkForBaiduSearch = function (url, doc) {
        // locate A tag with class="n"
        var nodes = doc.getElementsByClassName("n");
        if (nodes.length < 1) {
            return false;
        }
        for (i = 0; i < nodes.length; ++i) {
            if (nodes[i].innerHTML === "下一页&gt;") {
                return nodes[i];
            }
        }
        return false;
    };

    /**
     * @return true if given string matches one of the words that's
     * equivalent to 'next'.
     * @return false otherwise.
     */
    let matchesNext = function (str) {
        // str could be null
        if (! str) return false;
        str = str.trim();
        // str could be space only
        if (! str) return false;

        // to add more languages, load
        // /home/sylecn/projects/firefox/nextpage/make-regexp.el
        // M-x insert-nextpage-regexp

        // TODO make this regexp configurable
        var nextPattern = /(?:(^|>)(next[ _]page|Nächste Seite|la page suivante|следующей страницы)(<|$)|(^|>\s*)(next|nächste|Suivant|Следующая)(\s*<|$|( |&nbsp;|\u00A0)?(?:→|›|▸|»|›|>>|&(gt|#62|#x3e);)|1?\.(?:gif|jpg|png|webp))|^(→|›|▸|»|››| ?(&(gt|#62|#x3e);)+ ?)$|(下|后)一?(?:页|糗事|章|回|頁|张)|^(Next Chapter|Thread Next|Go to next page)|&nbsp;»[ \t\n]*$)/i;
        return nextPattern.test(str) || nextPattern.test(str.slice(1, -1));
    };

    /**
     * @param l an anchor object
     * @return true if this element is visible
     * @return false otherwise
     */
    let isVisible = function (l) {
        return l.offsetParent !== null;
    };

    /**
     * @param url a url string
     * @return true if the url pass the domain check.
     * This means the url matches the document domain, or it's a file:// or
     * javascript: url.
     * @return false otherwise. thus the url failed the domain check.
     */
    let checkDomain = function (url) {
        if (debugDomainCheck()) {
            log("checkDomain " + url);
        }

        if (url.match(/^javascript:/i)) {
            return true;
        }

        // eslint-disable-next-line no-useless-escape
        var domainPattern = /^([^:]+):\/\/\/?([^:\/]+)/;
        var matchResult = domainPattern.exec(url);

        if (! matchResult) {
            // should be a relative link.
            return true;
        }
        if (matchResult[1] === "file") {
            return true;
        }
        if (matchResult[2].indexOf(document.domain) !== -1) {
            return true;
        }
        if (debugDomainCheck()) {
            log("domain compare: link at " + matchResult[2] +
                ", this doc at " + document.domain);
            log("domain check failed.");
        }
        return false;
    };

    /**
     * @param l an anchor object
     * @return true if this anchor is link to next page
     * @return false otherwise
     */
    let isNextPageLink = function (l) {
        var imgMaybe;
        var spanMaybe;

        /**
         * if debugATag is enabled, log message; otherwise, do nothing.
         */
        var debugLog = function (msg) {
            if (debugATag()) {
                log(msg);
            }
        };

        // check rel
        if (l.hasAttribute("rel")) {
            if (matchesNext(l.getAttribute("rel"))) {
                // if rel is used, it's usually the right link. GNU info
                // html doc is using rel to represent the relation of the
                // nodes.
                return true;
            }
        }

        // check accesskey
        if (l.getAttribute("accesskey") === 'n') {
            // some well written html already use accesskey n to go to
            // next page, in firefox you could just use Alt-Shift-n.
            return true;
        }

        // invisible <a> tag is usually not the right link to nextpage.
        if (! isVisible(l)) {
            debugLog("link ignored because it's invisible: " + l.outerHTML);
            return false;
        }

        if (l.hasAttribute("title")) {
            if (matchesNext(l.getAttribute("title"))) {
                return true;
            }
        }

        // if we come here, it's not that clear we get a next page link, so more
        // restrict rules apply.

        // check domain
        if (l.hasAttribute("href")) {
            if (! checkDomain(l.getAttribute("href"))) {
                debugLog("link ignored because domain check failed: " + l.outerHTML);
                return false;
            }
        }

        // check innerHTML
        if (matchesNext(l.innerHTML)) {
            return true;
        }

        // check inner <img> tag
        imgMaybe = l.getElementsByTagName("img");
        if (imgMaybe.length !== 0) {
            if (matchesNext(imgMaybe[0].getAttribute('alt')) ||
                matchesNext(imgMaybe[0].getAttribute('name')) ||
                matchesNext(imgMaybe[0].getAttribute('src'))) {
                return true;
            }
        }
        // check inner <span> tag
        spanMaybe = l.getElementsByTagName("span");
        if (spanMaybe.length !== 0) {
            if (matchesNext(spanMaybe[0].innerHTML))
                return true;
        }

        debugLog("link ignored because no signs of nextpage found: " + l.outerHTML);
        return false;
    };

    /**
     * @param b a <button> object
     * @return true if this button is link to next page
     * @return false otherwise
     */
    let isNextPageHTML5Button = function (b) {
        return ((matchesNext(b.innerHTML)) ||
                (b.getAttribute("accesskey") === 'n') ||
                (b.hasAttribute("title")) &&
                 matchesNext(b.getAttribute("title")));
    };

    /**
     * @param l an INPUT type="button" object
     * @return true if this button is link to next page
     * @return false otherwise
     */
    let isNextPageInputTypeButton = function (l) {
        return (
            // check value
            matchesNext(l.getAttribute("value")) ||
            // check title
            (l.hasAttribute("title") && matchesNext(l.getAttribute("title"))) ||
            // check accesskey.
            // some well written html already use accesskey n to go to
            // next page, in firefox you could just use Alt-Shift-n.
            (l.getAttribute("accesskey") === 'n'));
    };

    /**
     * return the next page DOM element if there is a next page link or button.
     * otherwise, return null.
     */
    let getNextPageLink = function () {
        var links;
        var nodes;
        var i, j, k, e;

        /*
         * special case for some website, pre-generic
         */
        var preGeneric = [
            [/https:\/\/ninenines.eu\/docs\//i, getLinkForNinenines],
            [/\/((thread|forum)-|(viewthread|forumdisplay)\.php)/i, getLinkForDiscuz],
            [/^http:\/\/osdir\.com\/ml\//i, getLinkForOsdirML],
            [/^http:\/\/coding\.derkeiler\.com\/Archive\//i, getLinkForDerkeilerML],
            [/\.wikisource\.org\//i, getLinkForWikiSource],
            [/^https?:\/\/docs\.openstack\.org\//i, getLinkForOpenstackDoc],
            [/^http:\/\/www\.baidu\.com\/s\?wd=/i, getLinkForBaiduSearch]
        ];
        var url = utils.getURL();
        for (i = 0; i < preGeneric.length; ++i) {
            if (url.match(preGeneric[i][0])) {
                var re = preGeneric[i][1](url, document);
                if (debugSpecialCase()) {
                    log("special case for " + preGeneric[i][0]);
                    log("hook function returned " + re);
                }
                if (re) {
                    return re;
                }
            }
        }

        /*
          note: on some generated document (such as this one:
          http://www.netlib.org/lapack/lug/node5.html), there are two LINK tag with
          rel "next". I don't know what that means. it's probably a broken page.
          I will use the last <link rel="next" ...> if more than one exists.
        */
        // check last <link rel="next" ...> node in <head>
        let link = document.head.querySelectorAll('link[rel="next"]');
        if (link.length > 1) {
            if (debugging()) {
                log("use the last <LINK rel=\"next\"> href=" + link.href);
            }
            return link[link.length - 1];
        } else if (link.length === 1) {
            if (debugging()) {
                log("found <LINK rel=\"next\"> href=" + link.href);
            }
            return link[0];
        }

        /**
         * given a page url, return page number as a number if it is
         * found. return null if page can't be found in given URL or its value
         * is not a number.
         *
         * supported URL format:
         *     ?page=N (query string)
         */
        var parsePageFromURL = function (pageURL) {
            var pagePattern = /[?&]page=([^&]+)/;
            var mo = pagePattern.exec(pageURL);
            var result;
            if (mo) {
                result = parseInt(mo[1]);
                if (isNaN(result)) {
                    return null;
                } else {
                    return result;
                }
            } else {
                return null;
            }
        };

        // check <a> links
        var tagNameToCheck = ["a"];
        var pageURL = document.location.href;
        var currentPage = parsePageFromURL(pageURL);
        for (i = 0; i < tagNameToCheck.length; i++) {
            links = document.getElementsByTagName(tagNameToCheck[i]);
            for (j = 0; j < links.length; j++) {
                if (currentPage) {
                    if (parsePageFromURL(links[j].href) === currentPage + 1) {
                        return links[j];
                    }
                }
                if (isNextPageLink(links[j])) {
                    return links[j];
                }
                if (debugATag()) {
                    log("not nextpage link: " + links[j].outerHTML);
                }
            }
        }

        // check <input type="button" ...>
        nodes = document.getElementsByTagName('input');
        for (j = 0; j < nodes.length; j++) {
            if (isNextPageInputTypeButton(nodes[j])) {
                return nodes[j];
            }
        }

        // check <button ...>
        nodes = document.getElementsByTagName('button');
        for (j = 0; j < nodes.length; j++) {
            if (isNextPageHTML5Button(nodes[j])) {
                return nodes[j];
            }
        }

        // check for <a class="foo next"> <button class="foo next">
        // <input type="button" class="foo next">
        // accepts both next and nextControl class.
        var getNextElementByClassName = function (className) {
            var tagName;
            var nodes;
            nodes = document.getElementsByClassName(className);
            for (j = 0; j < nodes.length; j++) {
                tagName = nodes[j].tagName.toUpperCase();
                if (tagName === "A" ||
                    tagName === "BUTTON" ||
                    (tagName === "INPUT" &&
                     nodes[j].getAttribute("type") === "button")) {
                    if (debugging()) {
                        log("found <" + tagName + " class=\"foo " +
                            className + "\">");
                    }
                    return nodes[j];
                } else if (tagName === "LI") {
                    if (nodes[j].firstElementChild.tagName === "A") {
                        return nodes[j].firstElementChild;
                    }
                }
            }
            return null;
        };
        var nextClasses = ['next', 'nextControl', 'pageNext'];
        for (k = 0; k < nextClasses.length; k++) {
            e = getNextElementByClassName(nextClasses[k]);
            if (e) {
                return e;
            }
        }

        /*
         * special case for some website, post-generic
         */

        // // for acl2 tour
        // if ($('a[href="acl2-doc-info.html"] > img[src="index.gif"]',
        //        document).get(0)) {
        //      re = $('a > img[src$=".gif"]', document).filter(
        //          function (index) {
        //              return ((this.src === "walking.gif") ||
        //                      (this.src === "flying.gif"))
        //          }
        //      ).get(0);
        //      if (re) {
        //          return re;
        //      }
        // }

        return false;
    };

    /**
     * return True if href is link to top level index page or same level index
     * page.
     */
    let hrefIsLinkToIndexPage = function (href) {
        return (href.match(/^(\/?|\.\/)index\....l?$/i) || href.match(/^\/$/i));
    };

    /**
     * if there is a next page, goto next page. otherwise, print an info on
     * console.
     */
    let gotoNextPage = function () {
        if (debugGotoNextPage()) {
            log("in gotoNextPage()");
        }
        let nextpageLink = getNextPageLink();
        if (nextpageLink) {
            if (debugGotoNextPage()) {
                log("got nextpage link:\n" + utils.linkToString(nextpageLink));
            }
            if (nextpageLink.tagName.toUpperCase() === "BUTTON" ||
                nextpageLink.hasAttribute("onclick")) {
                if (debugGotoNextPage()) {
                    log("will click the element");
                }
                if (nextpageLink.click) {
                    // buttons has .click() function
                    nextpageLink.click();
                } else {
                    // <a> link doesn't have a .click() function
                    var clickEvent = document.createEvent("MouseEvents");
                    clickEvent.initMouseEvent("click", true, true, window,
                                              0, 0, 0, 0, 0,
                                              false, false, false, false, 0,
                                              null);
                    nextpageLink.dispatchEvent(clickEvent);
                }
            } else if (nextpageLink.hasAttribute("href")) {
                if (debugGotoNextPage()) {
                    log("will follow link.href if it's good");
                }
                // FIX Issue 4: don't follow a link to index.html
                if (hrefIsLinkToIndexPage(nextpageLink.href)) {
                    if (debugGotoNextPage()) {
                        log("not following link to index page");
                    }
                    return false;
                }
                nextpageLink.click();

                // Chrome v65: .click() doesn't follow link on <LINK> element.
                if (nextpageLink.tagName.toUpperCase() === "LINK") {
                    let oldUrl = document.location.href;
                    window.setTimeout(function () {
                        if (document.location.href === oldUrl) {
                            document.location.href = nextpageLink.href;
                        }
                    }, 200);
                }
            }
            // if there is a chance to return anything.
            return true;
        } else {
            // TODO show a nice auto timeout message at the bottom of the
            // content window. using html and css. use msg in
            // nextpage.strings.getString("msg_no_link_found")
            if (debugging()) {
                log("No link/button found. will stay at current page.");
            }
            return false;
        }
    };

    /**
     * @return true if we are at bottom of a page.
     * @return false otherwise.
     */
    let isAtBottom = function () {
        /**
         * return document height, in the context of nextpage.
         * it should return the main content's heigth for a multi-column site.
         */
        const getDocumentHeight = function () {
            return document.documentElement.scrollHeight;
        };

        // this bad site doesn't have a correct html markup, firefox can't
        // return the right document height, so I want SPC to just scroll
        // up.
        var hasBadMarkupDomainList = ["msdn.microsoft.com",
                                      "bbs.sgamer.com"];
        if (utils.inArray(document.domain, hasBadMarkupDomainList)) {
            return false;
        }

        if (typeof(window.scrollMaxY) !== 'undefined') {    // firefox
            return window.scrollMaxY <= window.scrollY;
        } else {    // chrome
            // 10px is used as float point comparison delta
            return window.innerHeight + window.scrollY + 10 >= getDocumentHeight();
        }
    };

    /**
     * if document view is at bottom of the page, and there is a next page,
     * goto next page.
     */
    let gotoNextPageMaybe = function () {
        if (isAtBottom()) {
            // go to next page
            return gotoNextPage();
        }
        return false;
    };

    /**
     * go back in history
     */
    let historyBack = function () {
        window.history.back();
    };

    /**
     * copy page title and url to clipboard.
     */
    let copyTitleAndUrl = function () {
        let title = document.title;
        let url = document.URL;
        let titleAndUrl = title + "\n" + url;
        utils.copyToClipboard(titleAndUrl);
    };

    /**
     * copy page title and url to clipboard, if no text is selected.
     */
    let copyTitleAndUrlMaybe = function () {
        let selection = window.getSelection();
        if (! selection.isCollapsed) {
            return;
        }
        copyTitleAndUrl();
    };

    let closeTab = function () {
        // Note: Scripts may not close windows that were not opened by script.
        // So window.close() doesn't work.
        // TODO implement me.
        log("close-tab is not implemented");
    };

    let bindings = {
        "n": "nextpage",
        "p": "history-back",
        "SPC": "nextpage-maybe"
    };

    /**
     * return user's key bindings.
     * it's a dict of {key-name: command-name}
     */
    let getBindings = function () {
        return bindings;
    };

    /**
     * run user command
     */
    let runUserCommand = function (command) {
        if (debugGotoNextPage()) {
            log("runUserCommand: " + command);
        }
        switch (command) {
        case "nextpage-maybe": return gotoNextPageMaybe();
        case "nextpage": return gotoNextPage();
        case "history-back": return historyBack();
        case "close-tab": return closeTab();
        case "copy-title-and-url": return copyTitleAndUrl();
        case "copy-title-and-url-maybe": return copyTitleAndUrlMaybe();
        case "nil": break;      //do nothing.
        default:
            if (debugging()) {
                log('will not run unknown command: ' + command);
            }
            break;
        }
    };

    // read parsed user config if there is one.
    const STORAGE_KEY_PARSED_CONFIG = 'user-config-parsed';
    store.get(STORAGE_KEY_PARSED_CONFIG, (result) => {
        let parsedConfig = result[STORAGE_KEY_PARSED_CONFIG] || {};
        if (parsedConfig.bindings) {
            // modify lexical variable, next time getBindings() should return
            // latest value.
            bindings = parsedConfig.bindings;
            variables = parsedConfig.variables;
            if (debugging()) {
                log("parsed user config:" + JSON.stringify({
                    "bindings": bindings,
                    "variables": variables
                }));
            }
        }
    }, log);

    document.addEventListener("keypress", function (e) {
        let key = utils.describeKeyInEmacsNotation(e);
        if (debugKeyEvents()) {
            log("keypress in emacs notation: " + key);
        }
        if (userIsTyping()) {
            if (debugKeyEvents()) {
                log("user is typing, ignoring key event");
            }
            return;
        }
        if (skipWebsite(e)) {
            if (debugKeyEvents()) {
                log("ignore key event on current website");
            }
            return;
        }
        if (debugKeyEvents()) {
            log("not skip website");
        }
        if (shouldIgnoreKey(key)) {
            log("ignore key event on current website");
            if (debugKeyEvents()) {
                log("ignore key event on current website");
            }
            return;
        }
        if (debugKeyEvents()) {
            log("will process key: " + key);
        }
        let command = getBindings()[key];
        if (typeof(command) !== "undefined") {
            runUserCommand(command);
        } else {
            if (debugging()) {
                log("no associated function with this key");
            }
        }
    });

    document.addEventListener("click", function (e) {
        var key = utils.describeMouseEventInEmacsNotation(e);
        if (debugKeyEvents()) {
            log("mouseclick: " + key);
        }
        if (skipWebsite(e)) {
            return;
        }
        if (shouldIgnoreKey(key)) {
            return;
        }
        let command = getBindings()[key];
        if (typeof(command) !== "undefined") {
            runUserCommand(command);
        }
    });

    document.addEventListener("wheel", function (e) {
        var key = utils.describeWheelEventInEmacsNotation(e);
        if (debugKeyEvents()) {
            log("wheel event: " + key);
        }
        if (skipWebsite(e)) {
            return;
        }
        if (shouldIgnoreKey(key)) {
            return;
        }
        let command = getBindings()[key];
        if (typeof(command) !== "undefined") {
            runUserCommand(command);
        }
    });

})();

// Local Variables:
// indent-tabs-mode: nil
// End:
