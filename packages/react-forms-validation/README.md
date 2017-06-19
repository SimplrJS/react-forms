<div align="center">
  <a href="https://github.com/SimplrJS">
    <img width="200" src="https://user-images.githubusercontent.com/7989797/27303346-34a5d6fa-5543-11e7-91e8-5b34287d0bc8.png" />
  </a>
</div>
<p align="center">
    <a href="https://npmjs.org/package/@simplr/react-forms/validation">
        <img src="https://img.shields.io/npm/v/@simplr/react-forms-validation.svg?style=flat-square" alt="version" />
    </a>
    <a href="https://npmjs.org/package/@simplr/react-forms/validation">
        <img src="https://img.shields.io/npm/l/@simplr/react-forms-validation.svg?style=flat-square" alt="license" />
    </a>
</p>

<h1 align="center">@simplr/react-forms-validation</h1>

This package subscribes to `@simplr/react-forms` store and it will validate on emitted actions.

## Features
- Validates fields on form store actions (`FieldRegistered`, `ValueChanged`, `PropsChanged`)
- Subscribes to form store handler and form stores to listen actions
- Premade validators like: _Email_, _Required_, _Contains_ etc.

## Get started

To initialise module you need to import subscriber once in your app.

```typescript
import { InitializeValidation } from "@simplr/react-forms-validation";

InitializeValidation();
```

## Validators example

```tsx
import { Form, Text, Password } from "@simplr/react-forms-dom";
import { RequiredValidator, EmailValidator } from "@simplr/react-forms-validation";

export function LoginForm(props: {}) {
        return <Form>
            <Text name="username">
                <RequiredValidator error="Username field is required" />
                <EmailValidator error="Username is not valid" />
            </Text>
            <Password name="password">
                <RequiredValidator error="Password field is required" />
            </Password>
            <button>Submit</button>
        </Form>;
    }
}

```
