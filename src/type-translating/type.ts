import type { InferStringValue, StringEnumType } from "./enum";
import type {
  AnyValue,
  ArrayValue,
  BooleanValue,
  FunctionValue,
  NumberValue,
  ObjectValue,
  SceneObjectValue,
  StringValue,
  UndefinedValue,
} from "./value";

export type PrimaryType =
  | "string"
  | "number"
  | "boolean"
  | "undefined"
  | "array"
  | "object"
  | "scene_object"
  | "function";

export interface TypeBase {
  primary: PrimaryType | "union" | "unknown";
  specifiers: unknown;
}

export interface StringType<E extends StringEnumType = "string">
  extends TypeBase {
  primary: "string";
  specifiers: {
    enum_type: E;
  };
}

export function string_type<E extends StringEnumType = "string">(
  enum_type?: E
): StringType<E> {
  return {
    primary: "string",
    specifiers: { enum_type: enum_type ?? ("string" as E) },
  };
}

export type NumberUnitType = "scalar" | "length" | "angle";

export interface NumberType<T extends NumberUnitType = "scalar">
  extends TypeBase {
  primary: "number";
  specifiers: {
    number_type: T;
  };
}

export function number_type<T extends NumberUnitType>(
  number_type: T
): NumberType<T> {
  return {
    primary: "number",
    specifiers: { number_type },
  };
}

export interface BooleanType extends TypeBase {
  primary: "boolean";
  specifiers: undefined;
}

export function boolean_type(): BooleanType {
  return {
    primary: "boolean",
    specifiers: undefined,
  };
}

export interface ArrayType<T extends TypeBase = AnyType> extends TypeBase {
  primary: "array";
  specifiers: {
    element_type: T;
  };
}

export function array_type<T extends TypeBase>(element_type: T): ArrayType<T> {
  return {
    primary: "array",
    specifiers: { element_type },
  };
}

export interface ObjectType<
  P extends Record<string, TypeBase> = Record<string, AnyType>
> extends TypeBase {
  primary: "object";
  specifiers: {
    properties: P;
  };
}

export function object_type<P extends Record<string, TypeBase>>(
  properties: P
): ObjectType<P> {
  return {
    primary: "object",
    specifiers: { properties },
  };
}

export interface FunctionType<
  Args extends Record<string, TypeBase> = Record<string, AnyType>,
  O extends TypeBase = AnyType
> extends TypeBase {
  primary: "function";
  specifiers: {
    args: Args;
    output: O;
  };
}

export type NodeType = "field" | "list" | "space";
export interface NodeTypeToValue {
  field: 1;
  list: 2;
  space: 3;
}

export interface SceneObjectType<T extends NodeType = NodeType>
  extends TypeBase {
  primary: "scene_object";
  specifiers: {
    scene_object_type: T;
  };
}

export function scene_object_type<T extends NodeType>(
  scene_object_type: T
): SceneObjectType<T> {
  return {
    primary: "scene_object",
    specifiers: { scene_object_type },
  };
}

export interface UndefinedType extends TypeBase {
  primary: "undefined";
  specifiers: undefined;
}

export function undefined_type(): UndefinedType {
  return {
    primary: "undefined",
    specifiers: undefined,
  };
}

export type InferValue<T extends TypeBase> = T extends StringType<
  infer E extends StringEnumType
>
  ? StringValue<InferStringValue<E>>
  : T extends NumberType<infer U extends NumberUnitType>
  ? NumberValue<U>
  : T extends BooleanType
  ? BooleanValue
  : T extends UndefinedType
  ? UndefinedValue
  : T extends ArrayType<infer U>
  ? ArrayValue<InferValue<U>>
  : T extends ObjectType<infer P>
  ? ObjectValue<InferProperties<P>>
  : T extends SceneObjectType<infer N extends NodeType>
  ? SceneObjectValue<N>
  : T extends FunctionType<infer A, infer O>
  ? FunctionValue<InferProperties<A>, InferValue<O>>
  : T extends UnionType<infer U1, infer U2>
  ? InferValue<U1> | InferValue<U2>
  : T extends UnknownType
  ? AnyValue
  : never;

type InferProperties<P extends Record<string, TypeBase>> = {
  [K in keyof P]: InferValue<P[K]>;
};

export interface UnionType<T1 extends TypeBase, T2 extends TypeBase>
  extends TypeBase {
  primary: "union";
  specifiers: {
    t1: T1;
    t2: T2;
  };
}

export function union_type<T1 extends TypeBase, T2 extends TypeBase>(
  t1: T1,
  t2: T2
): UnionType<T1, T2> {
  return {
    primary: "union",
    specifiers: { t1, t2 },
  };
}

type OptionalType<T extends TypeBase> = UnionType<T, UndefinedType>;

export function optional_type<T extends TypeBase>(type: T): OptionalType<T> {
  return union_type(type, undefined_type());
}

export interface UnknownType extends TypeBase {
  primary: "unknown";
  specifiers: undefined;
}

export function unknown_type(): UnknownType {
  return {
    primary: "unknown",
    specifiers: undefined,
  };
}

// TODO: rename
export type AnyType =
  | StringType
  | NumberType
  | BooleanType
  | UndefinedType
  | ArrayType
  | ObjectType
  | SceneObjectType
  | FunctionType;
