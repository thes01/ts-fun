import type { InferEnumValue, StringEnumType } from "./enum";
import type {
  ArrayValue,
  BooleanValue,
  NumberValue,
  StringValue,
} from "./value";

export type PrimaryType = "string" | "number" | "boolean" | "array";

interface TypeBase {
  primary: PrimaryType | "union";
  specifiers: unknown;
}

interface StringType<E extends StringEnumType = "string"> extends TypeBase {
  primary: "string";
  specifiers: {
    enum_type: E;
  };
}

export type NumberUnitType = "scalar" | "length" | "angle";

interface NumberType<T extends NumberUnitType = "scalar"> extends TypeBase {
  primary: "number";
  specifiers: {
    number_type: T;
  };
}

interface BooleanType extends TypeBase {
  primary: "boolean";
  specifiers: undefined;
}

interface ArrayType<T extends TypeBase = TypeBase> extends TypeBase {
  primary: "array";
  specifiers: {
    element_type: T;
  };
}

// TODO: Array Type, Optional Type

// ---------------------

type InferValue<T extends TypeBase> = T extends StringType<
  infer E extends StringEnumType
>
  ? StringValue<InferEnumValue<E>>
  : T extends NumberType<infer U extends NumberUnitType>
  ? NumberValue<InferNumberUnitValue<U>>
  : T extends BooleanType
  ? BooleanValue
  : T extends ArrayType<infer U>
  ? ArrayValue<InferValue<U>>
  : T extends UnionType<infer U1, infer U2>
  ? InferValue<U1> | InferValue<U2>
  : never;

type InferNumberUnitValue<T extends NumberUnitType> = T extends "scalar"
  ? undefined // ScalarValue
  : T extends "length"
  ? "mm" // LengthValue
  : "deg"; // AngleValue

interface UnionType<T1 extends TypeBase, T2 extends TypeBase> extends TypeBase {
  primary: "union";
  specifiers: {
    t1: T1;
    t2: T2;
  };
}

type _t = InferValue<
  UnionType<NumberType<"angle">, StringType<"string_axis_2">>
>;
