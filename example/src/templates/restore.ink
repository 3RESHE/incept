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
    settings = { menu: [] }
  } = props('document');

  const url = `/admin/profile/restore/${results.id}`;
  const title = _('Restore Profile');

  const crumbs = [
    { icon: 'home', label: 'Home', href: '/admin' },
    { icon: 'user', label: 'Profiles', href: '/admin/profile/search' },
    { 
      label: results.suggestion || _('Profile Detail'), 
      href: `/admin/profile/detail/${results.id}` 
    },
    { icon: 'arrows-rotate', label: title }
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
        <div class="pb-50">
          <p class="py-20">{_(
            'Are you sure you want to restore %s?', 
            results.suggestion
          )}</p>
          <form-button 
            lg success
            href={`/admin/profile/restore/${results.id}?confirmed=true`} 
          >
            <element-icon name="arrows-rotate" class="mr-5" />
            {_('Yes, Restore')}
          </form-button>
          <form-button 
            lg info
            href={`/admin/profile/detail/${results.id}`} 
          >
            <element-icon name="backward" class="mr-5" />
            {_('Nevermind')}
          </form-button>
        </div>
      </main>
    </admin-app>
  </body>
</html>