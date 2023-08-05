import {
  Component,
  Injector,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
  FlatPermissionDto,
  GetRoleForEditOutput,
  PermissionDto,
  PermissionDtoListResultDto,
  RoleDto,
  RoleEditDto,
  RoleServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';
import { PermissionPage, PermissionPageItem } from '../PermissionItem';
import { forEach as _forEach, map as _map, includes as _includes } from 'lodash-es';

@Component({
  templateUrl: 'edit-role-dialog.component.html',
  styleUrls:['edit-role-dialog.component.scss'],
  providers:[RoleServiceProxy]
})
export class EditRoleDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  isActive: boolean = true;
  permissions: FlatPermissionDto[] = [];
  grantedPermissions: string[] = [];
  role: RoleDto = new RoleDto();
  id: number;

  constructor(
    injector: Injector,
    public _roleService: RoleServiceProxy,
    public dialogRef: NbDialogRef<EditRoleDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getPermissions();
  }

  save(): void {
    this.saving = true;
    this.role.grantedPermissions = this.grantedPermissions;
    this._roleService
      .update(this.role)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.dialogRef.componentRef
        this.dialogRef.close();
      });
  }
  getPermissions(){
    this._roleService
      .getRoleForEdit(this.id)
      .subscribe((result: GetRoleForEditOutput) => {
        
        this.permissions = result.permissions;

        this.role.id = result.role.id;
        this.role.name = result.role.name;
        this.role.displayName = result.role.displayName;
        this.role.description = result.role.description;
        this.role.dataAccess = result.role.dataAccess;
        this.grantedPermissions = result.grantedPermissionNames;

      });
  }

  onCheckPermision(status, permName){
    const index: number = this.grantedPermissions.indexOf(permName);

    if(status == true && index == -1){
      this.grantedPermissions.push(permName);
    }else if(status == false && index !== -1){
      this.grantedPermissions.splice(index, 1);   
    }
  }

  checkAll(status){
    if(status == true){
      this.permissions.forEach(perm => {
        this.grantedPermissions.push(perm.name);
      });
    }else{
      this.grantedPermissions = [];
    }
    
  }

  validateChecked(permName){
    return this.grantedPermissions.includes(permName);
  }

}
