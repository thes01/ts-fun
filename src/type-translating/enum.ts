export type StringAxis2 = "x" | "y";
export type StringAxis3 = "x" | "y" | "z";


interface EnumMap {
  string_axis_2: StringAxis2;
  string_axis_3: StringAxis3;
}

type EnumKey = keyof EnumMap;
export type StringEnumType = EnumKey | "string";

interface InferEnum extends EnumMap {
  [key: string]: string;
}

export type InferStringValue<T extends string> = InferEnum[T];
