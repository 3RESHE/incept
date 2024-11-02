//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept-spec/dist/Registry';

import fs from 'fs';
import path from 'path';
import { objectToAttributeString } from './helpers';

const methods = [
  'code',     'color',     'country',
  'currency', 'date',      'time',
  'datetime', 'email',     'formula',
  'html',     'image',     'imagelist',
  'json',     'link',      'ul',
  'ol',       'list',      'markdown',
  'metadata', 'number',    'overflow',
  'phone',    'rating',    'space',
  'line',     'separated', 'table',
  'taglist',  'text',      'yesno',
  'view',     'none'
];

const alias: Record<string, { method: string, attributes: Record<string, unknown> }> = {
  'time': { method: 'date', attributes: { format: 'h:mm:ss a' } },
  'datetime': { method: 'date', attributes: { format: 'MMMM D, YYYY, h:mm:ss a' } }, 
  'ul': { method: 'list', attributes: {} },
  'ol': { method: 'list', attributes: { ordered: true } },
  'space': { method: 'separated', attributes: { separator: ' ' } },
  'line': { method: 'separated', attributes: { separator: 'line' } },
}

const link = '<link rel="import" type="component" href="@stackpress/ink-ui/format/[[format]].ink" name="format-[[format]]" />';
const head = '<table-head class="tx-[[direction]]">[[label]]</table-head>';
const sortable = `<table-head class="tx-[[direction]]"><a class="tx-primary cursor-pointer" href={sort('[[name]]')}>[[label]] <element-icon name={order('[[name]]')} /></a></table-head>`;

const none = '{data.[[name]].toString()}';
const format = '<format-[[format]] [[attributes]] value={data.[[name]]} />';

const col = '<table-col class="tx-[[direction]]" nowrap>[[format]]</table-col>';
const filterable = `<table-col class="tx-[[direction]]" nowrap><a class="tx-primary cursor-pointer" href={filter('[[name]]', data.[[name]])}>[[format]]</a></table-col>`;
const viewable = `<table-col class="tx-[[direction]]" nowrap><a class="tx-primary cursor-pointer" href={data._view}>{data.[[name]].toString()}</a></table-col>`;

const template = `<link rel="import" type="component" href="@stackpress/ink-ui/layout/table.ink" name="table-layout" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/head.ink" name="table-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/row.ink" name="table-row" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/col.ink" name="table-col" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/alert.ink" name="element-alert" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
[[imports]]
<script>
  import { filter, sort, order } from '@stackpress/incept-ink/dist/helpers';
  const { rows = [], none = 'No results found.' } = this.props;
</script>
<if true={rows.length > 0}>
  <table-layout
    head="py-16 px-12 bg-t-1 b-solid b-black bt-1 bb-0 bx-0 tx-bold" 
    body="py-16 px-12 b-solid b-black bt-1 bb-0 bx-0" 
    odd="bg-t-0"
    even="bg-t-1"
    top
  >
    [[headers]]
    <each key=i value=data from={rows}>
      <table-row>
        [[formats]]
      </table-row>
    </each>
  </table-layout>
<else />
  <element-alert info>
    <element-icon name="info-circle" />
    {none}
  </element-alert>
</if>`;

export default function generate(directory: Directory, registry: Registry) {
  for (const model of registry.model.values()) {
    const imports = new Set<string>();
    const headers: string[] = [];
    const formats: string[] = [];
    for (const column of model.lists) {
      const { label } = column;
      const direction = [ 
        'Boolean', 'Date', 'Time', 'Datetime', 
        'Number', 'Integer', 'Float' 
      ].includes(column.type) ? 'right' : 'left';
      let { method, attributes } = column.list;
      if (!methods.includes(method)) {
        continue;
      }
      if (alias[method]) {
        attributes = Object.assign({}, attributes, alias[method].attributes);
        method = alias[method].method;
      }
      if (method === 'metadata') {
        attributes = { 
          ...attributes, 
          padding: 10,
          'stripe-theme': 'bg-3', 
          'background-theme': 'bg-2'
        } 
      } 
      if (method !== 'none' && method !== 'view') {
        imports.add(link.replaceAll('[[format]]', method));
      }

      const row = (column.filter.method !== 'none'
        ? filterable 
        : method === 'view' 
        ? viewable
        : col
      );

      headers.push((column.sortable ? sortable : head)
        .replaceAll('[[direction]]', direction)
        .replaceAll('[[label]]', label)
        .replaceAll('[[name]]', column.name)
      );
      formats.push(row
        .replaceAll('[[direction]]', direction)
        .replaceAll('[[format]]', method === 'none' ? none : format)
        .replaceAll('[[name]]', column.name)
        .replaceAll('[[format]]', method)
        .replaceAll('[[attributes]]', objectToAttributeString(attributes))
        .replaceAll('  ', ' ')
      );
    }
    const file = path.join(directory.getPath(), `${model.name}/components/table.ink`);
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    fs.writeFileSync(file, template
      .replaceAll('[[imports]]', Array.from(imports.values()).join('\n'))
      .replaceAll('[[headers]]', headers.join('\n  '))
      .replaceAll('[[formats]]', formats.join('\n      '))
    );
  }
};