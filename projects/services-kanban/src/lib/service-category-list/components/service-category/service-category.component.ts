import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServiceCategory } from '../../../service-category';
import { DataDispatcher, DispatcherActionTypes } from 'leon-angular-utils';
import { Service } from '../../../service';
import { TitleFormDialogComponent } from '../../../title-form/dialog/title-form-dialog/title-form-dialog.component';
import { ServiceFormDialogComponent } from '../../../service-form/dialog/service-form-dialog/service-form-dialog.component';


@Component({
    selector: 'lib-service-category',
    templateUrl: './service-category.component.html',
    styleUrls: ['./service-category.component.scss'],
})
export class ServiceCategoryComponent implements OnInit, OnDestroy {
    private destroySubject: ReplaySubject<void> = new ReplaySubject<void>();
    @Input()
    serviceCategory: ServiceCategory;
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

    serviceDrop(event: CdkDragDrop<ServiceCategory, ServiceCategory>) {
        if (event.previousContainer.id === event.container.id) {
            const copyServices: Service[] = [...this.serviceCategory.services];
            moveItemInArray(
                copyServices,
                event.previousIndex,
                event.currentIndex
            );

            const newCategory: ServiceCategory = { ...this.serviceCategory, services: copyServices };
            this.serviceCategoryDispatcher.emit({
                data: newCategory,
                action: DispatcherActionTypes.UPDATE
            });

            console.log('move', newCategory);
        } else {
            const previousData: Service[] = [...event.previousContainer.data.services];
            const targetData: Service[] = [...event.container.data.services];
            transferArrayItem(
                previousData,
                targetData,
                event.previousIndex,
                event.currentIndex
            );
            const previousCategory: ServiceCategory = {
                ...event.previousContainer.data,
                id: event.previousContainer.id,
                services: previousData
            };
            const targetCategory: ServiceCategory = {
                ...event.container.data,
                id: event.container.id,
                services: targetData
            };

            this.serviceCategoryDispatcher.emit({
                data: previousCategory,
                action: DispatcherActionTypes.UPDATE
            });

            this.serviceCategoryDispatcher.emit({
                data: targetCategory,
                action: DispatcherActionTypes.UPDATE
            });
        }
    }


    updateServiceCategory(serviceCategory: ServiceCategory) {
        TitleFormDialogComponent.openServiceCategoryDialog(this.dialog, serviceCategory)
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((dispatcher) => {
                this.serviceCategoryDispatcher.emit(dispatcher);
            });
    }

    deleteServiceCategory(serviceCategory: ServiceCategory) {
        this.serviceCategoryDispatcher.emit({
            action: DispatcherActionTypes.DELETE,
            data: serviceCategory
        });
    }


    openServiceDialog(serviceCategory: ServiceCategory, service?: Service, index?: number) {
        ServiceFormDialogComponent.openDialog(this.dialog, { service, index }).subscribe((result) => {
            if (result.action === DispatcherActionTypes.CLOSE_DIALOG) {
                return;
            }

            if (result.action === DispatcherActionTypes.UPDATE) {
                this.serviceCategory.services = this.serviceCategory.services.map(item => (item.id === service.id) ? result.data : item);
            } else if (result.action === DispatcherActionTypes.DELETE) {
                this.serviceCategory.services = this.serviceCategory.services.filter(item => item.id !== service.id);
            } else if (result.action === DispatcherActionTypes.CREATE) {
                this.serviceCategory.services.push(result.data);
            }

            this.serviceCategoryDispatcher.emit({
                action: DispatcherActionTypes.UPDATE,
                data: this.serviceCategory
            });

        });
    }
}
