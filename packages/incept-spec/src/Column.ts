import type { ColumnInfo, EnumConfig } from './types';
import type Fieldset from './Fieldset';

import Attributes from './Attributes';

export const toValidator: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'integer',
  Float: 'float',
  Boolean: 'boolean',
  Date: 'date',
  Datetime: 'date',
  Time: 'date',
  Json: 'object',
  Object: 'object',
  Hash: 'object'
};

export default class Column {
  //ex. String, Number, Date, etc.
  public readonly type: string;
  //name of the column
  public readonly name: string;
  //whether if the column is required
  public readonly required: boolean;
  //whether if the column is multiple values
  public readonly multiple: boolean;
  //column attributes
  public readonly attributes: Attributes;
  //the fieldset this column belongs to
  protected _fieldset: Fieldset;

  /**
   * Returns true if this column is an @active column
   */
  public get active() {
    return this.attributes.active;
  }

  /**
   * Returns the column attributes
   * example: @foo @bar() ...
   */
  public get assertions() {
    //if column is system generated
    //if column is a relation to another model
    //if column is related to another model
    if (this.attributes.generated || this.relation || this.related) {
      //then there is no need to validate
      //relation columns are not assertable
      //related columns are not assertable
      return [];
    }
    //explicit validators
    const assertions = this.attributes.assertions;
    //implied validators
    // String, Text,    Number, Integer, 
    // Float,  Boolean, Date,   Datetime, 
    // Time,   Json,    Object, Hash
    for (const type in toValidator) {
      if (this.type === type) {
        if (this.multiple) {
          if (!assertions.find(v => v.method === 'array')) {
            assertions.unshift({ 
              method: 'array', 
              args: [ toValidator[type] ], 
              message: 'Invalid format'
            });
          }
        } else if (!assertions.find(v => v.method === toValidator[type])) {
          assertions.unshift({ 
            method: toValidator[type], 
            args: [], 
            message: 'Invalid format'
          });
        }
      }
    }
    // - enum
    if (this.enum && !assertions.find(v => v.method === 'option')) {
      assertions.unshift({ 
        method: 'option', 
        args: Object.values(this.enum), 
        message: 'Invalid option'
      });
    }
    // - unique
    if (this.attributes.unique) {
      if (!assertions.find(v => v.method === 'unique')) {
        assertions.unshift({ 
          method: 'unique', 
          args: [], 
          message: 'Already exists'
        });
      }
    }
    // - required
    if (!this.multiple 
      && this.required 
      && typeof this.attributes.default === 'undefined'
    ) {
      if (!assertions.find(v => v.method === 'required')) {
        assertions.unshift({ 
          method: 'required', 
          args: [], 
          message: `${this.name} is required`
        });
      }
    }
    return assertions;
  }

  /**
   * Returns a char length if ever
   */
  public get clen() {
    return this.attributes.clen;
  }

  /**
   * Returns the column @default value
   * example: @default("some value")
   */
  public get default() {
    //@default("some value")
    return this.attributes.default;
  }

  /**
   * If type is an enum, this returns the enum configuration
   */
  public get enum(): EnumConfig | null {
    return this._fieldset.registry.enum.get(this.type) || null;
  }

  /**
   * Returns the column field (defaults to none)
   * example: @field.text({type "text"})
   */
  public get field() {
    return this.attributes.field;
  }

  /**
   * If type is a fieldset, this returns the fieldset instance
   */
  public get fieldset(): Fieldset | null {
    return this._fieldset.registry.fieldset.get(this.type) || null;
  }

  /**
   * Returns true if column is @filterable
   */
  public get filterable() {
    return this.attributes.filterable;
  }

  /**
   * Returns true if column is @generated
   */
  public get generated() {
    return this.attributes.generated;
  }

  /**
   * Returns true if column is an @id
   */
  public get id() {
    return this.attributes.id;
  }

  /**
   * Returns true if column is @filterable, @searchable, or @sortable
   */
  public get indexable() {
    return this.attributes.indexable;
  }

  /**
   * Returns the column @label
   * example: @label("Some Label")
   */
  public get label() {
    return this.attributes.label || this.name;
  }

  /**
   * Returns the column list format (defaults to none)
   * example: @list.char({length 1})
   */
  public get list() {
    return this.attributes.list;
  }

  /**
   * Returns the highest number value
   */
  public get max() {
    return this.attributes.max;
  }

  /**
   * Returns the lowest number value
   */
  public get min() {
    return this.attributes.min;
  }

  /**
   * Returns number step value
   */
  public get step() {
    const step = this.attributes.step;
    if (step === 1 && this.type === 'Float') {
      return 0.01;
    }
    return step || 1;
  }

  /**
   * If type is a model, this returns the model instance
   */
  public get model() {
    return this._fieldset.registry.model.get(this.type) || null;
  }

  /**
   * Returns the related column, if any
   * example: user User 
   */
  public get related() {
    //get foreign model
    //example: user User[]
    const model = this._fieldset.registry.model.get(this.type);
    //if no model is found
    if (!model) {
      return null;
    }
    //get the foreign model's relational column
    const column = Array.from(model.columns.values())
      //example: user User @relation(local "userId" foreign: "id")
      .filter(column => !!column.relation)
      //example: user User @relation(...) === user User[]
      .find(column => column.type ===  this._fieldset.name);
    if (!column?.relation) {
      return null;
    }
    return column.relation;
  }

  /**
   * Returns the column relation
   */
  public get relation() {
    //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
    const relation = this.attributes.relation;
    //if no relation data or this column type is not a model
    if (!relation || !this.model) {
      return null;
    }
    //get the foreign (parent) and local (child) model
    const models = { parent: this.model, child: this._fieldset };
    //get all the columns of foreign model where the type is this model
    let foreignColumns = Array.from(models.parent.columns.values()).filter(
      //ie. users User[]
      column => column.type === this._fieldset.name
    ).filter(
      //filter again if the local column has a relation name
      //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
      //to. connections User[]
      column => !relation.name || relation.name === column.name
    );
    //if no columns are found
    if (foreignColumns.length === 0) {
      //then it's not a valid relation
      return null;
    }
    //get the foreign (parent) and local (child) columns
    const columns = { 
      //ie. users User[]
      //or. connections User[]
      parent: foreignColumns[0], 
      //user User @relation(local "userId" foreign: "id")
      //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
      child: this as Column
    };
    //get the foreign (parent) and local (child) keys
    //ie. @relation(local "userId" foreign: "id")
    const keys = { 
      parent: models.parent.column(relation.foreign) as Column, 
      child: models.child.column(relation.local) as Column
    };
    if (!keys.parent || !keys.child) {
      return null;
    }
    //get the parent and child relation types
    const types = {
      //ie. user User
      //ie. user User?
      //ie. users User[]
      parent: columns.parent.multiple ? 2 : columns.parent.required ? 1 : 0,
      //ie. user User @relation(local "userId" foreign: "id")
      child: columns.child.multiple ? 2 : columns.child.required ? 1 : 0
    };

    return { 
      parent: { 
        model: models.parent, 
        column: columns.parent, 
        key: keys.parent, 
        type: types.parent 
      }, 
      child: { 
        model: models.child, 
        column: columns.child, 
        key: keys.child, 
        type: types.child 
      } 
    };
  }

  /**
   * Returns true if column is @searchable
   */
  public get searchable() {
    return this.attributes.searchable;
  }

  /**
   * Returns information on how this column 
   * should look like in a database schema
   */
  public get schema() {
    const type = (() => {
      if (Boolean(this.fieldset 
        || this.multiple || this.type === 'Json' 
        || this.type === 'Object' || this.type === 'Hash'
      )) {
        return 'json';
      } else if ([ 
        'Char', 'Text', 'Integer', 'Float', 'Boolean', 
        'Date', 'Time', 'Datetime', 'Binary', 'Timestamp'
      ].includes(this.type)) {
        return this.type.toLowerCase();
      } else if (this.type === 'Number') {
        return String(this.step).split('.')[1].length > 0 
          ? 'float' 
          : 'integer';
      } else if (this.enum) {
        return 'enum';
      }
      return 'varchar';
    })();
    const length = (() => {
      if (type === 'enum' && this.enum) {
        return [ Math.max(...Object.values(this.enum).map(
          value => String(value).length
        )), 0 ];
      } else if (type === 'char' || type === 'varchar') {
        return [ Math.min(this.clen || 255, 255), 0];
      } else if (type === 'integer') {
        return [ String(this.max).split('.')[0].length, 0 ];
      } else if (type === 'float') {
        return [ 
          String(this.max).split('.')[0].length, 
          String(this.step).split('.')[1].length 
        ];
      }
      return [ 0, 0 ];
    })();
    const defaults = this.default ? this.default
      : this.required ? null 
      : undefined;
    const unsigned = this.min >= 0;
    const increment = Boolean(this.attributes.get('increment'));
    const index = this.id ? 'primary'
      : this.unique ? 'unique' 
      : this.indexable ? 'index'
      : undefined;
    return { type, length, defaults, unsigned, increment, index };
  }

  /**
   * Returns true if column is @sortable
   */
  public get sortable() {
    return this.attributes.sortable;
  }

  /**
   * Returns true if column is @spanable
   */
  public get spanable() {
    return this.attributes.spanable;
  }

  /**
   * Returns true if column is @unique
   */
  public get unique() {
    return this.attributes.unique;
  }

  /**
   * Returns the column @view format (defaults to none)
   * example: @view.char({length 1})
   */
  public get view() {
    return this.attributes.view;
  }

  /**
   * Sets the fieldset and column information
   */
  public constructor(fieldset: Fieldset, info: ColumnInfo) {
    this._fieldset = fieldset;
    this.type = info.type;
    this.name = info.name;
    this.multiple = info.multiple;
    this.required = info.required;
    this.attributes = new Attributes(
      Object.entries(info.attributes)
    );
  }
  
  /**
   * Returns a column attribute
   */
  public attribute(name: string) {
    return this.attributes.get(name);
  }
}