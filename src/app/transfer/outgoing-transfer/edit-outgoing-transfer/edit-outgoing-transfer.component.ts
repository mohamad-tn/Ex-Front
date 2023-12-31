import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, BranchDto, BranchServiceProxy, ClientDto, ClientServiceProxy, CompanyDto, CompanyServiceProxy, CountryDto, CountryServiceProxy, CurrencyDto, CurrencyServiceProxy, CustomerDto, CustomerServiceProxy, FileUploadDto, OutgoingTransferDto, OutgoingTransferServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { WebcamImage } from 'ngx-webcam';
import { finalize } from 'rxjs/operators';
import { OutgoingImageTakenDialogComponent } from '../outgoing-image-taken-dialog/outgoing-image-taken-dialog.component';
import html2canvas from 'html2canvas';


@Component({
  selector: "app-edit-outgoing-transfer",
  templateUrl: "./edit-outgoing-transfer.component.html",
  styleUrls: ["./edit-outgoing-transfer.component.scss"],
})
export class EditOutgoingTransferComponent
  extends AppComponentBase
  implements OnInit
{
  outgoingTransfer: OutgoingTransferDto = new OutgoingTransferDto();
  previousBalance: number = 0.0;
  currentBalance: number = 0.0;
  requiredAmount: number = 0.0;
  previousBalanceForToCompany: number = 0.0;
  currentBalanceForToCompany: number = 0.0;
  companyPhone: string = "";
  companyAddress: string = "";
  saving = false;
  date: Date;
  transferId: number;
  currencies: CurrencyDto[] = [];
  companies: CompanyDto[] = [];
  countries: CountryDto[] = [];
  clients: ClientDto[] = [];
  customers: CustomerDto[] = [];
  paymentTypes: object[] = [];
  branches: BranchDto[] = [];

  public fields: Object = { text: "name", value: "id" };
  public autoCompleteFields: Object = { value: "name" };
  baseUrl: string;

  constructor(
    injector: Injector,
    private _router: Router,
    private _datePipe: DatePipe,
    private _activatedRoute: ActivatedRoute,
    private _modalService: NbDialogService,
    private _currencyAppService: CurrencyServiceProxy,
    private _companyAppService: CompanyServiceProxy,
    private _countryAppService: CountryServiceProxy,
    private _clientAppService: ClientServiceProxy,
    private _customerAppService: CustomerServiceProxy,
    private _outgoingTransferAppService: OutgoingTransferServiceProxy,
    private _branchAppService: BranchServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.paymentTypes = [
      { name: "نقدي", id: 0 },
      { name: "ذمم", id: 1 },
      { name: "شركة", id: 2 },
    ];

    this.initialCurrencies();
    // this.initialCompanies();
    this.initialCountries();
    this.initialClients();
    this.initialCustomers();
    this.initialBranches();

    this.initialOutgoingTransfer();

    setTimeout(() => {
      this.initialOutgoingTransferData();
    }, 1000);
  }

  initialOutgoingTransferData() {
    this._activatedRoute.queryParams.subscribe((params: any) => {
      this.transferId = params.id;
      if (this.transferId != undefined) {
        this._outgoingTransferAppService
          .getById(this.transferId)
          .subscribe((result) => {
            this.outgoingTransfer = result;
            /////
            if (result.toBranchId !== null) {
              this.toBranch = true;
              this._companyAppService
                .gatAllByBranchId(result.toBranchId)
                .subscribe((result) => {
                  this.companies = result;
                });
            } else {
              this.initialCompanies();
            }
            /////
            var dateMomentObject = moment(
              this.outgoingTransfer.date,
              "DD/MM/YYYY hh:mm:ss a"
            );
            this.date = dateMomentObject.toDate();
            this.initialCustomerImages(result.beneficiaryId);
          });
      }
    });
  }

  initialCustomerImages(id) {
    if (id != undefined) {
      this.outgoingTransfer.images = [];
      this._customerAppService.getCustomerImages(id).subscribe((result) => {
        if (result.length > 0) {
          this.outgoingTransfer.images = result;
        }
      });
    }
  }

  initialOutgoingTransfer() {
    this.outgoingTransfer = new OutgoingTransferDto();
    if (this.outgoingTransfer.beneficiary == undefined)
      this.outgoingTransfer.beneficiary = new CustomerDto();

    if (this.outgoingTransfer.sender == undefined)
      this.outgoingTransfer.sender = new CustomerDto();

    this.outgoingTransfer.paymentType = 0;
  }

  initialBranches() {
    this._branchAppService
      .getAll()
      .subscribe((result) => (this.branches = result));
  }

  initialCurrencies() {
    this._currencyAppService
      .getAll()
      .subscribe((result) => (this.currencies = result));
  }

  initialCompanies() {
    this._companyAppService
      .getAll()
      .subscribe((result) => (this.companies = result));
  }

  initialCountries() {
    this._countryAppService
      .getAll()
      .subscribe((result) => (this.countries = result));
  }

  initialClients() {
    this._clientAppService
      .getAll()
      .subscribe((result) => (this.clients = result));
  }

  initialCustomers() {
    this._customerAppService
      .getAll()
      .subscribe((result) => (this.customers = result));
  }

  save() {
    this.outgoingTransfer.date = this.date.toISOString();
    this.saving = true;

    if (this.toBranch === false) {
      this.outgoingTransfer.toBranchId = null;
    }

    this._outgoingTransferAppService
      .update(this.outgoingTransfer)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this._router.navigateByUrl("/app/transfer/create-outgoing-transfer");
      });
  }

  onPaymentTypeChange(args: any) {
    if (args.item?.id != 1) {
      this.outgoingTransfer.receivedAmount = 0;
      if (args.itemData.id !== 3) {
        this.initialCompanies();
      }
    }
  }

  onChangeBeneficiary(args: any) {
    if (args.itemData != undefined && args.itemData.id != undefined) {
      this.outgoingTransfer.beneficiary = args.itemData;
      this.initialCustomerImages(args.itemData.id);
    } else {
      if (this.outgoingTransfer.beneficiary != undefined) {
        this.outgoingTransfer.beneficiary.phoneNumber = "";
        this.outgoingTransfer.beneficiary.address = "";
      }
    }
  }

  onChangeSender(args: any) {
    if (args.itemData != undefined && args.itemData.id != undefined) {
      this.outgoingTransfer.sender = args.itemData;
    } else {
      if (this.outgoingTransfer.sender != undefined) {
        this.outgoingTransfer.sender.phoneNumber = "";
        this.outgoingTransfer.sender.address = "";
      }
    }
  }

  onToBranchChange(args: any) {
    this._companyAppService
      .gatAllByBranchId(args.itemData.id)
      .subscribe((result) => {
        this.companies = result;
      });
  }

  onCurrencyChange(args: any) {
    if (args.itemData != undefined && args.itemData.id != undefined) {
      if (
        this.outgoingTransfer.paymentType == 1 &&
        this.outgoingTransfer.fromClientId != undefined
      )
        this.getFromClientBalance(
          this.outgoingTransfer.fromClientId,
          args.itemData.id
        );

      if (
        this.outgoingTransfer.paymentType == 2 &&
        this.outgoingTransfer.fromCompanyId != undefined
      )
        this.getFromCompanyBalance(
          this.outgoingTransfer.fromCompanyId,
          args.itemData.id
        );

      if (this.outgoingTransfer.toCompanyId != undefined)
        this.getToCompanyBalance(
          this.outgoingTransfer.toCompanyId,
          args.itemData.id
        );
    }
  }

  onToCompanyChange(args: any) {
    if (
      args.itemData != undefined &&
      args.itemData.id != undefined &&
      this.outgoingTransfer.currencyId != undefined
    ) {
      this.getToCompanyBalance(
        args.itemData.id,
        this.outgoingTransfer.currencyId
      );
      this.getCompanyInfo(args.itemData.id);
    }
  }

  getCompanyInfo(id) {
    let company = this.companies.find((x) => x.id == id);
    this.companyAddress = company.address;
    this.companyPhone = company.phone;
  }
  onFromCompanyChange(args: any) {
    if (
      args.itemData != undefined &&
      args.itemData.id != undefined &&
      this.outgoingTransfer.currencyId != undefined
    ) {
      this.getFromCompanyBalance(
        args.itemData.id,
        this.outgoingTransfer.currencyId
      );
    }
  }

  onFromClientChange(args: any) {
    if (
      args.itemData != undefined &&
      args.itemData.id != undefined &&
      this.outgoingTransfer.currencyId != undefined
    ) {
      this.getFromClientBalance(
        args.itemData.id,
        this.outgoingTransfer.currencyId
      );
    }
  }

  onAmountChange(args: any) {
    if (args != undefined && this.outgoingTransfer.currencyId != undefined) {
      if (
        this.outgoingTransfer.paymentType == 1 &&
        this.outgoingTransfer.fromClientId != undefined
      ) {
        this.getFromClientBalance(
          this.outgoingTransfer.fromClientId,
          this.outgoingTransfer.currencyId
        );
      } else if (
        this.outgoingTransfer.paymentType == 2 &&
        this.outgoingTransfer.fromCompanyId != undefined
      ) {
        this.getFromCompanyBalance(
          this.outgoingTransfer.fromCompanyId,
          this.outgoingTransfer.currencyId
        );
      }

      this.getToCompanyBalance(
        this.outgoingTransfer.toCompanyId,
        this.outgoingTransfer.currencyId
      );
    }
  }

  onCompanyCommissionChange(args: any) {
    if (args != undefined && this.outgoingTransfer.currencyId != undefined) {
      this.getToCompanyBalance(
        this.outgoingTransfer.toCompanyId,
        this.outgoingTransfer.currencyId
      );
    }
  }

  getFromClientBalance(clientId, currencyId) {
    this._clientAppService
      .getCurrentBalance(clientId, currencyId)
      .subscribe((result) => {
        this.previousBalance = result.balance;
        this.resolveValues();
        this.requiredAmount =
          this.outgoingTransfer.amount + this.outgoingTransfer.commission;
        this.currentBalance =
          this.outgoingTransfer.amount != undefined
            ? result.balance + this.requiredAmount
            : result.balance;
      });
  }

  getFromCompanyBalance(companyId, currencyId) {
    this._companyAppService
      .getCurrentBalance(companyId, currencyId)
      .subscribe((result) => {
        this.previousBalance = result.balance;
        this.resolveValues();
        this.requiredAmount =
          this.outgoingTransfer.amount + this.outgoingTransfer.commission;

        this.currentBalance =
          this.outgoingTransfer.amount != undefined
            ? result.balance + this.requiredAmount
            : result.balance;
      });
  }

  getToCompanyBalance(toCompanyId, currencyId) {
    this._companyAppService
      .getCurrentBalance(toCompanyId, currencyId)
      .subscribe((result) => {
        this.previousBalanceForToCompany = result.balance;
        this.resolveValues();
        this.requiredAmount =
          this.outgoingTransfer.amount + this.outgoingTransfer.commission;
        var value =
          this.outgoingTransfer.amount +
          this.outgoingTransfer.companyCommission;
        this.currentBalanceForToCompany =
          this.outgoingTransfer.amount != undefined
            ? result.balance - value
            : result.balance;
      });
  }

  resolveValues() {
    this.outgoingTransfer.amount =
      this.outgoingTransfer.amount != undefined
        ? this.outgoingTransfer.amount
        : 0;
    this.outgoingTransfer.commission =
      this.outgoingTransfer.commission != undefined
        ? this.outgoingTransfer.commission
        : 0;
    this.outgoingTransfer.companyCommission =
      this.outgoingTransfer.companyCommission != undefined
        ? this.outgoingTransfer.companyCommission
        : 0;
  }

  getAmountWithCurrency(number) {
    if (
      this.outgoingTransfer.currencyId != undefined &&
      number != 0 &&
      number != undefined
    ) {
      let selectedCurrency = this.currencies.find(
        (c) => c.id == this.outgoingTransfer.currencyId
      );
      return this.getBalance(number) + "  " + selectedCurrency.name;
    }
    return 0;
  }

  //-----
  webcamImage: WebcamImage | any;
  imgClassName: string = "col-md-6";
  imgSrc: any;
  takePhoto() {
    this._modalService
      .open(OutgoingImageTakenDialogComponent, {
        context: {
          //id: data.id
        },
      })
      .onClose.subscribe((e: any) => {
        if (e != undefined && e.img != undefined) {
          this.webcamImage = e.img;
          this.imgSrc = this.webcamImage.imageAsDataUrl;
          if (this.webcamImage != undefined) {
            let uploadFile = new FileUploadDto();
            uploadFile.fileAsBase64 = this.webcamImage.imageAsDataUrl;
            uploadFile.fileType = "jpeg";
            uploadFile.fileName = "webcam.jpeg";

            this.outgoingTransfer.images.push(uploadFile);
          }
        }
      });
  }

  updateImgCol(count) {
    if (count > 1) {
      this.imgClassName = "col-md-4";
    } else {
      this.imgClassName = "col-md-6";
    }
  }

  getSrc(image: FileUploadDto) {
    if (image.filePath != undefined) {
      return this.baseUrl + "/" + image.filePath;
    }

    return image.fileAsBase64;
  }

  deletePhoto(file) {
    var index = this.outgoingTransfer.images.findIndex(
      (x) => x.fileAsBase64 == file.fileAsBase64
    );
    this.outgoingTransfer.images.splice(index, 1);
  }

  toBranch: boolean = false;
  onToBranchValueChanged(event) {
    this.toBranch = event;
    if (this.toBranch === true) {
      this._companyAppService
        .gatAllByBranchId(this.outgoingTransfer.toBranchId)
        .subscribe((result) => {
          this.companies = result;
        });
    } else {
      this.initialCompanies();
    }
  }

  getCurrencyName(): string {
    if (this.outgoingTransfer.currencyId == undefined) return "";

    return this.currencies.find((x) => x.id == this.outgoingTransfer.currencyId)
      ?.name;
  }

  getCompanyName(id): string {
    if (id == undefined) return "";

    return this.companies.find((x) => x.id == id)?.name;
  }

  getCountryName(): string {
    if (this.outgoingTransfer.countryId == undefined) return "";

    return this.countries.find((x) => x.id == this.outgoingTransfer.currencyId)
      ?.name;
  }

  getClientName(id): string {
    if (id == undefined) return "";

    return this.clients.find((x) => x.id == id)?.name;
  }

  getSenderName(): string {
    if (this.outgoingTransfer.senderId == undefined) return "";

    return this.customers.find((x) => x.id == this.outgoingTransfer.senderId)
      ?.name;
  }

  getPaymentTypeName() {
    switch (this.outgoingTransfer.paymentType) {
      case 0: {
        return "نقدي";
      }
      case 1: {
        return "ذمم";
      }
      case 2: {
        return "شركة";
      }
      default: {
        return "";
      }
    }
  }

  getBeneficiaryName(): string {
    if (this.outgoingTransfer.beneficiaryId == undefined) return "";

    return this.customers.find(
      (x) => x.id == this.outgoingTransfer.beneficiaryId
    )?.name;
  }

  name = "Outgoing-Transfer-Statement";

  @ViewChild("screen") screen: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("downloadLink") downloadLink: ElementRef;

  downloadImage() {
    document.getElementById("print-section").style.display = "contents";
    document.getElementById("t5").style.width = "595px";
    document.getElementById("t5").style.height = "842px";
    html2canvas(this.screen.nativeElement).then((canvas) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL("image/png");
      this.downloadLink.nativeElement.download =
        "Outgoing-Transfer-Statement.png";
      this.downloadLink.nativeElement.click();
    });
    document.getElementById("print-section").style.display = "none";
    document.getElementById("t5").style.width = "0px";
    document.getElementById("t5").style.height = "0px";
  }
}

