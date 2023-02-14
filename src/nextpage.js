// Copyright (C) 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022, 2023 Yuanle Song <sylecn@gmail.com>
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

/* global store */
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
    let debugPrefetch = function () {return variables.debugPrefetch;};
    /**
     * return true if prefetch is enabled.
     */
    let prefetchEnabled = function () {return ! variables.prefetchDisabled;};
    // eslint-disable-next-line no-console
    let log = console.log;

    if (typeof KeyEvent === "undefined") {
        var KeyEvent = {
            DOM_VK_CANCEL: 3,
            DOM_VK_HELP: 6,
            DOM_VK_BACK_SPACE: 8,
            DOM_VK_TAB: 9,
            DOM_VK_CLEAR: 12,
            DOM_VK_RETURN: 13,
            DOM_VK_ENTER: 14,
            DOM_VK_SHIFT: 16,
            DOM_VK_CONTROL: 17,
            DOM_VK_ALT: 18,
            DOM_VK_PAUSE: 19,
            DOM_VK_CAPS_LOCK: 20,
            DOM_VK_ESCAPE: 27,
            DOM_VK_SPACE: 32,
            DOM_VK_PAGE_UP: 33,
            DOM_VK_PAGE_DOWN: 34,
            DOM_VK_END: 35,
            DOM_VK_HOME: 36,
            DOM_VK_LEFT: 37,
            DOM_VK_UP: 38,
            DOM_VK_RIGHT: 39,
            DOM_VK_DOWN: 40,
            DOM_VK_PRINTSCREEN: 44,
            DOM_VK_INSERT: 45,
            DOM_VK_DELETE: 46,
            DOM_VK_0: 48,
            DOM_VK_1: 49,
            DOM_VK_2: 50,
            DOM_VK_3: 51,
            DOM_VK_4: 52,
            DOM_VK_5: 53,
            DOM_VK_6: 54,
            DOM_VK_7: 55,
            DOM_VK_8: 56,
            DOM_VK_9: 57,
            DOM_VK_SEMICOLON: 59,
            DOM_VK_EQUALS: 61,
            DOM_VK_A: 65,
            DOM_VK_B: 66,
            DOM_VK_C: 67,
            DOM_VK_D: 68,
            DOM_VK_E: 69,
            DOM_VK_F: 70,
            DOM_VK_G: 71,
            DOM_VK_H: 72,
            DOM_VK_I: 73,
            DOM_VK_J: 74,
            DOM_VK_K: 75,
            DOM_VK_L: 76,
            DOM_VK_M: 77,
            DOM_VK_N: 78,
            DOM_VK_O: 79,
            DOM_VK_P: 80,
            DOM_VK_Q: 81,
            DOM_VK_R: 82,
            DOM_VK_S: 83,
            DOM_VK_T: 84,
            DOM_VK_U: 85,
            DOM_VK_V: 86,
            DOM_VK_W: 87,
            DOM_VK_X: 88,
            DOM_VK_Y: 89,
            DOM_VK_Z: 90,
            DOM_VK_CONTEXT_MENU: 93,
            DOM_VK_NUMPAD0: 96,
            DOM_VK_NUMPAD1: 97,
            DOM_VK_NUMPAD2: 98,
            DOM_VK_NUMPAD3: 99,
            DOM_VK_NUMPAD4: 100,
            DOM_VK_NUMPAD5: 101,
            DOM_VK_NUMPAD6: 102,
            DOM_VK_NUMPAD7: 103,
            DOM_VK_NUMPAD8: 104,
            DOM_VK_NUMPAD9: 105,
            DOM_VK_MULTIPLY: 106,
            DOM_VK_ADD: 107,
            DOM_VK_SEPARATOR: 108,
            DOM_VK_SUBTRACT: 109,
            DOM_VK_DECIMAL: 110,
            DOM_VK_DIVIDE: 111,
            DOM_VK_F1: 112,
            DOM_VK_F2: 113,
            DOM_VK_F3: 114,
            DOM_VK_F4: 115,
            DOM_VK_F5: 116,
            DOM_VK_F6: 117,
            DOM_VK_F7: 118,
            DOM_VK_F8: 119,
            DOM_VK_F9: 120,
            DOM_VK_F10: 121,
            DOM_VK_F11: 122,
            DOM_VK_F12: 123,
            DOM_VK_F13: 124,
            DOM_VK_F14: 125,
            DOM_VK_F15: 126,
            DOM_VK_F16: 127,
            DOM_VK_F17: 128,
            DOM_VK_F18: 129,
            DOM_VK_F19: 130,
            DOM_VK_F20: 131,
            DOM_VK_F21: 132,
            DOM_VK_F22: 133,
            DOM_VK_F23: 134,
            DOM_VK_F24: 135,
            DOM_VK_NUM_LOCK: 144,
            DOM_VK_SCROLL_LOCK: 145,
            DOM_VK_COMMA: 188,
            DOM_VK_PERIOD: 190,
            DOM_VK_SLASH: 191,
            DOM_VK_BACK_QUOTE: 192,
            DOM_VK_OPEN_BRACKET: 219,
            DOM_VK_BACK_SLASH: 220,
            DOM_VK_CLOSE_BRACKET: 221,
            DOM_VK_QUOTE: 222,
            DOM_VK_META: 224
        };
    }

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
        // exception rule, pipermail or mailing list archives is not webmail.
        [/mail\..*\/(pipermail|archives)/i, ""],
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
         * given a page url, return page number as a number if it is
         * found. return null if page can't be found in given URL or its value
         * is not a number.
         *
         * supported URL format:
         *     ?page=N (query string)
         */
        parsePageFromURL: function (pageURL) {
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
        },

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
         * return true if keyCode is a pure modifier key.
         */
        isPureModifierKey: function (keyCode) {
            return (keyCode === KeyEvent.DOM_VK_SHIFT ||
                    keyCode === KeyEvent.DOM_VK_CONTROL ||
                    keyCode === KeyEvent.DOM_VK_ALT);
        },

        /**
         * describe key pressed in emacs notation. return a string.
         * examples: n, N, C-a, M-n, SPC, DEL, <f2>, <insert>, C-M-n
         * <C-backspace>, <C-S-f7>, C-M-*, M-S-RET, <backspace>, <C-M-S-return>
         * C-., C-<, *, <kp-2>
         * @param e a KeyEvent
         * @return a string that describes which key was pressed.
         */
        describeKeyInEmacsNotation: function (e) {
            if (debugKeyEvents()) {
                log("keyCode=" + e.keyCode + ", key=" + e.key);
            }

            /**
             * convert keyCode to emacs key name. ignore modifier keys. only
             * convert the keys that doesn't require bracket in emacs
             * notation, most commonly printable characters.
             *
             * Return:
             *   [keyName, consumeShift?] if this keyCode doesn't require bracket.
             *   null otherwise.
             */
            var getNameForKeyCodeNoBracket = function (e) {
                // try get keyName while consuming shift key.
                // if get keyName okay, return keyName, otherwise, return null.
                let getKeyNameConsumeShift = function (e) {
                    let keyCode = e.keyCode;

                    if (keyCode >= KeyEvent.DOM_VK_A &&
                        keyCode <= KeyEvent.DOM_VK_Z) {
                        return e.ctrlKey ? e.key.toLowerCase() : e.key;
                    }

                    if (keyCode >= KeyEvent.DOM_VK_0 &&
                        keyCode <= KeyEvent.DOM_VK_9) {
                        return e.key;
                    }
                    switch (keyCode) {
                    case KeyEvent.DOM_VK_BACK_QUOTE: return "~";
                        // special handling for - key in main keyboard area.
                    case 173: return e.key;
                    case 189: return e.key;
                    case KeyEvent.DOM_VK_EQUALS: return "+";
                    case KeyEvent.DOM_VK_OPEN_BRACKET: return "{";
                    case KeyEvent.DOM_VK_CLOSE_BRACKET: return "}";
                    case KeyEvent.DOM_VK_BACK_SLASH: return "|";
                    case KeyEvent.DOM_VK_SEMICOLON: return ":";
                    case KeyEvent.DOM_VK_QUOTE: return "\"";
                    case KeyEvent.DOM_VK_COMMA: return "<";
                    case KeyEvent.DOM_VK_PERIOD: return ">";
                    case KeyEvent.DOM_VK_SLASH: return "?";
                    default: return null;
                    }
                };

                // try get keyName when shift key is not pressed.
                let getKeyNameNoShift = function (e) {
                    let keyCode = e.keyCode;
                    if ((keyCode >= KeyEvent.DOM_VK_A && keyCode <= KeyEvent.DOM_VK_Z)
                        || (keyCode >= KeyEvent.DOM_VK_0 && keyCode <= KeyEvent.DOM_VK_9)) {
                        return String.fromCharCode(keyCode).toLowerCase();
                    }
                    switch (keyCode) {
                    case KeyEvent.DOM_VK_SPACE: return "SPC";
                    case KeyEvent.DOM_VK_SEMICOLON: return ";";
                    case KeyEvent.DOM_VK_EQUALS: return "=";
                    case KeyEvent.DOM_VK_COMMA: return ",";
                    case KeyEvent.DOM_VK_PERIOD: return ".";
                    case KeyEvent.DOM_VK_SLASH: return "/";
                    case KeyEvent.DOM_VK_BACK_QUOTE: return "`";
                    case KeyEvent.DOM_VK_OPEN_BRACKET: return "[";
                    case KeyEvent.DOM_VK_BACK_SLASH: return "\\";
                    case KeyEvent.DOM_VK_CLOSE_BRACKET: return "]";
                    case KeyEvent.DOM_VK_QUOTE: return "'";

                    default: return null;
                    }
                };

                if (e.shiftKey) {
                    let keyName = getKeyNameConsumeShift(e);
                    if (keyName !== null) {
                        return [keyName, true];
                    }
                }
                // even if shiftKey is pressed, it may not be consumed, such
                // as C-S-y.
                let keyName = getKeyNameNoShift(e);
                if (keyName !== null) {
                    return [keyName, false];
                }
                return null;
            };
            /**
             * convert keyCode to emacs key name. ignore modifier
             * keys. convert the keys that requires bracket in emacs
             * notation. most commonly function keys and control keys.
             */
            var getNameForKeyCodeBracket = function (keyCode) {
                switch (keyCode) {
                case KeyEvent.DOM_VK_TAB: return "tab";

                case KeyEvent.DOM_VK_INSERT: return "insert";
                case KeyEvent.DOM_VK_DELETE: return "delete";
                case KeyEvent.DOM_VK_HOME: return "home";
                case KeyEvent.DOM_VK_END: return "end";
                case KeyEvent.DOM_VK_PAGE_UP: return "prior";
                case KeyEvent.DOM_VK_PAGE_DOWN: return "next";

                case KeyEvent.DOM_VK_BACK_SPACE: return "backspace";
                case KeyEvent.DOM_VK_ESCAPE: return "escape";

                case KeyEvent.DOM_VK_LEFT: return "left";
                case KeyEvent.DOM_VK_UP: return "up";
                case KeyEvent.DOM_VK_RIGHT: return "right";
                case KeyEvent.DOM_VK_DOWN: return "down";

                case KeyEvent.DOM_VK_RETURN: return "RET";
                case KeyEvent.DOM_VK_CONTEXT_MENU: return "menu";
                case KeyEvent.DOM_VK_MULTIPLY: return "kp-multiply";
                case KeyEvent.DOM_VK_ADD: return "kp-add";
                case KeyEvent.DOM_VK_SUBTRACT: return "kp-subtract";
                case KeyEvent.DOM_VK_DECIMAL: return "kp-decimal";
                case KeyEvent.DOM_VK_DIVIDE: return "kp-divide";

                case KeyEvent.DOM_VK_F1: return "f1";
                case KeyEvent.DOM_VK_F2: return "f2";
                case KeyEvent.DOM_VK_F3: return "f3";
                case KeyEvent.DOM_VK_F4: return "f4";
                case KeyEvent.DOM_VK_F5: return "f5";
                case KeyEvent.DOM_VK_F6: return "f6";
                case KeyEvent.DOM_VK_F7: return "f7";
                case KeyEvent.DOM_VK_F8: return "f8";
                case KeyEvent.DOM_VK_F9: return "f9";
                case KeyEvent.DOM_VK_F10: return "f10";
                case KeyEvent.DOM_VK_F11: return "f11";
                case KeyEvent.DOM_VK_F12: return "f12";

                default:
                    if (keyCode >= KeyEvent.DOM_VK_NUMPAD0 &&
                        keyCode <= KeyEvent.DOM_VK_NUMPAD9) {
                        return "kp-" + (keyCode - KeyEvent.DOM_VK_NUMPAD0);
                    } else {
                        return "KEYCODE" + keyCode;
                    }
                }
            };

            var noWrap = true;    // whether to wrap key with <>
            var shiftIsConsumed = false;    // whether shift key is consumed
                                            // in keyName.
            var keyName = "";
            var r = getNameForKeyCodeNoBracket(e);
            if (r === null) {
                noWrap = false;
                keyName = getNameForKeyCodeBracket(e.keyCode);
            } else {
                keyName = r[0];
                shiftIsConsumed = r[1];
            }
            var ctrl = e.ctrlKey ? "C-": "";
            var meta = (e.altKey || e.metaKey) ? "M-": "";
            var shift = e.shiftKey && (! shiftIsConsumed) ? "S-": "";
            var re = ctrl + meta + shift + keyName;
            if (! noWrap) {
                re = '<' + re + '>';
            }
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
            let re = "link = <" + l.tagName + "> {\n";
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

    // ADD new preGeneric and postGeneric handler here

    /**
     * the PKU BBS next page link look like this:
     * <div class="paging-button n"><a class="link" href="?bid=35&amp;threadid=17173713&amp;page=2"></a>下一页 &gt;</div>
     */
    let getLinkForPkuBBS = function (url, doc) {
        let divs = doc.querySelectorAll('div[class~="paging-button"]');
        for (let div of divs) {
            if (div.lastChild.textContent === "下一页 >") {
                return div.firstChild;
            }
        }
        return false;
    };

    let getLinkForDockerHub = function (url, doc) {
        return doc.querySelector('div[class~="dpagination"] li[class*="styles__nextPage"]');
    };

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

        // TODO make this regexp configurable. user config should be named
        // extra-next-pattern, or use a function (add-next-pattern PATTERN).
        var nextPattern = /(?:(^|>)(next[ _]page|Nächste Seite|la page suivante|следующей страницы)(<|$)|(^|>\s*)(next( +page)?|nächste|Suivant|Следующая)(\s*<|$|( |&nbsp;|\u00A0){1,2}?(?:→|›|▸|»|›|>>|&(gt|#62|#x3e);)|1?\.(?:gif|jpg|png|webp))|^(→|›|▸|»|››| ?(&(gt|#62|#x3e);)+ ?)$|(下|后)一?(?:页|糗事|章|回|頁|张)|^(Next Chapter|Thread Next|Go to next page|Next Topic)|(&nbsp;| )»[ \t\n]*$)/i;
        return nextPattern.test(str) || nextPattern.test(str.slice(1, -1));
    };

    /**
     * @return true if given string matches one of the words that's
     * equivalent to 'previous'.
     * @return false otherwise.
     */
    let matchesPrevious = function (str) {
        // str could be null
        if (! str) return false;
        str = str.trim();
        // str could be space only
        if (! str) return false;

        // TODO make this regexp configurable
        var previousPattern = /(?:(^|>)(previous[ _]page|Vorherige Seite)(<|$)|(^|>\s*)(prev(ious)?|vorherige|Précédent)(\s*<|$|( |&nbsp;|\u00A0)?(?:←|‹|◂|«|‹|<<|&(lt|#60|#x3c);)|1?\.(?:gif|jpg|png|webp))|^(←|‹|◂|«|‹‹| ?(&(lt|#60|#x3c);)+ ?)$|(上|前)一?(?:页|糗事|章|回|頁|张)|^(Previous Chapter|Thread Previous|Go to previous page)|&nbsp;«[ \t\n]*$)/i;
        return previousPattern.test(str) || previousPattern.test(str.slice(1, -1));
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
     * check link with matchFunc.
     *
     * @param l an anchor object
     * @param matchFunc the checker function. matchFunc signature:
     *        matchFunc(string) -> boolean.
     * @param accessKey single char string, return true if link has this
     *        accessKey.
     *
     * @return true if link has text that matches according to matchFunc or
     * has given accessKey. false otherwise.
     */
    let checkLinkWithFunc = function (l, matchFunc, accessKey) {
        /**
         * if debugATag is enabled, log message; otherwise, do nothing.
         */
        let debugLog = function (msg) {
            if (debugATag()) {
                log(msg);
            }
        };

        // check rel
        if (l.hasAttribute("rel")) {
            if (matchFunc(l.getAttribute("rel"))) {
                // if rel is used, it's usually the right link. GNU info
                // html doc is using rel to represent the relation of the
                // nodes.
                return true;
            }
        }

        // check accesskey
        if (l.getAttribute("accesskey") === accessKey) {
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
            if (matchFunc(l.getAttribute("title"))) {
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
        if (matchFunc(l.innerHTML)) {
            return true;
        }

        // check inner <img> tag
        let imgMaybe = l.getElementsByTagName("img");
        if (imgMaybe.length !== 0) {
            if (matchFunc(imgMaybe[0].getAttribute('alt')) ||
                matchFunc(imgMaybe[0].getAttribute('name')) ||
                matchFunc(imgMaybe[0].getAttribute('src'))) {
                return true;
            }
        }
        // check inner <span> tag
        let spanMaybe = l.getElementsByTagName("span");
        if (spanMaybe.length !== 0) {
            if (matchFunc(spanMaybe[0].innerHTML))
                return true;
        }

        debugLog("link check failed because neither text nor access key matched: " + l.outerHTML);
        return false;
    };

    /**
     * @param l an anchor object
     * @return true if this anchor is link to previous page
     * @return false otherwise
     */
    let isPreviousPageLink = function (l) {
        return checkLinkWithFunc(l, matchesPrevious, 'p');
    };

    /**
     * @param l an anchor object
     * @return true if this anchor is link to next page
     * @return false otherwise
     */
    let isNextPageLink = function (l) {
        return checkLinkWithFunc(l, matchesNext, 'n');
    };

    /**
     * @param b a <button> object
     * @return true if this button is link to next page
     * @return false otherwise
     */
    let isNextPageHTML5Button = function (b) {
        return (matchesNext(b.innerHTML) ||
                (b.getAttribute("accesskey") === 'n') ||
                (b.hasAttribute("title") &&
                 matchesNext(b.getAttribute("title"))));
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
     * @param b a <button> object
     * @return true if this button is link to previous page
     * @return false otherwise
     */
    let isPreviousPageHTML5Button = function (b) {
        return (matchesPrevious(b.innerHTML) ||
                (b.getAttribute("accesskey") === 'p') ||
                (b.hasAttribute("title") &&
                 matchesPrevious(b.getAttribute("title"))));
    };

    /**
     * @param l an INPUT type="button" object
     * @return true if this button is link to previous page
     * @return false otherwise
     */
    let isPreviousPageInputTypeButton = function (l) {
        return (
            // check value
            matchesPrevious(l.getAttribute("value")) ||
            // check title
            (l.hasAttribute("title") && matchesPrevious(l.getAttribute("title"))) ||
            // check accesskey.
            // some well written html already use accesskey n to go to
            // previous page, in firefox you could just use Alt-Shift-n.
            (l.getAttribute("accesskey") === 'p'));
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
            [/https:\/\/bbs.pku.edu.cn\//i, getLinkForPkuBBS],
            [/https:\/\/hub.docker.com\//i, getLinkForDockerHub],
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

        // check <a> links
        var tagNameToCheck = ["a"];
        var pageURL = document.location.href;
        var currentPage = utils.parsePageFromURL(pageURL);
        for (i = 0; i < tagNameToCheck.length; i++) {
            links = document.getElementsByTagName(tagNameToCheck[i]);
            for (j = 0; j < links.length; j++) {
                if (currentPage) {
                    if (utils.parsePageFromURL(links[j].href) === currentPage + 1) {
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

        return null;
    };

    /**
     * return True if href is link to top level index page or same level index
     * page.
     */
    let hrefIsLinkToIndexPage = function (href) {
        return (href.match(/^(\/?|\.\/)index\....l?$/i) || href.match(/^\/$/i));
    };

    /**
     * follow a previous page or next page link. to follow a link, the link
     * may be clicked or it's href may be used.
     *
     * @param link a DOM object, the link to follow.
     * @param allowRedirectToIndex boolean, allow redirect to index or not
     *
     * return true if link is followed. return false otherwise.
     */
    let followLink = function (link, allowRedirectToIndex) {
        if (isVisible(link) &&
            ((link.tagName.toUpperCase() === "BUTTON" ||
              link.hasAttribute("onclick") ||
              link.click))) {
            if (debugGotoNextPage()) {
                log("will click the element");
            }
            if (link.click) {
                // buttons has .click() function
                link.click();

                const pageURL = document.location.href;
                if (pageURL.match(/https:\/\/weread.qq.com\/web\/reader/i)) {
                    // special handling for wechat read (微信读书).
                    // button.click() doesn't work on these pages. it requires
                    // either a mouseevent with proper source element. Here I
                    // just simulate a ArrowRight (next page) or ArrowLeft
                    // (prev page) key press, which is easier.
                    const KEY_CODE_ARROW_RIGHT = 39;
                    const KEY_CODE_ARROW_LEFT = 37;
                    // support both next page and prev page link.
                    const keyCodeToPress = link.textContent.indexOf("上") !== -1 ? KEY_CODE_ARROW_LEFT : KEY_CODE_ARROW_RIGHT;
                    document.dispatchEvent(new KeyboardEvent('keydown', {keyCode: keyCodeToPress}));
                }
                return true;
            } else {
                // <a> link doesn't have a .click() function
                var clickEvent = document.createEvent("MouseEvents");
                clickEvent.initMouseEvent("click", true, true, window,
                                          0, 0, 0, 0, 0,
                                          false, false, false, false, 0,
                                          null);
                link.dispatchEvent(clickEvent);
                return true;
            }
        } else if (link.hasAttribute("href")) {
            if (debugGotoNextPage()) {
                log("will follow link.href if it's good");
            }
            if (! allowRedirectToIndex) {
                // FIX Issue 4: don't follow a link to index.html
                if (hrefIsLinkToIndexPage(link.href)) {
                    if (debugGotoNextPage()) {
                        log("not following link to index page");
                    }
                    return false;
                }
            }
            link.click();

            // Chrome v65: .click() doesn't follow link on <LINK> element.
            if (link.tagName.toUpperCase() === "LINK") {
                let oldUrl = document.location.href;
                window.setTimeout(function () {
                    if (document.location.href === oldUrl) {
                        document.location.href = link.href;
                    }
                }, 200);
            }
            return true;
        }
        // return false if we have not redirected to a new page.
        return false;
    };

    /**
     * if there is a next page, goto next page. otherwise, print an info on
     * console.
     *
     * return true if goto nextpage okay. return false otherwise.
     */
    let gotoNextPage = function () {
        if (debugGotoNextPage()) {
            log("in gotoNextPage()");
        }
        const nextpageLink = getNextPageLink();
        if (nextpageLink) {
            if (debugGotoNextPage()) {
                log("got nextpage link:\n" + utils.linkToString(nextpageLink));
            }
            return followLink(nextpageLink, false);
        } else {
            // TODO show a nice auto timeout message at the bottom of the
            // content window. using html and css. use msg in
            // nextpage.strings.getString("msg_no_link_found")
            if (debugging()) {
                log("No nextpage link/button found. will stay at current page.");
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
            // 10px is used as float point comparison delta
            return window.scrollY + 10 >= window.scrollMaxY;
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
     * try find previous page link in current document.
     *
     * return previous page DOM object if previous page link is found.
     * return null otherwise.
     */
    let getPreviousPageLink = function () {
        let links;
        let nodes;

        // check <a> links
        let tagNameToCheck = ["a"];
        let pageURL = document.location.href;
        let currentPage = utils.parsePageFromURL(pageURL);
        for (let i = 0; i < tagNameToCheck.length; i++) {
            links = document.getElementsByTagName(tagNameToCheck[i]);
            for (let j = 0; j < links.length; j++) {
                if (currentPage) {
                    if (utils.parsePageFromURL(links[j].href) === currentPage - 1) {
                        return links[j];
                    }
                }
                if (isPreviousPageLink(links[j])) {
                    return links[j];
                }
                if (debugATag()) {
                    log("not previous page link: " + links[j].outerHTML);
                }
            }
        }

        // check last <link rel="prev" ...> node in <head>
        let link = document.head.querySelectorAll('link[rel="prev"]');
        if (link.length > 1) {
            if (debugging()) {
                log("use the last <LINK rel=\"prev\"> href=" + link.href);
            }
            return link[link.length - 1];
        } else if (link.length === 1) {
            if (debugging()) {
                log("found <LINK rel=\"prev\"> href=" + link.href);
            }
            return link[0];
        }

        // check <input type="button" ...>
        nodes = document.getElementsByTagName('input');
        for (var j = 0; j < nodes.length; j++) {
            if (isPreviousPageInputTypeButton(nodes[j])) {
                return nodes[j];
            }
        }

        // check <button ...>
        nodes = document.getElementsByTagName('button');
        for (let j = 0; j < nodes.length; j++) {
            if (isPreviousPageHTML5Button(nodes[j])) {
                return nodes[j];
            }
        }

        // check for <a class="foo prev"> <button class="foo prev">
        // <input type="button" class="foo prev">
        // accepts both prev and prevControl class.
        var getPreviousElementByClassName = function (className) {
            var tagName;
            var nodes;
            nodes = document.getElementsByClassName(className);
            for (var j = 0; j < nodes.length; j++) {
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
        let nextClasses = ['prev', 'prevControl', 'pagePrevious'];
        for (let k = 0; k < nextClasses.length; k++) {
            let e = getPreviousElementByClassName(nextClasses[k]);
            if (e) {
                return e;
            }
        }

        return null;
    };

    /**
     * goto previous page if there is a previous page link.
     * return true if goto previous page okay. return false otherwise.
     */
    let gotoPreviousPage = function () {
        if (debugGotoNextPage()) {
            log("in gotoPreviousPage()");
        }
        let previousPageLink = getPreviousPageLink();
        if (previousPageLink) {
            if (debugGotoNextPage()) {
                log("got previous page link:\n" +
                    utils.linkToString(previousPageLink));
            }
            return followLink(previousPageLink, true);
        } else {
            if (debugging()) {
                log("No previous link/button found. will stay at current page.");
            }
            return false;
        }
    };

    /**
     * go back in history
     */
    let historyBack = function () {
        window.history.back();
    };

    /**
     * copy page title to clipboard.
     */
    let copyTitle = function () {
        utils.copyToClipboard(document.title);
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
        case "previous-page": return gotoPreviousPage();
        case "history-back": return historyBack();
        case "close-tab": return closeTab();
        case "copy-title-and-url": return copyTitleAndUrl();
        case "copy-title": return copyTitle();
        case "copy-title-and-url-maybe": return copyTitleAndUrlMaybe();
        case "nil": break;      //do nothing.
        default:
            if (debugging()) {
                log('will not run unknown command: ' + command);
            }
            break;
        }
    };

    /**
     * prerender or prefetch next page if prefetch is enabled in user config.
     */
    let prefetchMaybe = function () {
        if (prefetchEnabled()) {
            /**
             * return true if prerender is supported by this browser.
             */
            const prerenderSupported = function () {
                // firefox doesn't support prerender. chrome/msedge supports it.
                return typeof(window.scrollMaxY) === 'undefined';
            };

            const nextpageLink = getNextPageLink();
            if (nextpageLink.hasAttribute("href")) {
                const link = document.createElement("link");
                link.href = nextpageLink.href;
                link.rel = prerenderSupported() ? "prerender" : "prefetch";
                if (debugPrefetch()) {
                    log("will " + link.rel + " href " + nextpageLink.href);
                }
                document.body.appendChild(link);
            } else {
                if (debugPrefetch()) {
                    log("No href link found for prefetch.");
                }
            }
        } else {
            if (debugPrefetch()) {
                log("Note: prefetch disabled in user preferences. Try remove (disable-prefetch)");
            }
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

            // run prefetch *after* user config is parsed. Because user might
            // have disabled it.
            prefetchMaybe();
        }
    }, log);

    document.addEventListener("keydown", function (e) {
        if (utils.isPureModifierKey(e.keyCode)) {
            if (debugKeyEvents()) {
                log("ignore pure modifier key event");
            }
            return;
        }
        let key = utils.describeKeyInEmacsNotation(e);
        if (debugKeyEvents()) {
            log("pressed key in emacs notation: " + key);
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

    /**
     * shared code for regular mouse event handler and context menu event
     * handler.
     */
    let buildMouseEventHandler = function (func) {
        return function (e) {
            const key = utils.describeMouseEventInEmacsNotation(e);
            if (debugKeyEvents()) {
                log("mouseclick: " + key);
            }
            if (skipWebsite(e) || shouldIgnoreKey(key)) {
                return;
            }
            let command = getBindings()[key];
            if (typeof(command) !== "undefined") {
                e.preventDefault();    // mostly useful for middle click and right click
                func(command);
            } else {
                if (debugging()) {
                    log("no associated function with this key");
                }
            }
        };
    };

    let mouseEventHandler = buildMouseEventHandler(function (command) {
        return runUserCommand(command);
    });

    let contextMenuEventHandler = buildMouseEventHandler(function (_command) {
        // noop. just disable default behavior by e.preventDefault().
    });

    // all three event handlers are required to properly support mouse-[12345]
    // key bindings.
    document.addEventListener("click", mouseEventHandler);
    document.addEventListener("auxclick", mouseEventHandler);
    document.addEventListener("contextmenu", contextMenuEventHandler);

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
// js-curly-indent-offset: 0
// End:
