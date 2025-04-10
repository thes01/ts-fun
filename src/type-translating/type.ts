import type { InferEnumValue, StringEnumType } from "./enum";
import type {
  ArrayValue,
  BooleanValue,
  FunctionValue,
  NumberValue,
  ObjectValue,
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
  | "function";

export interface TypeBase {
  primary: PrimaryType | "union";
  specifiers: unknown;
}

export interface StringType<E extends StringEnumType = "string">
  extends TypeBase {
  primary: "string";
  specifiers: {
    enum_type: E;
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

export interface BooleanType extends TypeBase {
  primary: "boolean";
  specifiers: undefined;
}

export interface ArrayType<T extends TypeBase = TypeBase> extends TypeBase {
  primary: "array";
  specifiers: {
    element_type: T;
  };
}

export interface ObjectType<P extends Record<string, TypeBase>>
  extends TypeBase {
  primary: "object";
  specifiers: {
    properties: P;
  };
}

export interface FunctionType<
  Args extends Record<string, TypeBase>,
  O extends TypeBase
> extends TypeBase {
  primary: "function";
  specifiers: {
    args: Args;
    output: O;
  };
}

export interface UndefinedType extends TypeBase {
  primary: "undefined";
  specifiers: undefined;
}

export type InferValue<T extends TypeBase> = T extends StringType<
  infer E extends StringEnumType
>
  ? StringValue<InferEnumValue<E>>
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
  : T extends FunctionType<infer A, infer O>
  ? FunctionValue<InferProperties<A>, InferValue<O>>
  : T extends UnionType<infer U1, infer U2>
  ? InferValue<U1> | InferValue<U2>
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
