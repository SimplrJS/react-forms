import React, { useState, useEffect, ErrorInfo } from "react";
import ReactDOM from "react-dom";
import { TextField } from "./components/text-field";
import { GroupStoreMutable } from "./stores/group-store";
import { GroupContext, GroupContextObject } from "./contexts/group-context";
import { useForceUpdate } from "./force-update";

import "./reset.scss";
import "./app.scss";
import { Test1 } from "./tests/test1";

const store = new GroupStoreMutable();
const Test = () => {
    const forceUpdate = useForceUpdate();
    useEffect(() => {
        const listener = () => {
            forceUpdate();
        };
        forceUpdate();
        store.addListener(listener);
        return () => store.removeListener(listener);
    }, []);

    const groupContext: GroupContextObject = {
        store: store,
        test: "app",
        groupId: "person"
    };

    return (
        <>
            <div className="forms">
                <GroupContext.Provider value={groupContext}>
                    <Test1 />
                </GroupContext.Provider>
            </div>
            <div className="store">
                <pre>
                    {JSON.stringify(
                        store,
                        // tslint:disable-next-line:no-any
                        (_, value: any) => {
                            if (typeof value !== "function") {
                                return value;
                            }

                            return `${value.name}()`;
                        },
                        4
                    )}
                </pre>
            </div>
            <div className="store-result">
                {JSON.stringify(store.toObject(), null, 4)}
            </div>
        </>
    );
};

interface State {
    error?: Error;
    info?: ErrorInfo;
}

class App extends React.Component {
    public state: State = {};

    public componentDidCatch(error: Error, info: ErrorInfo): void {
        this.setState(() => ({
            error: error,
            info: info
        }));
    }

    public render(): JSX.Element {
        const { error } = this.state;
        if (error != null) {
            const info = this.state.info!;
            console.warn(error.message);
            console.log(info);
            return (
                <div className="error">
                    <p className="disclaimer">
                        Oops! An error has occurred! Here’s what we know…
                    </p>
                    <p className="message">{error.message}</p>
                    <p className="component-stack">
                        Component stack:
                        <pre>{info.componentStack.substr(1)}</pre>
                    </p>
                </div>
            );
        }

        return <Test />;
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
