<p align="right">
    <a href="https://npmjs.org/package/simplr-validation">
        <img src="https://img.shields.io/npm/v/simplr-validation.svg?style=flat-square" alt="version" />
    </a>
    <a href="https://npmjs.org/package/simplr-validation">
        <img src="https://img.shields.io/npm/l/simplr-validation.svg?style=flat-square" alt="license" />
    </a>
</p>

<h1 align="center">simplr-validation</h1>

_This readme is WIP. There may be some inconsistency._

This package subscribes to `@simplr/react-forms` store and it will validate on emitted actions.

## Features
- Validates fields on form store actions (`FieldRegistered`, `ValueChanged`, `PropsChanged`)
- Subscribes to form store handler and form stores to listen actions
- Premade validators like: _Email_, _Required_, _Contains_ etc.

## Get started

To initialise module you need to import subscriber once in your app.

```typescript
import { Subscriber } from "simplr-validation";

Subscriber.SubscriberContainer;
```

## Validators example

```tsx
import { Form, Text, Password } from "@simplr/react-forms-dom";
import { RequiredValidator, EmailValidator } from "simplr-validation/validators";

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
