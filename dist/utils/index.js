"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byRepo2TargetPath = exports.gitPull = exports.mkdir = exports.isExist = exports.gitClone = void 0;
var child_process_1 = require("child_process");
var fs = require("fs");
var path = require("path");
var gitClone = function (repository, target) {
    return new Promise(function (resolve, reject) {
        child_process_1.exec("git clone " + repository + " " + target, function (err) {
            if (err) {
                console.log(err);
                reject();
            }
            resolve();
        });
    });
};
exports.gitClone = gitClone;
var isExist = function (filePath) {
    try {
        fs.accessSync(filePath);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.isExist = isExist;
var mkdir = function (dir) {
    try {
        fs.mkdirSync(dir);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.mkdir = mkdir;
var gitPull = function (pullPath) {
    var cmd = "git --git-dir=" + path.join(pullPath, '.git') + " --work-tree=" + pullPath + " pull";
    return new Promise(function (resolve, reject) {
        child_process_1.exec(cmd, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};
exports.gitPull = gitPull;
var byRepo2TargetPath = function (filePath) {
    var dirname = path.basename(filePath);
    return dirname.replace('.git', '');
};
exports.byRepo2TargetPath = byRepo2TargetPath;
//# sourceMappingURL=index.js.map