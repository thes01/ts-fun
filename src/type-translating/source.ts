import type { SourceValueType, SourceValueTypeMap } from "./source_examples/source_value_type";
import { array_type, boolean_type, number_type, object_type, string_type, undefined_type, union_type, unknown_type, type StringType, type TypeBase } from "./type";
import type { ArrayType, BooleanType, NumberType, UndefinedType, UnionType, UnknownType } from "./type";

type SourceMode = 'value' | 'expression' | 'logic';

// ExpressionType is only on Expressions

interface Expression<T extends TypeBase> extends SourceValue<SourceValueType> {
    expression_type: T;
}

export interface SourceValue<T extends SourceValueType = SourceValueType> {
    value_type: T;
    value: PrimaryTypeToValue[SourceValueTypeMap[T]];

    // Alternative, optional modes.
    source: SourceMode | undefined;
    sources: {
        expression?: string,
    }
}

const expression: Expression<ArrayType<NumberType<'length'>>> = {
    expression_type: array_type(number_type('length')),

    value_type: 'array',
    value: [
        {
            value_type: 'number',
            value: {
                value: 10,
                unit: 'dm',
            },
        
            source: 'value',
            sources: {
                expression: '',
            }
        },
    ],

    source: 'value',
    sources: {
        expression: '',
    }
}

const expression_union: Expression<UnionType<[BooleanType, UndefinedType]>> = {
    expression_type: union_type([boolean_type(), undefined_type()]),

    value_type: 'undefined',
    value: undefined,

    source: 'expression',
    sources: {
        expression: 'true || false',
    }
};

const expression_division: Expression<StringType /* DivisionType */> = {
    expression_type: string_type(),
    value_type: 'division_string', // expression
    value: '[10 : 10 + 1cm : 4cm]',

    source: 'value',
    sources: {
    }
}

// Division expression - How is the value stored?

export type AnyValueSource = {
    [K in SourceValueType]: SourceValue<K>;
}[SourceValueType];

interface PrimaryTypeToValue {
  string: string;
  number: {
    value: number;
    unit: string;
  };
  boolean: boolean;
  undefined: undefined;
  array: AnyValueSource[];
  object: Record<string, AnyValueSource>;
  // function
  // scene_object
  // division_number
}

type PrimaryType = keyof PrimaryTypeToValue;

// ArrayType

function list_item_type<T extends TypeBase>(value_type: T) {
    return object_type({
        key: string_type(),
        value: value_type,
    })
}