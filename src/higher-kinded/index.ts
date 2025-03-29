import { assert, type Equals } from "tsafe";
import type { ApplyHK, HK } from "./hk";

type _NumberToString<T> = T extends number ? `${T}` : T;

interface NumberToString extends HK {
  output: _NumberToString<this["input"]>;
}

interface Identity extends HK {
  output: this["input"];
}

// Application of the HK to a type

type MapProperties<O extends object, M extends HK> = {
  [K in keyof O]: ApplyHK<O[K], M>;
};

// Example usage:

const test_object = {
  a: 1,
  b: "2",
  c: true,
} as const;

type Test = MapProperties<typeof test_object, NumberToString>;

// 1 is mapped to "1", the rest remains unchanged
assert<Equals<Test, { readonly a: "1"; readonly b: "2"; readonly c: true }>>();
