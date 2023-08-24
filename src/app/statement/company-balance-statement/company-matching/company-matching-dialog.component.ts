import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { CompanyCashFlowMatchingDto, CompanyCashFlowServiceProxy, MatchingItemDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-company-matching-dialog',
  templateUrl: './company-matching-dialog.component.html',
  styleUrls: ['./company-matching-dialog.component.scss']
})
export class CompanyMatchingDialogComponent extends AppComponentBase implements OnInit {

  saving = false;
  matchingDto: CompanyCashFlowMatchingDto = new CompanyCashFlowMatchingDto();
  matchItems: MatchingItemDto[] = [];
  id: number;
  currencyId: number;
  fromDate: string;
  toDate: string;
  constructor(
    injector: Injector,
    private _companyCashFlowService: CompanyCashFlowServiceProxy,
    public dialogRef: NbDialogRef<CompanyMatchingDialogComponent>
    ) {
    super(injector);
  }

  ngOnInit(): void {
    this.matchingDto.items = this.matchItems;
    // this.matchingDto.currencyId = this.currencyId;
    // this.matchingDto.fromDate = this.fromDate;
    // this.matchingDto.toDate = this.toDate;
  }

  save(){
    this.saving = true;
    this._companyCashFlowService
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
