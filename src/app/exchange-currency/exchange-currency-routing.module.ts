import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { CreateExchangeCurrencyComponent } from './create-exchange-currency/create-exchange-currency.component';
import { EditExchangeCurrencyComponent } from './edit-exchange-currency/edit-exchange-currency.component';
import { ExchangeCurrencyComponent } from './exchange-currency.component';
import { ListExchangeCurrencyComponent } from './list-exchange-currency/list-exchange-currency.component';

const routes: Routes = [{
  path: '',
  component: ExchangeCurrencyComponent,
  children: [
    {
      path: 'create',
      component: CreateExchangeCurrencyComponent,
      //data: { permission : 'Pages.ExchangeCurrencies' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'list-exchange-currency',
      component: ListExchangeCurrencyComponent,
      canActivate: [AppRouteGuard]
    },
    {
      path: 'edit-exchange-currency',
      component: EditExchangeCurrencyComponent,
      //data: { permission : 'Pages.ExchangeCurrencies' },
      canActivate: [AppRouteGuard]
    }
    
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
export class ExchangeCurrencyRoutingModule { }
