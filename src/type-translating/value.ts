import type { StringEnumValue } from "./enum";
import type { PrimaryType } from "./type";

export interface ValueBase {
  primary: PrimaryType; // shared with expression primary
}

export type NumberUnitValue = undefined | "mm" | "deg";

export interface NumberValue<U extends NumberUnitValue = undefined> {
  primary: "number";
  value: number;
  unit: U;
}

export interface StringValue<E extends StringEnumValue = string> {
  primary: "string";
  value: E;
}

export interface BooleanValue {
  primary: "boolean";
  value: boolean;
}

export interface UndefinedValue {
  primary: "undefined";
  value: undefined;
}

//

export interface ArrayValue<T extends ValueBase = ValueBase> {
  primary: "array";
  value: T[];
}

export interface ObjectValue<P extends Record<string, ValueBase>> {
  primary: "object";
  value: P;
}

export interface FunctionValue<
  Args extends Record<string, ValueBase>,
  O extends ValueBase
> {
  primary: "function";
  value: (args: Args) => O;
}
