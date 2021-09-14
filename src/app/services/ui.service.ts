import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private showDocList: boolean = false;
  private subject: Subject<any> = new Subject<any>();

  constructor() { }

  toggleShowDocList(): void {
    this.showDocList = !this.showDocList;
    this.subject.next(this.showDocList);
  }

  onToggleDocList(): Observable<any> {
    return this.subject.asObservable();
  }
}
