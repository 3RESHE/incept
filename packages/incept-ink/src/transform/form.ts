//types
import type { Directory } from 'ts-morph';
import type Column from '@stackpress/incept/dist/config/Column';
import type Registry from '@stackpress/incept/dist/config/Registry';

import fs from 'fs';
import path from 'path';
import mustache from 'mustache';
import { render } from '@stackpress/incept/dist/config/helpers';
import { objectToAttributeString } from './helpers';

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
  'url',      'wysiwyg'
];

const alias: Record<string, { method: string, attributes: Record<string, unknown> }> = {
  'email': { method: 'input', attributes: { type: 'email' } },
  'image': { method: 'file', attributes: { accept: 'image/*' } }, 
  'imagelist': { method: 'filelist', attributes: { accept: 'image/*' } },
  'phone': { method: 'input', attributes: { type: 'tel' } },
  'text': { method: 'input', attributes: { type: 'text' } },
  'url': { method: 'input', attributes: { type: 'url' } },
};

const link = `
<link rel="import" type="component" href="@stackpress/ink-ui/field/{{field}}.ink" name="field-{{field}}" />
`.trim();

const fieldset = `
<form-control class="pt-20" label="{{label}}" error={typeof errors.{{name}} === 'string' && errors.{{name}}}>
  <form-fieldset legend="{{legend}}" name="{{name}}" inputs={input.{{name}}} errors={errors.{{name}}} multiple={ {{multiple}} }>
    {{fields}}
  </form-fieldset>
</form-control>
`.trim();

const fieldsetTab = `
<form-fieldset legend="{{legend}}" name="{{name}}" inputs={input.{{name}}} errors={errors.{{name}}} multiple={ {{multiple}} }>
  {{fields}}
</form-fieldset>
`.trim();

const fieldsetField = `
<form-control control="{{name}}" class="pt-20" label="{{label}}">
  <field-{{field}} field="{{name}}" class="block" {{attributes}} />
</form-control>
`.trim();

const field = `
<form-control class="pt-20" label="{{label}}" error={errors.{{name}}}>
  <field-{{field}} class="block" name="{{field_name}}" value={input.{{name}}} {{attributes}} />
</form-control>
`.trim();

const template = `
<link rel="import" type="component" href="@stackpress/ink-ui/form/control.ink" name="form-control" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/tab.ink" name="element-tab" />
{{{imports}}}
<script>
  const { input = {}, errors = {}, action } = this.props;
</script>
<form method="post" {action}>
  <div class="flex flex-center-y">
    {{#tabs}}
      <element-tab 
        {{active}}
        class="relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0"
        active="bg-t-1"
        inactive="bg-t-2 tx-muted"  
        group="form" 
        selector="#{{selector}}"
      >
        {{label}}
      </element-tab>
    {{/tabs}}
  </div>
  {{#sections}}
    <div id="{{selector}}" class="bg-t-1 p-10" {{{active}}}>
      {{{fields}}}
    </div>
  {{/sections}}
  <form-button class="mt-20" type="submit" primary lg>Submit</form-button>
</form>
`.trim();

export function info(columns: Column[], imports: Set<string>) {
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
    } else if (alias[method]) {
      attributes = Object.assign({}, attributes, alias[method].attributes);
      method = alias[method].method;
    }
    imports.add(render(link, { field: method }));
    fields.push(render(field, {
      label, 
      name, 
      field_name: fieldName,
      field: method, 
      attributes: objectToAttributeString(attributes)
    }));
  }
  return fields;
}

export function fieldsets(columns: Column[], imports: Set<string>) {
  const fields: string[] = [];
  for (const column of columns) {
    const { name, label } = column;
    let { method, attributes } = column.field;
    const fieldName = [
      'filelist', 'imagelist', 
      'taglist', 'textlist'
    ].includes(method) ? `${name}[]` : name;
    if (!methods.includes(method) && method !== 'fieldset') {
      continue;
    } else if (method === 'fieldset' && column.fieldset) {
      const fieldsetFields = fieldsets(column.fieldset.fields, imports);
      fields.push(render(fieldset, {
        name, 
        label, 
        legend: column.multiple ? `${label} %s` : label, 
        multiple: column.multiple ? 'true' : 'false',
        fields: fieldsetFields.join('\n    ')
      }));
      continue;
    } else if (alias[method]) {
      attributes = Object.assign({}, attributes, alias[method].attributes);
      method = alias[method].method;
    }
    imports.add(render(link, { field: method }));
    fields.push(render(fieldsetField, {
      label, 
      name, 
      field_name: fieldName,
      field: method, 
      attributes: objectToAttributeString(attributes)
    }));
  }
  return fields;
}

export default function generate(directory: Directory, registry: Registry) {
  for (const model of registry.model.values()) {
    const imports = new Set<string>();
    const tabs = [ 
      { label: 'Info', selector: 'info', active: 'on' } 
    ];
    const sections = [
      {
        selector: 'info',
        fields: info(model.fields, imports).join('\n  '),
        active: ''
      }
    ];

    model.fields.filter(
      column => column.fieldset && column.field.method === 'fieldset'
    ).forEach(column => {
      if (!column.fieldset) return;
      const { name, label } = column;
      imports.add(
        '<link rel="import" type="component" href="@stackpress/ink-ui/form/fieldset.ink" name="form-fieldset" />'
      );
      tabs.push({ label: column.label, selector: column.name, active: '' });
      sections.push({
        selector: column.name,
        fields: render(fieldsetTab, {
          name, 
          label, 
          legend: column.multiple ? `${label} %s` : '', 
          multiple: column.multiple ? 'true' : 'false',
          fields: fieldsets(column.fieldset.fields, imports).join('\n  ')
        }),
        active: 'style="display:none"'
      });
    })
    const file = path.join(directory.getPath(), `${model.name}/components/form.ink`);
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    fs.writeFileSync(file, mustache.render(template, {
      imports: Array.from(imports.values()).join('\n'),
      tabs, 
      sections
    }));
  }
};