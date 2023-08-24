import { AfterViewInit, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, ClientDto, ClientServiceProxy, CompanyDto, CompanyServiceProxy, CountryDto, CountryServiceProxy, OutgoingTransferDto, OutgoingTransferServiceProxy } from '@shared/service-proxies/service-proxies';
import { AccordionComponent } from '@syncfusion/ej2-angular-navigations';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, Query, Predicate  } from '@syncfusion/ej2-data';
import { SearchOutgoingTransferInput } from './search-outgoing-transfer-input';
import { finalize } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { CheckEditPasswordComponent } from '@app/setting/general-setting/check-edit-password/check-edit-password.component';

@Component({
  selector: 'app-search-outgoing-transfer',
  templateUrl: './search-outgoing-transfer.component.html',
  styleUrls: ['./search-outgoing-transfer.component.scss']
})
export class SearchOutgoingTransferComponent extends AppComponentBase implements OnInit,AfterViewInit {

  @ViewChild('searchGrid') gridInstance: GridComponent;
  @ViewChild("accordion") accordionInstance: AccordionComponent;
  public dataSource: DataManager;
  private baseUrl: string;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [10, 20, 100];
  outgoingTransferInput: SearchOutgoingTransferInput = new SearchOutgoingTransferInput();
  expanded: boolean = true;
  paymentTypes: object[] = [];
  companies: CompanyDto[] = [];
  countries: CountryDto[] = [];
  clients: ClientDto[] = [];
  filtering: boolean = false;
  gridHeight: string = '30vh';
  public fields: Object = { text: 'name', value: 'id' };
  public param: Query; 

  constructor(
    injector: Injector,
    private _router: Router,
    private _companyAppService: CompanyServiceProxy,
    private _countryAppService: CountryServiceProxy,
    private _clientAppService: ClientServiceProxy,
    private _modalService: NbDialogService,
    private _outgoingTransferAppService: OutgoingTransferServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) { 
      super(injector);
      this.baseUrl = baseUrl;
    
    }

  ngOnInit(): void {
    this.pageSettings = {pageSize: 100, pageCount: 100, pageSizes: this.pageSizes};
    this.dataSource = new DataManager({
      url: this.baseUrl + '/api/services/app/OutgoingTransfer/GetForGrid',
      adaptor: new UrlAdaptor()
    });

    this.param = new Query().addParams(
      "userId",
      this.appSession.userId.toString()
    );

    this.outgoingTransferInput.fromDate = new Date().toISOString();
    this.outgoingTransferInput.toDate = new Date().toISOString();
    this.initialCompanies();
    this.initialCountries();
    this.initialClients();

    this.paymentTypes = [
      {'name' : 'نقدي' , 'id' : 0},
      {'name' : 'ذمم عملاء' , 'id' : 1},
      {'name' : 'ذمم شركات' , 'id' : 2},
      {'name' : 'فرع' , 'id' : 3},
    ];

  }

  ngAfterViewInit(){
    //Local Storage
    this.initialFromStorage();
  }

  initialFromStorage(){
    setTimeout( () => { 
      var objAsString = localStorage.getItem('serach-outgoing-transfer-input');
      if(objAsString != undefined && objAsString != ''){
        this.outgoingTransferInput = JSON.parse(objAsString);
        this.search();
        // reset local storage
        localStorage.removeItem("serach-outgoing-transfer-input");
      }
    },1000);
    
  }

  initialCompanies(){
    this._companyAppService.getAll()
    .subscribe(result => this.companies = result);
  }

  initialCountries(){
    this._countryAppService.getAll()
    .subscribe(result => this.countries = result);
  }

  initialClients(){
    this._clientAppService.getAll()
    .subscribe(result => this.clients = result);
  }

  search():void{
    //this.gridHeight = '31vh';
    if(this.accordionInstance != undefined){
      this.accordionInstance.expandItem(false,0);
    }

    this.param = new Query()
      .addParams("userId", this.appSession.userId.toString())
      .addParams("number", this.outgoingTransferInput.number?.toString())
      .addParams("fromDate", this.outgoingTransferInput.fromDate)
      .addParams("toDate", this.outgoingTransferInput.toDate)
      .addParams("paymentType",this.outgoingTransferInput.paymentType?.toString())
      .addParams("clientId",this.outgoingTransferInput.clientId?.toString())
      .addParams("companyId",this.outgoingTransferInput.companyId?.toString())
      .addParams("countryId",this.outgoingTransferInput.countryId?.toString())
      .addParams("beneficiary", this.outgoingTransferInput.beneficiary)
      .addParams("beneficiaryAddress",this.outgoingTransferInput.beneficiaryAddress)
      .addParams("sender", this.outgoingTransferInput.sender);
  }

  openEditPage(id){
    localStorage.setItem("serach-outgoing-transfer-input",JSON.stringify(this.outgoingTransferInput));
    this._router.navigate(["/app/transfer/edit-outgoing-transfer"], {
      queryParams: {
        id : id
      },
    })
  }
  
  showEditPage(id){
    this._modalService.open(
      CheckEditPasswordComponent
    ).onClose.subscribe((e:any) => {
      if(e.success == true){
        this.openEditPage(id);
      }
    });
    
  }
  
  delete(id): void {
    this._modalService.open(
      CheckEditPasswordComponent
    ).onClose.subscribe((e:any) => {
      if(e.success == true){
        this.openDeleteDialog(id);
      }
    });
  }

  openDeleteDialog(id){
    abp.message.confirm(
      this.l('هل انت متأكد الحذف'),
      undefined,
      (result: boolean) => {
        if (result) {
          this._outgoingTransferAppService
            .delete(id)
            .pipe(
              finalize(() => {
                this.gridInstance.refresh();
                abp.notify.success(this.l('SuccessfullyDeleted'));
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }
}
