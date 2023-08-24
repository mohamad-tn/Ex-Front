import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { TreasuryActionDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-print-treasury-action',
  templateUrl: './print-treasury-action.component.html',
  styleUrls: ['./print-treasury-action.component.scss']
})
export class PrintTreasuryActionComponent extends AppComponentBase implements OnInit {

  treasuryAction: TreasuryActionDto = new TreasuryActionDto();
  currencyName: string = '';
  actionTypeName: string = '';
  mainAccountName: string = '';
  accountName: string = '';
  exchangePartyName:string = '';
  
  constructor(
    injector: Injector,

    ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
