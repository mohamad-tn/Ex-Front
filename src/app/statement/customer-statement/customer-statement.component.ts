import { API_BASE_URL, CustomerWithImagesDto, FileUploadDto } from './../../../shared/service-proxies/service-proxies';
import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CustomerDto, CustomerServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: "app-customer-statement",
  templateUrl: "./customer-statement.component.html",
  styleUrls: ["./customer-statement.component.scss"],
})
export class CustomerStatementComponent
  extends AppComponentBase
  implements OnInit
{
  customers: CustomerDto[] = [];
  customer: CustomerWithImagesDto;
  loading: boolean = false;
  private baseUrl: string;
  public fields: Object = { text: "name", value: "id" };

  constructor(
    injector: Injector,
    private _customerAppService: CustomerServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.initialCustomers();
  }

  initialCustomers() {
    this._customerAppService
      .getAll()
      .subscribe((result) => {
        this.customers = result;
      });
  }

  getCustomerInfo(event) {
    this._customerAppService
      .getCustomerWithImages(event.value)
      .subscribe((result) => {
        this.customer = result;
        this.loading = true;
      });
  }

  getSrc(image: FileUploadDto) {
    if (image.filePath != undefined) {
      return this.baseUrl + "/" + image.filePath;
    }
    return image.fileAsBase64;
  }
}
