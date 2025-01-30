# Incept

Incept is a content management framework.

## Usage

See [Example](https://github.com/stackpress/incept/tree/main/example) 
for use case.

## Model Spec

The following attributes can be applied to model types in an idea file.

```js
model User @icon("user") @label("User" "Users") {}
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`@icon(string)`</td>
      <td>An icon representation of a model. Uses font awesome names.</td>
      <td>&nbsp;</td>
      <td>`@icon("user")`</td>
    </tr>
    <tr>
      <td>`@template(string)`</td>
      <td>Used to describe each row in a model</td>
      <td>&nbsp;</td>
      <td>`@template("User {{name}}")`</td>
    </tr>
    <tr>
      <td>`@label(string string)`</td>
      <td>A friendly name that represents the model</td>
      <td>&nbsp;</td>
      <td>`@label("User" "Users")`</td>
    </tr>
    <tr>
      <td>`@active`</td>
      <td>
        A flag that represents the active field. Active fields are 
        changed when deleting or restoring a row, as an alternative to 
        actually deleting the row in the database.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@default(string|number|boolean)`</td>
      <td>
        The default value applied when creating a row if no value 
        was provided.
      </td>
      <td>&nbsp;</td>
      <td>
        `@default(1)`
        <br />`@default("user")`
        <br />`@default(true)`
        <br />`@default("now()")`
        <br />`@default("nanoid()")`
        <br />`@default("nanoid(10)")`
        <br />`@default("cuid()")`
        <br />`@default("cuid(10)")`
      </td>
    </tr>
    <tr>
      <td>`@generated`</td>
      <td>
        A flag that represents that the value of this column is 
        generated, bypassing the need to be validated
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@id`</td>
      <td>
        A flag that represents the models identifier. If multiple ids 
        then the combination will be used to determine each rows 
        uniqueness.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@searchable`</td>
      <td>
        A flag deonoting this column is searchable and will be 
        considered in a search field for example. Also used to know 
        which columns need to be optimized in the database.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@sortable`</td>
      <td>
        A flag deonoting this column is sortable. Also used to know 
        which columns need to be optimized in the database.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@label(string)`</td>
      <td>
        A label that will be shown to represent this column instead of 
        the actual column name.
      </td>
      <td>&nbsp;</td>
      <td>`@label("Name")`</td>
    </tr>
    <tr>
      <td>`@min(number)`</td>
      <td>
        The minimum number value that will be accepted. This is also a 
        consideration when determining the database type.
      </td>
      <td>&nbsp;</td>
      <td>`@min(10)`</td>
    </tr>
    <tr>
      <td>`@max(number)`</td>
      <td>
        The maximum number value that will be accepted. This is also a 
        consideration when determining the database type.
      </td>
      <td>&nbsp;</td>
      <td>`@max(100)`</td>
    </tr>
    <tr>
      <td>`@step(number)`</td>
      <td>
        The incremental amount value that will be used when changing 
        the columns value. This is also a consideration when determining 
        the database type.
      </td>
      <td>&nbsp;</td>
      <td>
        `@step(1)`
        <br />`@step(0.01)`
      </td>
    </tr>
    <tr>
      <td>`@relation(config)`</td>
      <td>Maps columns in the model that is related to another model.</td>
      <td>
        local: string
        <br />foreign: string
        <br />name?: string
      </td>
      <td>
        `@relation({ local "userId" foreign "id" })`
        <br />`@relation({ name "memberships" local "ownerId" foreign "id" })`
        <br />`@relation({ name "connections" local "memberId" foreign "id" })`
      </td>
    </tr>
    <tr>
      <td>`@unique`</td>
      <td>
        A flag that ensures no duplicate value can be added to the model
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@updated`</td>
      <td>
        A flag that will automatically update the timestamp whenever 
        a row is changed.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </tbody>
</table>

## Validation Spec

The following validation attributes can be applied to model columns in an idea file.

```js
name String @is.required @is.cgt(10)
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`@is.required`</td>
      <td>Validates that a value must be given before being inserted.</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.notempty`</td>
      <td>
        Validates that a value is something as opposed to an empty string.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.eq(string|number)`</td>
      <td>
        Validates that the value is explicitly equal to the given argument
      </td>
      <td>&nbsp;</td>
      <td>
        `@is.eq(10)`
        <br />`@is.eq("foobar")`
      </td>
    </tr>
    <tr>
      <td>`@is.ne(string|number)`</td>
      <td>
        Validates that the value is explicitly not equal to the given argument
      </td>
      <td>&nbsp;</td>
      <td>
        `@is.neq(10)`
        <br />`@is.neq("foobar")`
      </td>
    </tr>
    <tr>
      <td>`@is.option(string|number[])`</td>
      <td>Validates that the value is one of the given options</td>
      <td>&nbsp;</td>
      <td>is.option([ 1 2 "foo" 3 "bar" ])</td>
    </tr>
    <tr>
      <td>`@is.regex(string)`</td>
      <td>
        Validates that the value matches the given regular expression
      </td>
      <td>&nbsp;</td>
      <td>`@is.regex("[a-z]$")`</td>
    </tr>
    <tr>
      <td>`@is.date`</td>
      <td>Validates that the value is a date</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.future`</td>
      <td>Validates that the value is a future date</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.past`</td>
      <td>Validates that the value is a past date</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.present`</td>
      <td>Validates that the value is the present date</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.gt(number)`</td>
      <td>Validate that the value is greater than the given number</td>
      <td>&nbsp;</td>
      <td>`@is.gt(10)`</td>
    </tr>
    <tr>
      <td>`@is.ge(number)`</td>
      <td>
        Validate that the value is greater than or equal to the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.ge(10)`</td>
    </tr>
    <tr>
      <td>`@is.lt(number)`</td>
      <td>Validate that the value is less than the given number</td>
      <td>&nbsp;</td>
      <td>`@is.lt(10)`</td>
    </tr>
    <tr>
      <td>`@is.le(number)`</td>
      <td>
        Validate that the value is less than or equal to the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.le(10)`</td>
    </tr>
    <tr>
      <td>`@is.ceq(number)`</td>
      <td>
        Validate that the character count of the value 
        is equal to the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.ceq(10)`</td>
    </tr>
    <tr>
      <td>`@is.cgt(number)`</td>
      <td>
        Validate that the character count of the value is greater 
        than or equal to the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.cle(10)`</td>
    </tr>
    <tr>
      <td>`@is.cge(number)`</td>
      <td>
        Validate that the character count of the value is 
        less than the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.cge(10)`</td>
    </tr>
    <tr>
      <td>`@is.clt(number)`</td>
      <td>
        Validate that the character count of the value is 
        less than or equal to the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.clt(10)`</td>
    </tr>
    <tr>
      <td>`@is.cle(number)`</td>
      <td>
        Validate that the character count of the value is less 
        than or equal to the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.cle(10)`</td>
    </tr>
    <tr>
      <td>`@is.weq(number)`</td>
      <td>
        Validate that the word count of the value is 
        equal to the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.weq(10)`</td>
    </tr>
    <tr>
      <td>`@is.wgt(number)`</td>
      <td>
        Validate that the word count of the value is greater 
        than or equal to the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.wle(10)`</td>
    </tr>
    <tr>
      <td>`@is.wge(number)`</td>
      <td>
        Validate that the word count of the value is less 
        than the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.wge(10)`</td>
    </tr>
    <tr>
      <td>`@is.wlt(number)`</td>
      <td>
        Validate that the word count of the value is less than 
        or equal to the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.wlt(10)`</td>
    </tr>
    <tr>
      <td>`@is.wle(number)`</td>
      <td>
        Validate that the word count of the value is less than 
        or equal to the given number
      </td>
      <td>&nbsp;</td>
      <td>`@is.wle(10)`</td>
    </tr>
    <tr>
      <td>`@is.cc`</td>
      <td>Validates that the value is a credit card</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.color`</td>
      <td>Validates that the value is a color value (color name or hex)</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.email`</td>
      <td>Validates that the value is an email</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.hex`</td>
      <td>Validates that the value is a hexidecimal</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.price`</td>
      <td>Validates that the value is a price number (ie. 2 decimal numbers)</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.url`</td>
      <td>Validates that the value is a URL</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.boolean`</td>
      <td>Validates that the value is a boolean</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.number`</td>
      <td>Validates that the value is a number format</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.float`</td>
      <td>Validates that the value is a float format</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.integer`</td>
      <td>Validates that the value is an integer format</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@is.object`</td>
      <td>Validates that the value is an object</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </tbody>
</table>

## Field Spec

The following fields can be applied to model columns in an idea file.

```js
name String @field.text
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`@field.color`</td>
      <td>Use a color field to represent this column in a form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.checkbox(attributes?)`</td>
      <td>Use a checkbox to represent this column in a form</td>
      <td>
        label: string 
        <br />check: boolean 
        <br />circle: boolean
        <br />square: boolean
        <br />rounded: boolean
        <br />blue: boolean
        <br />orange: boolean
      </td>
      <td>
        `@field.checkbox`
        <br />`@field.checkbox({ label "Enabled" circle true })`
      </td>
    </tr>
    <tr>
      <td>`@field.country(attributes?)`</td>
      <td>Use a country dropdown to represent this column in a form</td>
      <td>placeholder: string</td>
      <td>
        `@field.country`
        <br />`@field.country({ placeholder "Select Country" })`
      </td>
    </tr>
    <tr>
      <td>`@field.currency(attributes?)`</td>
      <td>Use a currency dropdown to represent this column in a form</td>
      <td>placeholder: string</td>
      <td>
        `@field.currency`
        <br />`@field.currency({ placeholder "Select Currency" })`
      </td>
    </tr>
    <tr>
      <td>`@field.date`</td>
      <td>Use a date field to represent this column in a form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.datetime`</td>
      <td>Use a date time field to represent this column in a form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.editor(attributes?)`</td>
      <td>Use a code editor to represent this column in a form</td>
      <td>
        lang: html|md|css|js|ts
        <br />numbers: boolean</td>
      <td>
        `@field.editor`
        <br />`@field.editor({ lang "html" numbers true })`
      </td>
    </tr>
    <tr>
      <td>`@field.file`</td>
      <td>Use a file input to represent this column in a form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.filelist`</td>
      <td>Use a file list fieldset to represent this column in a form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.input`</td>
      <td>Use an input field to represent this column in a form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.markdown(attributes?)`</td>
      <td>Use a markdown editor to represent this column in a form</td>
      <td>numbers: boolean</td>
      <td>
        `@field.markdown`
        <br />`@field.markdown({ numbers true })`
      </td>
    </tr>
    <tr>
      <td>`@field.mask(attributes)`</td>
      <td>Use an input mask to represent this column in a form</td>
      <td>mask: string</td>
      <td>
        `@field.mask`
        <br />`@field.mask({ mask "999-999-999" })`
      </td>
    </tr>
    <tr>
      <td>`@field.metadata`</td>
      <td>Use a key value fieldset to represent this column in a form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.number(attributes?)`</td>
      <td>Uses a number field to represent this column in a form</td>
      <td>
        min: number
        <br />max: number
        <br />step: number
        <br />separator: string 
        <br />decimal: string
        <br />absolute: boolean
      </td>
      <td>
        `@field.number`
        <br />`@field.number({ min 0 max 10 step 0.01 separator "," decimal "." absolute true })`
      </td>
    </tr>
    <tr>
      <td>`@field.password`</td>
      <td>Uses a password field to represent this column in a form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.range(attributes?)`</td>
      <td>Uses a range field to represent this column in a form</td>
      <td>
        min: number
        <br />max: number
        <br />step: number
        <br />width: number
      </td>
      <td>
        `@field.range`
        <br />`@field.range({ min 0 max 10 step 0.01 width 100 })`
      </td>
    </tr>
    <tr>
      <td>`@field.rating(attributes?)`</td>
      <td>Uses a rating field to represent this column in a form</td>
      <td>max: number</td>
      <td>
        `@field.rating`
        <br />`@field.rating({ max 5 })`
      </td>
    </tr>
    <tr>
      <td>`@field.select(attributes?)`</td>
      <td>Uses a select dropdown to represent this column in a form</td>
      <td>placeholder: string</td>
      <td>
        `@field.select`
        <br />`@field.select({ placeholder "Select Country" })`
      </td>
    </tr>
    <tr>
      <td>`@field.slug`</td>
      <td>
        Uses an input field that transforms the value 
        into a slug to represent this column in a form
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.switch(attributes?)`</td>
      <td>Uses a switch toggle to represent this column in a form</td>
      <td>
        rounded: boolean
        <br />onoff: boolean
        <br />yesno: boolean
        <br />checkex: boolean
        <br />sunmoon: boolean
        <br />ridge: boolean
        <br />smooth: boolean
        <br />blue: boolean
        <br />orange: boolean
        <br />green: boolean
      </td>
      <td>
        `@field.switch`
        <br />`@field.switch({ label "Enabled" yesno true })`
      </td>
    </tr>
    <tr>
      <td>`@field.textarea(attributes?)`</td>
      <td>Uses a textarea field to represent this column in a form</td>
      <td>rows: number</td>
      <td>
        `@field.textarea`
        <br />`@field.textarea({ rows 10 })`
      </td>
    </tr>
    <tr>
      <td>`@field.taglist`</td>
      <td>Uses a tag field to represent this column in a form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.textlist`</td>
      <td>Uses a text list fieldset to represent this column in a form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.time`</td>
      <td>Uses a time field to represent this column in a form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@field.wysiwyg(attributes?)`</td>
      <td>Uses a WYSIWYG to represent this column in a form</td>
      <td>
        history: boolean
        <br />font: boolean
        <br />size: boolean
        <br />format: boolean
        <br />paragraph: boolean
        <br />blockquote: boolean
        <br />style: boolean
        <br />color: boolean
        <br />highlight: boolean
        <br />text: boolean
        <br />remove: boolean
        <br />indent: boolean
        <br />align: boolean
        <br />rule: boolean
        <br />list: boolean
        <br />lineheight: boolean
        <br />table: boolean
        <br />link: boolean
        <br />image: boolean
        <br />video: boolean
        <br />audio: boolean
        <br />fullscreen: boolean
        <br />showblocks: boolean
        <br />code: boolean
        <br />dir: boolean
      </td>
      <td>
        `@field.wysiwyg`
        <br />`@field.wysiwyg({ font true size true format true })`
      </td>
    </tr>
  </tbody>
</table>

## Filter Spec

The following filter fields can be applied to model columns in an idea file.

```js
name String @field.text
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`@filter.color`</td>
      <td>Use a color field to represent this column in a filter form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@filter.checkbox(attributes?)`</td>
      <td>Use a checkbox to represent this column in a filter form</td>
      <td>
        label: string 
        <br />check: boolean 
        <br />circle: boolean
        <br />square: boolean
        <br />rounded: boolean
        <br />blue: boolean
        <br />orange: boolean
      </td>
      <td>
        `@filter.checkbox`
        <br />`@filter.checkbox({ label "Enabled" circle true })`
      </td>
    </tr>
    <tr>
      <td>`@filter.country(attributes?)`</td>
      <td>Use a country dropdown to represent this column in a filter form</td>
      <td>placeholder: string</td>
      <td>
        `@filter.select`
        <br />`@filter.select({ placeholder "Select Country" })`
      </td>
    </tr>
    <tr>
      <td>`@filter.currency(attributes?)`</td>
      <td>Use a currency dropdown to represent this column in a filter form</td>
      <td>placeholder: string</td>
      <td>
        `@filter.currency`
        <br />`@filter.currency({ placeholder "Select Currency" })`
      </td>
    </tr>
    <tr>
      <td>`@filter.date`</td>
      <td>Use a date field to represent this column in a filter form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@filter.datetime`</td>
      <td>Use a date time field to represent this column in a filter form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@filter.file`</td>
      <td>Use a file input to represent this column in a filter form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@filter.input`</td>
      <td>Use an input field to represent this column in a filter form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@filter.mask(attributes)`</td>
      <td>Use an input mask to represent this column in a filter form</td>
      <td>mask: string</td>
      <td>
        `@filter.mask`
        <br />`@filter.mask({ mask "999-999-999" })`
      </td>
    </tr>
    <tr>
      <td>`@filter.number(attributes?)`</td>
      <td>Uses a number field to represent this column in a filter form</td>
      <td>min: number
      <br />max: number
      <br />step: number
      <br />separator: string 
      <br />decimal: string
      <br />absolute: boolean</td>
      <td>
        `@filter.number`
        <br />`@filter.number({ min 0 max 10 step 0.01 separator "," decimal "." absolute true })`
      </td>
    </tr>
    <tr>
      <td>`@filter.password`</td>
      <td>Uses a password field to represent this column in a filter form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@filter.range(attributes?)`</td>
      <td>Uses a range field to represent this column in a filter form</td>
      <td>
        min: number
        <br />max: number
        <br />step: number
        <br />width: number</td>
      <td>
        `@filter.range`
        <br />`@filter.range({ min 0 max 10 step 0.01 width 100 })`
      </td>
    </tr>
    <tr>
      <td>`@filter.rating(attributes?)`</td>
      <td>Uses a rating field to represent this column in a filter form</td>
      <td>max: number</td>
      <td>
        `@filter.rating`
        <br />`@filter.rating({ max 5 })`
      </td>
    </tr>
    <tr>
      <td>`@filter.select(attributes?)`</td>
      <td>Uses a select dropdown to represent this column in a filter form</td>
      <td>placeholder: string</td>
      <td>
        `@filter.select`
        <br />`@filter.select({ placeholder "Select Country" })`
      </td>
    </tr>
    <tr>
      <td>`@filter.slug`</td>
      <td>
        Uses an input field that transforms the value into a slug to 
        represent this column in a filter form
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@filter.switch(attributes?)`</td>
      <td>Uses a switch toggle to represent this column in a filter form</td>
      <td>
        rounded: boolean
        <br />onoff: boolean
        <br />yesno: boolean
        <br />checkex: boolean
        <br />sunmoon: boolean
        <br />ridge: boolean
        <br />smooth: boolean
        <br />blue: boolean
        <br />orange: boolean
        <br />green: boolean
      </td>
      <td>
        `@filter.switch`
        <br />`@filter.switch({ label "Enabled" yesno true })`
      </td>
    </tr>
    <tr>
      <td>`@filter.time`</td>
      <td>Uses a time field to represent this column in a filter form</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </tbody>
</table>

### Spans

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`@span.date`</td>
      <td>
        Use a pair of date fields as a span to represent 
        this column in a filter form
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@span.datetime`</td>
      <td>
        Use a pair of date time fields as a span to represent 
        this column in a filter form
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@span.input`</td>
      <td>
        Use a pair of input fields as a span to represent 
        this column in a filter form
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@span.number(attributes?)`</td>
      <td>
        Use a pair of number fields as a span to represent 
        this column in a filter form
      </td>
      <td>
        min: number
        <br />max: number
        <br />step: number
        <br />separator: string 
        <br />decimal: string
        <br />absolute: boolean
      </td>
      <td>
        `@span.number`
        <br />`@span.number({ min 0 max 10 step 0.01 separator "," decimal "." absolute true })`
      </td>
    </tr>
    <tr>
      <td>`@span.range(attributes?)`</td>
      <td>Use a range field as a span to represent this column in a filter form</td>
      <td>
        min: number
        <br />max: number
        <br />step: number
        <br />width: number
      </td>
      <td>
        `@span.range`
        <br />`@span.range({ min 0 max 10 step 0.01 width 100 })`
      </td>
    </tr>
    <tr>
      <td>`@span.rating(attributes?)`</td>
      <td>
        Use a pair of rating fields as a span to represent 
        this column in a filter form
      </td>
      <td>max: number</td>
      <td>
        `@span.rating`
        <br />`@span.rating({ max 5 })`
      </td>
    </tr>
    <tr>
      <td>`@span.select(attributes?)`</td>
      <td>Use a pair of select dropdowns as a span to represent this column in a filter form</td>
      <td>placeholder: string</td>
      <td>
        `@span.select`
        <br />`@span.select({ placeholder "Select Country" })`
      </td>
    </tr>
    <tr>
      <td>`@span.time`</td>
      <td>
        Use a pair of time fields as a span to represent this 
        column in a filter form
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </body>
</table>

## List Spec

The following list format fields can be applied to model columns in an idea file.

```js
created Datetime @list.date({ locale "en" })
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`@list.hide`</td>
      <td>Hides this column in a formatted list of results</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@list.code(attributes?)`</td>
      <td>
        Uses a code format to represent this column in a 
        formatted list of results
      </td>
      <td>
        lang: string
        <br />numbers: boolean 
        <br />inline: boolean
        <br />trim: boolean
        <br />ltrim: boolean
        <br />rtrim: boolean
      </td>
      <td>
        `@list.code`
        <br />`@list.code(lang "en" trim true)`
      </td>
    </tr>
    <tr>
      <td>`@list.color(attributes?)`</td>
      <td>
        Uses a code color to represent this column in a 
        formatted list of results
      </td>
      <td>box: boolean<br />text: boolean</td>
      <td>
        `@list.color`
        <br />`@list.color(box true text true)`
      </td>
    </tr>
    <tr>
      <td>`@list.country(attributes?)`</td>
      <td>
        Uses a country format to represent this column 
        in a formatted list of results
      </td>
      <td>flag: boolean<br />text: boolean</td>
      <td>
        `@list.country`
        <br />`@list.country(flag true text true)`
      </td>
    </tr>
    <tr>
      <td>`@list.currency(attributes?)`</td>
      <td>
        Uses a currency format to represent this column 
        in a formatted list of results
      </td>
      <td>
        flag: boolean
        <br />text: boolean
      </td>
      <td>
        `@list.currency`
        <br />`@list.currency(flag true text true)`
      </td>
    </tr>
    <tr>
      <td>`@list.date(attributes?)`</td>
      <td>
        Uses a date format to represent this column 
        in a formatted list of results
      </td>
      <td>locale: string
      <br />format: string</td>
      <td>
        `@list.date`
        <br />`@list.date(locale "en" format "MMMM D, YYYY, h:mm:ss a")`
      </td>
    </tr>
    <tr>
      <td>`@list.email`</td>
      <td>
        Uses an email format to represent this column in a 
        formatted list of results
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@list.formula(attributes)`</td>
      <td>
        Outputs the value of the given formula in a formatted list of results
      </td>
      <td>
        formula: string
        <br />data: object
      </td>
      <td>
        `@list.formula(formula "{x} + {this} + {y}" data { x 3 y 4 })`
      </td>
    </tr>
    <tr>
      <td>`@list.html(attributes?)`</td>
      <td>
        Uses a raw HTML format to represent this 
        column in a formatted list of results
      </td>
      <td>
        ordered: boolean
        <br />indent: number
        <br />spacing: number
      </td>
      <td>
        `@list.html`
        <br />`@list.html({ ordered true indent 10 spacing 10 })`
      </td>
    </tr>
    <tr>
      <td>`@list.image`</td>
      <td>
        Uses a image format to represent this column 
        in a formatted list of results
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@list.imagelist`</td>
      <td>
        Uses an image carousel to represent this column in a 
        formatted list of results. Ideally for an array of strings.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@list.json`</td>
      <td>
        Uses a json format to represent this column in a formatted 
        list of results. Ideally for arrays or objects.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@list.link`</td>
      <td>
        Uses a clickable link to represent this column 
        in a formatted list of results
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@list.list`</td>
      <td>
        Uses a list (ordered or unordered) to represent this 
        column in a formatted list of results. Ideally for an 
        array of strings
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@list.markdown`</td>
      <td>
        Converts the column value from markdown to raw HTML 
        to represent this column in a formatted list of results
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@list.metadata(attributes?)`</td>
      <td>
        Outputs the keys and values of the columns value in 
        tabular format. Ideally for a key value object.
      </td>
      <td>padding: number
      <br />align: left|right|center
      <br />format: boolean</td>
      <td>
        `@list.metadata`
        <br />`@list.metadata({ padding 10 align "left" format true })`
      </td>
    </tr>
    <tr>
      <td>`@list.number(attributes?)`</td>
      <td>
        Uses a number format to represent this column in 
        a formatted list of results
      </td>
      <td>separator: string
      <br />decimal: string
      <br />decimals: number
      <br />absolute: boolean</td>
      <td>
        `@list.number`
        <br />`@list.number({ separator "," decimal "." decimals 4 absolute true })`
      </td>
    </tr>
    <tr>
      <td>`@list.overflow(attributes?)`</td>
      <td>
        Uses a format that considers text overflows to represent 
        this column in a formatted list of results
      </td>
      <td>length: number
      <br />words: boolean
      <br />hellip: boolean</td>
      <td>
        `@list.overflow`
        <br />`@list.overflow({ length 10 words true hellip true})`
      </td>
    </tr>
    <tr>
      <td>`@list.phone(attributes?)`</td>
      <td>
        Uses a phone format to represent this column in a 
        formatted list of results
      </td>
      <td>label: string</td>
      <td>
        `@list.phone`
        <br />`@list.phone({ label "Call Me Maybe" })`
      </td>
    </tr>
    <tr>
      <td>`@list.rating(attributes?)`</td>
      <td>
        Uses a rating format to represent this column 
        in a formatted list of results
      </td>
      <td>max: number
      <br />remainder: boolean
      <br />round: round|ceil|floor
      <br />spacing: number</td>
      <td>
        `@list.rating`
        <br />`@list.rating({ max 5 remainder true round "floor" spacing 10 })`
      </td>
    </tr>
    <tr>
      <td>`@list.separated(attributes?)`</td>
      <td>
        Uses a separator format to represent this column in a 
        formatted list of results. Ideally for an array of strings.
      </td>
      <td>separator: string</td>
      <td>
        `@list.separated`
        <br />`@list.separated({ separator ", " })`
      </td>
    </tr>
    <tr>
      <td>`@list.table(attributes?)`</td>
      <td>
        Uses a tablular format to represent this column in a formatted 
        list of results. Ideally for an array of objects.
      </td>
      <td>
        top: boolean
        <br />left: boolean
        <br />right: boolean
        <br />padding: number
        <br />align: left|right|center
        <br />background: color
        <br />border: color
        <br />header: color
        <br />stripe: color
      </td>
      <td>
        `@list.table`
        <br />`@list.table({ align "left" top true padding 100 background "blue" header "#CCC" })`
      </td>
    </tr>
    <tr>
      <td>`@list.taglist(attributes?)`</td>
      <td>
        Uses a tag list format to represent this column in a formatted 
        list of results. Ideally for an array of strings.
      </td>
      <td>
        curved: boolean
        <br />rounded: boolean
        <br />pill: boolean
        <br />info: boolean
        <br />warning: boolean
        <br />success: boolean
        <br />error: boolean
        <br />muted: boolean
        <br />primary: boolean
        <br />color: color
        <br />secondary: boolean
        <br />outline: boolean
        <br />solid: boolean
        <br />transparent: boolean
      </td>
      <td>
        `@list.taglist`
        <br />`@list.taglist({ curved true info true outline true })`
      </td>
    </tr>
    <tr>
      <td>`@list.template(attributes)`</td>
      <td>
        Uses a template to generate a text to represent 
        this column in a formatted list of results
      </td>
      <td>template: string</td>
      <td>`@list.template({ template "{{foo}} and {{bar}}" })`</td>
    </tr>
    <tr>
      <td>`@list.text(attributes?)`</td>
      <td>
        Uses a text format to represent this column in 
        a formatted list of results
      </td>
      <td>upper: boolean
      <br />lower: boolean
      <br />capital: boolean</td>
      <td>
        `@list.text`
        <br />`@list.text({ upper true })`
      </td>
    </tr>
    <tr>
      <td>`@list.yesno(attributes?)`</td>
      <td>
        Converts a boolean to a string representation to 
        represent this column in a formatted list of results
      </td>
      <td>yes: string<br />no: string</td>
      <td>
        `@list.yesno`
        <br />`@list.yesno({ yes "Yep" no "Nah" })`
      </td>
    </tr>
  </tbody>
</table>

## View Spec

The following view format fields can be applied to model columns in an idea file.

```js
created Datetime @view.date({ locale "en" })
```

<table cellspacing="0" cellpadding="0" border="1">
  <thead>
    <tr>
      <th align="left">Attribute</th>
      <th align="left">Description</th>
      <th align="left">Attributes</th>
      <th align="left">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`@view.hide`</td>
      <td>Hides this column in a view</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@view.code(attributes?)`</td>
      <td>Uses a code format to represent this column in a view</td>
      <td>
        lang: string
        <br />numbers: boolean 
        <br />inline: boolean
        <br />trim: boolean
        <br />ltrim: boolean
        <br />rtrim: boolean
      </td>
      <td>
        `@view.code`
        <br />`@view.code(lang "en" trim true)`
      </td>
    </tr>
    <tr>
      <td>`@view.color(attributes?)`</td>
      <td>Uses a code color to represent this column in a view</td>
      <td>box: boolean<br />text: boolean</td>
      <td>
        `@view.color`
        <br />`@view.color(box true text true)`
      </td>
    </tr>
    <tr>
      <td>`@view.country(attributes?)`</td>
      <td>Uses a country format to represent this column in a view</td>
      <td>flag: boolean<br />text: boolean</td>
      <td>
        `@view.country`
        <br />`@view.country(flag true text true)`
      </td>
    </tr>
    <tr>
      <td>`@view.currency(attributes?)`</td>
      <td>Uses a currency format to represent this column in a view</td>
      <td>flag: boolean<br />text: boolean</td>
      <td>
        `@view.currency`
        <br />`@view.currency(flag true text true)`
      </td>
    </tr>
    <tr>
      <td>`@view.date(attributes?)`</td>
      <td>Uses a date format to represent this column in a view</td>
      <td>locale: string<br />format: string</td>
      <td>
        `@view.date`
        <br />`@view.date(locale "en" format "MMMM D, YYYY, h:mm:ss a")`
      </td>
    </tr>
    <tr>
      <td>`@view.email`</td>
      <td>Uses an email format to represent this column in a view</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@view.formula(attributes?)`</td>
      <td>Outputs the value of the given formula in a view</td>
      <td>formula: string</td>
      <td>`@view.formula(formula "{x} + {this} + {y}" data { x 3 y 4 })`</td>
    </tr>
    <tr>
      <td>`@view.html(attributes?)`</td>
      <td>Uses a raw HTML format to represent this column in a view</td>
      <td>
        ordered: boolean
        <br />indent: number
        <br />spacing: number
      </td>
      <td>
        `@view.html`
        <br />`@view.html({ ordered true indent 10 spacing 10 })`
      </td>
    </tr>
    <tr>
      <td>`@view.image`</td>
      <td>Uses a image format to represent this column in a view</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@view.imagelist`</td>
      <td>
        Uses an image carousel to represent this column in 
        a view. Ideally for an array of strings.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@view.json`</td>
      <td>
        Uses a json format to represent this column in a view. 
        Ideally for arrays or objects.
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@view.link`</td>
      <td>Uses a clickable link to represent this column in a view</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@view.list`</td>
      <td>
        Uses a list (ordered or unordered) to represent this 
        column in a view. Ideally for an array of strings
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@view.markdown`</td>
      <td>
        Converts the column value from markdown to raw HTML 
        to represent this column in a view
      </td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>`@view.metadata(attributes?)`</td>
      <td>
        Outputs the keys and values of the columns value 
        in tabular format. Ideally for a key value object.
      </td>
      <td>
        padding: number
        <br />align: left|right|center
        <br />format: boolean
      </td>
      <td>
        `@view.metadata`
        <br />`@view.metadata({ padding 10 align "left" format true })`
      </td>
    </tr>
    <tr>
      <td>`@view.number(attributes?)`</td>
      <td>Uses a number format to represent this column in a view</td>
      <td>
        separator: string
        <br />decimal: string
        <br />decimals: boolean
        <br />absolute: boolean
      </td>
      <td>
        `@view.number`
        <br />`@view.number({ separator "," decimal "." decimals 4 absolute true })`
      </td>
    </tr>
    <tr>
      <td>`@view.overflow(attributes?)`</td>
      <td>
        Uses a format that considers text overflows to represent 
        this column in a view
      </td>
      <td>
        length: number
        <br />words: boolean
        <br />hellip: boolean
      </td>
      <td>
        `@view.overflow`
        <br />`@view.overflow({ length 10 words true hellip true})`
      </td>
    </tr>
    <tr>
      <td>`@view.phone(attributes?)`</td>
      <td>Uses a phone format to represent this column in a view</td>
      <td>label: string</td>
      <td>
        `@view.phone`
        <br />`@view.phone({ label "Call Me Maybe" })`
      </td>
    </tr>
    <tr>
      <td>`@view.rating(attributes?)`</td>
      <td>Uses a rating format to represent this column in a view</td>
      <td>
        max: number
        <br />remainder: boolean
        <br />round: round|ceil|floor
        <br />spacing: number
      </td>
      <td>
        `@view.rating`
        <br />`@view.rating({ max 5 remainder true round "floor" spacing 10 })`
      </td>
    </tr>
    <tr>
      <td>`@view.separated(attributes?)`</td>
      <td>
        Uses a separator format to represent this column in a 
        view. Ideally for an array of strings.
      </td>
      <td>separator: string</td>
      <td>
        `@view.separated`
        <br />`@view.separated({ separator ", " })`
      </td>
    </tr>
    <tr>
      <td>`@view.table(attributes?)`</td>
      <td>
        Uses a tablular format to represent this column 
        in a view. Ideally for an array of objects.
      </td>
      <td>
        top: boolean
        <br />left: boolean
        <br />right: boolean
        <br />padding: number
        <br />align: left|right|center
        <br />background: color
        <br />border: color
        <br />header: color
        <br />stripe: color
      </td>
      <td>
        `@view.table`
        <br />`@view.table({ align "left" top true padding 100 background "blue" header "#CCC" })`
      </td>
    </tr>
    <tr>
      <td>`@view.taglist(attributes?)`</td>
      <td>
        Uses a tag list format to represent this column in 
        a view. Ideally for an array of strings.
      </td>
      <td>
        curved: boolean
        <br />rounded: boolean
        <br />pill: boolean
        <br />info: boolean
        <br />warning: boolean
        <br />success: boolean
        <br />error: boolean
        <br />muted: boolean
        <br />primary: boolean
        <br />color: boolean
        <br />secondary: boolean
        <br />outline: boolean
        <br />solid: boolean
        <br />transparent: boolean
      </td>
      <td>
        `@view.taglist`
        <br />`@view.taglist({ curved true info true outline true })`
      </td>
    </tr>
    <tr>
      <td>`@view.template(attributes?)`</td>
      <td>Uses a template to generate a text to represent this column in a view</td>
      <td>template: string</td>
      <td>`@view.template({ template "{{foo}} and {{bar}}" })`</td>
    </tr>
    <tr>
      <td>`@view.text(attributes?)`</td>
      <td>Uses a text format to represent this column in a view</td>
      <td>
        upper: boolean
        <br />lower: boolean
        <br />capital: boolean
      </td>
      <td>
        `@view.text`
        <br />`@view.text({ upper true })`
      </td>
    </tr>
    <tr>
      <td>`@view.yesno(attributes?)`</td>
      <td>
        Converts a boolean to a string representation to 
        represent this column in a view
      </td>
      <td>yes: string<br />no: string</td>
      <td>
        `@view.yesno`
        <br />`@view.yesno({ yes "Yep" no "Nah" })`
      </td>
    </tr>
  </tbody>
</table>
