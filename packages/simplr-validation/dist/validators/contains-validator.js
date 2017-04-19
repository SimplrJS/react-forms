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
var Validator = require("validator");
var base_validator_1 = require("../abstractions/base-validator");
var ContainsValidator = (function (_super) {
    __extends(ContainsValidator, _super);
    function ContainsValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContainsValidator.prototype.Validate = function (value) {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }
        if (!Validator.contains(value, this.props.value)) {
            return this.InvalidSync(this.props.errorMessage);
        }
        return this.ValidSync();
    };
    return ContainsValidator;
}(base_validator_1.BaseValidator));
exports.ContainsValidator = ContainsValidator;
