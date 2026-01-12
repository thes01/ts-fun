import type { InferStringValue, StringEnumType } from "./enum";
import type { NodeType, NodeTypeToValue, PrimaryType } from "./type";

interface ValueBase {
  primary_type: PrimaryType;
  value: unknown;
}

export type NumberType = "scalar" | "length" | "angle";

export interface NumberValue<U extends NumberType = NumberType>
  extends ValueBase {
  primary_type: "number";
  value: number;
  number_type: U;
}

export function number_value(
  value: number,
  number_type: NumberType
): NumberValue {
  return {
    primary_type: "number",
    value,
    number_type,
  };
}

export const scalar_value = (value: number) => number_value(value, "scalar");
export const length_value = (value: number) => number_value(value, "length");
export const angle_value = (value: number) => number_value(value, "angle");

export interface StringValue<E extends string = string> extends ValueBase {
  primary_type: "string";
  value: E;
}

export function string_value<E extends StringEnumType = "string">(
  value: InferStringValue<E>,
  _enum_type?: E
): StringValue<InferStringValue<E>> {
  return {
    primary_type: "string",
    value,
  };
}

export interface BooleanValue extends ValueBase {
  primary_type: "boolean";
  value: boolean;
}

export function boolean_value(value: boolean): BooleanValue {
  return {
    primary_type: "boolean",
    value,
  };
}

export interface UndefinedValue extends ValueBase {
  primary_type: "undefined";
  value: undefined;
}

export function undefined_value(): UndefinedValue {
  return {
    primary_type: "undefined",
    value: undefined,
  };
}

export interface ArrayValue<T extends ValueBase = AnyValue> extends ValueBase {
  primary_type: "array";
  value: T[];
}

type UniformArray<T extends ValueBase> = [] | [T, ...NoInfer<T>[]];

export function array_value<T extends ValueBase>(
  values: UniformArray<T>
): ArrayValue<T> {
  return {
    primary_type: "array",
    value: values,
  };
}

export interface ObjectValue<
  P extends Record<string, ValueBase> = Record<string, AnyValue>
> extends ValueBase {
  primary_type: "object";
  value: P;
}

export function object_value<P extends Record<string, ValueBase>>(
  value: P
): ObjectValue<P> {
  return {
    primary_type: "object",
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
  primary_type: "scene_object";
  node_type: T;
  value: NodeTypeToValue[T];
};

export function scene_object_value<T extends NodeType>(
  node_type: T,
  value: NodeTypeToValue[T]
) {
  return {
    primary_type: "scene_object",
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
  primary_type: "function";
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
  if (value.primary_type === "array") {
    return value.value.map(simplify_value) as SimplifiedValue<V>;
  }
  if (value.primary_type === "object") {
    return Object.fromEntries(
      Object.entries(value.value).map(([k, v]) => [k, simplify_value(v)])
    ) as SimplifiedValue<V>;
  }

  value.value satisfies string | number | boolean | undefined | Function;
  return value.value as SimplifiedValue<V>;
}

declare const a: FunctionValue<{ x: NumberValue }, NumberValue>;