/**
 * Convers an object of attributes to a string
 * ex. { type: 'text', number: 4, required: true, disabled: false } => 
 *   'type="text" required number={4} disabled={false}'
 * ex. { list: ['a', 2, true] } => 'list={["a", 2, true]}'
 */
export function objectToAttributeString(attributes: Record<string, any>) {
  return Object.entries(attributes).map(([key, value]) => {
    return `${key}={${JSON.stringify(value)}}`;
  }).join(' ');
}