import { bindable, customElement } from 'aurelia-framework';

const regularInputs = [
  'text', 'number', 'email', 'tel', 'checkbox', 'password',  // defaults
  'color' //'date' // probable migration to own custom-elements
] as const;
type InputType = typeof regularInputs[number];

customElement('au-matrix')
export class AuMatrixComponent {
  @bindable inputClass: string = "";
  @bindable editable: boolean = true;
  @bindable
  private model: IMAtrixModel;
  modelChanged(model: IMAtrixModel) {
    this.buildMatrix();
  }

  private colTitles: string[];
  private matrix: MatrixField[][] = [];
  private unsavedActions: boolean = false;

  toggleEdit(row: MatrixField) {
    if (!this.editable) { return; }
    row.readonly = !row.readonly;
  }

  buildMatrix() {
    if (this.canBuildModel) {
      return;
    }


    this.colTitles = this.model.columns.map(e => e.name);

    const fields: MatrixField[][] = this.model.rows.map(row => {
      return this.model.columns.map(col => {
        let key = col.key;
        let field: MatrixField = new MatrixField({
          colId: col.id,
          rowId: row.id,
          type: col.type,
          value: row.data[key],
          readonly: true
        });

        return field;
      });
    });

    this.matrix = fields;
  }

  get canBuildModel() {
    return this.model?.columns?.length && this.model?.rows?.length;


  }

  // not ready
  changesPrompt() {
    return !this.unsavedActions;
  }

}

interface IMAtrixField {
  colId: string;
  rowId: string;
  type: InputType;
  value: any;
  readonly: boolean;
}

class MatrixField implements IMAtrixField {
  public readonly type: InputType;
  public readonly colId: string;
  public readonly rowId: string;

  private initValue: any;

  public value: any;
  public readonly: boolean;

  constructor(args: IMAtrixField) {
    this.type = args.type;
    this.colId = args.colId;
    this.rowId = args.rowId;

    this.initValue = args.value;

    this.value = args.value;
    this.readonly = args.readonly;
  }

  public hasChanged() {
    return this.value == this.initValue;
  }

  public revert() {
    this.value = this.initValue;
  }
}

export interface IRow {
  id: string;
  name: string;
  data: Object;
}

export interface IColumn {
  id: string;
  type: InputType;
  name: string;
  key: string;
}

export interface IMAtrixModel {
  columnTitle: string;
  columns: IColumn[];

  rowTitle: string;
  rows: IRow[];
}