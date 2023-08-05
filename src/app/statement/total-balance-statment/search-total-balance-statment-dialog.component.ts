import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { DateTimePicker } from '@syncfusion/ej2-angular-calendars';

@Component({
  selector: 'app-search-total-balance-statment-dialog',
  templateUrl: './search-total-balance-statment-dialog.component.html',
  styleUrls: ['./search-total-balance-statment-dialog.component.scss']
})
export class SearchTotalBalanceStatmentDialogComponent extends AppComponentBase implements OnInit {

  saving = false;
  toDate: Date = new Date()
  constructor(
    injector: Injector,
    public dialogRef: NbDialogRef<SearchTotalBalanceStatmentDialogComponent>
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
