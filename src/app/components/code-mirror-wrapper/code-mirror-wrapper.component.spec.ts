import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'zen-observable';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CodeMirrorWrapperComponent } from './code-mirror-wrapper.component';

import { DocumentService } from 'src/app/services/document.service';

import { testDocCode } from 'src/app/spec-helpers/spec-objects';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { sleepyTime } from 'src/app/spec-helpers/spec-functions';

describe('CodeMirrorWrapperComponent', () => {
  let component: CodeMirrorWrapperComponent;
  let fixture: ComponentFixture<CodeMirrorWrapperComponent>;
  let documentServiceStub: Partial<DocumentService>;
  let httpController: HttpTestingController;

  beforeEach(async () => {
    documentServiceStub = {
      isCodeModeOn: () => false,
      onActiveDocUpdate: jasmine.createSpy('onActiveDocUpdate').and.returnValue(of(testDocCode)),
      updateActiveBody: jasmine.createSpy('updateActiveBody')
    };
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        MatIconModule,
        CodemirrorModule
      ],
      declarations: [ 
        CodeMirrorWrapperComponent,
      ],
      providers: [
        { provide: DocumentService, useValue: documentServiceStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeMirrorWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#updateText passes data on to documentService', () => {
    component.updateText('foo');

    expect(documentServiceStub.updateActiveBody).toHaveBeenCalledOnceWith('foo');
  });

  it('#triggerExecuteCode POSTs data and updates property with response data', async () => {
    await sleepyTime(0);
  
    component.triggerExecuteCode();

    const req = httpController.expectOne(component.codeExUrl);

    const fakeResp = { data: btoa('3') };

    req.flush(fakeResp, {
      headers: {
        statusCode: '201'
      }
    });
    await sleepyTime(0);

    expect(component.codeOutput).toEqual('3');
  });
});
