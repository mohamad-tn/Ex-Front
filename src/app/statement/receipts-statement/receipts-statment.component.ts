import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { TreasuryActionStatementOutputDto, TreasuryActionServiceProxy } from '@shared/service-proxies/service-proxies';
import { SearchReceiptsStatmentComponent } from './search-receipts-statment.component';

@Component({
  selector: "app-receipts-statment",
  templateUrl: "./receipts-statment.component.html",
  styleUrls: ["./receipts-statment.component.scss"],
})
export class ReceiptsStatmentComponent
  extends AppComponentBase
  implements OnInit
{
  treasuryActions: TreasuryActionStatementOutputDto[] = [];
  sumAmount: number = 0;

  constructor(
    injector: Injector,
    private _router: Router,
    private _treasuryActionAppService: TreasuryActionServiceProxy,
    private _modalService: NbDialogService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    setTimeout(() => this.showSearchDialog(), 500);
  }

  initialTreasuryActions(data) {
    this._treasuryActionAppService
      .getFroStatment(
        0,
        data.fromDate,
        data.toDate,
        data.mainAccount,
        data.mainAccountCompanyId,
        data.mainAccountClientId,
        data.expenceId,
        undefined,
        data.beneficiaryId
      )
      .subscribe((result) => {
        this.treasuryActions = result;

        this.sumAmount = 0;
        this.treasuryActions.forEach((element) => {
          this.sumAmount = this.sumAmount + element.amount;
        });
      });
  }

  showSearchDialog() {
    this._modalService
      .open(SearchReceiptsStatmentComponent)
      .onClose.subscribe((e: any) => {
        this.initialTreasuryActions(e);
      });
  }

  showTreasuryAction(item) {
    this._router.navigate([
      "/app/treasury/edit-treasury-action",
      {
        id: item.id,
      },
    ]);
  }
}
