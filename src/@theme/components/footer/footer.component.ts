import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by <b><a href="http://b-wire.co"
                              target="_blank">B-Wire</a></b> 2020.
      Developed By
      <b>
        <a href="#" target="_blank">
        .Net Team
        </a>
      </b>
    </span>
    <div class="socials">
      <a href="" target="_blank" class="ion ion-social-github"></a>
      <a href="" target="_blank" class="ion ion-social-facebook"></a>
      <a href="" target="_blank" class="ion ion-social-twitter"></a>
      <a href="" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
