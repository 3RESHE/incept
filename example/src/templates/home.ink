<link rel="import" type="template" href="@stackpress/incept-admin/theme/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/autocomplete.ink" name="field-autocomplete" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import type { KeyboardEvent } from '@stackpress/ink/dist/types';
  import type { State } from '@stackpress/ink-ui/utilities/select';
  import InkRegistry from '@stackpress/ink/dist/client/InkRegistry';
  import { env, props } from '@stackpress/ink';
  import { _ } from '@stackpress/incept-i18n';

  const { code = 200, status = 'OK' } = props('document');
  const url = `/`;
  const title = _('Home Page');
  const filter = (
    query: string, 
    options: (options: Node[]) => void
  ) => {
    //query from remote
    const results = [ 1, 2, 3 ].map(value => {
      const option = document.createElement('option');
      option.textContent = value.toString();
      const element = InkRegistry.register(option);
      element.setAttribute('value', value);
      return option;
    });
    options(results);
  }
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial">
    <h1>Hello</h1>
    <field-autocomplete 
      name="auto" 
      placeholder="Choose" 
      value={1} 
      {filter} 
    >
      <option value={1}>Option 1</option>
    </field-autocomplete>
  </body>
</html>