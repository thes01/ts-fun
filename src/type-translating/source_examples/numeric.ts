import { number_type } from "../type";

// PRIMARY TYPE / VALUE TYPE

// 10 DM SOURCE VALUE
const length_source_value = {
	expression_type: number_type('length'),

	selected_source: 'length',
	sources: {
		length: {
			primary_type: 'number',
			value: 10,
			unit: 'dm',
		},
		// expression: '',
	},
};

// 10 DM SOURCE VALUE - VALUE FLATTENED
const length_source_flattened = {
    expression_type: number_type('length'),

	// Flattened value
    primary_type: 'number',
    value: 10,
	specifiers: {
		unit: 'dm', // Extended unit.
	},

    // source: 'expression'
    sources: {
        expression: '',
    }
}