interface Base {
  foo: string;
}

interface Sub extends Base {
  foo: "foo";
}

interface Context<T extends Base = Base> {
  covariant: T;
}

declare const sub_context: Context<Sub>;

declare function accept_base(context: Context): void;

accept_base(sub_context); // This should be valid until "contravariant" is uncommented.
