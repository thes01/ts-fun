import type { InferEnumValue, StringEnumType } from "./enum";
import type {
  ArrayValue,
  BooleanValue,
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
  | "object";

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

export interface UndefinedType extends TypeBase {
  primary: "undefined";
  specifiers: undefined;
}

export type InferValue<T extends TypeBase> = T extends StringType<
  infer E extends StringEnumType
>
  ? StringValue<InferEnumValue<E>>
  : T extends NumberType<infer U extends NumberUnitType>
  ? NumberValue<InferNumberUnitValue<U>>
  : T extends BooleanType
  ? BooleanValue
  : T extends UndefinedType
  ? UndefinedValue
  : T extends ArrayType<infer U>
  ? ArrayValue<InferValue<U>>
  : T extends ObjectType<infer P>
  ? ObjectValue<InferObjectProperties<P>>
  : T extends UnionType<infer U1, infer U2>
  ? InferValue<U1> | InferValue<U2>
  : never;

type InferNumberUnitValue<T extends NumberUnitType> = T extends "scalar"
  ? undefined // ScalarValue
  : T extends "length"
  ? "mm" // LengthValue
  : "deg"; // AngleValue

type InferObjectProperties<P extends Record<string, TypeBase>> = {
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

type MyRecordProperties = {
  foo: NumberType<"length">;
  bar: StringType<"string_axis_2">;
};

type MyRecord = ObjectType<MyRecordProperties>;

// TODO: Add Evaluate
type _t = InferValue<MyRecord>;

type _tt = _t["value"];
