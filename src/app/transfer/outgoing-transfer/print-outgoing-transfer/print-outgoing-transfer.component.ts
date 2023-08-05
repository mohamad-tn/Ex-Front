import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { OutgoingTransferDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-print-outgoing-transfer',
  templateUrl: './print-outgoing-transfer.component.html',
  styleUrls: ['./print-outgoing-transfer.component.scss']
})
export class PrintOutgoingTransferComponent extends AppComponentBase implements OnInit {

  input: OutgoingTransferDto = new OutgoingTransferDto();
  currencyName: string;
  countryName: string;
  toCompanyName: string;
  fromCompanyName: string;
  fromClientName: string;
  senderName: string;
  paymentTypeName: string;
  beneficiaryName: string;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
