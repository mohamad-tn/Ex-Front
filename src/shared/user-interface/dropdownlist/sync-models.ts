import { EmitType } from "@syncfusion/ej2-base";
import { ChangeEventArgs } from "@syncfusion/ej2-angular-dropdowns";

export interface ISyncModel {
    parentEle: HTMLElement;
    index: number;
    propName: string | undefined;
}

//dropdownlist
export interface ISyncDropdownlistModel extends ISyncModel {
    placeholder: string | undefined;
    datasource: any | undefined;
    onChangeHandler: EmitType<ChangeEventArgs>;
}

export class SyncDropdownlistModel implements ISyncDropdownlistModel {
    parentEle: HTMLElement;
    index: number;
    propName: string | undefined;
    value: number | undefined;
    placeholder: string | undefined;
    datasource: any | undefined;
    onChangeHandler: EmitType<ChangeEventArgs>

    constructor(data?: ISyncDropdownlistModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

//autocompete
export interface ISyncAutoCompleteModel extends ISyncModel {
    placeholder: string | undefined;
    datasource: any | undefined;
    onChangeHandler: EmitType<ChangeEventArgs> | undefined
}

export class SyncAutoCompleteModel implements ISyncAutoCompleteModel {
    parentEle: HTMLElement;
    index: number;
    propName: string | undefined;
    value: string | undefined;
    placeholder: string | undefined;
    datasource: any | undefined;
    onChangeHandler: EmitType<ChangeEventArgs> | undefined

    constructor(data?: ISyncAutoCompleteModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

//textbox
export interface ISyncTextBoxModel extends ISyncModel {
    placeholder: string | undefined;
}

export class SyncTextBoxModel implements ISyncTextBoxModel {
    parentEle: HTMLElement;
    index: number;
    propName: string | undefined;
    value: string | undefined;
    placeholder: string | undefined;

    constructor(data?: ISyncTextBoxModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

//numeric
export interface ISyncNumericTextBoxModel extends ISyncModel {
    placeholder: string | undefined;
    onChangeHandler: EmitType<ChangeEventArgs> | undefined;
}

export class SyncNumericTextBoxModel implements ISyncNumericTextBoxModel {
    parentEle: HTMLElement;
    index: number;
    propName: string | undefined;
    placeholder: string | undefined;
    value: number | undefined;
    onChangeHandler: EmitType<ChangeEventArgs> | undefined;

    constructor(data?: ISyncNumericTextBoxModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

//button
export interface ISyncButtonModel extends  ISyncModel {
    cssClass: string | undefined;
    iconCss: string | undefined;
    isPrimary : boolean;
    click: Function;
}

export class SyncButtonModel implements ISyncButtonModel{
    parentEle: HTMLElement;
    index: number;
    propName: string;
    content: string | undefined;
    cssClass: string;
    iconCss: string;
    isPrimary: true;
    click: Function;

    constructor(data?: ISyncButtonModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
    
}

