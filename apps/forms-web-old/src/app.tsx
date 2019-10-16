import "@babel/polyfill";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect, ErrorInfo, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";

import "./reset.scss";
import "./app.scss";
import { FormStore } from "./stores/form-store";

const store = new FormStore();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).store = store;

const Test = (): JSX.Element => {
    const [storeState, setStoreState] = useState(store.getState());

    useEffect(() => {
        return store.addListener(() => {
            setStoreState(store.getState());
        });
    }, [setStoreState]);

    return (
        <>
            <div className="forms">
                {/* <GroupContext.Provider value={groupContext}>
                <Test1 />
            </GroupContext.Provider> */}
            </div>
            <div className="store">
                <pre>
                    {JSON.stringify(
                        store,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                <pre>{JSON.stringify(store, null, 4)}</pre>
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const info = this.state.info!;
            return (
                <div className="error">
                    <p className="disclaimer">Oops! An error has occurred! Here’s what we know…</p>
                    <pre className="message">{error.message}</pre>
                    <div className="component-stack">
                        Component stack:
                        <pre>{info.componentStack.substr(1)}</pre>
                    </div>

                    <div>
                        <button type="button" onClick={() => location.reload()}>
                            Reload page
                        </button>
                    </div>
                </div>
            );
        }

        return <Test />;
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
