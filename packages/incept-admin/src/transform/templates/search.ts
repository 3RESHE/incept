//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept/dist/config/Registry';

import fs from 'fs';
import path from 'path';
import { render } from '@stackpress/incept/dist/config/helpers';

const template = `
<link rel="import" type="template" href="@stackpress/incept-admin/dist/components/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/crumbs.ink" name="element-crumbs" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/pager.ink" name="element-pager" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/input.ink" name="field-input" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
<link rel="import" type="component" href="../components/table.ink" name="{{lower}}-table" />
<link rel="import" type="component" href="../components/filters.ink" name="{{lower}}-filters" />
<link rel="import" type="component" href="@stackpress/incept-admin/dist/components/app.ink" name="admin-app" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import { env, props } from '@stackpress/ink';
  import { _ } from '@stackpress/incept-i18n';
  import { addQueryParam } from '@stackpress/incept-ink/dist/helpers';
  const { 
    q,
    code = 200, 
    status = 'OK',
    span = {}, 
    filter = {},
    results = [],
    total = 0,
    skip = 0,
    take = 50,
    settings = { 
      root: '/admin',
      menu: [], 
      session: { 
        id: 0, 
        token: '', 
        roles: [ 'GUEST' ], 
        permissions: [] 
      }
    }
  } = props('document');
  const url = \`\${settings.root}/{{lower}}/search\`;
  const title = _('{{plural}}');
  const links = { create: \`\${settings.root}/{{lower}}/create\` };
  const crumbs = [
    { icon: 'home', label: 'Home', href: settings.root },
    { icon: '{{icon}}', label: title }
  ];
  const page = (page: number) => {
    window.location.search = addQueryParam(
      window.location.search, 
      'skip', 
      (page - 1) * take
    );
  };
  const detail = \`\${settings.root}/{{lower}}/detail/{{ids}}\`;
  const update = \`\${settings.root}/{{lower}}/update/{{ids}}\`;
  const toggle = () => {
    const filter = document.querySelector('.filter');
    if (filter?.classList.contains('right-0')) {
      filter?.classList.remove('right-0');
      filter?.classList.add('right--360');
    } else {
      filter?.classList.remove('right--360');
      filter?.classList.add('right-0');
    }
  };
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial">
    <admin-app {settings} {url} {title} {code} {status}>
      <header class="p-10 bg-t-1">
        <element-crumbs 
          crumbs={crumbs} 
          block 
          bold 
          white 
          icon-muted
          link-primary
          spacing={2}
        />
      </header>
      <main class="flex-grow scroll-auto h-calc-full-38 flex flex-col">
        <div class="flex flex-y-center p-10">
          <form-button muted padding={10}>
            <element-icon name="filter" click=toggle />
          </form-button>
          <form class="flex-grow flex flex-y-center">
            <field-input border-white class="flex-grow" name="q" value=q />
            <form-button info padding={10}>
              <element-icon name="search" />
            </form-button>
          </form>
          <form-button success padding={10} class="ml-10" href={links.create}>
            <element-icon name="plus" />
          </form-button>
        </div>
        <div class="flex-grow p-10">
          <{{lower}}-table rows={results} {detail} {update} none={_('No Results Found')} />
        </div>
        <div class="p-10">
          <element-pager 
            total={total} 
            range={take} 
            start={skip} 
            show={3} 
            next
            prev
            rewind
            forward
            white
            bold
            bg-info
            border-theme="bd-2"
            square={40}
            {page}
          />
        </div>
      </main>
      <aside class="filter absolute z-5 bottom-0 top-0 right--360 w-360 flex flex-col transition-500">
        <header class="flex flex-center-y bg-t-0 px-5 py-8" click=toggle>
          <element-icon name="chevron-left" class="pr-10 cursor-pointer" />
          <h3 class="tx-upper">{_('Filters')}</h3>
        </header>
        <main class="flex-grow bg-t-1">
          <div class="px-10">
            <{{lower}}-filters {filter} {span} />
          </div>
        </main>
      </aside>
    </admin-app>
  </body>
</html>
`.trim();

export default function generate(directory: Directory, registry: Registry) {
  for (const model of registry.model.values()) {
    const file = path.join(
      directory.getPath(), 
      `${model.name}/admin/search.ink`
    );
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    const source = render(template, { 
      icon: model.icon || '',
      ids: model.ids.map(column => `{{${column.name}}}`).join('/'),
      lower: model.lower, 
      plural: model.plural 
    });
    fs.writeFileSync(file, source);
  }
};