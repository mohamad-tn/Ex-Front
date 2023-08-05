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
  CreateRoleDto,
  PermissionDto,
  PermissionDtoListResultDto,
  RoleDto,
  RoleServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';
import { PermissionPage, PermissionPageItem } from '../PermissionItem';
import { forEach as _forEach, map as _map, includes as _includes } from 'lodash-es';

@Component({
  templateUrl: 'create-role-dialog.component.html',
  styleUrls:['create-role-dialog.component.scss'],
  providers:[RoleServiceProxy]
})
export class CreateRoleDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  isActive: boolean = true;
  permissions: PermissionDto[] = [];
  grantedPermissions: string[] = [];
  role: CreateRoleDto = new CreateRoleDto();
  
  constructor(
    injector: Injector,
    public _roleService: RoleServiceProxy,
    public dialogRef: NbDialogRef<CreateRoleDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getPermissions();
    
    
  }

  save(): void {
    this.saving = true;
    debugger;
    this.role.grantedPermissions = this.grantedPermissions;
    this._roleService
      .create(this.role)
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
      .getAllPermissions()
      .subscribe((result: PermissionDtoListResultDto) => {
        this.permissions = result.items;
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
