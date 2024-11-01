import {Injectable} from '@angular/core';
import {AppSettings, defaults} from "../app.config";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private options = defaults
  private notify$ = new BehaviorSubject<Record<string, any>>({});

  constructor() { }

  getOptions() {
    return this.options
  }

  setOptions(options: AppSettings) {
    this.options = Object.assign(defaults, options);
    this.notify$.next(this.options);
  }
}
