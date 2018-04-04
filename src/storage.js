// uniform sync storage access for firefox (browser.storage.sync) and chrome
// (chrome.storage.sync).
/* exported store */
var store = function () {
    "use strict";
    let store;
    let storeGet;
    let storeSet;
    let storeRemove;
    let storeClear;

    try {
        // firefox
        store = browser.storage.sync;
        storeGet = function (key, succCallback, errCallback) {
            store.get(key).then(succCallback, errCallback);
        };
        storeSet = function (keyValues, succCallback, errCallback) {
            store.set(keyValues).then(succCallback, errCallback);
        };
        storeRemove = function (keys, succCallback, errCallback) {
            store.remove(keys).then(succCallback, errCallback);
        };
        storeClear = function (succCallback, errCallback) {
            store.clear().then(succCallback, errCallback);
        };
    } catch (e) {
        // chrome
        store = chrome.storage.sync;

        /**
         * wrap succCallback and errCallback to be a single callback.
         */
        let wrapForChrome = function (succCallback, errCallback) {
            return function (...args) {
                if (chrome.runtime.lastError) {
                    return errCallback(chrome.runtime.lastError);
                }
                succCallback(...args);
            };
        };

        storeGet = function (key, succCallback, errCallback) {
            store.get(key, wrapForChrome(succCallback, errCallback));
        };
        storeSet = function (keyValues, succCallback, errCallback) {
            store.set(keyValues, wrapForChrome(succCallback, errCallback));
        };
        storeRemove = function (keys, succCallback, errCallback) {
            store.remove(keys, wrapForChrome(succCallback, errCallback));
        };
        storeClear = function (succCallback, errCallback) {
            store.clear(wrapForChrome(succCallback, errCallback));
        };
    }
    return {
        /**
         * key: the key
         * succCallback: called with a js object, the fetched key values.
         * errCallback: called with an error object, if fetch failed.
         */
        get: storeGet,

        /**
         * keyValues: the key and values to set
         * succCallback: called when set succeeded
         * errCallback: called when there is an error
         */
        set: storeSet,

        /**
         * keys: the keys to remove
         * succCallback: called when keys are removed
         * errCallback: called when remove failed
         */
        remove: storeRemove,

        /**
         * succCallback: called when all keys are removed
         * errCallback: called when clear failed
         */
        clear: storeClear,
    };
}();
