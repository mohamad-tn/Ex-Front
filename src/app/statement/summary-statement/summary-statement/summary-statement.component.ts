import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientCashFlowServiceProxy, CompanyCashFlowServiceProxy, ExchangePriceDto, ExchangePriceServiceProxy, IncomeTransferDetailServiceProxy, SummaryCashFlowDto, TreasuryCashFlowServiceProxy } from '@shared/service-proxies/service-proxies';
import { SearchSummaryStatementComponent } from '../search-summary-statement/search-summary-statement.component';
import html2canvas from 'html2canvas';
import { finalize } from 'rxjs/operators';

@Component({
  selector: "app-summary-statement",
  templateUrl: "./summary-statement.component.html",
  styleUrls: ["./summary-statement.component.scss"],
})
export class SummaryStatementComponent
  extends AppComponentBase
  implements OnInit
{
  totalResult: number[] = [];
  clientResult: SummaryCashFlowDto[] = [];
  companyResult: SummaryCashFlowDto[] = [];
  treasuryResult: SummaryCashFlowDto[] = [];
  noneReseivedResult: SummaryCashFlowDto[] = [];
  cellWidth: string = "20%";
  constructor(
    injector: Injector,
    private _modalService: NbDialogService,
    private _clientCashFlowService: ClientCashFlowServiceProxy,
    private _companyCashFlowService: CompanyCashFlowServiceProxy,
    private _exchangePrice: ExchangePriceServiceProxy,
    private _treasuryCashFlowService: TreasuryCashFlowServiceProxy,
    private _incomeTransferDetailService: IncomeTransferDetailServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialClientSummary(undefined);
    this.initialCompanySummary(undefined);
    this.initialTreasurySummary(undefined);
    this.initialnoneReceivedSummary(undefined);

    setTimeout(() => {
      this.showSearchDialog();
    }, 500);
  }

  initialClientSummary(date) {
    this._clientCashFlowService.summary(date).subscribe((result) => {
      this.clientResult = result.sort((a, b) =>
        a.currency?.name.localeCompare(b.currency?.name)
      );
      this.cellWidth =
        result.length > 0 ? 100 / result.length + "%" : this.cellWidth;
    });
  }

  initialCompanySummary(date) {
    this._companyCashFlowService.summary(undefined).subscribe((result) => {
      this.companyResult = result.sort((a, b) =>
        a.currency?.name.localeCompare(b.currency?.name)
      );
    });
  }

  initialTreasurySummary(date) {
    this._treasuryCashFlowService.summary(undefined).subscribe((result) => {
      this.treasuryResult = result.sort((a, b) =>
        a.currency?.name.localeCompare(b.currency?.name)
      );
    });
  }

  initialnoneReceivedSummary(date) {
    this._incomeTransferDetailService.summary(undefined).subscribe((result) => {
      this.noneReseivedResult = result.sort((a, b) =>
        a.currency?.name.localeCompare(b.currency?.name)
      );
    });
  }

  calculatTotal(currencyId) {
    var clientCashFlow = this.clientResult.find(
      (x) => x.currency?.id == currencyId
    );
    var companyCashFlow = this.companyResult.find(
      (x) => x.currency?.id == currencyId
    );
    var treasuryCashFlow = this.treasuryResult.find(
      (x) => x.currency?.id == currencyId
    );
    var noneReceived = this.noneReseivedResult.find(
      (x) => x.currency?.id == currencyId
    );
    let totalBalance =
      clientCashFlow?.totalBalance +
      companyCashFlow?.totalBalance +
      treasuryCashFlow?.totalBalance +
      noneReceived?.totalBalance;
    return this.getBalanceWithComma(totalBalance);
  }

  calculatTotal1(currencyId) {
    var clientCashFlow = this.clientResult.find(
      (x) => x.currency?.id == currencyId
    );
    var companyCashFlow = this.companyResult.find(
      (x) => x.currency?.id == currencyId
    );
    var treasuryCashFlow = this.treasuryResult.find(
      (x) => x.currency?.id == currencyId
    );
    var noneReceived = this.noneReseivedResult.find(
      (x) => x.currency?.id == currencyId
    );
    let totalBalance =
      clientCashFlow?.totalBalance +
      companyCashFlow?.totalBalance +
      treasuryCashFlow?.totalBalance +
      noneReceived?.totalBalance;
    return totalBalance;
  }

  toDate: Date = new Date();
  date: string;
  showSearchDialog() {
    this.loading = false;
    this._modalService
      .open(SearchSummaryStatementComponent)
      .onClose.subscribe((e: any) => {
        if (e != undefined && e?.toDate) {
          let d = new Date(e?.toDate);
          this.toDate = e?.toDate;
          this.date = d.toLocaleDateString();
          this.initialClientSummary(e?.toDate);
          this.initialCompanySummary(e?.toDate);
          this.initialTreasurySummary(e?.toDate);
          this.initialnoneReceivedSummary(e?.toDate);
          this.calculateAll();
          this.calculateAll();
        }
      });
  }

  getBalanceWithComma(value) {
    if (value != undefined) {
      var realNumber = Math.abs(value);
      if (value < 0) {
        return this.numberWithCommas(realNumber) + "/بذمتنا";
      } else if (value > 0) {
        return this.numberWithCommas(realNumber) + "/بذمته";
      }
    }
    return "0";
  }

  prices: ExchangePriceDto[] = [];
  loading: boolean = false;
  totalAmount: number = 0;

  calculateAll() {
    let mainCurrencyTotalBalance = 0;
    let currencyTotalBalance = 0;

    this._exchangePrice
      .getAll()
      .pipe(
        finalize(() => {
          this.loading = true;
        })
      )
      .subscribe((x) => {
        this.prices = x;
        this.prices.map((z) => {
          if (z.currency.isMainCurrency == true) {
            mainCurrencyTotalBalance = this.calculatTotal1(z.currencyId);
          } else {
            currencyTotalBalance =
              currencyTotalBalance +
              z.mainPrice * this.calculatTotal1(z.currencyId);
            this.totalAmount = mainCurrencyTotalBalance + currencyTotalBalance;
          }
        });
      });
  }

  name = "Summary-Statement";

  @ViewChild("screen") screen: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("downloadLink") downloadLink: ElementRef;

  downloadImage() {
    document.getElementById("toDate").style.display = "contents";
    document.getElementById("buttons").style.display = "none";
    document.getElementById("swap").style.display = "none";
    document.getElementById("t2").style.width = "595px";
    document.getElementById("t2").style.height = "842px";
    html2canvas(this.screen.nativeElement).then((canvas) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL("image/png");
      this.downloadLink.nativeElement.download =
        "Summary-Statement-To_Date : " + this.date + ".png";
      this.downloadLink.nativeElement.click();
    });
    document.getElementById("toDate").style.display = "none";
    document.getElementById("buttons").style.display = "contents";
    document.getElementById("swap").style.display = "contents";
    document.getElementById("t2").style.width = "auto";
    document.getElementById("t2").style.height = "auto";
  }
}
