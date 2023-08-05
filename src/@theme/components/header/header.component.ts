import { Component, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { NbIconLibraries, NbLayoutDirection, NbLayoutDirectionService, NbMediaBreakpointsService, NbMenuBag, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { AnalyticsService, LayoutService } from '../../../@core/utils';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { RippleService } from '../../../@core/utils/ripple.service';
import {CurrentThemeService} from '../../../@core/utils/theme.service';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { NbLogoutComponent } from '@nebular/auth';
import { AppComponentBase } from '@shared/app-component-base';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent extends AppComponentBase implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  public readonly materialTheme$: Observable<boolean>;
  public readonly onClickUserMenu$: Observable<boolean>;
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
    {
      value: 'material-light',
      name: 'Material Light',
    },
    {
      value: 'material-dark',
      name: 'Material Dark',
    },
  ];

  currentTheme = 'material-light';
  currentDirection= NbLayoutDirection;
  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];
  languagesMenu = [ { title: 'EN' }, { title: 'AR' } ];
  tag = 'user-context-menu';
  public constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private currentThemeService: CurrentThemeService,
    private analytics: AnalyticsService,
    private rippleService: RippleService,
    private iconLibraries: NbIconLibraries,
    private _authService: AppAuthService,
    private directionService: NbLayoutDirectionService,
    injector: Injector,
    @Inject(DOCUMENT) private document: any
  ) {
    super(injector);
    this.materialTheme$ = this.themeService.onThemeChange()
      .pipe(map(theme => {
        const themeName: string = theme?.name || '';
        return themeName.startsWith('material');
      }));
      
      menuService.onItemClick()
      .pipe(filter(({ tag }) => tag === this.tag))
      .subscribe(bag => this.onClickUserMenu(bag));
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    //Direction
    this.directionService.setDirection(this.currentDirection.RTL);
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = this.appSession.user);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => {
        this.currentTheme = themeName;
        this.rippleService.toggle(themeName?.startsWith('material'));
      });

      this.changeTheme('material-light');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.currentThemeService.setCurrentTheme(themeName);
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  startSearch() {
    this.analytics.trackEvent('startSearch');
  }

  trackEmailClick() {
    this.analytics.trackEvent('clickContactEmail', 'click');
  }

  onClickUserMenu(bag: NbMenuBag){
    if(bag.item.title == 'Log out'){
      this.logout();
    }
  }
  logout() {
    this._authService.logout();
  }

  screenIsFull: boolean = false;
  openFullScreen() {
    let elem = document.documentElement;
      let methodToBeInvoked = elem.requestFullscreen  || elem['mozRequestFullscreen'] || elem['msRequestFullscreen'];
      if (methodToBeInvoked){
        methodToBeInvoked.call(elem);
        this.screenIsFull = true;
      }
  }

  closeFullScreen() {
    if (document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }

    this.screenIsFull = false;
  }
}
