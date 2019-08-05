import "@babel/polyfill";

import React, { useState, useEffect, ErrorInfo, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
import { MD5 } from "object-hash";
import { GroupStoreMutable } from "./stores/group-store";
import { GroupContext, GroupContextObject } from "./contexts/group-context";
// import { useForceUpdate } from "./force-update";
import { Test1 } from "./tests/test1";
import { Test2 } from "./tests/test2";

import "./reset.scss";
import "./app.scss";
import { JsonView } from "./pretty-diff";
import { JsonType } from "./pretty-diff/contracts";

const store = new GroupStoreMutable();

// tslint:disable-next-line:no-any
(window as any).store = store;

function useStoreHash(): [TestState, () => void] {
    const [state, setState] = useState<TestState>({
        storeObject: undefined,
        store: {},
        hash: ""
    });

    const updateStoreHash = useCallback(() => {
        const storeObject = store.toObject();
        const hash = MD5({
            storeHash: MD5(store),
            storeObjectHash: MD5(storeObject)
        });
        if (state.hash === hash) {
            return;
        }
        setState({
            storeObject: storeObject,
            store: store,
            hash: hash
        });
    }, [store]);

    return [state, updateStoreHash];
}

interface TestState {
    storeObject?: unknown;
    store: unknown;
    hash: string;
}

let done = false;
const Test = () => {
    const [state, updateStoreHash] = useStoreHash();
    if (!done) {
        console.log("Initial render.");
        done = true;
    }

    useEffect(() => {
        const listener = () => {
            console.log("State updated");
            updateStoreHash();
        };
        console.log("First update...");
        updateStoreHash();
        store.addListener(listener);
        return () => store.removeListener(listener);
    }, []);

    const [groupId] = useState(undefined);
    // const [groupId] = useState("person");

    const groupContext: GroupContextObject = {
        store: store,
        groupId: groupId
    };

    return (
        <>
            <div className="forms">
                <GroupContext.Provider value={groupContext}>
                    {/* <Test1 /> */}
                    <Test2 />
                </GroupContext.Provider>
            </div>
            <div className="store">
                <pre>
                    {/* {JSON.stringify(
                        state.store,
                        // tslint:disable-next-line:no-any
                        (_, value: any) => {
                            if (typeof value !== "function") {
                                return value;
                            }

                            return `${value.name}()`;
                        },
                        4
                    )} */}
                    <JsonView value={state.store as JsonType} />
                </pre>
            </div>
            <div className="store-result">
                <JsonView value={state.storeObject as JsonType} />
            </div>
            {/* <pre className="store-result">{JSON.stringify(state.storeObject, null, 4)}</pre> */}
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
            return (
                <div className="error">
                    <p className="disclaimer">Oops! An error has occurred! Here’s what we know…</p>
                    <pre className="message">{error.message}</pre>
                    <div className="component-stack">
                        Component stack:
                        <pre>{info.componentStack.substr(1)}</pre>
                    </div>

                    <div>
                        <button onClick={() => location.reload()}>Reload page</button>
                    </div>
                </div>
            );
        }

        return <Test />;
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
