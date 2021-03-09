import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceFormComponent } from './service-form.component';
import { ServiceFormDialogComponent } from './dialog/service-form-dialog/service-form-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DeleteButtonModule, MaterialColorPickerModule } from 'ng-components-leon';


@NgModule({
  declarations: [
    ServiceFormComponent,
    ServiceFormDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MaterialColorPickerModule,
    DeleteButtonModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    ServiceFormComponent
  ]
})
export class ServiceFormModule {
}
