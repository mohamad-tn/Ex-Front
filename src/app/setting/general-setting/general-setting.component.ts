import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GeneralSettingDto, GeneralSettingServiceProxy, MigrationServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-general-setting',
  templateUrl: './general-setting.component.html',
  styleUrls: ['./general-setting.component.scss']
})
export class GeneralSettingComponent extends AppComponentBase implements OnInit {

  generalSetting: GeneralSettingDto = new GeneralSettingDto();
  saving = false;

  constructor(
    injector: Injector,
    private _generalSettingAppService: GeneralSettingServiceProxy,
    private _migrationAppService: MigrationServiceProxy,
    ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialSetting();
  }

  initialSetting(){
    this._generalSettingAppService.get()
    .subscribe(result =>{
      if(result != undefined){
        this.generalSetting = result;
      }
    });
  }

  save(): void {
    this.saving = true;

    this._generalSettingAppService
      .update(this.generalSetting)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
      });
  }

  resetDb(){
    this._migrationAppService.clearDatabase("")
    .subscribe(result =>{
      if(result.success){
        abp.notify.success('تم تصفير قاعدة البيانات بنجاح');
      }else{
        abp.notify.error("حدثت مشكلة أثناء تصفير قاعدة البيانات");
      }
    })
  }
}
