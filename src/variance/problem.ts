// An example where contravariance may cause TypeScript errors.

interface Base {
  foo: string;
}

interface Sub extends Base {
  foo: "foo";
}

interface Context<T extends Base = Base> {
  covariant: T;
  // Uncomment the following line to see an error.
  // contravariant: (x: T) => void;

  // Interestingly, TS is all happy when you use method shorthand syntax instead of object property syntax.
  // bivariant(x: T): void;
  // See also https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
}

declare const sub_context: Context<Sub>;
declare function accept_base(context: Context): void;

accept_base(sub_context);

// ------------------------------

// Class behaves the same way:

class Cls<_T extends Base = Base> {
  constructor() {}

  // Beware! The standard class method syntax is bivariant, which can lead to unexpected behavior.
  // bivariant(_x: _T): void {}

  // contravariant: (_x: _T) => void = () => {}
}

const sub = new Cls<Sub>();

declare function accept_base(context: Cls): void;

accept_base(sub);
