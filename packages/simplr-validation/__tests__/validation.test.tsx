import * as React from "react";

import * as Validation from "../src/validation";
import * as Contracts from "../src/contracts";
import { ContainsValidator } from "../src/validators/index";

it("Validate value without errors", async (done) => {
    const errorMessage = "error message";
    const validValue = "p-ok";
    const children = [
        <ContainsValidator value="ok" errorMessage={errorMessage} />,
        <input type="text" />
    ];
    const validationPromise = Validation.Validate(children, validValue);
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
        <ContainsValidator value="ok" errorMessage={errorMessage} />,
        <input type="text" />
    ];
    const validationPromise = Validation.Validate(children, invvalidValue);
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

it("IsComponentOfType should return true", () => {
    const validator = <ContainsValidator value="ok" errorMessage="error message" />;
    expect(Validation.IsComponentOfType(validator, Contracts.VALIDATOR)).toBe(true);
});

it("IsComponentOfType should return false", () => {
    const component = <input type="text" />;
    expect(Validation.IsComponentOfType(component, Contracts.VALIDATOR)).toBe(false);
});

it("RenderComponents should render components and Validate methods MUST be reachable", () => {
    const validators = [<ContainsValidator value="ok" errorMessage="error message" />];
    const renderedComponents = Validation.RenderComponents<Contracts.Validator>(validators);

    expect(renderedComponents.length).toBe(1);
    expect(renderedComponents[0].Validate).not.toBeUndefined();
    expect(renderedComponents[0].Validate("p-ok")).toBeUndefined();
});
