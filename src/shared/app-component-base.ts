import { Injector, ElementRef } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
    LocalizationService,
    PermissionCheckerService,
    FeatureCheckerService,
    NotifyService,
    SettingService,
    MessageService,
    AbpMultiTenancyService
} from 'abp-ng2-module';

import { AppSessionService } from '@shared/session/app-session.service';

export abstract class AppComponentBase {

    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    localization: LocalizationService;
    permission: PermissionCheckerService;
    feature: FeatureCheckerService;
    notify: NotifyService;
    setting: SettingService;
    message: MessageService;
    multiTenancy: AbpMultiTenancyService;
    appSession: AppSessionService;
    elementRef: ElementRef;

    constructor(injector: Injector) {
        this.localization = injector.get(LocalizationService);
        this.permission = injector.get(PermissionCheckerService);
        this.feature = injector.get(FeatureCheckerService);
        this.notify = injector.get(NotifyService);
        this.setting = injector.get(SettingService);
        this.message = injector.get(MessageService);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.appSession = injector.get(AppSessionService);
        this.elementRef = injector.get(ElementRef);
    }

    l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, this.localizationSourceName);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }

    getBalance(value){
        if(value != undefined)
        {
            var realNumber = Math.abs(value);
            if(value < 0){
                return this.numberWithCommas(realNumber) + '/' + this.l('ForHim');
            }else if(value > 0){
                return this.numberWithCommas(realNumber) + '/' + this.l('OnHim');
            }
        }
        return '0';
    }

    getCommission(value){
        return (value != undefined) ? this.numberWithCommas(value) : '';
    }

    numberWithCommas(number){
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    numberWithCommasAndAbs(number){
        var realNumber = Math.abs(number);
        return realNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    getDateFromString(str: string){
        const array = str.split(' ');
        if(array && array.length == 3){
            const dateArray = array[0].split('/');
            const month = +dateArray[0];
            const day = +dateArray[1];
            const year = +(dateArray[2]);
            const timeArray = array[1].split(':');
            let hour = +timeArray[0];
            const minute = +timeArray[1];
            const second = +timeArray[2];
            if(array[2].toLowerCase() == 'pm'){
                hour = hour + 12;
            }
            return new Date(year, month - 1, day, hour, minute, second, 0);
        }
        return null;
    }
    
}
