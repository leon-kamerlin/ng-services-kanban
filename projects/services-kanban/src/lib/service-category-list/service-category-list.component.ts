import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { distinct, filter, takeUntil, tap } from 'rxjs/operators';
import { ServiceCategory } from '../service-category';
import { DataDispatcher, DispatcherActionTypes } from 'leon-angular-utils';
import { TitleFormDialogComponent } from '../title-form/dialog/title-form-dialog/title-form-dialog.component';
import { ComponentStore } from '@ngrx/component-store';
import { Service } from '../service';

interface State {
    categories: Array<ServiceCategory>;
    categoriesDispatcher?: DataDispatcher<ServiceCategory[]>;
    categoryDispatcher?: DataDispatcher<ServiceCategory>;
}

@Component({
    selector: 'lib-service-category-list',
    templateUrl: './service-category-list.component.html',
    styleUrls: ['./service-category-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ComponentStore],
})
export class ServiceCategoryListComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroySubject: ReplaySubject<void> = new ReplaySubject<void>();

    @Input()
    set serviceCategories(value: ServiceCategory[]) {
        this.setCategories(value);
    }


    @Output()
    readonly serviceCategoriesDispatcher = this.componentStore.select(state => state?.categoriesDispatcher).pipe(
        filter(value => !!value),
        distinct()
    );

    @Output()
    readonly serviceCategoryDispatcher = this.componentStore.select(state => state?.categoryDispatcher).pipe(
        filter(value => !!value),
        distinct()
    );


    readonly setCategories = this.componentStore.updater(
        (state: State, categories: Array<ServiceCategory>) => ({ ...state, categories })
    );

    readonly setCategoriesDispatcher = this.componentStore.updater(
        (state: State, categoriesDispatcher: DataDispatcher<ServiceCategory[]>) => ({ ...state, categoriesDispatcher })
    );

    readonly setCategoryDispatcher = this.componentStore.updater(
        (state: State, categoryDispatcher: DataDispatcher<ServiceCategory>) => ({ ...state, categoryDispatcher })
    );

    readonly addCategory = this.componentStore.updater(
        (state: State, category: ServiceCategory) => ({ ...state, categories: [...state.categories, category] })
    );

    readonly updateCategory = this.componentStore.updater(
        (state: State, category: ServiceCategory) => ({
            ...state,
            categories: state.categories.map(item => (item.id === category.id) ? category : item)
        })
    );

    readonly deleteCategory = this.componentStore.updater(
        (state: State, category: ServiceCategory) => ({
            ...state,
            categories: state.categories.filter(item => item.id !== category.id)
        })
    );

    readonly categories$ = this.componentStore.select(state => state.categories);

    constructor(private dialog: MatDialog, private readonly componentStore: ComponentStore<State>) {
        this.componentStore.setState({ categories: [] });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    get destroy$() {
        return this.destroySubject.asObservable();
    }

    createNewCategory() {
        TitleFormDialogComponent.openServiceCategoryDialog(this.dialog)
            .pipe(
                takeUntil(this.destroy$),
                tap((dispatcher) => {
                    this.setCategoryDispatcher(dispatcher);
                    if (dispatcher.action === DispatcherActionTypes.CREATE) {
                        this.addCategory(dispatcher.data);
                    }
                }),
            )
            .subscribe();
    }

    onServiceCategoryDispatcher(dispatcher: DataDispatcher<ServiceCategory>) {
        this.setCategoryDispatcher(dispatcher);
        if (dispatcher.action === DispatcherActionTypes.UPDATE) {
            this.updateCategory(dispatcher.data);
        } else if (dispatcher.action === DispatcherActionTypes.DELETE) {
            this.deleteCategory(dispatcher.data);
        }
    }


    categoryDrop(event: CdkDragDrop<Array<ServiceCategory>, Array<ServiceCategory>>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        this.setCategories(event.container.data);
        this.setCategoriesDispatcher({
            data: event.container.data,
            action: DispatcherActionTypes.UPDATE
        });

    }
}
