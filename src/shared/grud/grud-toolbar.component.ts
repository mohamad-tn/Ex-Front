import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '../app-component-base';

@Component({
  selector: 'grud-toolbar',
  templateUrl: './grud-toolbar.component.html',
  styleUrls: ['./grud-toolbar.component.scss']
})
export class GrudToolbarComponent extends AppComponentBase implements OnInit {
  @Input() createPermision: string;
  @Output() onClearFilters = new EventEmitter();
  @Output() onClearSorts = new EventEmitter();
  @Output() onCreate = new EventEmitter();
  constructor(injector: Injector) {super(injector); }
  ngOnInit(): void {
  }
  showCreateDialog() {
    this.onCreate.emit();
  }
  clearFilters() {
    this.onClearFilters.emit();
  }
  clearSorts() {
    this.onClearSorts.emit();
  }

}
