```tsx

const indexes = [0, 1, 2, 3];

const fieldsArrayUsage = 
<FieldsArray>
    {indexes.map(index => <div arrayKey={`my-array`} index={Number(index)}>
        
    </div>)}
</FieldsArray>

export a = () =>
<Permanent>
    <Form>
        <TextField name="firstName" initialValue={initialValue}>
            <UppercaseNormalizer />
            <DebounceValidator value={1000} />
            <TextValidator text="John" errorMessage="You ain't John!" />
        </TextField>

        <NumberField name="age" />


        <Converter convert={obj => `${obj.firstName} ${obj.lastName}`}>
            <FieldGroup>
                <TextField name="firstName" />
                <TextField name="lastName" />
            </FieldGroup>
        </Converter>



    </Form>
</Permanent>

const result = {
    firstName: "John",
    age: ""
}

```
