import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteItemDialog } from './item-delete.component';

describe('DeleteItemDialog', () => {
  let component: DeleteItemDialog;
  let fixture: ComponentFixture<DeleteItemDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteItemDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteItemDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
