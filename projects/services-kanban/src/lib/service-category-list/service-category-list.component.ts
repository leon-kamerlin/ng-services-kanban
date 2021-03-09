import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServiceCategory } from '../service-category';
import { DataDispatcher, DispatcherActionTypes } from 'leon-angular-utils';
import { TitleFormDialogComponent } from '../title-form/dialog/title-form-dialog/title-form-dialog.component';

@Component({
    selector: 'lib-service-category-list',
    templateUrl: './service-category-list.component.html',
    styleUrls: ['./service-category-list.component.scss'],
})
export class ServiceCategoryListComponent implements OnInit, OnDestroy {
    private destroySubject: ReplaySubject<void> = new ReplaySubject<void>();
    @Input()
    serviceCategories: ServiceCategory[] = [];
    @Output()
    serviceCategoriesDispatcher: EventEmitter<DataDispatcher<ServiceCategory[]>> = new EventEmitter<DataDispatcher<ServiceCategory[]>>();
    @Output()
    serviceCategoryDispatcher: EventEmitter<DataDispatcher<ServiceCategory>> = new EventEmitter<DataDispatcher<ServiceCategory>>();

    constructor(private dialog: MatDialog) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    get destroy$() {
        return this.destroySubject.asObservable();
    }

    categoryDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.serviceCategories, event.previousIndex, event.currentIndex);
        this.serviceCategoriesDispatcher.emit({
            data: this.serviceCategories,
            action: DispatcherActionTypes.UPDATE
        });
    }


    createNewCategory() {
        TitleFormDialogComponent.openServiceCategoryDialog(this.dialog)
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((dispatcher) => {
                this.serviceCategoryDispatcher.emit(dispatcher);
            });
    }
}
