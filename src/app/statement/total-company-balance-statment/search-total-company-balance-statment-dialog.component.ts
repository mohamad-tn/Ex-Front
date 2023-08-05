import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { DateTimePicker } from '@syncfusion/ej2-angular-calendars';

@Component({
  selector: 'app-search-total-company-balance-statment-dialog',
  templateUrl: './search-total-company-balance-statment-dialog.component.html',
  styleUrls: ['./search-total-company-balance-statment-dialog.component.scss']
})
export class SearchTotalCompanyBalanceStatmentDialogComponent extends AppComponentBase implements OnInit {

  saving = false;
  toDate: Date = new Date()
  constructor(
    injector: Injector,
    public dialogRef: NbDialogRef<SearchTotalCompanyBalanceStatmentDialogComponent>
    ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;
    this.dialogRef.close({'toDate': this.toDate.toISOString()});
  }

}
