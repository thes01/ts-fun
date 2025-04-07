import type { InferEnumValue, StringAxis2, StringEnumType } from "./enum";
import type {
  ArrayValue,
  BooleanValue,
  NumberValue,
  StringValue,
} from "./value";

export type PrimaryType = "string" | "number" | "boolean" | "array";

interface TypeBase {
  primary: PrimaryType;
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
  : never;

type InferNumberUnitValue<T extends NumberUnitType> = T extends "scalar"
  ? undefined // ScalarValue
  : T extends "length"
  ? "mm" // LengthValue
  : "deg"; // AngleValue

// type _t = InferValue<StringType<"string_axis_2">>;

type _t = InferValue<NumberType<"length">>;
