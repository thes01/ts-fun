import {
  array_type,
  boolean_type,
  number_type,
  object_type,
  scene_object_type,
  string_type,
  undefined_type,
  unknown_type,
  type AnyType,
  type ArrayType,
  type FunctionType,
  type InferValueFromType,
  type ObjectType,
  type StringType,
  type TypeBase,
  type UndefinedType,
  type UnionType,
  type UnknownType,
} from "./type";

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

const base_type_map = {
  ...number_type_map,
  ...scene_object_map,
  string: string_type("string"),
  number: number_type("scalar"),
  boolean: boolean_type(),
  undefined: undefined_type(),
  unknown: unknown_type(),
};

const type_map = {
  ...base_type_map,
  "list_item[]": array_type(object_type({ type: string_type("string") })),
};

type TypeMap = typeof type_map;

interface TTypeMap extends TypeMap {
  [key: string]: TypeBase;
}

export type TypeAlias = keyof TypeMap;

export type AliasToType<T extends string> = TTypeMap[T];

export function alias_to_type<T extends TypeAlias>(alias: T): AliasToType<T> {
  return type_map[alias];
}

export type InferFromAlias<T extends string> = InferValueFromType<AliasToType<T>>;

export type InferFrom<T extends string | TypeBase> = T extends string
  ? InferFromAlias<T>
  : T extends TypeBase
  ? InferValueFromType<T>
  : never;

type _t = InferFrom<"unknown">;

declare const a: InferFrom<"string">;
// declare const foo: InferFrom<"join">;
// const b = foo.value([a]);
