import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientCashFlowMatchingDto, ClientCashFlowServiceProxy, MatchingItemDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-client-matching-dialog',
  templateUrl: './client-matching-dialog.component.html',
  styleUrls: ['./client-matching-dialog.component.scss']
})
export class ClientMatchingDialogComponent extends AppComponentBase implements OnInit {

  saving = false;
  matchingDto: ClientCashFlowMatchingDto = new ClientCashFlowMatchingDto();
  matchItems: MatchingItemDto[] = [];
  currencyId: number;
  fromDate: string;
  toDate: string;
  constructor(
    injector: Injector,
    private _clientCashFlowService: ClientCashFlowServiceProxy,
    public dialogRef: NbDialogRef<ClientMatchingDialogComponent>
    ) {
    super(injector);
  }

  ngOnInit(): void {
    this.matchingDto.items = this.matchItems;
    //this.matchingDto.currencyId = this.currencyId;
    // this.matchingDto.fromDate = this.fromDate;
    // this.matchingDto.toDate = this.toDate;
  }

  save(){
    this.saving = true;
    this._clientCashFlowService
      .match(this.matchingDto)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.dialogRef.close({success: true});
      });
  }

}
