import type {
  ArrayType,
  BooleanType,
  FunctionType,
  InferValue,
  NumberType,
  ObjectType,
  StringType,
  TypeBase,
  UndefinedType,
  UnionType,
} from "./type";
import type { SimplifiedValue } from "./value";

export type Optional<T extends TypeBase> = UnionType<T, UndefinedType>;

interface TypeAliasMap {
  string: StringType;
  "string?": Optional<StringType>;

  my_object: ObjectType<{
    a: StringType<"string">;
    b: Optional<StringType<"string_axis_2">>;
    c: Optional<StringType>;
  }>;

  join: FunctionType<{ "0": StringType; "1": StringType }, StringType>;
}

type TypeAlias = keyof TypeAliasMap;

type InferFromAlias<T extends TypeAlias> = InferValue<TypeAliasMap[T]>;

type _t = SimplifiedValue<InferFromAlias<"my_object">>;
