import {Component, EventEmitter, Output} from '@angular/core';
import {AppSettings} from "../../../app.config";
import {CoreService} from "../../../_services/core.service";

@Component({
  selector: 'app-customizer',
  templateUrl: './customizer.component.html',
  styleUrl: './customizer.component.scss'
})
export class CustomizerComponent {
  @Output() optionsChange = new EventEmitter<AppSettings>();
  options = this.settings.getOptions();

  constructor(private settings : CoreService) {}

  setDark() {
    this.optionsChange.emit(this.options);
  }

  setColor() {
    this.optionsChange.emit(this.options);
  }

  setDir() {
    this.optionsChange.emit(this.options);
  }

  setSidebar() {
    this.optionsChange.emit(this.options);
  }
}
