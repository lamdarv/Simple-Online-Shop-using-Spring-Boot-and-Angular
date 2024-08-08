import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [] // Remove CustomDatePipe from exports
})
export class SharedModule { }
