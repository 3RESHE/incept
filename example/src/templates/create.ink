<link rel="import" type="template" href="@stackpress/incept-admin/theme/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/crumbs.ink" name="element-crumbs" />
<link rel="import" type="component" href="@stackpress/.incept/Profile/form.ink" name="profile-form" />
<link rel="import" type="component" href="@/components/app.ink" name="admin-app" />
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

  const { errors = {} } = props('document');

  const data = { name: 'John Doe' };
</script>
<html>
  <html-head />
  <body class="dark bg-t-0 tx-t-1 tx-arial">
    <admin-app {url} {title}>
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
      <h1>Profile Creation</h1>
      <profile-form {data} {errors} action="/admin/profile/create" />
    </admin-app>
  </body>
</html>