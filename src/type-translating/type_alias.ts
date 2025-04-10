import type {
  ArrayType,
  BooleanType,
  FunctionType,
  InferValue,
  NodeType,
  NumberType,
  NumberUnitType,
  ObjectType,
  PrimaryType,
  SceneObjectType,
  StringType,
  TypeBase,
  UndefinedType,
  UnionType,
} from "./type";

export type Optional<T extends TypeBase> = UnionType<T, UndefinedType>;

type NumberTypeMap = {
  [K in NumberUnitType]: NumberType<K>;
};

type SceneObjectMap = {
  [K in NodeType]: SceneObjectType<K>;
};

// todo: known object map

interface BaseTypeMap extends NumberTypeMap, SceneObjectMap {
  string: StringType;
  number: NumberType<NumberUnitType>;
  boolean: BooleanType;
  undefined: UndefinedType;
}

type OptionalTypeMap = {
  [K in keyof BaseTypeMap as `${K}?`]: Optional<BaseTypeMap[K]>;
};

type ArrayTypeMap = {
  [K in keyof BaseTypeMap as `${K}[]`]: ArrayType<BaseTypeMap[K]>;
};

interface TypeMap extends BaseTypeMap, OptionalTypeMap, ArrayTypeMap {
  join: FunctionType<{ 0: StringType }, StringType>;
  "list_item[]": ArrayType<ObjectType<{ type: StringType }>>;
}

type TypeAlias = keyof TypeMap;

type InferFromAlias<T extends TypeAlias> = InferValue<TypeMap[T]>;

export type GetType<T extends TypeAlias> = TypeMap[T];

export type InferFrom<T extends TypeAlias | TypeBase> = T extends TypeAlias
  ? InferFromAlias<T>
  : T extends TypeBase
  ? InferValue<T>
  : never;

type _t = InferFrom<"scalar[]">;

declare const a: InferFrom<"string">;
declare const foo: InferFrom<"join">;

const b = foo.value([a]);
