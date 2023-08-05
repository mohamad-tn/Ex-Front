import { Component, Injector, OnInit, Renderer2 } from '@angular/core';
import { NbIconLibraries, NbMenuItem } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { MENU_ITEMS } from 'app/app-menu';

@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AppComponentBase implements OnInit {
  
  menu = MENU_ITEMS;
  
  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private iconLibraries: NbIconLibraries
  ) {
    super(injector);
    this.localizeMenuTitles(this.menu);
    this.iconLibraries.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    this.iconLibraries.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'sidebar-mini');
this.l
    SignalRAspNetCoreHelper.initSignalR();

    abp.event.on('abp.notifications.received', (userNotification) => {
      abp.notifications.showUiNotifyForUserNotification(userNotification);

      // Desktop notification
      Push.create('AbpZeroTemplate', {
        body: userNotification.notification.data.message,
        icon: abp.appPath + 'assets/app-logo-small.png',
        timeout: 6000,
        onClick: function () {
          window.focus();
          this.close();
        }
      });
    });
  }
  localizeMenuTitles(menuItems: NbMenuItem[]) {
    menuItems.forEach(item => {
      item.title=this.l(item.title);

      if(item.children != null){
        
        this.localizeMenuTitles(item.children);
      }
      
    });

    this.menu = menuItems;
  }
}
