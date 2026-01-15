import { err, ok, type Result } from "../../result";
import type { AnyValueSource } from "../source";
import type { ExType } from "../type";
import type { AnyValue } from "../value";

type AnyValueResult = Result<AnyValue, string[]>;

export function source_value_to_value(
    source_value: AnyValueSource, 
    expression_type: ExType,
    evaluate: (content: string) => AnyValueResult
): AnyValueResult {
    if (source_value.source === 'expression') {
        return evaluate(source_value.sources.expression);
    }

    // Trivial cases
    if (source_value.value_type === 'number') {
        // Convert units to base units.
        return ok({
            primary_type: 'number',
            // TODO: unit conversion
            value: 10,
            number_type: 'length',
        })
    }
    if (source_value.value_type === 'array') {
        if (expression_type.primary_type !== 'array') {
            return err(['validation error']);
        }
        const element_type = expression_type.parameters.element_type;

        const element_values = source_value.value.map(val => source_value_to_value(val, element_type, evaluate));
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
    if (source_value.value_type === 'object') {
        if (expression_type.primary_type !== 'object') {
            return err(['validation error']);
        }

        const property_values: Record<string, AnyValue> = {};
        const errors: string[] = [];
        for (const [key, val] of Object.entries(source_value.value)) {
            const property_type  = expression_type.parameters.properties[key];
            if (property_type === undefined) {
                return err([`validation error: Property ${key} not defined in type.`]);
            }
            const result = source_value_to_value(val, property_type, evaluate);
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
    source_value.value_type satisfies 'string' | 'boolean' | 'undefined';
    return ok(source_value);
}