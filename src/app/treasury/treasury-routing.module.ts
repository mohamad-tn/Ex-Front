import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { EditTreasuryActionComponent } from './edit-treasury-action/edit-treasury-action.component';
import { ListTreasuryActionComponent } from './list-treasury-action/list-treasury-action.component';
import { TreasuryActionComponent } from './treasury-action/treasury-action.component';
import { TreasuryComponent } from './treasury.component';

const routes: Routes = [{
  path: '',
    component: TreasuryComponent,
  children: [
    {
      path: 'treasury-action',
      component: TreasuryActionComponent,
      //data: { permission: 'Pages.TreasuryActions' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'list-treasury-action',
      component: ListTreasuryActionComponent,
      //data: { permission: 'Pages.TreasuryActions' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'edit-treasury-action',
      component: EditTreasuryActionComponent,
      //data: { permission: 'Pages.TreasuryActions' },
      canActivate: [AppRouteGuard]
    },
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class TreasuryRoutingModule { }
