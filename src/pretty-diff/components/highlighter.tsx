import React, { useContext, createContext } from "react";
import { animated } from "react-spring";
import { Keyframes } from "react-spring/renderprops";
import { isEqualTypes } from "../helpers";

export enum HighlighterState {
    None = "none",
    New = "new",
    Changed = "changed",
    Removed = "removed"
}

export function getHighlighterState(prev: unknown, current: unknown): HighlighterState {
    if (isEqualTypes(prev, current)) {
        // Same element.
        return HighlighterState.None;
    } else if (prev === undefined && current !== undefined) {
        // Current element is added.
        return HighlighterState.New;
    } else if (prev !== undefined && current === undefined) {
        // Current element is removed.
        return HighlighterState.Removed;
    } else {
        // Element is changed.
        return HighlighterState.Changed;
    }
}

const HighlighterContext = createContext<{ state: HighlighterState; styles?: React.CSSProperties }>({
    state: HighlighterState.None
});

const Container = (Keyframes.Spring({
    [HighlighterState.None]: { backgroundColor: "white", color: "black" },
    [HighlighterState.Changed]: {
        backgroundColor: "#9E3699",
        color: "white"
    },
    [HighlighterState.New]: {
        backgroundColor: "#93AA64",
        color: "white"
    },
    [HighlighterState.Removed]: [
        {
            backgroundColor: "#D13532",
            color: "white"
        },
        { backgroundColor: "white", color: "black" }
    ]
}) as unknown) as (props: { state?: string; children: (styles: React.CSSProperties) => JSX.Element }) => JSX.Element;

export const Highlighter = ({ children, state }: { children: React.ReactNode; state: HighlighterState }) => {
    const parentStyles = useContext(HighlighterContext);

    if (parentStyles.styles != null && parentStyles.state !== HighlighterState.None) {
        return <animated.span style={parentStyles.styles}>{children}</animated.span>;
    }

    return (
        <Container state={state}>
            {styles => (
                <animated.span style={styles} data-state={state}>
                    <HighlighterContext.Provider value={{ state: state, styles: styles }}>{children}</HighlighterContext.Provider>
                </animated.span>
            )}
        </Container>
    );
};
