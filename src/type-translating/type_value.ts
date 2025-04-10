import type { AnyType, ArrayType, ObjectType } from "./type";
import type { AnyValue, ArrayValue, ObjectValue } from "./value";

export function value_matches_type(value: AnyValue, type: AnyType): boolean {
  if (value.primary === "array" && type.primary === "array") {
    return array_value_matches_type(value, type);
  }
  if (value.primary === "object" && type.primary === "object") {
    return object_value_matches_type(value, type);
  }
  //...

  return false;
}

function array_value_matches_type(value: ArrayValue, type: ArrayType): boolean {
  return value.value.every((v) =>
    value_matches_type(v, type.specifiers.element_type)
  );
}

function object_value_matches_type(
  value: ObjectValue,
  type: ObjectType
): boolean {
  for (const [key, property] of Object.entries(value.value)) {
    const property_type = type.specifiers.properties[key];
    if (
      property_type === undefined ||
      !value_matches_type(property, property_type)
    ) {
      return false;
    }
  }
  return true;
}
