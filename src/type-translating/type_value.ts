import {
  string_type,
  type AnyType,
  type ArrayType,
  type InferValue,
  type ObjectType,
} from "./type";
import { alias_to_type, type InferFrom, type TypeAlias } from "./type_alias";
import {
  simplify_value,
  type AnyValue,
  type ArrayValue,
  type ObjectValue,
} from "./value";

export function value_matches<T extends AnyType | TypeAlias>(
  value: AnyValue,
  type_or_alias: T
): value is InferFrom<T> {
  let type: AnyType;
  if (typeof type_or_alias === "string") {
    type = alias_to_type(type_or_alias) as AnyType;
  } else {
    type = type_or_alias;
  }

  if (value.primary === "number") {
    return (
      type.primary === "number" &&
      value.number_type === type.specifiers.number_type
    );
  }
  if (value.primary === "array") {
    return type.primary === "array" && array_value_matches_type(value, type);
  }
  if (value.primary === "object") {
    return type.primary === "object" && object_value_matches_type(value, type);
  }
  if (value.primary === "scene_object") {
    return (
      type.primary === "scene_object" &&
      value.node_type === type.specifiers.scene_object_type
    );
  }

  value.primary satisfies "boolean" | "undefined" | "string" | "function";
  return value.primary === type.primary;
}

function array_value_matches_type(value: ArrayValue, type: ArrayType): boolean {
  return value.value.every((v) =>
    value_matches(v, type.specifiers.element_type)
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
      !value_matches(property, property_type)
    ) {
      return false;
    }
  }
  return true;
}

declare const a: AnyValue;

if (value_matches(a, "list_item[]")) {
  const simplified = simplify_value(a);
}
