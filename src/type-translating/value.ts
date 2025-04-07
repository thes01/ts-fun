import type { StringEnumValue } from "./enum";
import type { PrimaryType } from "./type";

export interface ValueBase {
  primary: PrimaryType; // shared with expression primary
  value: unknown;
}

export type NumberUnitValue = undefined | "mm" | "deg";

export interface NumberValue<U extends NumberUnitValue = undefined>
  extends ValueBase {
  primary: "number";
  value: number;
  unit: U;
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

//

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
  Args extends Record<string, ValueBase> = {},
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

export type RawValue<V extends ValueBase> = V extends ArrayValue<infer E>
  ? RawValue<E>[]
  : V extends ObjectValue<infer P>
  ? { [K in keyof P]: RawValue<P[K]> }
  : V["value"];

export function get_raw_value<V extends AnyValue>(value: V): RawValue<V> {
  if (value.primary === "array") {
    return value.value.map((v) => get_raw_value(v)) as RawValue<V>;
  }
  if (value.primary === "object") {
    return Object.fromEntries(
      Object.entries(value.value).map(([k, v]) => [k, get_raw_value(v)])
    ) as RawValue<V>;
  }
  return value.value as RawValue<V>;
}
