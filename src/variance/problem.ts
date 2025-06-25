// An example where contravariance may cause TypeScript errors.
// This example is valid until "contravariant" property is uncommented.

interface Base {
  foo: string;
}

interface Sub extends Base {
  foo: "foo";
}

interface Context<T extends Base = Base> {
  covariant: T;
  // contravariant: (x: T) => void;
}

declare const sub_context: Context<Sub>;
declare function accept_base(context: Context): void;

accept_base(sub_context);
