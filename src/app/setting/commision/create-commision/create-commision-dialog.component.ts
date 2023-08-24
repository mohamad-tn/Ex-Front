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
  CreateCommisionDto,
  CommisionServiceProxy,
  CurrencyServiceProxy,
  CurrencyDto
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: 'create-commision-dialog.component.html',
  styleUrls:['create-commision-dialog.component.scss'],
  providers:[CommisionServiceProxy]
})
export class CreateCommisionDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  commision: CreateCommisionDto = new CreateCommisionDto();
  currencies: CurrencyDto[] = [];
  public fields: Object = { text: 'name', value: 'id' };
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _commisionService: CommisionServiceProxy,
    private _currencyService: CurrencyServiceProxy,
    public dialogRef: NbDialogRef<CreateCommisionDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialCurrencies();
    this.commision.percentage = 0;
    this.commision.value = 0;
  }

  initialCurrencies(){
    this._currencyService.getAll()
    .subscribe(result => this.currencies = result);
  }

  save(): void {
    this.saving = true;

    this._commisionService
      .create(this.commision)
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
