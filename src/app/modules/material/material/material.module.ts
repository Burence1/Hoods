import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCarouselModule } from 'ng-mat-carousel';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const material =[
  // Angular material
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatDividerModule,
  MatSidenavModule,
  MatBadgeModule,
  MatButtonModule,
  MatCarouselModule.forRoot(),
  MatListModule,
  MatDialogModule,
  MatSelectModule,
  MatMenuModule,
  MatTableModule,
  MatProgressSpinnerModule,
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    material
  ],
  exports: [material],
})
export class MaterialModule { }