<link rel="import" type="template" href="@stackpress/incept-admin/theme/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/crumbs.ink" name="element-crumbs" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/pager.ink" name="element-pager" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/input.ink" name="field-input" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
<link rel="import" type="component" href="@stackpress/.incept/Profile/search.ink" name="profile-search" />
<link rel="import" type="component" href="@stackpress/.incept/Profile/filters.ink" name="profile-filters" />
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
  import { addQueryParam } from '@stackpress/incept-ink/dist/helpers';

  const { 
    q,
    code = 200, 
    status = 'OK',
    span = {}, 
    filter = {},
    results = [],
    settings = { menu: [] },
    total = 0,
    skip = 0,
    take = 50
  } = props('document');
  
  const url = '/ink/index.html';
  const title = _('Profile Search');

  const crumbs = [
    { icon: 'home', label: 'Home', href: '/admin' },
    { icon: 'user', label: 'Profiles' }
  ];
  const page = (page: number) => {
    window.location.search = addQueryParam(
      window.location.search, 
      'skip', 
      (page - 1) * take
    )
  };
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
        <h1 class="tx-upper p-10">{title}</h1>
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
          <form-button success padding={10} class="ml-10" href="/admin/profile/create">
            <element-icon name="plus" />
          </form-button>
        </div>
        <div class="flex-grow p-10">
          <profile-search rows={results} none={_('No Results Found')} />
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
            <profile-filters {filter} {span} />
          </div>
        </main>
      </aside>
    </admin-app>
  </body>
</html>