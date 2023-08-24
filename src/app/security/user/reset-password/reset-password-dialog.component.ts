import {
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ResetPasswordDto,
  UserServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';
import { forEach as _forEach, map as _map } from 'lodash-es';

@Component({
  templateUrl: 'reset-password-dialog.component.html',
  styleUrls:['reset-password-dialog.component.scss'],
  providers:[UserServiceProxy]
})
export class ResetPasswordDialogComponent extends AppComponentBase
  implements OnInit {
    public isLoading = false;
    public resetPasswordDto: ResetPasswordDto;
    id: number;

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    public dialogRef: NbDialogRef<ResetPasswordDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit() {
    this.isLoading = true;
    this.resetPasswordDto = new ResetPasswordDto();
    this.resetPasswordDto.userId = this.id;
    this.resetPasswordDto.newPassword = Math.random()
      .toString(36)
      .substr(2, 10);
    this.isLoading = false;
  }

  public resetPassword(): void {
    this.isLoading = true;
    console.log(this.resetPasswordDto);
    this._userService
      .resetPassword(this.resetPasswordDto)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.notify.info('Password Reset');
        this.dialogRef.close();
      });
  }
}
