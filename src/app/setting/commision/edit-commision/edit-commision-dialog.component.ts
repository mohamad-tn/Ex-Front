import {
  Component,
  Injector,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CommisionServiceProxy, CurrencyDto, CurrencyServiceProxy, UpdateCommisionDto,
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: 'edit-commision-dialog.component.html',
  styleUrls:['edit-commision-dialog.component.scss']
})
export class EditCommisionDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  commision: UpdateCommisionDto = new UpdateCommisionDto();
  id: number;
  currencies: CurrencyDto[] = [];
  public fields: Object = { text: 'name', value: 'id' };
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _commisionService: CommisionServiceProxy,
    private _currencyService: CurrencyServiceProxy,
    public dialogRef: NbDialogRef<EditCommisionDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialCurrencies();

    this._commisionService.getForEdit(this.id).subscribe((result: UpdateCommisionDto) => {
      this.commision = result;
    });
  }

  initialCurrencies(){
    this._currencyService.getAll()
    .subscribe(result => this.currencies = result);
  }

  save(): void {
    this.saving = true;

    this._commisionService
      .update(this.commision)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.dialogRef.close();
        this.onSave.emit();
      });
  }
}
