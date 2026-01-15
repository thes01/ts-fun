import {
  string_type,
  type ExType,
  type ArrayType,
  type InferValueFromType,
  type ObjectType,
} from "./type";
import { alias_to_type, type InferFrom, type TypeAlias } from "./type_alias";
import {
  simplify_value,
  type AnyValue,
  type ArrayValue,
  type ObjectValue,
} from "./value";

export function value_matches<T extends ExType | TypeAlias>(
  value: AnyValue,
  type_or_alias: T
): value is InferFrom<T> {
  let type: ExType;
  if (typeof type_or_alias === "string") {
    type = alias_to_type(type_or_alias) as ExType;
  } else {
    type = type_or_alias;
  }

  if (value.primary_type === "number") {
    return (
      type.primary_type === "number" &&
      value.number_type === type.parameters.number_type
    );
  }
  if (value.primary_type === "array") {
    return type.primary_type === "array" && array_value_matches_type(value, type);
  }
  if (value.primary_type === "object") {
    return type.primary_type === "object" && object_value_matches_type(value, type);
  }
  if (value.primary_type === "scene_object") {
    return (
      type.primary_type === "scene_object" &&
      value.node_type === type.parameters.scene_object_type
    );
  }

  value.primary_type satisfies "boolean" | "undefined" | "string" | "function";
  return value.primary_type === type.primary_type;
}

function array_value_matches_type(value: ArrayValue, type: ArrayType): boolean {
  return value.value.every((v) =>
    value_matches(v, type.parameters.element_type)
  );
}

function object_value_matches_type(
  value: ObjectValue,
  type: ObjectType
): boolean {
  for (const [key, property] of Object.entries(value.value)) {
    const property_type = type.parameters.properties[key];
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
