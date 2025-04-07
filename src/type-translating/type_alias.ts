import type {
  InferValue,
  ObjectType,
  StringType,
  TypeBase,
  UndefinedType,
  UnionType,
} from "./type";

export type Optional<T extends TypeBase> = UnionType<T, UndefinedType>;

interface TypeAliasMap {
  string: StringType;
  "string?": Optional<StringType>;

  my_object: ObjectType<{
    a: StringType<"string">;
    b: Optional<StringType<"string_axis_2">>;
    c: Optional<StringType>;
  }>;
}

type TypeAlias = keyof TypeAliasMap;

type InferFromAlias<T extends TypeAlias> = InferValue<TypeAliasMap[T]>;

type _t = InferFromAlias<"my_object">["value"]["b"]["value"];
