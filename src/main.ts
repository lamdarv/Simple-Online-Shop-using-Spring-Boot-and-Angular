import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
// import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CustomDatePipe } from './app/shared/pipes/custom-date.pipe';
import { SharedModule } from './app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom(
      MatTableModule, 
      MatButtonModule, 
      MatPaginatorModule, 
      MatSortModule, 
      SharedModule, 
      MatDialogModule, 
      MatCardModule,
      MatDatepickerModule,
      MatNativeDateModule
    ),
  ]
}).catch((err) => console.error(err));
