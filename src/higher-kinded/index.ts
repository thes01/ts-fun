// Inspiration: https://github.com/sinclairzx81/parsebox

interface HK {
  input: unknown;
  output: unknown;
}

// Example Higher-Kinded types:

interface NumberToString extends HK {
  output: this["input"] extends number ? `${this["input"]}` : this["input"];
}

interface Identity extends HK {
  output: this["input"];
}

// Application of the HK to a type

type MapProperties<O, M extends HK> = {
  [K in keyof O]: (M & { input: O[K] })["output"];
};

// Example usage:

const test_object = {
  a: 1,
  b: "2",
  c: true,
} as const;

type Test = MapProperties<typeof test_object, NumberToString>;
