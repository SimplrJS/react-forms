"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var fs = require("mz/fs");
var path = require("path");
var mkdirp = require("mkdirp");
function move(from, to, recursively, removeFromDirectory, rootFrom) {
    if (recursively === void 0) { recursively = true; }
    if (removeFromDirectory === void 0) { removeFromDirectory = true; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var files, _loop_1, _i, files_1, file, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    from = path.resolve(from);
                    to = path.resolve(to);
                    rootFrom = rootFrom || from;
                    return [4 /*yield*/, fs.readdir(from)];
                case 1:
                    files = _a.sent();
                    _loop_1 = function (file) {
                        var stats, fileResolved, fromDirectory, toDirectory, toFile, err_2, fromDirectory_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fs.stat(path.join(from, file))];
                                case 1:
                                    stats = _a.sent();
                                    if (!stats.isFile()) return [3 /*break*/, 6];
                                    fileResolved = path.resolve(from, file);
                                    fromDirectory = path.dirname(fileResolved);
                                    toDirectory = fromDirectory.replace(rootFrom, to);
                                    toFile = path.join(toDirectory, fileResolved.replace(fromDirectory, ""));
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 5, , 6]);
                                    return [4 /*yield*/, mkdirpAsync(toDirectory)];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, fs.rename(fileResolved, toFile)];
                                case 4:
                                    _a.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_2 = _a.sent();
                                    console.info(err_2);
                                    return [3 /*break*/, 6];
                                case 6:
                                    if (!stats.isDirectory()) return [3 /*break*/, 9];
                                    if (!(recursively === true)) return [3 /*break*/, 9];
                                    fromDirectory_1 = path.join(from, file);
                                    return [4 /*yield*/, tryAndRetry(function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, move(fromDirectory_1, to, recursively, removeFromDirectory, from)];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 7:
                                    _a.sent();
                                    if (!(removeFromDirectory === true && fs.existsSync(fromDirectory_1))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, waitForEmptyAndRemoveDirAsync(fromDirectory_1)];
                                case 8:
                                    _a.sent();
                                    _a.label = 9;
                                case 9: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, files_1 = files;
                    _a.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 5];
                    file = files_1[_i];
                    return [5 /*yield**/, _loop_1(file)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (!(removeFromDirectory === true && fs.existsSync(from))) return [3 /*break*/, 7];
                    return [4 /*yield*/, waitForEmptyAndRemoveDirAsync(from)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    console.error("That's an error: ", JSON.stringify(err_1));
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.move = move;
function mkdirpAsync(dir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    mkdirp(dir, function (err, made) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(made);
                    });
                })];
        });
    });
}
function waitForEmptyAndRemoveDirAsync(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = fs.readdirSync(dir);
                    _a.label = 1;
                case 1:
                    if (!(files.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, sleep(10)];
                case 2:
                    _a.sent();
                    if (fs.existsSync(dir)) {
                        files = fs.readdirSync(dir);
                    }
                    else {
                        files = [];
                    }
                    return [3 /*break*/, 1];
                case 3:
                    if (fs.existsSync(dir)) {
                        fs.rmdirSync(dir);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function sleep(milliseconds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(resolve, milliseconds);
                })];
        });
    });
}
function rmdir(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var list, i, filename, stat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readdir(dir)];
                case 1:
                    list = _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < list.length)) return [3 /*break*/, 9];
                    filename = path.join(dir, list[i]);
                    return [4 /*yield*/, fs.stat(filename)];
                case 3:
                    stat = _a.sent();
                    if (!(filename === "." || filename === "..")) return [3 /*break*/, 4];
                    return [3 /*break*/, 8];
                case 4:
                    if (!stat.isDirectory()) return [3 /*break*/, 6];
                    // rmdir recursively
                    return [4 /*yield*/, rmdir(filename)];
                case 5:
                    // rmdir recursively
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6: 
                // rm fiilename
                return [4 /*yield*/, fs.unlink(filename)];
                case 7:
                    // rm fiilename
                    _a.sent();
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 2];
                case 9: return [4 /*yield*/, fs.exists(dir)];
                case 10:
                    if (!_a.sent()) return [3 /*break*/, 12];
                    return [4 /*yield*/, fs.rmdir(dir)];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    });
}
function tryAndRetry(action, maxTries) {
    if (maxTries === void 0) { maxTries = 5; }
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 2, , 4]);
                    action();
                    return [3 /*break*/, 5];
                case 2:
                    err_3 = _a.sent();
                    return [4 /*yield*/, sleep(10)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 0];
                case 5: return [2 /*return*/];
            }
        });
    });
}
