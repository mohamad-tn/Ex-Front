import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientCashFlowServiceProxy, CompanyCashFlowServiceProxy, IncomeTransferDetailServiceProxy, SummaryCashFlowDto, TreasuryCashFlowServiceProxy } from '@shared/service-proxies/service-proxies';
import { SearchSummaryStatementComponent } from '../search-summary-statement/search-summary-statement.component';

@Component({
  selector: 'app-summary-statement',
  templateUrl: './summary-statement.component.html',
  styleUrls: ['./summary-statement.component.scss']
})
export class SummaryStatementComponent extends AppComponentBase implements OnInit {

  totalResult: number[] = [];
  clientResult: SummaryCashFlowDto[] = [];
  companyResult: SummaryCashFlowDto[] = [];
  treasuryResult: SummaryCashFlowDto[] = [];
  noneReseivedResult: SummaryCashFlowDto[] = [];
  cellWidth: string = '20%'
  constructor(
    injector: Injector,
    private _modalService: NbDialogService,
    private _clientCashFlowService: ClientCashFlowServiceProxy,
    private _companyCashFlowService: CompanyCashFlowServiceProxy,
    private _treasuryCashFlowService: TreasuryCashFlowServiceProxy,
    private _incomeTransferDetailService: IncomeTransferDetailServiceProxy,
    ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialClientSummary(undefined);
    this.initialCompanySummary(undefined);
    this.initialTreasurySummary(undefined);
    this.initialnoneReceivedSummary(undefined);
    
  }

  initialClientSummary(date){
    this._clientCashFlowService.summary(date)
    .subscribe(result => {
      this.clientResult = result.sort((a,b) => a.currency?.name.localeCompare(b.currency?.name));
      this.cellWidth = result.length > 0 ? ((100/result.length)+'%') : this.cellWidth;
    })
  }

  initialCompanySummary(date){
    this._companyCashFlowService.summary(undefined)
    .subscribe(result => {
      this.companyResult = result.sort((a,b) => a.currency?.name.localeCompare(b.currency?.name));
      
    })
  }

  initialTreasurySummary(date){
    this._treasuryCashFlowService.summary(undefined)
    .subscribe(result => {
      this.treasuryResult = result.sort((a,b) => a.currency?.name.localeCompare(b.currency?.name));
    
    })
  }

  initialnoneReceivedSummary(date){
    this._incomeTransferDetailService.summary(undefined)
    .subscribe(result => {
      this.noneReseivedResult = result.sort((a,b) => a.currency?.name.localeCompare(b.currency?.name));
    })
  }

  calculatTotal(currencyId){
    
    var clientCashFlow = this.clientResult.find(x=>x.currency?.id == currencyId);
    var companyCashFlow= this.companyResult.find(x=>x.currency?.id == currencyId);
    var treasuryCashFlow= this.treasuryResult.find(x=>x.currency?.id == currencyId);
    var noneReceived = this.noneReseivedResult.find(x=>x.currency?.id == currencyId);
    let totalBalance = clientCashFlow?.totalBalance + companyCashFlow?.totalBalance + treasuryCashFlow?.totalBalance + noneReceived?.totalBalance;
    return this.getBalanceWithComma(totalBalance);
  }

  showSearchDialog(){
    this._modalService.open(
      SearchSummaryStatementComponent
    ).onClose.subscribe((e:any) => {
      if(e != undefined && e?.toDate){
        this.initialClientSummary(e?.toDate);
        this.initialCompanySummary(e?.toDate);
        this.initialTreasurySummary(e?.toDate);
        this.initialnoneReceivedSummary(e?.toDate);
      }
    });

  }

  getBalanceWithComma(value){
    if(value != undefined)
    {
        var realNumber = Math.abs(value);
        if(value < 0){
            return this.numberWithCommas(realNumber) + '/بذمتنا';
        }else if(value > 0){
            return this.numberWithCommas(realNumber) + '/بذمته';
        }
    }
    return '0';
}
}
