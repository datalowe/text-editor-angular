import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TextDocument } from '../interfaces/TextDocument';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private showDocList: boolean = false;
  private subject: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  toggleShowDocList(): void {
    this.showDocList = !this.showDocList;
    this.subject.next(this.showDocList);
  }

  onToggleDocList(): Observable<any> {
    return this.subject.asObservable();
  }
}
