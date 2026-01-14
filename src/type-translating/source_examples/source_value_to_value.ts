import { err, ok, type Result } from "../../result";
import type { AnyValueSource } from "../source";
import type { AnyValue } from "../value";

type AnyValueResult = Result<AnyValue, string[]>;

export function source_value_to_value(source_value: AnyValueSource, evaluate: (content: string) => AnyValueResult): AnyValueResult {
    if (source_value.source === 'expression') {
        return evaluate(source_value.sources.expression);
    }

    // Trivial cases
    if (source_value.primary_type === 'number') {
        // Convert units to base units.
        return ok({
            primary_type: 'number',
            // TODO: unit conversion
            value: 10,
            number_type: 'length',
        })
    }
    if (source_value.primary_type === 'array') {
        const element_values = source_value.value.map(val => source_value_to_value(val, evaluate));
        const success_values = element_values.filter(v => v.success).map(v => v.data);
        const errors = element_values.filter(v => !v.success).flatMap(v => v.error);
        if (errors.length > 0) {
            return err(errors);
        }
        return ok({
            primary_type: 'array',
            value: success_values,
        });
    }
    if (source_value.primary_type === 'object') {
        const property_values: Record<string, AnyValue> = {};
        const errors: string[] = [];
        for (const [key, val] of Object.entries(source_value.value)) {
            const result = source_value_to_value(val, evaluate);
            if (result.success) {
                property_values[key] = result.data;
            } else {
                errors.push(...result.error);
            }
        }
        if (errors.length > 0) {
            return err(errors);
        }
        return ok({
            primary_type: 'object',
            value: property_values,
        });
    }
    source_value.primary_type satisfies 'string' | 'boolean' | 'undefined';
    return ok(source_value);
}