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
  CompanyServiceProxy, CurrencyDto, CompanyBalanceDto, UpdateCompanyDto, CurrencyServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: 'edit-company-dialog.component.html',
  styleUrls:['edit-company-dialog.component.scss']
})
export class EditCompanyDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  companyBalance: CompanyBalanceDto = new CompanyBalanceDto();
  company: UpdateCompanyDto = new UpdateCompanyDto();
  id: number;
  currencies: CurrencyDto[] = [];
  public currencyFields: Object = { text: 'name', value: 'id' };
  forHim: boolean = false;
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _companyService: CompanyServiceProxy,
    public _currencyService: CurrencyServiceProxy,
    public dialogRef: NbDialogRef<EditCompanyDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._companyService.getForEdit(this.id).subscribe((result: UpdateCompanyDto) => {
      this.company = result;
    });
    this.initialCurrencies();
  }

  initialCurrencies(){
    this._currencyService.getAll()
    .subscribe(result => this.currencies = result);
  }

  addCompanyBalance(event){
    if(this.companyBalance.currencyId != undefined && this.companyBalance.currencyId != 0){

      var isExist = this.company.companyBalances
      .findIndex((p:CompanyBalanceDto) => p.currencyId == this.companyBalance.currencyId);
  
      if(this.company.companyBalances != undefined && isExist > -1){
        abp.message.error(this.l('BalanceForThisCurrencyAlreadyExist'));
      }else{
        let companyBalance = new CompanyBalanceDto();

        companyBalance.balance = this.forHim == true ? - this.companyBalance.balance: this.companyBalance.balance;
        companyBalance.currencyId = this.companyBalance.currencyId;
        this.company.companyBalances.push(companyBalance);
        
        this.forHim = false;
        this.companyBalance = new CompanyBalanceDto();
      }
    }
    
  }

  removeCompanyBalance(currencyId){
    var index = this.company.companyBalances
    .findIndex((p:CompanyBalanceDto) => p.currencyId == currencyId);

    if(index > -1)
      this.company.companyBalances.splice(index,1);
  }

  save(): void {
    this.saving = true;

    this._companyService
      .update(this.company)
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

  saveCompanyBalance(args){
    let index = this.company.companyBalances.findIndex(x=>x.currencyId == this.companyBalance.currencyId);
    if(index > -1){
      this.company.companyBalances[index].balance = this.forHim == true ? - this.companyBalance.balance: this.companyBalance.balance;
      this.companyBalance = new CompanyBalanceDto();
      this.forHim = false;
    }
  }

  editCompanyBalance(args){
    if(args.balance > 0){
      this.forHim = false
    }else{
      this.forHim = true
    }
    this.companyBalance.currencyId = args.currencyId;
    this.companyBalance.balance = Math.abs(args.balance);
  }
}
