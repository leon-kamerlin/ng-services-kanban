import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleFormComponent } from './title-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TitleFormDialogComponent } from './dialog/title-form-dialog/title-form-dialog.component';
import { FieldRequiredModule } from 'leon-angular-utils';


@NgModule({
    declarations: [
        TitleFormComponent,
        TitleFormDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FieldRequiredModule
    ],
    exports: [
        TitleFormComponent,
    ]
})
export class TitleFormModule {
}
