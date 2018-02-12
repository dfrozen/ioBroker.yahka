var controllerDir;
var appName;

function getAppName() {
    var parts = __dirname.replace(/\\/g, '/').split('/');
    if (parts[parts.length - 2] === 'build') {
        return parts[parts.length - 3].split('.')[0];
    }
    return parts[parts.length - 2].split('.')[0];
}

// Get js-controller directory to load libs
function getControllerDir(isInstall) {
    var fs = require('fs');
    // Find the js-controller location
    // tslint:disable-next-line:no-shadowed-variable
    var controllerDir = __dirname.replace(/\\/g, "/");
    controllerDir = controllerDir.split("/");
    if (controllerDir[controllerDir.length - 4] === "adapter") {
        controllerDir.splice(controllerDir.length - 4, 4);
        controllerDir = controllerDir.join("/");
    }
    else if (controllerDir[controllerDir.length - 4] === "node_modules") {
        controllerDir.splice(controllerDir.length - 4, 4);
        controllerDir = controllerDir.join("/");
        if (fs.existsSync(controllerDir + "/node_modules/iobroker.js-controller")) {
            controllerDir += "/node_modules/iobroker.js-controller";
        }
        else if (fs.existsSync(controllerDir + "/node_modules/ioBroker.js-controller")) {
            controllerDir += "/node_modules/ioBroker.js-controller";
        }
        else if (!fs.existsSync(controllerDir + "/controller.js")) {
            if (!isInstall) {
                console.log("Cannot find js-controller");
                process.exit(10);
            }
            else {
                process.exit();
            }
        }
    }
    else {
        if (!isInstall) {
            console.log("Cannot find js-controller");
            process.exit(10);
        }
        else {
            process.exit();
        }
    }
    return controllerDir;
}

// Read controller configuration file
function getConfig() {
    if (fs.existsSync(controllerDir + '/conf/' + appName + '.json')) {
        return JSON.parse(fs.readFileSync(controllerDir + '/conf/' + appName + '.json'));
    } else if (fs.existsSync(controllerDir + '/conf/' + appName.toLowerCase() + '.json')) {
        return JSON.parse(fs.readFileSync(controllerDir + '/conf/' + appName.toLowerCase() + '.json'));
    } else {
        throw new Error('Cannot find ' + controllerDir + '/conf/' + appName + '.json');
    }
}
appName       = getAppName();
controllerDir = getControllerDir(typeof process !== 'undefined' && process.argv && process.argv.indexOf('--install') !== -1);

exports.controllerDir = controllerDir;
exports.getConfig =     getConfig;
exports.adapter =       require(controllerDir + '/lib/adapter.js');
exports.appName =       appName;
