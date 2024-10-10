# Incept Assert

Transforms [ideas](https://github.com/@stackpress/idea) to 
typescript typings.

## Install

```bash
$ npm i @stackpress/incept-assert
```

## Usage

In your `.idea` file, add the following plugin settings.

```js
plugin "@stackpress/incept-ts" {
  lang "ts"
  enums "./modules/enums"
  types "./modules/[name]/types"
}

plugin "@stackpress/incept-assert" {
  output "./modules/[name]/assert"
}
```

## Configurations

| Name   | Type   | Description                        |
|--------|--------|------------------------------------|
| lang   | string | transforms to `js` or `ts`         |
| output | string | path to put generated assert code  |
