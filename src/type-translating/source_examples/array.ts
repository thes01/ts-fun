import { array_type, string_type } from "../type";

const array_of_strings_value = {
    expression_type: array_type(string_type()),

    source: 'array',
    sources: {
        array: [
            {
                // expression type???
                source: 'string',
                sources: {
                    string: {
                        primary_type: 'string',
                        value: 'value',
                    },
                    expression: '',
                }
            }
        ],
        expression: '',
    }
}

const array_of_strings_flattened = {
    expression_type: array_type(string_type()),

    primary_type: 'array',
    value: [
        {
            primary_type: 'string',
            value: 'value',

            sources: {
                expression: '',
            }
        }
    ],

    // source
    sources: {
        expression: '',
    }
}