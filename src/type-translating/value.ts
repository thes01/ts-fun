import type { StringEnumValue } from "./enum";
import type { NodeType, NodeTypeToValue, PrimaryType } from "./type";

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
  return value.value as SimplifiedValue<V>;
}

declare const b: AnyValue;

if (b.primary === "number") {
  b.number_type;
}

if (b.primary === "scene_object") {
  if (b.node_type === "field") {
    b.value satisfies 1;
  }
}
