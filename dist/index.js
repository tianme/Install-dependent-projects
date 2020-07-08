"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
var child_process_1 = require("child_process");
var index_1 = require("./utils/index");
var path = require("path");
var os = require("os");
var ora = require("ora");
var CACHE_DIR = path.resolve(os.homedir(), '.bhc-deps');
var RUN_PATH = './node_modules/@vue/cli-service/bin/vue-cli-service.js';
var runDep = function (filePath, cwd, args) {
    if (args === void 0) { args = ['serve']; }
    return new Promise(function (resolve, reject) {
        var child = child_process_1.fork(filePath, args, {
            cwd: cwd
        });
        child.on('error', function (err) {
            reject(err);
        });
        resolve();
    });
};
var install = function (cwd) { return new Promise(function (resolve, reject) {
    var child = child_process_1.exec('npm i', {
        cwd: cwd
    });
    child.on('exit', function (code) {
        if (code) {
            reject(code);
            return;
        }
        resolve(code);
    });
}); };
var run = function (repoAry) { return __awaiter(void 0, void 0, void 0, function () {
    var runDepList, runCloneList, installList, pullList, _loop_1, i, spinner, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                runDepList = [];
                runCloneList = [];
                installList = [];
                pullList = [];
                _loop_1 = function (i) {
                    var repo = repoAry[i];
                    var tragetPath = path.join(CACHE_DIR, index_1.byRepo2TargetPath(repo));
                    runDepList.push(function () { return runDep(RUN_PATH, tragetPath); });
                    installList.push(function () { return install(tragetPath); });
                    pullList.push(function () { return index_1.gitPull(tragetPath); });
                    if (!index_1.isExist(tragetPath)) {
                        runCloneList.push(index_1.gitClone(repo, tragetPath));
                    }
                };
                for (i = 0; i < repoAry.length; i++) {
                    _loop_1(i);
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                spinner = ora('clone projects...');
                spinner.start();
                return [4 /*yield*/, Promise.all(runCloneList)];
            case 2:
                _a.sent();
                spinner.succeed('clone projects done');
                spinner.text = 'git pull ...';
                spinner.start();
                return [4 /*yield*/, Promise.all(pullList.map(function (item) { return item(); }))];
            case 3:
                _a.sent();
                spinner.succeed('git pull done');
                spinner.text = 'npm install ...';
                spinner.start();
                return [4 /*yield*/, Promise.all(installList.map(function (item) { return item(); }))];
            case 4:
                _a.sent();
                spinner.succeed('npm install done');
                Promise.all(runDepList.map(function (item) { return item(); }));
                return [2 /*return*/, null];
            case 5:
                e_1 = _a.sent();
                console.log(e_1);
                return [2 /*return*/, e_1];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.run = run;
//# sourceMappingURL=index.js.map