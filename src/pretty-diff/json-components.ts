import { ArrayView } from "./components/json-types/array-view";
import { BooleanView } from "./components/json-types/boolean-view";
import { NullView } from "./components/json-types/null-view";
import { NumberView } from "./components/json-types/number-view";
import { ObjectView } from "./components/json-types/object-view";
import { StringView } from "./components/json-types/string-view";

export const DEFAULT_JSON_COMPONENTS = {
    ArrayView: ArrayView,
    BooleanView: BooleanView,
    NullView: NullView,
    NumberView: NumberView,
    ObjectView: ObjectView,
    StringView: StringView
};
