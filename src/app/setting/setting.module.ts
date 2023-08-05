import { BranchComponent } from './branch/branch.component';
import { CreateBranchDialogComponent } from "./branch/create-branch/create-branch-dialog.component";
import { EditBranchDialogComponent } from "./branch/edit-branch/edit-branch-dialog.component";

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { 
  NbActionsModule, 
  NbAlertModule, 
  NbButtonModule, 
  NbCardModule, 
  NbDialogModule, 
  NbIconModule, 
  NbInputModule, 
  NbCheckboxModule,
  NbSelectModule } from '@nebular/theme';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { 
  EditService,
  FilterService, 
  ForeignKeyService, 
  GridModule, 
  GroupService, 
  PageService, 
  SortService, 
  ToolbarService } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { CountryComponent } from './country/country.component';
import { EditCountryDialogComponent } from './country/edit-country/edit-country-dialog.component';
import { CreateCountryDialogComponent } from './country/create-country/create-country-dialog.component';
import { BranchServiceProxy, ClientServiceProxy, CommisionServiceProxy, CompanyServiceProxy, CountryServiceProxy, CurrencyServiceProxy, ExchangePriceServiceProxy, ExpenseServiceProxy, GeneralSettingServiceProxy, IncomeServiceProxy, MigrationServiceProxy, ProvinceServiceProxy, TreasuryBalanceServiceProxy } from '@shared/service-proxies/service-proxies';
import { CurrencyComponent } from './currency/currency.component';
import { CreateCurrencyDialogComponent } from './currency/create-currency/create-currency-dialog.component';
import { EditCurrencyDialogComponent } from './currency/edit-currency/edit-currency-dialog.component';
import { ProvinceComponent } from './country/province/province.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { IncomeComponent } from './income/income.component';
import { CreateIncomeDialogComponent } from './income/create-income/create-income-dialog.component';
import { EditIncomeDialogComponent } from './income/edit-income/edit-income-dialog.component';
import { ExpenseComponent } from './expense/expense.component';
import { CreateExpenseDialogComponent } from './expense/create-expense/create-expense-dialog.component';
import { EditExpenseDialogComponent } from './expense/edit-expense/edit-expense-dialog.component';
import { CompanyComponent } from './company/company.component';
import { CreateCompanyDialogComponent } from './company/create-company/create-company-dialog.component';
import { EditCompanyDialogComponent } from './company/edit-company/edit-company-dialog.component';
import { ClientComponent } from './client/client.component';
import { EditClientDialogComponent } from './client/edit-client/edit-client-dialog.component';
import { CreateClientDialogComponent } from './client/create-client/create-client-dialog.component';
import { InitialBalanceComponent } from './initial-balance/initial-balance.component';
import { ExchangePriceComponent } from './exchange-price/exchange-price.component';
import { CommisionComponent } from './commision/commision.component';
import { CreateCommisionDialogComponent } from './commision/create-commision/create-commision-dialog.component';
import { EditCommisionDialogComponent } from './commision/edit-commision/edit-commision-dialog.component';
import { GeneralSettingComponent } from './general-setting/general-setting.component';
import { CheckEditPasswordComponent } from './general-setting/check-edit-password/check-edit-password.component';

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
  NbCheckboxModule
];
const SYNCFUSION_MODULES = [
  GridModule,
  ToolbarModule,
  UploaderModule,
  NumericTextBoxModule,
  DropDownListModule,
  SwitchModule 
];

const SYNCFUSION_SERVICES = [
  PageService,
  SortService,
  FilterService,
  GroupService,
  ToolbarService,
  ForeignKeyService,
  EditService
];

@NgModule({
  declarations: [
    SettingComponent,
    CountryComponent,
    EditCountryDialogComponent,
    CreateCountryDialogComponent,
    CurrencyComponent,
    CreateCurrencyDialogComponent,
    EditCurrencyDialogComponent,
    ProvinceComponent,
    IncomeComponent,
    CreateIncomeDialogComponent,
    EditIncomeDialogComponent,
    ExpenseComponent,
    CreateExpenseDialogComponent,
    EditExpenseDialogComponent,
    CompanyComponent,
    CreateCompanyDialogComponent,
    EditCompanyDialogComponent,
    ClientComponent,
    CreateClientDialogComponent,
    EditClientDialogComponent,
    InitialBalanceComponent,
    ExchangePriceComponent,
    CommisionComponent,
    CreateCommisionDialogComponent,
    EditCommisionDialogComponent,
    GeneralSettingComponent,
    CheckEditPasswordComponent,
    BranchComponent,
    CreateBranchDialogComponent,
    EditBranchDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    SharedModule,
    ServiceProxyModule,
    ThemeModule,
    SettingRoutingModule,
    ...SYNCFUSION_MODULES,
    ...NB_MODULES,
    TabsModule,
  ],
  providers: [
    ...SYNCFUSION_SERVICES,
    CountryServiceProxy,
    CurrencyServiceProxy,
    ExpenseServiceProxy,
    IncomeServiceProxy,
    CompanyServiceProxy,
    ClientServiceProxy,
    BranchServiceProxy,
    ProvinceServiceProxy,
    CommisionServiceProxy,
    TreasuryBalanceServiceProxy,
    ExchangePriceServiceProxy,
    GeneralSettingServiceProxy,
    MigrationServiceProxy,
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SettingModule {}
