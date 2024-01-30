import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  showError(message: string) {
    // @ts-ignore
    console.error(message);
  }
  constructor() { }
}
