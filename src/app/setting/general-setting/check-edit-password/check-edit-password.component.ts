import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { CheckPasswordInput, GeneralSettingServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-check-edit-password',
  templateUrl: './check-edit-password.component.html',
  styleUrls: ['./check-edit-password.component.scss']
})
export class CheckEditPasswordComponent extends AppComponentBase implements OnInit {

  input: CheckPasswordInput = new CheckPasswordInput();
  invalidPassword: boolean = false;
  constructor(
    injector: Injector,
    private _generalSettingService: GeneralSettingServiceProxy,
    public dialogRef: NbDialogRef<CheckEditPasswordComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    
  }

  checkPassword(){
    this._generalSettingService.checkPassword(this.input)
    .subscribe(result=>{
      if(result.success == true){
        this.invalidPassword = false;
        this.dialogRef.close({success: true});
      }else{
        this.invalidPassword = true;
      }
      
    })
  }
}
