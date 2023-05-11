interface IValueConverterOptions {
    disabled?: boolean;
}


export type FilterMode = 'exact' | 'startsWith' | 'endsWith' | 'contains' |
    '>=' | '>' | '<=' | '<' | '==' |
    'Array.includes' | '!Array.includes' | 'Array.some' | '!Array.some';

export interface IFilterOptions extends IValueConverterOptions {
    props: string | string[];
    q: string | string[];
    mode?: FilterMode;
    minLength?: number;
    take?: number;
}

export interface INumberFormatOptions extends IValueConverterOptions {
    //spacing?: number;
    delimiter?: string;
}


export interface ITakeOptions extends IValueConverterOptions {
    take: number;
    page: number;
    skip?: number;
}


export interface ISortOptions extends IValueConverterOptions {
    key?: string;
    asc: boolean;
}