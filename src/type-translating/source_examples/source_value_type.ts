// TODO: Is this necessary?

import type { PrimaryType } from "../type";

// Should these be some kind of aliases? What is the relation to expression type?
// It seems this is a duplication of the ExpressionType concept.
const SOURCE_VALUE_TYPE_MAP = {
    string: 'string',
    division_string: 'string',
    array: 'array',
    length: 'number',

    undefined: 'undefined',
    // Should this be a thing?
    // boolean_optional: ['boolean', 'undefined'],

    // How about enums???

    // ???
    list_item: 'object',
} as const satisfies Record<string, PrimaryType>;

export type SourceValueTypeMap = typeof SOURCE_VALUE_TYPE_MAP;
export type SourceValueType = keyof SourceValueTypeMap;

export function source_value_type_to_primary_type<T extends SourceValueType>(
    source_value_type: T
): SourceValueTypeMap[T] {
    return SOURCE_VALUE_TYPE_MAP[source_value_type];
}
