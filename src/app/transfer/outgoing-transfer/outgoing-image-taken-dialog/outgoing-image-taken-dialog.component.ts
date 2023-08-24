import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-outgoing-image-taken-dialog',
  templateUrl: './outgoing-image-taken-dialog.component.html',
  styleUrls: ['./outgoing-image-taken-dialog.component.scss']
})
export class OutgoingImageTakenDialogComponent extends AppComponentBase implements OnInit {

  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  webcamImage: WebcamImage | any;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  saving: boolean;
  constructor(injector: Injector,
    public dialogRef: NbDialogRef<OutgoingImageTakenDialogComponent>) {
    super(injector);
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  
  public triggerSnapshot(): void {

    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    //this.webcamImage = webcamImage;
    this.dialogRef.close({img: webcamImage});
    // console.info('received webcam image', webcamImage);
    // this.pictureTaken.emit(webcamImage);

  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
  
  save(){
    this.saving = true;
    
    
  }
  
}
