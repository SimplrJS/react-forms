"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simplr_forms_core_1 = require("simplr-forms-core");
var Immutable = require("immutable");
var form_store_subscriber_1 = require("./form-store-subscriber");
var FormStoreHandlerSubscriber = (function () {
    function FormStoreHandlerSubscriber(fshContainer) {
        if (fshContainer === void 0) { fshContainer = simplr_forms_core_1.Stores.FSHContainer; }
        var _this = this;
        this.fshContainer = fshContainer;
        this.formStoresSubscribers = Immutable.Map();
        this.onFormRegistered = function (action) {
            var formStore = _this.fshContainer.FormStoresHandler.GetStore(action.FormId);
            _this.formStoresSubscribers = _this.formStoresSubscribers
                .set(action.FormId, new form_store_subscriber_1.FormStoreSubscriber(formStore));
        };
        this.onFormUnregistered = function (action) {
            var formStoreSubscriber = _this.formStoresSubscribers.get(action.FormId);
            formStoreSubscriber.RemoveFormListeners();
            _this.formStoresSubscribers = _this.formStoresSubscribers.remove(action.FormId);
        };
        this.formRegisterSubscription = this.formStoresHandler.addListener(simplr_forms_core_1.Actions.FormRegistered, this.onFormRegistered);
        this.formUnregisterSubscription = this.formStoresHandler.addListener(simplr_forms_core_1.Actions.FormUnregistered, this.onFormUnregistered);
    }
    Object.defineProperty(FormStoreHandlerSubscriber.prototype, "formStoresHandler", {
        get: function () {
            return this.fshContainer.FormStoresHandler;
        },
        enumerable: true,
        configurable: true
    });
    return FormStoreHandlerSubscriber;
}());
exports.FormStoreHandlerSubscriber = FormStoreHandlerSubscriber;
