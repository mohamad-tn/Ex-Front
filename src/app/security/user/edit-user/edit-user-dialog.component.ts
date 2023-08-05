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
  UserDto,
  RoleDto,
  UserServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { forEach as _forEach, map as _map, includes as _includes } from 'lodash-es';

@Component({
  templateUrl: 'edit-user-dialog.component.html',
  styleUrls:['edit-user-dialog.component.scss'],
  providers:[UserServiceProxy]
})
export class EditUserDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  roles: RoleDto[] = [];
  user: UserDto = new UserDto();
  id: number;
  passwordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
        'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];
  confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];
  
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _userService: UserServiceProxy,
    public dialogRef: NbDialogRef<EditUserDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getRoles();
    this._userService.get(this.id).subscribe((result) => {
      this.user = result;
    });
  }

  save(): void {
    this.saving = true;
    
    this._userService
      .update(this.user)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.dialogRef.componentRef
        this.dialogRef.close();
        this.onSave.emit();
      });
  }
  onActiveChecked(checked: boolean){
    this.user.isActive = checked;
  }
  getRoles(){
    this._userService.getRoles().subscribe((result) => {
      this.roles = result.items;
    });
  }
  onRoleChecked(checked: boolean,role: RoleDto){
    if(checked){
      this.user.roleNames.push(role.normalizedName);
    }else{
      let index:number = this.user.roleNames.indexOf(role.normalizedName);
      if(index !== -1){
        this.user.roleNames.splice(index, 1);
      }
    }
  }
  isRoleChecked(normalizedName: string): boolean{
    return _includes(this.user.roleNames, normalizedName);
  }
  
}
