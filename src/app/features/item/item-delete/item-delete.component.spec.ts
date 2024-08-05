import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDeleteComponent } from './item-delete.component';

describe('ItemDeleteComponent', () => {
  let component: ItemDeleteComponent;
  let fixture: ComponentFixture<ItemDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
