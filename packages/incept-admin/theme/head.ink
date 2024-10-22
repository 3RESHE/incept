<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <link rel="favicon" href="/favicon.ico" />
  <link rel="shortcut icon" type="image/png" href="/favicon.png" />
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
  <link rel="stylesheet" type="text/css" href="/styles/global.css" />
  <link rel="stylesheet" type="text/css" href={`/build/client/${env('BUILD_ID')}.css`} />
  
  <script data-app={env('APP_DATA')} src={`/build/client/${env('BUILD_ID')}.js`}></script>
  <if true={env('SERVER_ENV') === 'development'}>
    <script src="/dev.js"></script>
  </if>
</head>