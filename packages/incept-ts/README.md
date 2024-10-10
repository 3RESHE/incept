# 💡 Idea Typescript

Transforms [ideas](https://github.com/@stackpress/idea) to 
typescript typings.

## Install

```bash
$ npm i @stackpress/incept-ts
```

## Usage

In your `.idea` file, add the following plugin settings.

```js
plugin "@stackpress/incept-ts" {
  lang "ts"
  enums "./modules/enums"
  types "./modules/[name]/types"
}
```

## Configurations

| Name  | Type   | Description                     |
|-------|--------|---------------------------------|
| lang  | string | transforms to `js` or `ts`      |
| enums | string | path to put generated enum code |
| types | string | path to put generated type code |
