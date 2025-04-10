import type { InferStringValue, StringEnumType } from "./enum";
import type { NodeType, NodeTypeToValue, PrimaryType } from "./type";

interface ValueBase {
  primary: PrimaryType;
  value: unknown;
}

export type NumberType = "scalar" | "length" | "angle";

export interface NumberValue<U extends NumberType = NumberType>
  extends ValueBase {
  primary: "number";
  value: number;
  number_type: U;
}

export function number_value(
  value: number,
  number_type: NumberType
): NumberValue {
  return {
    primary: "number",
    value,
    number_type,
  };
}

export const scalar_value = (value: number) => number_value(value, "scalar");
export const length_value = (value: number) => number_value(value, "length");
export const angle_value = (value: number) => number_value(value, "angle");

export interface StringValue<E extends string = string> extends ValueBase {
  primary: "string";
  value: E;
}

export function string_value<E extends StringEnumType = "string">(
  value: InferStringValue<E>,
  _enum_type?: E
): StringValue<InferStringValue<E>> {
  return {
    primary: "string",
    value,
  };
}

export interface BooleanValue extends ValueBase {
  primary: "boolean";
  value: boolean;
}

export function boolean_value(value: boolean): BooleanValue {
  return {
    primary: "boolean",
    value,
  };
}

export interface UndefinedValue extends ValueBase {
  primary: "undefined";
  value: undefined;
}

export function undefined_value(): UndefinedValue {
  return {
    primary: "undefined",
    value: undefined,
  };
}

export interface ArrayValue<T extends ValueBase = AnyValue> extends ValueBase {
  primary: "array";
  value: T[];
}

type UniformArray<T extends ValueBase> = [] | [T, ...NoInfer<T>[]];

export function array_value<T extends ValueBase>(
  values: UniformArray<T>
): ArrayValue<T> {
  return {
    primary: "array",
    value: values,
  };
}

export interface ObjectValue<
  P extends Record<string, ValueBase> = Record<string, AnyValue>
> extends ValueBase {
  primary: "object";
  value: P;
}

export function object_value<P extends Record<string, ValueBase>>(
  value: P
): ObjectValue<P> {
  return {
    primary: "object",
    value,
  };
}

// A little "trick" to make TS happy about narrowing down value by the node_type
type NodeTypeValue = {
  [K in NodeType]: {
    node_type: K;
    value: NodeTypeToValue[K];
  };
}[NodeType];

export type SceneObjectValue<T extends NodeType = NodeType> = NodeTypeValue & {
  primary: "scene_object";
  node_type: T;
  value: NodeTypeToValue[T];
};

export function scene_object_value<T extends NodeType>(
  node_type: T,
  value: NodeTypeToValue[T]
) {
  return {
    primary: "scene_object",
    node_type,
    value,
  } as SceneObjectValue<T>;
}

// "UntypedFunctionValue" - it doesn't have any information about
// the types expected to be passed as arguments
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
  | FunctionValue
  | SceneObjectValue;

export type SimplifiedValue<V extends ValueBase> = V extends ArrayValue<infer E>
  ? SimplifiedValue<E>[]
  : V extends ObjectValue<infer P>
  ? { [K in keyof P]: SimplifiedValue<P[K]> }
  : V["value"];

export function simplify_value<V extends AnyValue>(
  value: V
): SimplifiedValue<V> {
  if (value.primary === "array") {
    return value.value.map(simplify_value) as SimplifiedValue<V>;
  }
  if (value.primary === "object") {
    return Object.fromEntries(
      Object.entries(value.value).map(([k, v]) => [k, simplify_value(v)])
    ) as SimplifiedValue<V>;
  }

  value.value satisfies string | number | boolean | undefined | Function;
  return value.value as SimplifiedValue<V>;
}

// declare const b: AnyValue;

// if (b.primary === "number") {
//   b.number_type;
// }

// if (b.primary === "scene_object") {
//   if (b.node_type === "field") {
//     // YAY!
//     b.value satisfies 1;
//   }
// }
