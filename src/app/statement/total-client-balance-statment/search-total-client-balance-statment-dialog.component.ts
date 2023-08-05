import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { DateTimePicker } from '@syncfusion/ej2-angular-calendars';

@Component({
  selector: 'app-search-total-client-balance-statment-dialog',
  templateUrl: './search-total-client-balance-statment-dialog.component.html',
  styleUrls: ['./search-total-client-balance-statment-dialog.component.scss']
})
export class SearchTotalClientBalanceStatmentDialogComponent extends AppComponentBase implements OnInit {

  saving = false;
  toDate: Date = new Date()
  constructor(
    injector: Injector,
    public dialogRef: NbDialogRef<SearchTotalClientBalanceStatmentDialogComponent>
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
