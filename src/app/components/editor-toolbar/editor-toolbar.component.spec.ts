import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../button/button.component';
import { Document } from '../../Document';

import { EditorToolbarComponent } from './editor-toolbar.component';

const filledDoc: Document = {
  _id: 'abcdefghijklmnopqrstuvwx',
  title: 'filled-title',
  body: 'filled-body'
};

describe('EditorToolbarComponent', () => {
  let component: EditorToolbarComponent;
  let fixture: ComponentFixture<EditorToolbarComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        EditorToolbarComponent,
        ButtonComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have showDocList set to false after creation', () => {
    expect(component.showDocList).toBeFalsy();
  });

  it('should have three buttons', () => {
    expect(de.queryAll(By.css('app-button')).length).toEqual(3);
  });

  it('should emit saveSignal event when save button is clicked', fakeAsync( () => {
    spyOn(component.saveSignal, 'emit');
    const button = de.nativeElement.querySelector('#save-doc-btn');

    button.firstChild.click();
    tick(1);
    expect(component.saveSignal.emit).toHaveBeenCalled();
  })
  );

  it('should emit newDoc event when new document button is clicked', fakeAsync( () => {
    spyOn(component.onNewDoc, 'emit');
    const button = de.nativeElement.querySelector('#new-doc-btn');

    button.firstChild.click();
    tick(1);
    expect(component.onNewDoc.emit).toHaveBeenCalled();
  })
  );

  it('should emit onChangeDoc event with correct document when changeDoc is triggered', fakeAsync( () => {
    spyOn(component.onChangeDoc, 'emit');
    component.changeDoc(filledDoc);
    tick(1);

    expect(component.onChangeDoc.emit).toHaveBeenCalledWith(filledDoc);
  })
  );

  it('should toggle showDocList and actually show doc list in rendition when toggleShowList is triggered', fakeAsync(() => {
    expect(component.showDocList).toBeFalse();
    component.toggleShowList();
    tick(1);

    expect(component.showDocList).toBeTrue();
  })
  );
});
