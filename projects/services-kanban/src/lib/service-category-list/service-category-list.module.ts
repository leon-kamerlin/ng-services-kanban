import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCategoryListComponent } from './service-category-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ServiceCategoryComponent } from './components/service-category/service-category.component';
import { DeleteButtonModule } from 'ng-components-leon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TitleFormModule } from '../title-form/title-form.module';
import { ServiceFormModule } from '../service-form/service-form.module';



@NgModule({
    declarations: [
        ServiceCategoryListComponent,

        ServiceCategoryComponent
    ],
  imports: [
    CommonModule,
    DragDropModule,
    DeleteButtonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TitleFormModule,
    ServiceFormModule
  ],
    exports: [
        ServiceCategoryListComponent
    ]
})
export class ServiceCategoryListModule {
}
