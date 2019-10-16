import { useState, useEffect } from "react";

export function useDiff<TValue>(value: TValue): { prevState: TValue; state: TValue } {
    const [prevValue, setPrevValue] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPrevValue(value);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [value]);

    return {
        prevState: prevValue,
        state: value
    };
}
