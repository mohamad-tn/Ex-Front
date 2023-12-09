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
  BranchDto,
  BranchServiceProxy,
  CreateUserDto,
  RoleDto,
  UserServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { forEach as _forEach, map as _map } from 'lodash-es';

@Component({
  templateUrl: "create-user-dialog.component.html",
  styleUrls: ["create-user-dialog.component.scss"],
  providers: [UserServiceProxy],
})
export class CreateUserDialogComponent
  extends AppComponentBase
  implements OnInit
{
  saving = false;
  isActive: boolean = true;
  roles: RoleDto[] = [];
  public fields: Object = { text: "name", value: "id" };
  branches: BranchDto[] = [];
  user: CreateUserDto = new CreateUserDto();
  rolesNames: string[]=[];

  passwordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: "pattern",
      localizationKey:
        "PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber",
    },
  ];
  confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: "validateEqual",
      localizationKey: "PasswordsDoNotMatch",
    },
  ];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _userService: UserServiceProxy,
    private _branchAppService: BranchServiceProxy,
    public dialogRef: NbDialogRef<CreateUserDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.user.isActive = true;
    this.initialBranches();
    this.getRoles();
  }

  initialBranches() {
    this._branchAppService
      .getAll()
      .subscribe((result) => (this.branches = result));
  }

  save(): void {
    this.saving = true;
    this._userService
      .create(this.user)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.dialogRef.componentRef;
        this.dialogRef.close();
        this.onSave.emit();
      });
  }
  onActiveChecked(checked: boolean) {
    this.user.isActive = checked;
  }
  getRoles() {
    this._userService.getRoles().subscribe((result) => {
      this.roles = result.items;
    });
  }
  onRoleChecked(checked: boolean, role: RoleDto) {
    if (checked) {
      this.rolesNames.push(role.normalizedName);
      this.user.roleNames = this.rolesNames;
    } else {
      let index: number = this.user.roleNames.indexOf(role.normalizedName);
      if (index !== -1) {
        this.user.roleNames.splice(index, 1);
      }
    }
  }
}
