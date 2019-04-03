import React, { useState, useContext } from "react";
import { TextField } from "../components/text-field";
import { ResetButton } from "../components/reset";
import { Permanent } from "../components/permanent";
import { GroupContext } from "../contexts/group-context";

export const Test1 = () => {
    const [show, setShow] = useState(true);
    const [perm, setPerm] = useState(true);

    const { store } = useContext(GroupContext);

    let lastName = null;
    let lastNamePermanent = null;
    // let lastNameDuplicate = null;
    // const getLastNameField = store.getField("person.lastName");
    // const lastNameValue = getLastNameField == null ? "Tuščias" : getLastNameField.currentValue;

    const [firstNameId, setFirstNameId] = useState("firstName");

    if (show) {
        lastName = (
            <label>
                Last name
                <TextField name="lastName" initialValue="Smith" />
            </label>
        );
        // lastNameDuplicate = <TextField name="lastNameDuplicate" currentValue={lastNameValue} />;
        lastNamePermanent = (
            <label>
                Last name (permanent)
                <TextField name="lastNamePermanent" initialValue="Smith" permanent={perm} />
            </label>
        );
    }
    return (
        <>
            <div>
                <button onClick={() => setShow(!show)}>{!show ? "Mount" : "Unmount"}</button>
                <label>
                    First name
                    <TextField name={firstNameId} initialValue="John" />
                </label>
                {lastName}
                {/* ---------
                {lastNameDuplicate} */}
                {lastNamePermanent}
                <div>
                    <ResetButton>Reset</ResetButton>
                </div>
                <div>
                    <button onClick={() => setPerm(!perm)}>
                        Toggle permanent (current: {`${perm}`})
                    </button>

                    <button onClick={() => store.updateValue("person.firstName", "test")}>
                        Update value ("test")
                    </button>
                    <button
                        onClick={() =>
                            store.updateValue(
                                "person.firstName",
                                store.getField("person.firstName")!.currentValue
                            )
                        }
                    >
                        Update value (current value)
                    </button>
                    <button
                        onClick={() =>
                            firstNameId === "firstName"
                                ? setFirstNameId("anotherName")
                                : setFirstNameId("firstName")
                        }
                    >
                        Change firstName id (break)
                    </button>
                </div>
            </div>
        </>
    );
};
