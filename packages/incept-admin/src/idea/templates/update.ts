//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept-spec/dist/Registry';

import fs from 'fs';
import path from 'path';
import { render } from '@stackpress/incept-spec/dist/helpers';

const template = `
<link rel="import" type="template" href="@stackpress/incept-admin/theme/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/crumbs.ink" name="element-crumbs" />
<link rel="import" type="component" href="../components/form.ink" name="{{lower}}-form" />
<link rel="import" type="component" href="@stackpress/incept-admin/theme/app.ink" name="admin-app" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import { env, props } from '@stackpress/ink';
  import { _ } from '@stackpress/incept-i18n';

  const { 
    code = 200, 
    status = 'OK', 
    errors = {}, 
    results = {},
    input = {},
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
  const url = \`\${settings.root}/{{lower}}/update/\${results.id}\`;
  const title = _('Update {{singular}}');
  const links = {
    search: \`\${settings.root}/{{lower}}/search\`,
    detail: \`\${settings.root}/{{lower}}/detail/\${results.id}\`
  };
  const crumbs = [
    { icon: 'home', label: 'Home', href: settings.root },
    { icon: 'user', label: _('{{plural}}'), href: links.search },
    { label: results.suggestion || _('{{singular}} Detail'), href: links.detail },
    { icon: 'edit', label: title }
  ];
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial">
    <admin-app {settings} {url} {title} {code} {status} {errors}>
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
      <main class="flex-grow p-10 scroll-auto h-calc-full-38">
        <h1>{title}</h1>
        <div class="pb-50">
          <{{lower}}-form {input} {errors} action={url} />
        </div>
      </main>
    </admin-app>
  </body>
</html>
`.trim();

export default function generate(directory: Directory, registry: Registry) {
  for (const model of registry.model.values()) {
    const file = path.join(
      directory.getPath(), 
      `${model.name}/admin/update.ink`
    );
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    const source = render(template, { 
      lower: model.lower, 
      singular: model.singular,
      plural: model.plural 
    });
    fs.writeFileSync(file, source);
  }
};