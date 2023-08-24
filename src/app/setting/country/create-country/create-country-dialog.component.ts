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
  CreateCountryDto,
  CountryServiceProxy,
  ProvinceDto
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: 'create-country-dialog.component.html',
  styleUrls:['create-country-dialog.component.scss'],
  providers:[CountryServiceProxy]
})
export class CreateCountryDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  provinceName: string = '';
  provinceId: number;
  country: CreateCountryDto = new CreateCountryDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _countryService: CountryServiceProxy,
    public dialogRef: NbDialogRef<CreateCountryDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if(this.country.provinces == undefined){
      this.country.provinces= [];
    }
  }

  addProvince(event){
    if(this.provinceName != undefined && this.provinceName != ''){

      var isExist = this.country.provinces
      .findIndex((p:ProvinceDto) => p.name.trim() == this.provinceName.trim());
  
      if(this.country.provinces != undefined && isExist > -1){
        abp.message.error(this.l('TheProvinceAlreadyExist'));
      }else{
        let province = new ProvinceDto();
        province.id = this.provinceId;
        province.name = this.provinceName;
        this.country.provinces.push(province);
        
        this.provinceName = '';
      }
    }
    
  }

  removeProvince(name){
    var index = this.country.provinces
    .findIndex((p:ProvinceDto) => p.name.trim() == name);

    if(index > -1)
      this.country.provinces.splice(index,1);
  }

  save(): void {
    this.saving = true;

    this._countryService
      .create(this.country)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.dialogRef.close();
        this.onSave.emit();
      });
  }
}
