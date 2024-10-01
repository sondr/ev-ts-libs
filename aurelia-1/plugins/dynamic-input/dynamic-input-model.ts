import { IDynamicInputModel } from "./interfaces";

function clone<T>(obj: T) { return JSON.parse(JSON.stringify(obj)); };

export class DynamicInputModel<T> {
    private initialModel: T;
    public model: T;
    public fields: IDynamicInputModel<T>[] = [];
    
    constructor(
        model: T,
        fields: IDynamicInputModel<T>[] = []
    ) {
        this.setModel(model);
        this.fields = fields;
    }

    public setModel(model: T) {
        this.model = typeof model === 'object' ? model : {} as T;
        const initial =  clone(model);
        this.initialModel = initial;
    }

    public reset() {
        const cloned = clone(this.initialModel);
        this.model = cloned;
    }

    public hasChanged() {
        return JSON.stringify(this.initialModel) !== JSON.stringify(this.model);
    }
}

interface ITest{
    name: string;
    age: number;
}

const dim = () => new DynamicInputModel<ITest>({ name: 'test', age: 100 }, );