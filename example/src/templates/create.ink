<link rel="import" type="template" href="@stackpress/incept-admin/theme/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/incept-admin/theme/app.ink" name="admin-app" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/crumbs.ink" name="element-crumbs" />
<link rel="import" type="component" href="@stackpress/.incept/Profile/form.ink" name="profile-form" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import { env, props } from '@stackpress/ink';
  import { _ } from '@stackpress/incept-i18n';

  const url = '/ink/index.html';
  const title = _('Create Profile');

  const crumbs = [
    { icon: 'home', label: 'Home', href: '/ink/index.html' },
    { icon: 'book', label: 'Docs' }
  ];

  const { 
    code = 200, 
    status = 'OK', 
    errors = {}, 
    input = { name: 'John Doe' }
  } = props('document');
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial">
    <admin-app {url} {title} {code} {status} {errors}>
      <header class="p-10 bg-t-1">
        <element-crumbs 
          crumbs={crumbs} 
          block 
          bold 
          white 
          underline
          icon-muted
          link-primary
          spacing={2}
        />
      </header>
      <main class="flex-grow p-10 scroll-auto h-calc-full-38">
        <h1>{_('Create Profile')}</h1>
        <profile-form {input} {errors} action="/admin/profile/create" />
      </main>
    </admin-app>
  </body>
</html>