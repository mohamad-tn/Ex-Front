import { Component, EventEmitter, Inject, Injector, OnInit, Optional, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, CustomerServiceProxy, ExchangePartyDto, FileUploadDto, IncomeTransferDetailDto, IncomeTransferDetailServiceProxy, PayDirectTransferInputDto, TreasuryActionDto, TreasuryActionServiceProxy } from '@shared/service-proxies/service-proxies';
import { WebcamImage } from 'ngx-webcam';
import { threadId } from 'worker_threads';
import { ImageTakenDialogComponent } from '../image-taken-dialog/image-taken-dialog.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pay-direct-transfer',
  templateUrl: './pay-direct-transfer.component.html',
  styleUrls: ['./pay-direct-transfer.component.scss']
})
export class PayDirectTransferComponent extends AppComponentBase  implements OnInit {

  public beneficiaries: object[] = [];

  webcamImage: WebcamImage | any;
  imgSrc: any;
  slides = [
    {image: 'assets/img/take-photo.jpg', text: 'First'},
    {image: 'assets/img/take-photo.jpg',text: 'Second'},
    {image: 'assets/img/take-photo.jpg',text: 'Third'}
];
  payDirectTransferInput : PayDirectTransferInputDto = new PayDirectTransferInputDto();
  exchangeParties: ExchangePartyDto[] = [];
  treasuryAction: TreasuryActionDto = new TreasuryActionDto();
  exchangeParty: ExchangePartyDto = new ExchangePartyDto();
  saving: boolean;
  beneficiaryId: number;
  public fields: Object = { text: 'name', value: 'id' };
  public exchangePartyFields: Object = { text: 'name', value: 'exchangePartyId' };
  currencyName: string;
  imgClassName: string = 'col-md-6';
  baseUrl: string;

  constructor(injector: Injector,
    private _modalService: NbDialogService,
    private _router: Router,
    private _incomeTransferDetailAppService: IncomeTransferDetailServiceProxy,
    private _treasuryActionAppService: TreasuryActionServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) { 
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    let routeData = history.state;
    if(routeData?.id == undefined){
      this.beneficiaryId = routeData?.beneficiaryId;
      this.navegateToDirectTransfer();
    }
    
    this.payDirectTransferInput.phoneNumber = routeData.phoneNumber;
    this.treasuryAction.incomeTransferDetailId = routeData.id;
    this.treasuryAction.amount = routeData.amount;
    this.treasuryAction.currencyId = routeData.currencyId;
    this.treasuryAction.mainAccount = 4; // حوالة مباشرة
    this.treasuryAction.actionType = 0; // صرف
    this.treasuryAction.date = new Date().toISOString();
    this.treasuryAction.issuer = routeData.company;
    if(routeData.identificationNumber != undefined){
      this.treasuryAction.identificationNumber = routeData.identificationNumber;
    }
    this.payDirectTransferInput.images = [];
    this.currencyName = routeData.currencyName;
    this.initialCustomerImages();
    if(this.webcamImage == undefined){
      this.imgSrc='assets/img/take-photo.jpg'
    }

    this.initialExchangeParties();
  }

  initialCustomerImages(){
    this._incomeTransferDetailAppService.getDirectTransferImages(this.treasuryAction.incomeTransferDetailId )
    .subscribe(result =>{
      if(result.length > 0){
        this.payDirectTransferInput.images = result;
      }
    });
  }

  save(){
    this.payDirectTransferInput.treasuryAction = this.treasuryAction;
    this.saving = true;
    this._treasuryActionAppService
      .payDirectTransfer(this.payDirectTransferInput)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.navegateToDirectTransfer();
      });
  }

  navegateToDirectTransfer(){
    this._router.navigateByUrl('/app/transfer/direct-transfer');
  }

  takePhoto(){
    this._modalService.open(
      ImageTakenDialogComponent,
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

          this.payDirectTransferInput.images.push(uploadFile);
          
          //this.updateImgCol(this.payDirectTransferInput.images.length);
        }
      }
    });
  }


  initialExchangeParties(){
    this._treasuryActionAppService.getExchangeParties()
    .subscribe(result => {
      this.exchangeParties = result;
      if(this.exchangeParties.length > 0){
        this.exchangeParty.exchangePartyId = this.exchangeParties[0].exchangePartyId;
      }
    });
  }

  onExchangePartyChange(args: any){
    if(args.itemData != undefined){
      this.treasuryAction.exchangePartyClientId = undefined;
      this.treasuryAction.exchangePartyCompanyId = undefined;
      this.treasuryAction.treasuryId = undefined;
      if(args.itemData.group == "Client"){
        this.treasuryAction.exchangePartyClientId = args.itemData.id;
      }else if(args.itemData.group == "Company"){
        this.treasuryAction.exchangePartyCompanyId = args.itemData.id;
      }else{
        this.treasuryAction.treasuryId = args.itemData.id;
      }
    }
  }

  deletePhoto(file){
    var index = this.payDirectTransferInput.images.findIndex(x=>x.fileAsBase64 == file.fileAsBase64);
    this.payDirectTransferInput.images.splice(index,1);
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

}


