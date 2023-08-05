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
  CountryServiceProxy, ProvinceDto, UpdateCountryDto,
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: 'edit-country-dialog.component.html',
  styleUrls:['edit-country-dialog.component.scss']
})
export class EditCountryDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  provinceName: string = '';
  provinceId: number;
  country: UpdateCountryDto = new UpdateCountryDto();
  id: number;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _countryService: CountryServiceProxy,
    public dialogRef: NbDialogRef<EditCountryDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._countryService.getForEdit(this.id).subscribe((result: UpdateCountryDto) => {
      this.country = result;
    });
  }

  addProvince(event){
    if(this.provinceName != undefined && this.provinceName != ''){
      
      if(this.country.provinces == undefined){
        this.country.provinces= [];
      }

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
      .update(this.country)
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
