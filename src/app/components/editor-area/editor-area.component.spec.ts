import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { EditorAreaComponent } from './editor-area.component';
import { FormsModule } from '@angular/forms';
import { EditorToolbarComponent } from '../editor-toolbar/editor-toolbar.component';
import { ButtonComponent } from '../button/button.component';
import { QuillEditorComponent } from 'ngx-quill';

describe('EditorAreaComponent', () => {
  let component: EditorAreaComponent;
  let fixture: ComponentFixture<EditorAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule
      ],
      declarations: [ 
        EditorAreaComponent,
        EditorToolbarComponent,
        ButtonComponent,
        QuillEditorComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
