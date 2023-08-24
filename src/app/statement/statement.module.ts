import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { StatementRoutingModule } from './statement-routing.module';
import { StatementComponent } from './statement.component';
import { AggregateService, EditService, FilterService, ForeignKeyService, GridModule, GroupService, PageService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { MaskedTextBoxModule, NumericTextBoxModule, TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule, ListBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { CalendarModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ClientBalanceStatementComponent } from './client-balance-statement/client-balance-statement.component';
import { NbActionsModule, NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDialogModule, NbIconModule, NbInputModule, NbPopoverModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { CompanyBalanceStatementComponent } from './company-balance-statement/company-balance-statement.component';
import { TreasuryBalanceStatementComponent } from './treasury-balance-statment/treasury-balance-statement.component';
import { TotalClientBalanceStatmentComponent } from './total-client-balance-statment/total-client-balance-statment.component';
import { SearchTotalClientBalanceStatmentDialogComponent } from './total-client-balance-statment/search-total-client-balance-statment-dialog.component';

import { TotalBalanceStatmentComponent } from './total-balance-statment/total-balance-statment.component';
import { SearchTotalBalanceStatmentDialogComponent } from './total-balance-statment/search-total-balance-statment-dialog.component';

import { SearchClientBalanceStatmentDialogComponent } from './client-balance-statement/search-client-balance-statment-dialog.component';
import { TotalCompanyBalanceStatmentComponent } from './total-company-balance-statment/total-company-balance-statment.component';
import { SearchTotalCompanyBalanceStatmentDialogComponent } from './total-company-balance-statment/search-total-company-balance-statment-dialog.component';
import { SearchCompanyBalanceStatmentDialogComponent } from './company-balance-statement/search-company-balance-statment-dialog.component';
import { ClientCashFlowServiceProxy, CompanyCashFlowServiceProxy, TreasuryCashFlowServiceProxy } from '@shared/service-proxies/service-proxies';
import { ClientMatchingDialogComponent } from './client-balance-statement/client-matching/client-matching-dialog.component';
import { CompanyMatchingDialogComponent } from './company-balance-statement/company-matching/company-matching-dialog.component';
import { OutgoingTransferStatementComponent } from './outgoing-transfer-statement/outgoing-transfer-statement.component';
import { SearchOutgoingTransferStatementDialogComponent } from './outgoing-transfer-statement/search-outgoing-transfer-statement-dialog.component';
import { SpendsStatmentComponent } from './spends-statment/spends-statment.component';
import { SearchSpendsStatmentComponent } from './spends-statment/search-spends-statment.component';
import { SearchReceiptsStatmentComponent } from './receipts-statement/search-receipts-statment.component';
import { ReceiptsStatmentComponent } from './receipts-statement/receipts-statment.component';
import { DefaultersOfPaymentStatementComponent } from './defaulters-of-payment-statment/defaulters-of-payment-statement.component';
import { SearchDefaultersOfPaymentStatementComponent } from './defaulters-of-payment-statment/search-defaulters-of-payment-statement.component';
import { SummaryStatementComponent } from './summary-statement/summary-statement/summary-statement.component';
import { SearchSummaryStatementComponent } from './summary-statement/search-summary-statement/search-summary-statement.component';
import { InactiveClientStatementComponent } from './inactive-client-statement/inactive-client-statement.component';
import { SearchInactiveClientStatementComponent } from './inactive-client-statement/search-inactive-client-statement.component';
import { ExchangeCurrencyStatementComponent } from './exchange-currency-statement/exchange-currency-statement.component';
import { SearchExchangeCurrencyStatementComponent } from './exchange-currency-statement/search-exchange-currency-statement.component';
import { NgxPrintDirective, NgxPrintModule } from 'ngx-print';

const NB_MODULES = [
  NbActionsModule,
  NbIconModule,
  NbEvaIconsModule,
  NbDialogModule.forChild(),
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbAlertModule,
  NbPopoverModule,
  NbCheckboxModule
];
const SYNCFUSION_MODULES = [
  GridModule,
  ToolbarModule,
  UploaderModule,
  TextBoxModule,
  NumericTextBoxModule,
  CalendarModule,
  DatePickerModule,
  MaskedTextBoxModule,
  DropDownListModule,
  SwitchModule,
  ListBoxModule
];

const SYNCFUSION_SERVICES = [
  PageService,
  SortService,
  FilterService,
  GroupService,
  ToolbarService,
  ForeignKeyService,
  EditService,
  AggregateService
];

@NgModule({
  declarations: [
    StatementComponent, 
    ClientBalanceStatementComponent, 
    CompanyBalanceStatementComponent, 
    TreasuryBalanceStatementComponent, 
    TotalClientBalanceStatmentComponent, 
    SearchTotalClientBalanceStatmentDialogComponent,
    
    TotalBalanceStatmentComponent, 
    SearchTotalBalanceStatmentDialogComponent,

    SearchClientBalanceStatmentDialogComponent,
    TotalCompanyBalanceStatmentComponent, 
    SearchTotalCompanyBalanceStatmentDialogComponent,
    SearchCompanyBalanceStatmentDialogComponent,
    ClientMatchingDialogComponent,
    CompanyMatchingDialogComponent,
    OutgoingTransferStatementComponent,
    SearchOutgoingTransferStatementDialogComponent,
    SpendsStatmentComponent,
    SearchSpendsStatmentComponent,
    SearchReceiptsStatmentComponent,
    ReceiptsStatmentComponent,
    DefaultersOfPaymentStatementComponent,
    SearchDefaultersOfPaymentStatementComponent,
    SummaryStatementComponent,
    SearchSummaryStatementComponent,
    InactiveClientStatementComponent,
    SearchInactiveClientStatementComponent,
    ExchangeCurrencyStatementComponent,
    SearchExchangeCurrencyStatementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    SharedModule,
    ServiceProxyModule,
    ThemeModule,
    StatementRoutingModule,
    ...SYNCFUSION_MODULES,
    ...NB_MODULES,
    NgxPrintModule
  ],
  providers: [
    ...SYNCFUSION_SERVICES,
    ClientCashFlowServiceProxy,
    CompanyCashFlowServiceProxy,
    TreasuryCashFlowServiceProxy
  ],
  entryComponents: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class StatementModule { }
