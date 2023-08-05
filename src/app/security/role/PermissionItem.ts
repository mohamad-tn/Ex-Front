
export class PermissionPage{
    constructor(name: string, displayName: string){
        this.name = name;
        this.displayName = displayName;
    }
    name: string;
    displayName: string;
    ceate: PermissionPageItem;
    edit: PermissionPageItem;
    delete: PermissionPageItem;
    otherActions: PermissionPageItem[];
}
export class PermissionPageItem{
    constructor(name: string, displayName: string){
        this.name = name;
        this.displayName = displayName;
    }
    name: string;
    displayName: string;
    
}