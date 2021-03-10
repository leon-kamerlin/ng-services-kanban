import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent, ReplaySubject } from 'rxjs';
import { distinct, filter, first, map, mergeMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ServiceCategory } from '../../../service-category';
import { DataDispatcher, DispatcherActionTypes } from 'leon-angular-utils';
import { Service } from '../../../service';
import { TitleFormDialogComponent } from '../../../title-form/dialog/title-form-dialog/title-form-dialog.component';
import {
    ServiceFormDialogComponent,
    ServiceFormDialogData
} from '../../../service-form/dialog/service-form-dialog/service-form-dialog.component';
import { ComponentStore } from '@ngrx/component-store';
import { DeleteButtonComponent } from 'ng-components-leon';

interface State {
    category: ServiceCategory;
    dataDispatcher: DataDispatcher<ServiceCategory>;
}

@Component({
    selector: 'lib-service-category',
    templateUrl: './service-category.component.html',
    styleUrls: ['./service-category.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ComponentStore],
})
export class ServiceCategoryComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroySubject: ReplaySubject<void> = new ReplaySubject<void>();

    @Input()
    set serviceCategory(value: ServiceCategory) {
        this.setCategory(value);
    }

    @Output()
    readonly serviceCategoryDispatcher = this.componentStore.select(state => state?.dataDispatcher).pipe(
        filter(value => !!value || !!value?.data),
        distinct()
    );

    @ViewChild('addServiceButton', { static: true, read: ElementRef })
    addServiceButton: ElementRef;

    @ViewChild('updateCategoryButton', { static: true, read: ElementRef })
    updateCategoryButton: ElementRef;

    @ViewChild(DeleteButtonComponent, { static: true })
    deleteCategoryButton: DeleteButtonComponent;

    @ViewChild(CdkDropList, { static: true })
    cdkDropList: CdkDropList;

    readonly setCategory = this.componentStore.updater(
        (state: State, category: ServiceCategory) => ({ ...state, category })
    );

    readonly setDataDispatcher = this.componentStore.updater(
        (state: State, dataDispatcher: DataDispatcher<ServiceCategory>) => ({ ...state, dataDispatcher })
    );

    readonly addServiceToCategory = this.componentStore.updater(
        (state: State, service: Service) => ({
            ...state,
            category: { ...state.category, services: [...state.category.services, service] }
        })
    );

    readonly updateService = this.componentStore.updater(
        (state: State, service: Service) => ({
            ...state,
            category: { ...state.category, services: state.category.services.map(item => (item.id === service.id) ? service : item) }
        })
    );

    readonly deleteService = this.componentStore.updater(
        (state: State, service: Service) => ({
            ...state,
            category: { ...state.category, services: state.category.services.filter(item => item.id !== service.id) }
        })
    );

    readonly category$ = this.componentStore.select(state => state?.category).pipe(
        filter(value => !!value),
        distinct()
    );

    constructor(
        private readonly componentStore: ComponentStore<State>,
        private dialog: MatDialog
    ) {
        this.componentStore.setState(null);
    }


    ngOnInit() {
    }

    ngAfterViewInit() {
        const addService$ = fromEvent(this.addServiceButton.nativeElement, 'click');
        const updateCategory$ = fromEvent(this.updateCategoryButton.nativeElement, 'click');

        // Add service
        addService$.subscribe(() => this.handleServices());

        // Delete service category
        this.deleteCategoryButton.delete$.pipe(
            mergeMap(() => this.category$.pipe(
                first()
            )),
        ).subscribe((category: ServiceCategory) => {
            this.deleteCategory(category);
        });

        // Update service category
        updateCategory$.pipe(
            mergeMap(() => this.category$.pipe(
                first()
            ))
        ).subscribe((category: ServiceCategory) => {
            this.updateCategory(category);
        });
    }

    ngOnDestroy() {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    get destroy$() {
        return this.destroySubject.asObservable();
    }

    // Opens dialog for updating service
    clickOnService(service: Service) {
        this.handleServices(service);
    }

    serviceDrop(event: CdkDragDrop<ServiceCategory, ServiceCategory>) {
        if (event.previousContainer.id === event.container.id) {
            // Moving services within same category

            moveItemInArray(
                event.container.data.services,
                event.previousIndex,
                event.currentIndex
            );

            this.setDataDispatcher({
                data: event.container.data,
                action: DispatcherActionTypes.UPDATE
            });


        } else {
            // Moving service to another category
            const previousServices: Service[] = [...event.previousContainer.data.services];
            const targetServices: Service[] = [...event.container.data.services];

            transferArrayItem(
                previousServices,
                targetServices,
                event.previousIndex,
                event.currentIndex
            );
            const previousCategory: ServiceCategory = {
                ...event.previousContainer.data,
                id: event.previousContainer.id,
                services: previousServices
            };
            const targetCategory: ServiceCategory = {
                ...event.container.data,
                id: event.container.id,
                services: targetServices
            };

            this.setDataDispatcher({
                data: previousCategory,
                action: DispatcherActionTypes.UPDATE
            });

            this.setDataDispatcher({
                data: targetCategory,
                action: DispatcherActionTypes.UPDATE
            });

        }
    }

    private handleServices(service?: Service) {
        const data: ServiceFormDialogData = { service };
        ServiceFormDialogComponent.openDialog(this.dialog, data).pipe(
            tap((result => {
                if (result.action === DispatcherActionTypes.CLOSE_DIALOG) {
                    return;
                }

                if (result.action === DispatcherActionTypes.UPDATE) {
                    this.updateService(result.data);
                } else if (result.action === DispatcherActionTypes.DELETE) {
                    this.deleteService(result.data);
                } else if (result.action === DispatcherActionTypes.CREATE) {
                    this.addServiceToCategory(result.data);
                }
            })),
            mergeMap(() => this.category$.pipe(
                first()
            ))
        ).subscribe((serviceCategory) => {
            this.setDataDispatcher({
                action: DispatcherActionTypes.UPDATE,
                data: serviceCategory
            });
        });
    }


    private updateCategory(serviceCategory: ServiceCategory) {
        TitleFormDialogComponent.openServiceCategoryDialog(this.dialog, serviceCategory)
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((dispatcher) => {
                this.setDataDispatcher(dispatcher);
                this.setCategory(dispatcher.data);
            });
    }

    private deleteCategory(serviceCategory: ServiceCategory) {
        this.setDataDispatcher({
            action: DispatcherActionTypes.DELETE,
            data: serviceCategory
        });
    }
}
