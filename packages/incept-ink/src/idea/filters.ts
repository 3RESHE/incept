//types
import type { Directory } from 'ts-morph';
import type Column from '@stackpress/incept-spec/dist/Column';
import type Registry from '@stackpress/incept-spec/dist/Registry';

import fs from 'fs';
import path from 'path';
import { objectToAttributeString } from './helpers';

const methods = [
  'checkbox', 'color',    'country',
  'currency', 'date',     'datetime',
  'email',    'file',     'image',    
  'input',    'mask',     'number',
  'password', 'phone',    'radio',
  'range',    'rating',   'select',
  'slug',     'switch',   'text',
  'time',     'url'
];

const alias: Record<string, { method: string, attributes: Record<string, unknown> }> = {
  'email': { method: 'input', attributes: { type: 'email' } },
  'phone': { method: 'input', attributes: { type: 'tel' } },
  'text': { method: 'input', attributes: { type: 'text' } },
  'url': { method: 'input', attributes: { type: 'url' } },
};

const link = '<link rel="import" type="component" href="@stackpress/ink-ui/field/[[field]].ink" name="field-[[field]]" />';

const filter = `
<form-control class="pt-20" label="[[label]]" error={errors.[[name]]}>
  <field-[[field]] class="block" name="filter[[[name]]]" value={filter.[[name]]} [[attributes]] />
</form-control>`.trim();

const span = `
<form-control class="pt-20" label="[[label]]" error={errors.[[name]]}>
  <field-[[field]] class="block" name="span[[[name]]][0]" value={span.[[name]]?.[0]} [[attributes]] />
  <field-[[field]] class="block" name="span[[[name]]][1]" value={span.[[name]]?.[1]} [[attributes]] />
</form-control>`.trim();

const template = `
<link rel="import" type="component" href="@stackpress/ink-ui/form/control.ink" name="form-control" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
[[imports]]
<script>
  const { filter = {}, span = {}, errors = {} } = this.props;
</script>
<form>
  [[fields]]
  <form-button class="mt-20" type="submit" primary lg>Filter</form-button>
</form>`.trim();

export function body(columns: Column[], imports: Set<string>) {
  const fields: string[] = [];
  for (const column of columns) {
    const { name, label } = column;
    if (column.filter.method !== 'none') {
      let { method, attributes } = column.filter;
      if (!methods.includes(method)) {
        continue;
      } else if (alias[method]) {
        attributes = Object.assign({}, attributes, alias[method].attributes);
        method = alias[method].method;
      }
      imports.add(link.replaceAll('[[field]]', method));
      fields.push(filter
        .replaceAll('[[label]]', label)
        .replaceAll('[[name]]', name)
        .replaceAll('[[field]]', method)
        .replaceAll('[[attributes]]', objectToAttributeString(attributes))
      );
    } else if (column.span.method !== 'none') {
      let { method, attributes } = column.span;
      if (!methods.includes(method)) {
        continue;
      } else if (alias[method]) {
        attributes = Object.assign({}, attributes, alias[method].attributes);
        method = alias[method].method;
      }
      imports.add(link.replaceAll('[[field]]', method));
      fields.push(span
        .replaceAll('[[label]]', label)
        .replaceAll('[[name]]', name)
        .replaceAll('[[field]]', method)
        .replaceAll('[[attributes]]', objectToAttributeString(attributes))
      );
    }
  }
  return fields;
}

export default function generate(directory: Directory, registry: Registry) {
  for (const model of registry.model.values()) {
    const imports = new Set<string>();
    const fields = body(Array.from(model.columns.values()), imports);
    const file = path.join(directory.getPath(), `${model.name}/filters.ink`);
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    fs.writeFileSync(file, template
      .replaceAll('[[imports]]', Array.from(imports.values()).join('\n'))
      .replaceAll('[[fields]]', fields.join('\n  '))
    );
  }
};