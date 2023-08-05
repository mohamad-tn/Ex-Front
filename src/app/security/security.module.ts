import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityComponent } from './security.component';
import { 
  NbActionsModule, 
  NbButtonModule, 
  NbCardModule, 
  NbCheckboxModule, 
  NbDialogModule, 
  NbIconModule, 
  NbInputModule, 
  NbListModule,
  NbSelectModule,
  NbTabsetModule,
  NbToggleModule,
  NbTooltipModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { 
  FilterService, 
  ForeignKeyService, 
  GridModule, 
  GroupService, 
  PageService, 
  SortService, 
  ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { ThemeModule } from '@theme/theme.module';
import { SecurityRoutingModule } from './security-routing.module';
import { UserComponent } from './user/user.component';
import { BrowserModule } from '@angular/platform-browser';
import { CreateUserDialogComponent } from './user/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from './user/edit-user/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './user/reset-password/reset-password-dialog.component';
import { RoleComponent } from './role/role.component';
import { CreateRoleDialogComponent } from './role/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './role/edit-role/edit-role-dialog.component';
import { PermissionRoleComponent } from './role/permission-role/permission-role.component';

const NB_MODULES = [
  NbActionsModule,
  NbIconModule,
  NbEvaIconsModule,
  NbDialogModule.forChild(),
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbListModule,
  NbSelectModule,
  NbTooltipModule,
  NbToggleModule
];
const SYNCFUSION_MODULES = [
  GridModule,
  ToolbarModule,
];

const SYNCFUSION_SERVICES = [
  PageService,
  SortService,
  FilterService,
  GroupService,
  ToolbarService,
  ForeignKeyService
];


@NgModule({
  declarations: [
    SecurityComponent, 
    UserComponent, 
    CreateUserDialogComponent, 
    EditUserDialogComponent, 
    ResetPasswordDialogComponent, 
    RoleComponent, 
    CreateRoleDialogComponent, 
    EditRoleDialogComponent, PermissionRoleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    SharedModule,
    ServiceProxyModule,
    ThemeModule,
    SecurityRoutingModule,
    ...SYNCFUSION_MODULES,
    ...NB_MODULES
  ],
  providers: [
    ...SYNCFUSION_SERVICES,
  ],
  entryComponents: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class SecurityModule { }
