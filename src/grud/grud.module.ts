import { NgModule } from '@angular/core';
import { GrudToolbarComponent } from './grud-toolbar.component';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';


@NgModule({
  declarations: [GrudToolbarComponent],
  imports: [
    ToolbarModule
  ]
})
export class GrudModule { }
