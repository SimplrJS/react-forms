"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var BaseValidator = (function (_super) {
    __extends(BaseValidator, _super);
    function BaseValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseValidator.SimplrValidationValidatorComponent = function () { };
    BaseValidator.prototype.SkipValidation = function (value) {
        return (value == null || value === "");
    };
    BaseValidator.prototype.Valid = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    BaseValidator.prototype.Invalid = function (error) {
        return new Promise(function (resolve, reject) {
            reject(error);
        });
    };
    BaseValidator.prototype.ValidSync = function () {
        return;
    };
    BaseValidator.prototype.InvalidSync = function (error) {
        return error;
    };
    BaseValidator.prototype.render = function () {
        return null;
    };
    return BaseValidator;
}(React.Component));
exports.BaseValidator = BaseValidator;
