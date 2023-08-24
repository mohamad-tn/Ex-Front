import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ReadOutgoingTransferDto, OutgoingTransferServiceProxy } from '@shared/service-proxies/service-proxies';
import { result } from 'lodash-es';
import { SearchOutgoingTransferStatementDialogComponent } from './search-outgoing-transfer-statement-dialog.component';

@Component({
  selector: 'app-outgoing-transfer-statement',
  templateUrl: './outgoing-transfer-statement.component.html',
  styleUrls: ['./outgoing-transfer-statement.component.scss']
})
export class OutgoingTransferStatementComponent extends AppComponentBase implements OnInit {

  outgoingTransfers: ReadOutgoingTransferDto[] = [];
  
  constructor(
    injector: Injector,
    private _router: Router,
    private _outgoingTransferAppService: OutgoingTransferServiceProxy,
    private _modalService: NbDialogService
    ) {
    super(injector);
  }

  ngOnInit(): void {
    setTimeout(()=>this.showSearchDialog(),500);
  }

  showSearchDialog(){
    this._modalService.open(
      SearchOutgoingTransferStatementDialogComponent
    ).onClose.subscribe((e:any) => {
      if(e != undefined && e?.input){
        this.initialOutgoingTransfers(e?.input);
      }
    });
  }

  initialOutgoingTransfers(input){
    this._outgoingTransferAppService.getForStatment(
      input.number,
      input.fromDate,
      input.toDate,
      input.paymentType,
      input.countryId,
      input.clientId,
      input.companyId,
      input.beneficiary,
      input.beneficiaryAddress,
      input.sender).subscribe(result =>{
        this.outgoingTransfers = result;
      });
  }  

  showOutgoinTransfer(item){
    let url = '/app/transfer/edit-outgoing-transfer?id=' + item.id;
    this._router.navigateByUrl(url);
  }
}
