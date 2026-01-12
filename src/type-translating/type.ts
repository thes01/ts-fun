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
  primary_type: PrimaryType | "union" | "unknown";
  specifiers: unknown;
}

export interface StringType<E extends StringEnumType = "string">
  extends TypeBase {
  primary_type: "string";
  specifiers: {
    enum_type: E;
  };
}

export function string_type<E extends StringEnumType = "string">(
  enum_type?: E
): StringType<E> {
  return {
    primary_type: "string",
    specifiers: { enum_type: enum_type ?? ("string" as E) },
  };
}

export type NumberUnitType = "scalar" | "length" | "angle";

export interface NumberType<T extends NumberUnitType = "scalar">
  extends TypeBase {
  primary_type: "number";
  specifiers: {
    number_type: T;
  };
}

export function number_type<T extends NumberUnitType>(
  number_type: T
): NumberType<T> {
  return {
    primary_type: "number",
    specifiers: { number_type },
  };
}

export interface BooleanType extends TypeBase {
  primary_type: "boolean";
  specifiers: undefined;
}

export function boolean_type(): BooleanType {
  return {
    primary_type: "boolean",
    specifiers: undefined,
  };
}

export interface ArrayType<T extends TypeBase = ExType> extends TypeBase {
  primary_type: "array";
  specifiers: {
    element_type: T;
  };
}

export function array_type<T extends TypeOrAlias>(element_type: T): ArrayType<FullType<T>> {
  return {
    primary_type: "array",
    specifiers: { element_type: get_full_type(element_type) },
  };
}

export interface ObjectType<
  P extends Record<string, TypeBase> = Record<string, ExType>
> extends TypeBase {
  primary_type: "object";
  specifiers: {
    properties: P;
  };
}

export function object_type<P extends Record<string, TypeBase>>(
  properties: P
): ObjectType<P> {
  return {
    primary_type: "object",
    specifiers: { properties },
  };
}

export interface FunctionType<
  Args extends Record<string, TypeBase> = Record<string, ExType>,
  O extends TypeBase = ExType
> extends TypeBase {
  primary_type: "function";
  specifiers: {
    args: Args;
    output: O;
  };
}

// Mock interface
export type NodeType = "field" | "list" | "space";
export interface NodeTypeToValue {
  field: 1;
  list: 2;
  space: 3;
}

export interface SceneObjectType<T extends NodeType = NodeType>
  extends TypeBase {
  primary_type: "scene_object";
  specifiers: {
    scene_object_type: T;
  };
}

export function scene_object_type<T extends NodeType>(
  scene_object_type: T
): SceneObjectType<T> {
  return {
    primary_type: "scene_object",
    specifiers: { scene_object_type },
  };
}

export interface UndefinedType extends TypeBase {
  primary_type: "undefined";
  specifiers: undefined;
}

export function undefined_type(): UndefinedType {
  return {
    primary_type: "undefined",
    specifiers: undefined,
  };
}

export type InferValueFromType<T extends TypeBase> = T extends StringType<
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
  ? ArrayValue<InferValueFromType<U>>
  : T extends ObjectType<infer P>
  ? ObjectValue<InferProperties<P>>
  : T extends SceneObjectType<infer N extends NodeType>
  ? SceneObjectValue<N>
  : T extends FunctionType<infer A, infer O>
  ? FunctionValue<InferProperties<A>, InferValueFromType<O>>
  : T extends UnionType<infer U>
  ? InferValueFromType<U[number]>
  : T extends UnknownType
  ? AnyValue
  : never;

type InferProperties<P extends Record<string, TypeBase>> = {
  [K in keyof P]: InferValueFromType<P[K]>;
};

export interface UnionType<T extends readonly TypeBase[]>
  extends TypeBase {
  primary_type: "union";
  specifiers: {
    types: T;
  };
}

export function union_type<const T extends readonly TypeBase[]>(
  types: T
): UnionType<T> {
  return {
    primary_type: "union",
    specifiers: { types },
  };
}

type OptionalType<T extends TypeOrAlias> = UnionType<[FullType<T>, UndefinedType]>;

export function optional_type<T extends TypeOrAlias>(type: T): OptionalType<T> {
  return union_type([get_full_type(type), undefined_type()]);
}

export interface UnknownType extends TypeBase {
  primary_type: "unknown";
  specifiers: undefined;
}

export function unknown_type(): UnknownType {
  return {
    primary_type: "unknown",
    specifiers: undefined,
  };
}

// TODO: rename
export type ExType =
  | StringType
  | NumberType
  | BooleanType
  | UndefinedType
  | ArrayType
  | ObjectType
  | SceneObjectType
  | FunctionType;

const number_type_map = {
  scalar: number_type("scalar"),
  length: number_type("length"),
  angle: number_type("angle"),
};

const scene_object_map = {
  field: scene_object_type("field"),
  list: scene_object_type("list"),
  space: scene_object_type("space"),
};

const type_map = {
  ...number_type_map,
  ...scene_object_map,
  string: string_type("string"),
  number: number_type("scalar"),
  boolean: boolean_type(),
  undefined: undefined_type(),
  unknown: unknown_type(),
};


type TypeMap = typeof type_map;
type TypeAlias = keyof TypeMap;
// TODO: might not be necessary
interface TTypeMap extends TypeMap {
  [key: string]: TypeBase;
}
type AliasToType<T extends string> = TTypeMap[T];

// TODO: Rename
type TypeOrAlias = TypeBase | TypeAlias;

type FullType<T extends TypeBase | string> = T extends string ? AliasToType<T> : T;

export function get_full_type<T extends TypeBase | TypeAlias, Result = FullType<T>>(type: T): Result {
  if (typeof type === "string") {
    return type_map[type as TypeAlias] as Result;
  }
  return type as unknown as Result;
}