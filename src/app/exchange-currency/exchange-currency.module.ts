import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
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
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { ExchangeCurrencyRoutingModule } from './exchange-currency-routing.module';
import { ExchangeCurrencyComponent } from './exchange-currency.component';
import { 
  EditService, 
  FilterService, 
  ForeignKeyService, 
  GridModule, 
  GroupService, 
  PageService, 
  SortService, 
  ToolbarService } from '@syncfusion/ej2-angular-grids';
import { AccordionModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { MaskedTextBoxModule, NumericTextBoxModule, TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { CalendarModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AutoCompleteModule, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ClientServiceProxy, CompanyServiceProxy, CurrencyServiceProxy, ExchangeCurrencyServiceProxy, TreasuryServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateExchangeCurrencyComponent } from './create-exchange-currency/create-exchange-currency.component';
import { EditExchangeCurrencyComponent } from './edit-exchange-currency/edit-exchange-currency.component';
import { SearchExchangeCurrencyComponent } from './search-exchange-currency/search-exchange-currency.component';
import { ListExchangeCurrencyComponent } from './list-exchange-currency/list-exchange-currency.component';


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
  
];

@NgModule({
  declarations: [
    ExchangeCurrencyComponent,
    CreateExchangeCurrencyComponent,
    EditExchangeCurrencyComponent,
    SearchExchangeCurrencyComponent,
    ListExchangeCurrencyComponent, 
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    SharedModule,
    ServiceProxyModule,
    ThemeModule,
    ExchangeCurrencyRoutingModule,
    ...SYNCFUSION_MODULES,
    ...NB_MODULES,
  ],
  providers: [
    ...SYNCFUSION_SERVICES,
    CurrencyServiceProxy,
    CompanyServiceProxy,
    ClientServiceProxy,
    ExchangeCurrencyServiceProxy,
    //TreasuryServiceProxy 
  ],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class ExchangeCurrencyModule { }
