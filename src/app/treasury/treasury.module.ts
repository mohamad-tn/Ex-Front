import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { TreasuryRoutingModule } from './treasury-routing.module';
import { TreasuryComponent } from './treasury.component';
import { EditService, FilterService, ForeignKeyService, GridModule, GroupService, PageService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { MaskedTextBoxModule, NumericTextBoxModule, TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { TreasuryActionComponent } from './treasury-action/treasury-action.component';
import { CalendarModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NbActionsModule, NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { CustomerServiceProxy, IncomeTransferDetailServiceProxy, TreasuryActionServiceProxy } from '@shared/service-proxies/service-proxies';
import { SearchTreasuryActionDialogComponent } from './search-treasury-action/search-treasury-action-dialog.component';
import { EditTreasuryActionComponent } from './edit-treasury-action/edit-treasury-action.component';
import { ListTreasuryActionComponent } from './list-treasury-action/list-treasury-action.component';
import {NgxPrintModule} from 'ngx-print';
import { PrintTreasuryActionComponent } from './print-treasury-action/print-treasury-action.component';
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
  declarations: [TreasuryComponent, TreasuryActionComponent, SearchTreasuryActionDialogComponent, EditTreasuryActionComponent, ListTreasuryActionComponent, PrintTreasuryActionComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    SharedModule,
    ServiceProxyModule,
    ThemeModule,
    TreasuryRoutingModule,
    ...SYNCFUSION_MODULES,
    ...NB_MODULES,
    NgxPrintModule
  ],
  providers: [
    ...SYNCFUSION_SERVICES,
    TreasuryActionServiceProxy,
    CustomerServiceProxy,
    IncomeTransferDetailServiceProxy 
  ],
  entryComponents: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class TreasuryModule { }
