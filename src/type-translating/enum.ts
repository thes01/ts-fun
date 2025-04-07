export type StringEnumType = "string" | "string_axis_2" | "string_axis_3";

export type StringAxis2 = "x" | "y";
export type StringAxis3 = "x" | "y" | "z";

export type StringEnumValue = string | StringAxis2 | StringAxis3;

export type InferEnumValue<T extends StringEnumType> = T extends "string_axis_2"
  ? StringAxis2
  : T extends "string_axis_3"
  ? StringAxis3
  : string;
