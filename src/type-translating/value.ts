import type { StringEnumValue } from "./enum";
import type { PrimaryType } from "./type";

export interface ValueBase {
  primary: PrimaryType; // shared with expression primary
  value: unknown;
}

export type NumberType = "scalar" | "length" | "angle";

export interface NumberValue<U extends NumberType = NumberType>
  extends ValueBase {
  primary: "number";
  value: number;
  number_type: U;
}

export interface StringValue<E extends StringEnumValue = string>
  extends ValueBase {
  primary: "string";
  value: E;
}

export interface BooleanValue extends ValueBase {
  primary: "boolean";
  value: boolean;
}

export interface UndefinedValue extends ValueBase {
  primary: "undefined";
  value: undefined;
}

export interface ArrayValue<T extends ValueBase = AnyValue> extends ValueBase {
  primary: "array";
  value: T[];
}

export interface ObjectValue<
  P extends Record<string, ValueBase> = Record<string, AnyValue>
> extends ValueBase {
  primary: "object";
  value: P;
}

export interface FunctionValue<
  Args extends Record<string, AnyValue> = {},
  O extends ValueBase = AnyValue
> {
  primary: "function";
  value: (args: Args) => O;
}

export type AnyValue =
  | StringValue
  | NumberValue
  | BooleanValue
  | UndefinedValue
  | ArrayValue
  | ObjectValue
  | FunctionValue;

export type SimplifiedValue<V extends ValueBase> = V extends ArrayValue<infer E>
  ? SimplifiedValue<E>[]
  : V extends ObjectValue<infer P>
  ? { [K in keyof P]: SimplifiedValue<P[K]> }
  : V["value"];

export function simplify_value<V extends AnyValue>(
  value: V
): SimplifiedValue<V> {
  if (value.primary === "array") {
    return value.value.map((v) => simplify_value(v)) as SimplifiedValue<V>;
  }
  if (value.primary === "object") {
    return Object.fromEntries(
      Object.entries(value.value).map(([k, v]) => [k, simplify_value(v)])
    ) as SimplifiedValue<V>;
  }
  return value.value as SimplifiedValue<V>;
}

// does not work on functions
const a = simplify_value({
  primary: "array",
  value: [{ primary: "boolean", value: true }],
});

declare const b: AnyValue;

if (b.primary === "number") {
  b.number_type;
}
