<link rel="import" type="template" href="@stackpress/incept-admin/dist/components/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/control.ink" name="form-control" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/input.ink" name="field-input" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/password.ink" name="field-password" />
<link rel="import" type="component" href="@stackpress/incept-admin/dist/components/blank.ink" name="blank-app" />
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
    type = 'username',
    errors = {}, 
    input = {}
  } = props('document');

  const label = type === 'phone' 
    ? _('Phone') 
    : type === 'email' 
    ? _('Email') 
    : _('Username');

  const url = `/auth/signin/${type}`;
  const title = _('Sign In');
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial scroll-auto">
    <blank-app {code} {status} {errors}>
      <main class="flex flex-col flex-center">
        <form method="post">
          <form-control class="pt-20 relative z-6" {label} error={errors.name}>
            <field-input 
              class="block" 
              type="text"
              name={type}
              value={input[type]} 
              required
            />
          </form-control>
          <form-control class="pt-20 relative z-4" label="Password" error={errors.password}>
            <field-password class="block" name="password" required />
          </form-control>
          <form-button class="mt-20" type="submit" primary lg>
            {_('Submit')}
          </form-button>
        </form>
      </main>
    </blank-app>
  </body>
</html>