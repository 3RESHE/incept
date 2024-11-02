<link rel="import" type="template" href="@stackpress/incept-admin/theme/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/crumbs.ink" name="element-crumbs" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
<link rel="import" type="component" href="@stackpress/.incept/Profile/detail.ink" name="profile-detail" />
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
    results = {},
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
  const url = `${settings.root}/profile/detail/${results.id}`;
  const title = results.suggestion || _('Profile Detail');
  const links = {
    search: `${settings.root}/profile/search`,
    update: `${settings.root}/profile/update/${results.id}`,
    remove: `${settings.root}/profile/remove/${results.id}`,
    restore: `${settings.root}/profile/restore/${results.id}`
  };
  const crumbs = [
    { icon: 'home', label: 'Home', href: settings.root },
    { icon: 'user', label: _('Profiles'), href: links.search },
    { label: title }
  ];
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
      <main class="flex-grow p-10 scroll-auto h-calc-full-38">
        <h1>{title}</h1>
        <div class="tx-right mb-20">
          <form-button 
            md warning
            href={links.update} 
          >
            <element-icon name="edit" class="mr-5" />
            {_('Update')}
          </form-button>
          <form-button 
            md error
            class={results.active ? 'inline-block' : 'none'}
            href={links.remove} 
          >
            <element-icon name="trash" class="mr-5" />
            {_('Remove')}
          </form-button>
          <form-button 
            md success
            class={!results.active ? 'inline-block' : 'none'}
            href={links.restore} 
          >
            <element-icon name="arrows-rotate" class="mr-5" />
            {_('Restore')}
          </form-button>
        </div>
        <div class="pb-50">
          <profile-detail data={results} />
        </div>
      </main>
    </admin-app>
  </body>
</html>