import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';

import { AppRoutingModule } from 'app/app-routing.module';
import { ThemeModule } from '@theme/theme.module';
import { NbActionsModule, NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDialogModule, NbIconModule, NbInputModule, NbMenuModule, NbPopoverModule, NbSelectModule } from '@nebular/theme';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { SettingModule } from './setting/setting.module';
import { StatementModule } from './statement/statement.module';
import { TransferModule } from './transfer/transfer.module';
import { ExchangeCurrencyModule } from './exchange-currency/exchange-currency.module';
import { TreasuryModule } from './treasury/treasury.module';
import { SecurityModule } from './security/security.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { NbEvaIconsModule } from '@nebular/eva-icons';



const NB_MODULES = [
  NbActionsModule,
  NbIconModule,
  NbEvaIconsModule,
  NbDialogModule.forChild(),
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbSelectModule,
  NbAlertModule,
  NbCheckboxModule,
  NbPopoverModule,
];

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,
    SettingModule,
    StatementModule,
    TransferModule,
    TreasuryModule,
    SecurityModule,
    ExchangeCurrencyModule,
    NB_MODULES,
    SharedModule,
  ],
  providers: [],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
