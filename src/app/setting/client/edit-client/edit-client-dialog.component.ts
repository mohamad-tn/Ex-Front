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
  ClientServiceProxy, CurrencyDto, ClientBalanceDto, UpdateClientDto, CurrencyServiceProxy, ClientPhoneDto, ProvinceServiceProxy, ProvinceForDropdownDto,
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: 'edit-client-dialog.component.html',
  styleUrls:['edit-client-dialog.component.scss']
})
export class EditClientDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  clientBalance: ClientBalanceDto = new ClientBalanceDto();
  clientPhone: ClientPhoneDto = new ClientPhoneDto();
  client: UpdateClientDto = new UpdateClientDto();
  id: number;
  currencies: CurrencyDto[] = [];
  phones: ClientPhoneDto[] = [];
  provinces: ProvinceForDropdownDto[] = [];
  activated: boolean = true;
  public currencyFields: Object = { text: 'name', value: 'id' };
  public provinceFields: Object = { groupBy: 'countryName' ,text: 'name', value: 'id' };
  @Output() onSave = new EventEmitter<any>();
  forHim: boolean = false;

  constructor(
    injector: Injector,
    public _clientService: ClientServiceProxy,
    public _currencyService: CurrencyServiceProxy,
    public _provinceService: ProvinceServiceProxy,
    public dialogRef: NbDialogRef<EditClientDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {

    this._clientService.getForEdit(this.id).subscribe((result: UpdateClientDto) => {
      this.client = result;
    });
    if(this.client.clientPhones == undefined){
      this.client.clientPhones= [];
    }
    this.initialCurrencies();
    this.initialProvinces();
  }

  initialCurrencies(){
    this._currencyService.getAll()
    .subscribe(result => this.currencies = result);
  }
  initialProvinces(){
    this._provinceService.getAllForDropdown()
    .subscribe(result =>{
      this.provinces = result;
    })
  }
  addClientBalance(event){
    if(this.clientBalance.currencyId != undefined && this.clientBalance.currencyId != 0){

      var isExist = this.client.clientBalances
      .findIndex((p:ClientBalanceDto) => p.currencyId == this.clientBalance.currencyId);
  
      if(this.client.clientBalances != undefined && isExist > -1){
        abp.message.error(this.l('BalanceForThisCurrencyAlreadyExist'));
      }else{
        let clientBalance = new ClientBalanceDto();
        clientBalance.balance = this.forHim == true ? - this.clientBalance.balance: this.clientBalance.balance;
        clientBalance.currencyId = this.clientBalance.currencyId;
        this.client.clientBalances.push(clientBalance);
        
        this.forHim = false;
        this.clientBalance = new ClientBalanceDto();
      }
    }
    
  }

  removeClientBalance(currencyId){
    var index = this.client.clientBalances
    .findIndex((p:ClientBalanceDto) => p.currencyId == currencyId);

    if(index > -1)
      this.client.clientBalances.splice(index,1);
  }

  addClientPhone(event){
    if(this.clientPhone.phoneNumber != undefined){

      var isExist = this.client.clientPhones
      .findIndex((p:ClientPhoneDto) => p.phoneNumber == this.clientPhone.phoneNumber);
  
      if(this.client.clientPhones != undefined && isExist > -1){
        abp.message.error(this.l('PhoneAlreadyExist'));
      }else{
        let clientPhone = new ClientPhoneDto();
        clientPhone.phoneNumber = this.clientPhone.phoneNumber;
        this.client.clientPhones.push(clientPhone);
        
        this.clientPhone = new ClientPhoneDto();
      }
    }
    
  }

  removeClientPhone(phoneNumber){
    var index = this.client.clientPhones
    .findIndex((p:ClientPhoneDto) => p.phoneNumber == phoneNumber);

    if(index > -1)
      this.client.clientBalances.splice(index,1);
  }

  saveClientBalance(args){
    let index = this.client.clientBalances.findIndex(x=>x.currencyId == this.clientBalance.currencyId);
    if(index > -1){
      this.client.clientBalances[index].balance = this.forHim == true ? - this.clientBalance.balance: this.clientBalance.balance;
      this.clientBalance = new ClientBalanceDto();
      this.forHim = false;
    }
  }

  save(): void {
    this.saving = true;

    this._clientService
      .update(this.client)
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

  getCurrencyName(currencyId){
    var currency = this.currencies.find((p:CurrencyDto) => p.id == currencyId);
    if(currency != undefined)
      return currency.name;

    return '';
  }

  onActivatedValueChanged(checked){
    this.client.activated = checked;
  }

  editClientBalance(args){
    if(args.balance > 0){
      this.forHim = false
    }else{
      this.forHim = true
    }
    this.clientBalance.currencyId = args.currencyId;
    this.clientBalance.balance = Math.abs(args.balance);
  }
}

