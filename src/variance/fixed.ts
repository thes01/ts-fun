// Here is how to fix the problem:
// `accept_base` should accept a union type of all possible subtypes,
// instead of the base type.

interface Base {
  foo: string;
}

interface Sub1 extends Base {
  foo: "foo";
}

interface Sub2 extends Base {
  foo: "bar";
}

type AnySub = Sub1 | Sub2;

interface Context<T extends Base = Base> {
  covariant: T;
  contravariant: (x: T) => void;
}

// Distribute AnySub over Context:
// DistributedContext = Context<Sub1> | Context<Sub2>
type DistributedContext<T extends Base = AnySub> =
  T extends infer A extends Base ? Context<A> : never;

declare const sub_context: Context<Sub1>;
declare function accept_base(context: DistributedContext): void;

accept_base(sub_context);
