<link rel="import" type="template" href="@/modules/app/components/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/panel.ink" name="panel-layout" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table.ink" name="table-layout" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/head.ink" name="table-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/row.ink" name="table-row" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/col.ink" name="table-col" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import { env, props } from '@stackpress/ink';
  import { _ } from '@stackpress/incept-i18n';

  const title = _('Oops...');
  const description = _('There was an error.');
</script>
<html>
  <html-head />
  <body class="dark bg-t-0 tx-t-1 tx-arial">
    <div class="p-20 w-calc-full-40">
      <h1 class="pt-10 pb-20">{_('Not Found')}</h1>
      <p>{_('Resource not found.')}</p>
    </div>
  </body>
</html>