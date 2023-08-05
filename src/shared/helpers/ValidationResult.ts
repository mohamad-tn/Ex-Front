
export interface IValidationResult {
    success: boolean | undefined;
    index: number | undefined;
    data: any | undefined;
    fields: ValidationResultField[] | undefined;
}

export class ValidationResult implements IValidationResult {
    success: boolean | undefined;
    index: number | undefined;
    data: any;
    fields: ValidationResultField[] | undefined;

    constructor(data?: IValidationResult) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
    
}

export interface IValidationResultField {
    name: string | undefined;
    message: string | undefined;
}

export class ValidationResultField implements IValidationResultField {
    name: string | undefined;
    message: string | undefined;

    constructor(data?: IValidationResultField) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}