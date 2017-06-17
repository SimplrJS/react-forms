import * as React from "react";

import * as Validation from "../src/utils/validation";
import { ContainsValidator } from "../src/validators/index";

it("Validate value without errors", async (done) => {
    const errorMessage = "error message";
    const validValue = "p-ok";
    const children = [
        <ContainsValidator value="ok" error={errorMessage} />,
        <input type="text" />
    ];
    const validationPromise = Validation.ValidateField(children, validValue);
    let validationResponse;

    try {
        validationResponse = await validationPromise;
    } catch (error) {
        done.fail(error);
    }

    try {
        expect(validationResponse).toBeUndefined();
        done();
    } catch (error) {
        done.fail(error);
    }
});

it("Validate value with error", async (done) => {
    const errorMessage = "error message";
    const invvalidValue = "invalid-value";
    const children = [
        <ContainsValidator value="ok" error={errorMessage} />,
        <input type="text" />
    ];
    const validationPromise = Validation.ValidateField(children, invvalidValue);
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
