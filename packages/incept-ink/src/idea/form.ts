//types
import type { Directory } from 'ts-morph';
import type Column from '@stackpress/incept-spec/dist/Column';
import type Registry from '@stackpress/incept-spec/dist/Registry';

import fs from 'fs';
import path from 'path';
import { objectToAttributeString } from '../helpers';

const methods = [
  'checkbox', 'color',    'country',
  'currency', 'date',     'datetime',
  'editor',   'email',    'file',
  'filelist', 'image',    'imagelist',
  'input',    'markdown', 'mask',
  'metadata', 'number',   'password',
  'phone',    'radio',    'range',
  'rating',   'select',   'slug',
  'switch',   'taglist',  'textarea',
  'textlist', 'text',     'time',
  'url',      'wysiwyg',  'fieldset'
];

const alias: Record<string, { method: string, attributes: Record<string, unknown> }> = {
  'email': { method: 'input', attributes: { type: 'email' } },
  'image': { method: 'file', attributes: { accept: 'image/*' } }, 
  'imagelist': { method: 'filelist', attributes: { accept: 'image/*' } },
  'phone': { method: 'input', attributes: { type: 'tel' } },
  'text': { method: 'input', attributes: { type: 'text' } },
  'url': { method: 'input', attributes: { type: 'url' } },
};

const link = '<link rel="import" type="component" href="@stackpress/ink-ui/field/[[field]].ink" name="field-[[field]]" />';

const fieldset = `
<form-control class="pt-20" label="[[label]]" error={typeof errors.[[name]] === 'string' && errors.[[name]]}>
  <form-fieldset legend="[[legend]]" name="[[name]]" inputs={input.[[name]]} errors={errors.[[name]]} multiple={[[multiple]]}>
    [[fields]]
  </form-fieldset>
</form-control>`.trim();

const fieldsetField = `
<form-control control="[[name]]" class="pt-20" label="[[label]]">
  <field-[[field]] field="[[name]]" class="block" [[attributes]] />
</form-control>`.trim();

const field = `
<form-control class="pt-20" label="[[label]]" error={errors.[[name]]}>
  <field-[[field]] class="block" name="[[field_name]]" value={input.[[name]]} [[attributes]] />
</form-control>`.trim();

const template = `
<link rel="import" type="component" href="@stackpress/ink-ui/form/control.ink" name="form-control" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
[[imports]]
<script>
  const { input = {}, errors = {}, action } = this.props;
</script>
<form method="post" {action}>
  [[fields]]
  <form-button class="mt-20" type="submit" success lg>Submit</form-button>
</form>`.trim();

export function body(columns: Column[], imports: Set<string>, inFieldset = false) {
  const fields: string[] = [];
  for (const column of columns) {
    const { name, label } = column;
    let { method, attributes } = column.field;
    const fieldName = [
      'filelist', 'imagelist', 
      'taglist', 'textlist'
    ].includes(method) ? `${name}[]` : name;
    if (!methods.includes(method)) {
      continue;
    } else if (method === 'fieldset' && column.fieldset) {
      imports.add(
        '<link rel="import" type="component" href="@stackpress/ink-ui/form/fieldset.ink" name="form-fieldset" />'
      );
      const fieldsetFields = body(column.fieldset.fields, imports, true);
      fields.push(fieldset
        .replaceAll('[[name]]', name)
        .replaceAll('[[label]]', label)
        .replaceAll('[[legend]]', column.multiple ? `${label} %s` : label)
        .replaceAll('[[multiple]]', column.multiple ? 'true' : 'false')
        .replaceAll('[[fields]]', fieldsetFields.join('\n    '))
      );
      continue;
    } else if (alias[method]) {
      attributes = Object.assign({}, attributes, alias[method].attributes);
      method = alias[method].method;
    }
    imports.add(link.replaceAll('[[field]]', method));
    fields.push((inFieldset ? fieldsetField : field)
      .replaceAll('[[label]]', label)
      .replaceAll('[[name]]', name)
      .replaceAll('[[field_name]]', fieldName)
      .replaceAll('[[field]]', method)
      .replaceAll('[[attributes]]', objectToAttributeString(attributes))
    );
  }
  return fields;
}

export default function generate(directory: Directory, registry: Registry) {
  for (const model of registry.model.values()) {
    const imports = new Set<string>();
    const fields = body(model.fields, imports);
    const file = path.join(directory.getPath(), `${model.name}/form.ink`);
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    fs.writeFileSync(file, template
      .replaceAll('[[imports]]', Array.from(imports.values()).join('\n'))
      .replaceAll('[[fields]]', fields.join('\n  '))
    );
  }
};