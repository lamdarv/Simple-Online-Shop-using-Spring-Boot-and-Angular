import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../models/item.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CustomDatePipe } from '../../../shared/pipes/custom-date.pipe';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-item-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, CustomDatePipe, SharedModule],
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {
  item: Item | undefined;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService
  ) { }

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.itemService.getItemById(+itemId).subscribe((response: any) => {
        this.item = response.data;
      });
    }
  }

  goBack(): void {
    window.history.back();
  }
}
