import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAddDialog } from './item-add.component';

describe('ItemAddDialog', () => {
  let component: ItemAddDialog;
  let fixture: ComponentFixture<ItemAddDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemAddDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemAddDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
