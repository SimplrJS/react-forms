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
var base_validator_1 = require("../abstractions/base-validator");
var RequiredValidator = (function (_super) {
    __extends(RequiredValidator, _super);
    function RequiredValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RequiredValidator.prototype.isString = function (value) {
        return typeof value === "string";
    };
    RequiredValidator.prototype.isArray = function (value) {
        return {}.toString.call(value) === "[object Array]";
    };
    RequiredValidator.prototype.isObject = function (value) {
        return value === Object(value);
    };
    RequiredValidator.prototype.Validate = function (value) {
        if (value == null) {
            return this.InvalidSync(this.props.errorMessage);
        }
        if (this.isString(value) &&
            value.trim().length === 0) {
            return this.InvalidSync(this.props.errorMessage);
        }
        if (this.isArray(value) &&
            value.length === 0) {
            return this.InvalidSync(this.props.errorMessage);
        }
        if (this.isObject(value) &&
            Object.keys(value).length === 0) {
            return this.InvalidSync(this.props.errorMessage);
        }
        return this.ValidSync();
    };
    return RequiredValidator;
}(base_validator_1.BaseValidator));
exports.RequiredValidator = RequiredValidator;
