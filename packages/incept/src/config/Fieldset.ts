import type { ColumnInfo } from './types';
import type Registry from './Registry';

import Mustache from 'mustache';
import Attributes from './Attributes';
import Column from './Column';
import { camelize, capitalize, dasherize, generators } from './helpers';

export default class Fieldset {
  //stores the registry
  public readonly registry: Registry;
  //name of the fieldset
  public readonly name: string;
  //attributes of the fieldset
  public readonly attributes: Attributes;
  //columns of the fieldset
  public readonly columns: Map<string, Column>;

  /**
   * Returns all the columns with assertions
   */
  public get assertions() {
    return Array.from(this.columns.values()).filter(
      column => column.assertions.length > 0
    );
  }

  /**
   * Returns the camel cased fieldset name
   */
  public get camel() {
    return camelize(this.name);
  }

  /**
   * Returns the dashed fieldset name
   */
  public get dash() {
    return dasherize(this.name);
  }

  /**
   * Returns the default values
   */
  public get defaults() {
    const defaults: Record<string, any> = {};
    for (const column of this.columns.values()) {
      if (column.default === undefined 
        || generators.includes(column.default)
      ) {
        continue;
      }
      defaults[column.name] = column.default;
    }
    return defaults;
  }

  /**
   * Returns all the enum columns
   */
  public get enums() {
    return Array.from(this.columns.values()).filter(
      column => column.enum !== null
    );
  }

  /**
   * Returns all the field columns
   */
  public get fields() {
    return Array.from(this.columns.values()).filter(
      column => column.field.method !== 'none'
    );
  }

  /**
   * Returns all the types that are fieldsets
   */
  public get fieldsets(): Column[] {
    //address Address[]
    return Array.from(this.columns.values()).filter(
      column => !!column.fieldset
    );
  }

  /**
   * Returns the icon
   */
  public get icon() {
    const icon = this.attributes.icon as string[];
    return icon[0] || null;
  }

  /**
   * Returns all the indexable columns
   */
  public get label() {
    return this.attributes.labels;
  }

  /**
   * Returns all the listable columns
   */
  public get lists() {
    return Array.from(this.columns.values()).filter(
      column => column.list.method !== 'hide'
    );
  }

  /**
   * Returns the lower cased fieldset name
   */
  public get lower() {
    return this.name.toLocaleLowerCase();
  }

  /**
   * Returns the schema plural label
   */
  public get plural() {
    return this.attributes.labels[1] || this.name;
  }

  /**
   * Returns the schema singular label
   */
  public get singular() {
    return this.attributes.labels[0] || this.name;
  }

  /**
   * Returns the fieldset @template
   */
  public get template() {
    return this.attributes.template;
  }

  /**
   * Returns the capitalized column name
   */
  public get title() {
    return capitalize(this.name);
  }

  /**
   * Returns all the viewable columns
   */
  public get views() {
    return Array.from(this.columns.values()).filter(
      column => column.view.method !== 'hide'
    );
  }

  /**
   * Sets the fieldset and column information 
   */
  public constructor(
    registry: Registry,
    name: string, 
    attributes: Record<string, unknown>, 
    columns: ColumnInfo[]
  ) {
    this.registry = registry;
    this.name = name;
    this.attributes = new Attributes(Object.entries(attributes));
    this.columns = new Map(columns.map(
      info =>[ info.name, new Column(this, info) ]
    ));
  }

  /**
   * Returns a column by name
   */
  public column(name: string) {
    return this.columns.get(name);
  }

  /**
   * Renders a template given the data
   */
  public render(data: Record<string, any>) {
    if (!this.template) {
      return '';
    }
    return Mustache.render(this.template, data);
  }
}