import { array_type, boolean_type, number_type, object_type, string_type, undefined_type, union_type, type StringType, type TypeBase } from "./type";
import type { ArrayType, BooleanType, NumberType, UndefinedType, UnionType } from "./type";

type SourceMode = 'value' | 'expression' | 'logic';

// ExpressionType is only on Expressions

interface Expression<T extends TypeBase> extends SourceValue<PrimaryType> {
    expression_type: T;
}

export interface SourceValue<T extends PrimaryType = PrimaryType> {
    primary_type: T;
    value: PrimaryTypeToValue[T];

    // Alternative, optional modes.
    source: SourceMode | undefined;
    sources: {
        expression: string,
    }
}

const expression: Expression<ArrayType<NumberType<'length'>>> = {
    expression_type: array_type(number_type('length')),

    primary_type: 'array',
    value: [
        {
            primary_type: 'number',
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

    primary_type: 'undefined',
    value: undefined,

    source: 'expression',
    sources: {
        expression: 'true || false',
    }
};

// Division expression - How is the value stored?




export type AnyValueSource = {
    [K in PrimaryType]: SourceValue<K>;
}[PrimaryType];

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