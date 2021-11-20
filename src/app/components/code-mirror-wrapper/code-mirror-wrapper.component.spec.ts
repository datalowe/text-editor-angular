import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeMirrorWrapperComponent } from './code-mirror-wrapper.component';

describe('CodeMirrorWrapperComponent', () => {
  let component: CodeMirrorWrapperComponent;
  let fixture: ComponentFixture<CodeMirrorWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeMirrorWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeMirrorWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
