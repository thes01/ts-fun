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
  parameters: unknown;
}

interface TypeAliasBase {
  type_alias: string;
  parameters: unknown;
}

export type SourceType = TypeBase | TypeAliasBase;

export interface StringType<E extends StringEnumType = "string">
  extends TypeBase {
  primary_type: "string";
  parameters: {
    enum_type: E;
  };
}

export function string_type<E extends StringEnumType = "string">(
  enum_type?: E
): StringType<E> {
  return {
    primary_type: "string",
    parameters: { enum_type: enum_type ?? ("string" as E) },
  };
}

export type NumberUnitType = "scalar" | "length" | "angle";

export interface NumberType<T extends NumberUnitType = "scalar">
  extends TypeBase {
  primary_type: "number";
  parameters: {
    number_type: T;
  };
}

export function number_type<T extends NumberUnitType>(
  number_type: T
): NumberType<T> {
  return {
    primary_type: "number",
    parameters: { number_type },
  };
}

export interface BooleanType extends TypeBase {
  primary_type: "boolean";
  parameters: undefined;
}

export function boolean_type(): BooleanType {
  return {
    primary_type: "boolean",
    parameters: undefined,
  };
}

export interface ArrayType<T extends SourceType = ExType> extends TypeBase {
  primary_type: "array";
  parameters: {
    element_type: T;
  };
}

export function array_type<T extends SourceType = ExType>(element_type: T): ArrayType<T> {
  return {
    primary_type: "array",
    parameters: { element_type },
  };
}

export interface ListItemType<T extends SourceType = ExType> extends TypeAliasBase {
  type_alias: "list_item";
  parameters: {
    value_type: T
  }
}

export function list_item_alias_type<T extends SourceType>(value_type: T): ListItemType<T> {
  return {
    type_alias: "list_item",
    parameters: { value_type }
  }
} 

export interface ObjectType<
  P extends Record<string, SourceType> = Record<string, ExType>
> extends TypeBase {
  primary_type: "object";
  parameters: {
    properties: P;
  };
}

export function object_type<P extends Record<string, SourceType> = Record<string, ExType>>(
  properties: P
): ObjectType<P> {
  return {
    primary_type: "object",
    parameters: { properties },
  };
}

// export interface FunctionType<
//   Args extends Record<string, TypeBase> = Record<string, ExType>,
//   O extends TypeBase = ExType
// > extends TypeBase {
//   primary_type: "function";
//   parameters: {
//     args: Args;
//     output: O;
//   };
// }

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
  parameters: {
    scene_object_type: T;
  };
}

export function scene_object_type<T extends NodeType>(
  scene_object_type: T
): SceneObjectType<T> {
  return {
    primary_type: "scene_object",
    parameters: { scene_object_type },
  };
}

export interface UndefinedType extends TypeBase {
  primary_type: "undefined";
  parameters: undefined;
}

export function undefined_type(): UndefinedType {
  return {
    primary_type: "undefined",
    parameters: undefined,
  };
}

export type InferValueFromType<T extends SourceType> = T extends StringType<
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
  // : T extends FunctionType<infer A, infer O>
  // ? FunctionValue<InferProperties<A>, InferValueFromType<O>>
  : T extends UnionType<infer U>
  ? InferValueFromType<U[number]>
  : T extends UnknownType
  ? AnyValue
  : never;

type InferProperties<P extends Record<string, SourceType>> = {
  [K in keyof P]: InferValueFromType<P[K]>;
};

export interface UnionType<T extends readonly SourceType[]>
  extends TypeBase {
  primary_type: "union";
  parameters: {
    types: T;
  };
}

export function union_type<const T extends readonly SourceType[]>(
  types: T
): UnionType<T> {
  return {
    primary_type: "union",
    parameters: { types },
  };
}

interface OptionalTypeAlias<T extends SourceType = ExType> extends TypeAliasBase {
  type_alias: "optional";
  parameters: {
    value_type: T;
  };
}

export function optional_type_alias<T extends SourceType>(value_type: T): OptionalTypeAlias<T> {
  return {
    type_alias: "optional",
    parameters: { value_type },
  };
}

export interface UnknownType extends TypeBase {
  primary_type: "unknown";
  parameters: undefined;
}

export function unknown_type(): UnknownType {
  return {
    primary_type: "unknown",
    parameters: undefined,
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
  // Type Aliases
  | ListItemType
  | OptionalTypeAlias;
  // | FunctionType;

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

function list_item_resolved<T extends SourceType>(value_type: T): ListItemResolved<T> {
  return object_type({
    key: string_type(),
    label: string_type(),
    value: value_type,
  });
}

type ListItemResolved<T extends SourceType> = ObjectType<{
  key: StringType;
  label: StringType;
  value: T;
  // image
}>;

function optional_resolved<T extends SourceType>(value_type: T): OptionalResolved<T> {
  return union_type([value_type, undefined_type()]);
}

type OptionalResolved<T extends SourceType> = UnionType<[
  T,
  UndefinedType
]>;

export type ResolvedType<T extends SourceType> = 
  T extends ArrayType<infer E> ? ArrayType<ResolvedType<E>> :
  T extends ObjectType<infer P> ? ObjectType<{ [K in keyof P]: ResolvedType<P[K]> }> :
  T extends ListItemType<infer V> ? ListItemResolved<ResolvedType<V>> : 
  T extends OptionalTypeAlias<infer V> ? OptionalResolved<ResolvedType<V>> : 
  T;


export function resolve_type<T extends SourceType>(type: T): ResolvedType<T> {
  const parameters = type.parameters as any;
  if ("primary_type" in type) {
    if (type.primary_type === 'array') {
      const resolved_element_type = resolve_type(parameters.element_type);
      return array_type(resolved_element_type) as ResolvedType<T>;
    }
    if (type.primary_type === 'object') {
      const props = parameters.properties;
      const resolved_props: Record<string, SourceType> = {};
      for (const key in props) {
        resolved_props[key] = resolve_type(props[key]);
      }
      return object_type(resolved_props) as ResolvedType<T>;
    }
    return type as ResolvedType<T>;
  }
  if (type.type_alias === 'list_item') {
    return list_item_resolved(resolve_type(parameters.value_type)) as ResolvedType<T>;
  }
  if (type.type_alias === 'optional') {
    return optional_resolved(resolve_type(parameters.value_type)) as ResolvedType<T>;
  }
  throw new Error("Unexpected.");
}


const a = list_item_alias_type(array_type(optional_type_alias(number_type('length'))));
const resolved = resolve_type(a);

console.log(JSON.stringify(resolved, null, 2));
// type A = ListItemType<ArrayType<OptionalTypeAlias<NumberType<'length'>>>>;

// type AA = ResolvedType<A>;
