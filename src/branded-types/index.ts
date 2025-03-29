// Src: https://polvara.me/posts/Branded%20types%20in%20TypeScript/

declare const brand: unique symbol;
type Brand<T, TBrand extends string> = T & { [brand]: TBrand };

// Examples:

type NonEmptyString = Brand<string, "NonEmptyString">;

export function is_non_empty_string(str: string): str is NonEmptyString {
  return str.length > 0;
}
