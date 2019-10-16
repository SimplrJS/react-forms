/* eslint-disable */

import { useMemo, useReducer } from "react";

type VoidFunction = () => void;

const reducer = (state: boolean, _action: null): boolean => !state;

export const useForceUpdate = (): VoidFunction => {
    const [, dispatch] = useReducer(reducer, false);

    // Turn dispatch(required_parameter) into dispatch().
    const memoizedDispatch = useMemo(
        (): VoidFunction => (): void => {
            dispatch(null);
        },
        [dispatch]
    );
    return memoizedDispatch;
};
