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

  const { 
    code = 200, 
    status = 'OK', 
    errors = {}, 
    results = {},
    input = { name: 'John Doe' },
    settings = { menu: [] }
  } = props('document');

  const url = `/admin/profile/update/${results.id}`;
  const title = _('Update Profile');

  const crumbs = [
    { icon: 'home', label: 'Home', href: '/admin' },
    { icon: 'user', label: 'Profiles', href: '/admin/profile/search' },
    { label: results.suggestion || _('Profile Detail') },
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
          <profile-form {input} {errors} action={url} />
        </div>
      </main>
    </admin-app>
  </body>
</html>