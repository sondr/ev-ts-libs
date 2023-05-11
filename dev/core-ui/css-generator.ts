const newLine = '\r\n';
export class CssGenerator {
  static create(baseSelector: string = "") {
    return new CssGenerator(baseSelector);
  }

  constructor(_baseSelector: string = "") { }

  private _cssString: string;
  private _parts: CssPart[] = [];
  private _built: boolean = false;


  get cssString() {
    if (!this._built) {
      this.buildCssString();
    }

    return this._cssString;
  }
  get parts() {
    return this._parts;
  }


  public setParts(parts: CssPart[]) {
    this._parts = parts || [];

    return this.chain();
  }
  public appendParts(parts: CssPart[]) {
    this._parts.push(...parts);

    return this.chain();
  }

  appendPartsCustom(cb: () => CssPart[]) {
    const parts = cb();
    this.appendParts(parts);
  }

  public appendPart(part: CssPart) {
    this._parts.push(part);

    return this.chain();
  }

  public reset() {
    this.setParts([]);
    return this.chain()
  }




  private chain() {
    this._built = false;
    this._cssString = "";
    return this;
  }

  private buildCssString() {
    let string = this._parts.reduce((prevVal, val, idx) => {
      let content = val.props?.reduce((propPrevVal, propVal, propIdx) =>
        propPrevVal + newLine + `${propVal[0]}:${propVal[1]};`, '');

      return prevVal + newLine + `${val.sel}{${content}${newLine}}`;
    }, '');

    this._cssString = string;
    this._built = true;

    return this._cssString;
  }

}

export class CssPart {
  constructor(
    public sel?: string,
    public props?: ArrayPair<string, string>[]
  ) { }

  static prop(name: string, value: string): ArrayPair<string, string> {
    return [name, value];
  }

}

interface ArrayPair<T, T2> {
  0: T;
  1: T2;
  2?: undefined;
}
