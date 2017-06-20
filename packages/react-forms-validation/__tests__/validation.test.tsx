import * as React from "react";

import { FormStore } from "@simplr/react-forms/stores";

import * as Validation from "../src/utils/validation";
import { ContainsValidator } from "../src/validators/index";
import { ValidationFieldErrorTemplate } from "../src/contracts";
import * as sinon from "Sinon";
import { FormError } from "@simplr/react-forms/contracts";

it("Validate value without errors", async done => {
    try {
        const errorMessage = "error message";
        const validValue = "p-ok";
        const fieldId = "field-id";
        const formStore = new FormStore("form-id");

        const children = [
            <ContainsValidator value="ok" error={errorMessage} />,
            <input type="text" />
        ];
        const validationPromise = Validation.ValidateField(children, validValue, fieldId, formStore);
        let validationResponse;

        validationResponse = await validationPromise;
        expect(validationResponse).toBeUndefined();

        done();
    } catch (error) {
        done.fail(error);
    }
});

it("Validate value with error", async done => {
    const errorMessage = "error message";
    const invalidValue = "invalid-value";
    const fieldId = "field-id";
    const formStore = new FormStore("form-id");

    const children = [
        <ContainsValidator value="ok" error={errorMessage} />,
        <input type="text" />
    ];
    const validationPromise = Validation.ValidateField(children, invalidValue, fieldId, formStore);
    let validationResponse;

    try {
        await validationPromise;
    } catch (error) {
        validationResponse = error;
    }

    try {
        expect(validationResponse).toBe(errorMessage);
        done();
    } catch (error) {
        done.fail(error);
    }
});

fit("Validate value with error template", async done => {
    const invalidValue = "invalid-value";
    const fieldId = "field-id";
    const formStore = new FormStore("form-id");
    const errorTemplate: ValidationFieldErrorTemplate = (tFieldId, tFormStore) =>
        `${tFieldId} error template`;
    const spyCallback = sinon.spy(errorTemplate);

    const children = [
        <ContainsValidator value="ok" error={spyCallback} />,
        <input type="text" />
    ];
    const validationPromise = Validation.ValidateField(children, invalidValue, fieldId, formStore);
    let validationResponse: FormError | undefined = undefined;

    try {
        await validationPromise;
    } catch (error) {
        validationResponse = error;
    }

    try {
        expect(spyCallback.called).toBe(true);
        expect(validationResponse).toBeDefined();
        expect(validationResponse!.Message).toBe(errorTemplate(fieldId, formStore));
        done();
    } catch (error) {
        done.fail(error);
    }
});
