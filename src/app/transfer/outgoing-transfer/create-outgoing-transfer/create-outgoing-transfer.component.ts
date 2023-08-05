import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckEditPasswordComponent } from '@app/setting/general-setting/check-edit-password/check-edit-password.component';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { LocalizationHelper } from '@shared/localization/localization-helper';
import { API_BASE_URL, ClientDto, ClientServiceProxy, CompanyDto, CompanyServiceProxy, CountryDto, CountryServiceProxy, CurrencyDto, CurrencyServiceProxy, CustomerDto, CustomerServiceProxy, FileUploadDto, OutgoingTransferDto, OutgoingTransferServiceProxy } from '@shared/service-proxies/service-proxies';
import { L10n, setCulture, loadCldr } from '@syncfusion/ej2-base';
import { WebcamImage } from 'ngx-webcam';
import { finalize } from 'rxjs/operators';
import { OutgoingImageTakenDialogComponent } from '../outgoing-image-taken-dialog/outgoing-image-taken-dialog.component';
import { PrintOutgoingTransferComponent } from '../print-outgoing-transfer/print-outgoing-transfer.component';


@Component({
  selector: 'app-create-outgoing-transfer',
  templateUrl: './create-outgoing-transfer.component.html',
  styleUrls: ['./create-outgoing-transfer.component.scss']
})
export class CreateOutgoingTransferComponent extends AppComponentBase implements OnInit {

  outgoingTransfer: OutgoingTransferDto = new OutgoingTransferDto();
  listNumber: number = 0;
  previousBalance: number = 0.0;
  currentBalance: number = 0.0;
  requiredAmount: number = 0.0;
  previousBalanceForToCompany: number = 0.0;
  currentBalanceForToCompany: number = 0.0;
  companyPhone: string = '';
  companyAddress: string = '';
  saving = false;
  transferId: number;
  currencies: CurrencyDto[] = [];
  companies: CompanyDto[] = [];
  countries: CountryDto[] = [];
  clients: ClientDto[] = [];
  customers: CustomerDto[] = [];
  paymentTypes: object[] = [];


  public fields: Object = { text: 'name', value: 'id' };
  public autoCompleteFields: Object = { value: 'name' };
  baseUrl: string;

  constructor(
    injector: Injector,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _modalService: NbDialogService,
    private _currencyAppService: CurrencyServiceProxy,
    private _companyAppService: CompanyServiceProxy,
    private _countryAppService: CountryServiceProxy,
    private _clientAppService: ClientServiceProxy,
    private _customerAppService: CustomerServiceProxy,
    private _outgoingTransferAppService: OutgoingTransferServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) 
  { 
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.outgoingTransfer.date = new Date().toISOString();
    if(this.outgoingTransfer.beneficiary == undefined)
      this.outgoingTransfer.beneficiary=new CustomerDto();

    if(this.outgoingTransfer.sender == undefined)
      this.outgoingTransfer.sender=new CustomerDto();

    this.outgoingTransfer.images = [];
    //this.initialCustomerImages();
    if(this.webcamImage == undefined){
      this.imgSrc='assets/img/take-photo.jpg'
    }
    this.initialNumber();
    this.initialCurrencies();
    this.initialCompanies();
    this.initialCountries();
    this.initialClients();
    this.initialCustomers();

    this.paymentTypes = [
      {'name' : 'نقدي' , 'id' : 0},
      {'name' : 'ذمم' , 'id' : 1},
      {'name' : 'شركة' , 'id' : 2},
    ];

    this.outgoingTransfer.paymentType = 0;
    
    if(history.state != undefined && history.state.name != undefined && history.state.name == 'edit-outgoing-transfer'){
      this.transferId = +history.state.id;
      if(this.transferId != undefined){
        this._outgoingTransferAppService.getById(this.transferId)
        .subscribe(result => {
          this.outgoingTransfer = result
        });
      }
    }
    
  }

  initialCustomerImages(id){
    if(id != undefined){
      this.outgoingTransfer.images = []
      this._customerAppService.getCustomerImages(id)
      .subscribe(result =>{
        if(result.length > 0){
          this.outgoingTransfer.images = result;
        }
      });
    }
  }


  initialNumber(){
    this._outgoingTransferAppService.getLastNumber()
    .subscribe(result => {
      this.listNumber = result + 1;
      this.outgoingTransfer.number = this.listNumber;
    });
  }

  initialCurrencies(){
    this._currencyAppService.getAll()
    .subscribe(result => {
      this.currencies = result;
      this.initialMainCurrency();
    });
  }

  initialMainCurrency(){
    this.currencies.forEach(currncy => {
      if(currncy.isMainCurrency){
        this.outgoingTransfer.currencyId = currncy.id;
      }
    });
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

  initialCustomers(){
    this._customerAppService.getAll()
    .subscribe(result => this.customers = result);
  }

  save(){
    if(this.outgoingTransfer.amount == 0){
      return;
    }
    this.saving = true;
    this._outgoingTransferAppService
      .create(this.outgoingTransfer)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        let url = this._router.url;
        this._router.navigateByUrl('/',{skipLocationChange: true})
        .then(()=>{
          this._router.navigateByUrl(url);
        });
        // this.outgoingTransfer = new OutgoingTransferDto();
        // this.outgoingTransfer.date = new Date().toISOString();

        // if(this.outgoingTransfer.beneficiary == undefined)
        //   this.outgoingTransfer.beneficiary=new CustomerDto();

        // if(this.outgoingTransfer.sender == undefined)
        //   this.outgoingTransfer.sender=new CustomerDto();
      });
  }

  onPaymentTypeChange(args:any){
    this.outgoingTransfer.receivedAmount = 0;
  }

  onChangeBeneficiary(args:any){
    if(args.itemData !=undefined && args.itemData.id != undefined){
      this.outgoingTransfer.beneficiary = args.itemData;
      this.initialCustomerImages(args.itemData.id)
    }else{
      if(this.outgoingTransfer.beneficiary != undefined){
        this.outgoingTransfer.beneficiary.phoneNumber = '';
        this.outgoingTransfer.beneficiary.address = '';
      }
    }
  }

  onChangeSender(args:any){
    if(args.itemData != undefined && args.itemData.id != undefined){
      this.outgoingTransfer.sender = args.itemData;
    }else{
      if(this.outgoingTransfer.sender != undefined){
        this.outgoingTransfer.sender.phoneNumber = '';
        this.outgoingTransfer.sender.address = '';
      }
    }
  }

  onCurrencyChange(args: any){
    if(args.itemData != undefined && 
      args.itemData.id != undefined){
        if(this.outgoingTransfer.paymentType == 1 && this.outgoingTransfer.fromClientId != undefined)
          this.getFromClientBalance(this.outgoingTransfer.fromClientId, args.itemData.id);

        if(this.outgoingTransfer.paymentType == 2 && this.outgoingTransfer.fromCompanyId != undefined)
          this.getFromCompanyBalance(this.outgoingTransfer.fromCompanyId, args.itemData.id);

        if(this.outgoingTransfer.toCompanyId != undefined)
          {
            this.getToCompanyBalance(this.outgoingTransfer.toCompanyId, args.itemData.id);
            this.getFromCompanyBalance(this.outgoingTransfer.fromCompanyId, args.itemData.id);
          }
      } 
  }

  onToCompanyChange(args: any){
    if(args.itemData != undefined && 
      args.itemData.id != undefined && 
      this.outgoingTransfer.currencyId != undefined){
        this.getToCompanyBalance(args.itemData.id, this.outgoingTransfer.currencyId);
        this.getCompanyInfo(args.itemData.id);
    }
  }

  getCompanyInfo(id){
    let company = this.companies.find(x=>x.id == id);
    this.companyAddress = company.address;
    this.companyPhone = company.phone;
  }

  onFromCompanyChange(args: any){
    if(args.itemData != undefined && 
      args.itemData.id != undefined && 
      this.outgoingTransfer.currencyId != undefined){
        this.getFromCompanyBalance(args.itemData.id, this.outgoingTransfer.currencyId);
    }
  }

  onFromClientChange(args: any){
    if(args.itemData != undefined && 
      args.itemData.id != undefined && 
      this.outgoingTransfer.currencyId != undefined){
        this.getFromClientBalance(args.itemData.id, this.outgoingTransfer.currencyId);
    }
  }

  onAmountChange(args: any){
    if(args != undefined && this.outgoingTransfer.currencyId != undefined){
      if(this.outgoingTransfer.paymentType == 1 && this.outgoingTransfer.fromClientId != undefined){
        this.getFromClientBalance(this.outgoingTransfer.fromClientId, this.outgoingTransfer.currencyId);
      }else if(this.outgoingTransfer.paymentType == 2 && this.outgoingTransfer.fromCompanyId != undefined){
        this.getFromCompanyBalance(this.outgoingTransfer.fromCompanyId, this.outgoingTransfer.currencyId);
      }

      this.getToCompanyBalance(this.outgoingTransfer.toCompanyId, this.outgoingTransfer.currencyId);
  }
  }

  onCompanyCommissionChange(args:any){
    if(args != undefined && this.outgoingTransfer.currencyId != undefined){
      this.getToCompanyBalance(this.outgoingTransfer.toCompanyId, this.outgoingTransfer.currencyId);
    }
  }

  getFromClientBalance(clientId, currencyId){
    this._clientAppService.getCurrentBalance(clientId, currencyId)
    .subscribe(result => {
      this.previousBalance = result.balance;
      this.resolveValues();
      this.requiredAmount = (this.outgoingTransfer.amount + this.outgoingTransfer.commission);
      this.currentBalance = this.outgoingTransfer.amount != undefined ? (result.balance + this.requiredAmount) : result.balance;
    });
  }

  getFromCompanyBalance(companyId, currencyId){
    this._companyAppService.getCurrentBalance(companyId, currencyId)
    .subscribe(result => {
      this.previousBalance = result.balance;
      this.resolveValues();
      this.requiredAmount = (this.outgoingTransfer.amount + this.outgoingTransfer.commission);
      
      this.currentBalance = this.outgoingTransfer.amount != undefined ? (result.balance + this.requiredAmount) : result.balance;
    });
  }

  getToCompanyBalance(toCompanyId, currencyId){
    this._companyAppService.getCurrentBalance(toCompanyId, currencyId)
    .subscribe(result => {
      this.previousBalanceForToCompany = result.balance;
      this.resolveValues();
      this.requiredAmount = (this.outgoingTransfer.amount + this.outgoingTransfer.commission);
      var value = (this.outgoingTransfer.amount + this.outgoingTransfer.companyCommission);
      this.currentBalanceForToCompany = this.outgoingTransfer.amount != undefined ? (result.balance - value) : result.balance;
    });
  }

  resolveValues(){
    this.outgoingTransfer.amount = this.outgoingTransfer.amount != undefined ? this.outgoingTransfer.amount : 0;
    this.outgoingTransfer.commission = this.outgoingTransfer.commission != undefined ? this.outgoingTransfer.commission : 0;
    this.outgoingTransfer.companyCommission = this.outgoingTransfer.companyCommission != undefined ? this.outgoingTransfer.companyCommission : 0;
  }

  getAmountWithCurrency(number){
    if(this.outgoingTransfer.currencyId != undefined && number != 0 && number != undefined){
      let selectedCurrency = this.currencies.find( c => c.id == this.outgoingTransfer.currencyId);
      return this.getBalance(number) + '  ' + selectedCurrency.name;
    }
      return 0;
  }

  searchOutgoingTransfer(){
    this._router.navigateByUrl("/app/transfer/search-outgoing-transfer");
  }
  
  //-----
  webcamImage: WebcamImage | any;
  imgClassName: string = 'col-md-6';
  imgSrc: any;
  takePhoto(){
    this._modalService.open(
      OutgoingImageTakenDialogComponent,
      {
        context: {
          //id: data.id
        },
      }
    ).onClose.subscribe((e:any) => {
      if(e != undefined && e.img != undefined){
        this.webcamImage = e.img;
        this.imgSrc = this.webcamImage.imageAsDataUrl;
        if(this.webcamImage != undefined){
          let uploadFile = new FileUploadDto();
          uploadFile.fileAsBase64 = this.webcamImage.imageAsDataUrl;
          uploadFile.fileType = 'jpeg';
          uploadFile.fileName = 'webcam.jpeg';

          this.outgoingTransfer.images.push(uploadFile);
        }
      }
    });
  }
  
  updateImgCol(count){
    if(count > 1){
      this.imgClassName = 'col-md-4';
    }else{
      this.imgClassName = 'col-md-6';
    }
    
  }

  getSrc(image : FileUploadDto){
    if(image.filePath != undefined){
      return this.baseUrl + '/' + image.filePath;
    }

    return image.fileAsBase64;
  }

  deletePhoto(file){
    var index = this.outgoingTransfer.images.findIndex(x=>x.fileAsBase64 == file.fileAsBase64);
    this.outgoingTransfer.images.splice(index,1);
  }

  print(){
    this._modalService.open(
      PrintOutgoingTransferComponent,
      {
        context: {
          input: this.outgoingTransfer,
          currencyName: this.getCurrencyName(),
          toCompanyName: this.getCompanyName(this.outgoingTransfer.toCompanyId),
          fromCompanyName:  this.getCompanyName(this.outgoingTransfer.fromCompanyId),
          fromClientName: this.getClientName(this.outgoingTransfer.fromClientId),
          senderName: this.getSenderName(),
          paymentTypeName: this.getPaymentTypeName(),
          beneficiaryName: this.getBeneficiaryName()
        },
      }
    ).onClose.subscribe((e:any) => {
      if(e.success == true){
        
      }
    });
  }


  getCurrencyName(): string{
    if(this.outgoingTransfer.currencyId == undefined)
      return '';

    return this.currencies.find(x=>x.id == this.outgoingTransfer.currencyId)?.name;
  }

  getCountryName(): string{
    if(this.outgoingTransfer.countryId == undefined)
      return '';

    return this.countries.find(x=>x.id == this.outgoingTransfer.currencyId)?.name;
  }

  getCompanyName(id): string{
    if(id == undefined)
      return '';

    return this.companies.find(x=>x.id == id)?.name;
  }

  getClientName(id): string{
    if(id == undefined)
      return '';

    return this.clients.find(x=>x.id == id)?.name;
  }

  getSenderName(): string{
    if(this.outgoingTransfer.senderId == undefined)
      return '';

    return this.customers.find(x=>x.id == this.outgoingTransfer.senderId)?.name;
  }

  getBeneficiaryName(): string{
    if(this.outgoingTransfer.beneficiaryId == undefined)
      return '';

    return this.customers.find(x=>x.id == this.outgoingTransfer.beneficiaryId)?.name;
  }

  getPaymentTypeName(){
    switch(this.outgoingTransfer.paymentType)
    {
      case 0: {return 'نقدي'}
      case 1: {return 'ذمم'}
      case 2: {return 'شركة'}
      default: {return ''}
    }
  }
}

