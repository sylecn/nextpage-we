(function(){
    const STORAGE_KEY_USER_CONFIG = 'user-config-text';
    const STORAGE_KEY_PARSED_CONFIG = 'user-config-parsed';
    const DEFAULT_CONFIG_TEXT = '(bind "SPC" \'nextpage-maybe)\n' +
	  '(bind "n" \'nextpage)\n' +
	  '(bind "p" \'history-back)\n';
    const store = browser.storage.sync;

    const logTextarea = document.getElementById("log");
    /**
     * append log message into textarea
     */
    let log = function (msg) {
	logTextarea.value += msg + '\n';
    };
    let clearLog = function () {
	logTextarea.value = '';
    };
    let setLog = function (msg) {
	logTextarea.value = msg + '\n';
    };

    /**
     * generic error handler
     */
    let onError = function (error) {
	console.log(error);
    };

    /**
     * load user config from add-on storage API and show it in UI.
     * this does not make the config effective.
     * use reloadUserConfig if you want to reload user config.
     */
    let showUserConfig = function () {
	let getKey = store.get(STORAGE_KEY_USER_CONFIG);
	getKey.then((result) => {
	    document.getElementById('user-config').value =
		result[STORAGE_KEY_USER_CONFIG] || "";
	}, onError);
    };

    /**
     * make userConfig effective in all existing windows and new windows.
     * TODO is this possible?
     */
    let loadConfig = function (userConfig) {
	// TODO
    };

    const VALID_COMMANDS = ["nextpage-maybe",
			    "nextpage",
			    "history-back",
			    "close-tab",
			    "nil"];
    /**
     * returns true if given nextpage config command is valid.
     */
    // this is used for syntax checking.
    let isValidCommand = function (command) {
	return VALID_COMMANDS.indexOf(command) !== -1;
    }

    /**
     * parse nextpage user config. currently only bind is supported.
     * using dumb regexp to do parsing. sexp read style parsing not supported.
     * one bind per line.
     *
     * comments and empty lines are skipped.
     *
     * @return {
     *     bindings: {key-name: command-name},
     *     variables: {debug: true|false, debugXXX: true|false},
     *     logs: ["warning and error messages"],
     *     ok: true|false
     *   }
     */
    let parseUserConfig = function (userConfig) {
	var noerror = true;
	var variables = {};
	var bindings = {
            "n": "nextpage",
            "p": "history-back",
            "SPC": "nextpage-maybe"
	};
	var logs = [];
	var line_index;
	var log = function (msg) {
	    logs.push('line ' + (line_index + 1) + ': ' + msg);
	};

	var lines = userConfig.split('\n');
	var r, mo, i;
	var line;
	var command_pattern = /^\(([a-zA-Z][-a-zA-Z0-9]*)(\s+.*)?\)$/;
	var command;		//stores first string in sexp list.
	for (i = 0; i < lines.length; ++i) {
	    line_index = i;
	    line = lines[i].trim();
	    if (line === '' || line.match(/^\s*;/)) {
		// ignore empty lines and comment lines
		continue;
	    }
	    if ((mo = command_pattern.exec(line))) {
		command = mo[1];
	    } else {
		log('Error: bad sexp: ' + line);
		noerror = false;
		continue;
	    };

	    switch (command) {
	    case "enable-debug":
		variables['debugging'] = true;
		break;
	    case "enable-debug-for-key-events":
		variables['debugKeyEvents'] = true;
		break;
	    case "enable-debug-goto-next-page":
		variables['debugGotoNextPage'] = true;
		break;
	    case "enable-debug-special-case":
		variables['debugSpecialCase'] = true;
		break;
	    case "enable-debug-for-a-tag":
		variables['debugATag'] = true;
		break;
	    case "enable-debug-for-domain-check":
		variables['debugDomainCheck'] = true;
		break;
	    case "enable-debug-for-content-editable":
		variables['debugContentEditable'] = true;
		break;
	    case "enable-debug-for-iframe":
		variables['debugIFrame'] = true;
		break;
	    case "disable-debug":
		variables['debugging'] = false;
		break;
	    case "unbind-all":
		// clear all bindings
		bindings = {};
		break;
	    case "bind":
		r = function () {
		    var bind_pattern = /\(bind\s+"(.*)"\s+'?([^'\s]*)\s*\)/;
		    var mo = bind_pattern.exec(line);
		    var key, command;

		    if (! mo) {
			log('Error: bind: not well formed: ' + line);
			noerror = false;
			return;
		    };
		    key = mo[1];
		    command = mo[2];
		    if (key.indexOf(' ') !== -1) {
			log('Warning: bind: key sequence is not supported: ' +
			    key);
		    };
		    if (! isValidCommand(command)) {
			log('Error: bind: invalid command: ' + command);
			noerror = false;
		    }
		    if (bindings.hasOwnProperty(key)) {
			if (bindings[key] !== command) {
			    log('Warning: bind: overwrite existing binding (' +
				key + ', ' + bindings[key] + ')');
			} else {
			    log('Warning: bind: duplicate binding (' +
				key + ', ' + bindings[key] + ')');
			}
		    }
		    bindings[key] = command;
		}();
		break;
	    default:
		log('Error: unknown command: ' + command);
		noerror = false;
	    };
	}
	return {
	    bindings: bindings,
	    logs: logs,
	    ok: noerror,
	    variables: variables
	};
    };

    /**
     * clear user config.
     */
    let clearUserConfig = function () {
	let removeKey = store.remove([STORAGE_KEY_USER_CONFIG,
				      STORAGE_KEY_PARSED_CONFIG]);
	removeKey.then(function () {
	    setLog("user config removed, using built-in config now");
	}, function (error) {
	    setLog("remove user config failed: " + error);
	});
    };

    /**
     * save user configuration and reload config.
     */
    let saveAndReload = function () {
	let newUserConfig = document.getElementById('user-config').value;
	if (newUserConfig.trimRight() === "") {
	    // clear user config. use system default config.
	    clearUserConfig();
	    return;
	}
	let parsedUserConfig = parseUserConfig(newUserConfig);
	if (! parsedUserConfig.ok) {
	    log("parse failed. user config not saved.");
	    return;
	}
	let setKey = store.set({
	    [STORAGE_KEY_USER_CONFIG]: newUserConfig,
	    [STORAGE_KEY_PARSED_CONFIG]: parsedUserConfig
	});
	setKey.then(function () {
	    setLog("user config saved");
	}, function (error) {
	    setLog("save user config failed: " + error);
	});
    };

    let help = function () {
	window.open("usage.html");
    };

    /**
     * fill in initial values.
     */
    let initUI = function () {
	document.getElementById('built-in-config').value = DEFAULT_CONFIG_TEXT;
	showUserConfig();
	document.getElementById('save-and-reload').addEventListener('click', saveAndReload);
	document.getElementById('help').addEventListener('click', help);
    };

    initUI();
})();
