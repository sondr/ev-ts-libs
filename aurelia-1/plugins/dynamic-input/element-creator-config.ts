import { CustomDynamicInputFunction as CustomDynamicInputFunction, ICustomDynamicInput } from "./interfaces";

export class DynamicInputConfig {
    //private _customKeys: string[] = [];
    public readonly custom: ICustomDynamicInput = {};


    // build() {
    //     this._customKeys = this.custom ? Object.keys(this.custom) : [];
    // }

    add(key: string, action: () => HTMLElement) {
        this.custom[key] = action;
    }

    find(key:string): CustomDynamicInputFunction | undefined {
        return this.custom[key];
    }
}

//export const customDynamicInputs: ICustomDynamicInput = {};