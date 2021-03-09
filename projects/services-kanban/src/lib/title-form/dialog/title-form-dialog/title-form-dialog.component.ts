import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TitleFormData } from '../../title-form.component';
import * as uuid from 'uuid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceCategory } from '../../../service-category';
import { DataDispatcher, DispatcherActionTypes } from 'leon-angular-utils';

@Component({
    selector: 'lib-service-category-form-dialog',
    templateUrl: './title-form-dialog.component.html',
    styleUrls: ['./title-form-dialog.component.scss']
})
export class TitleFormDialogComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<TitleFormDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: TitleFormData) {
    }

    public static openServiceCategoryDialog(dialog: MatDialog, serviceCategory?: ServiceCategory): Observable<DataDispatcher<ServiceCategory>> {

        const dialogRef = dialog.open(TitleFormDialogComponent, { data: serviceCategory });

        return dialogRef.afterClosed().pipe(
            map((result: DataDispatcher<TitleFormData>) => {

                if (result === undefined) {
                    return {
                        action: DispatcherActionTypes.CLOSE_DIALOG,
                        data: null
                    };
                } else if (serviceCategory) {
                    return {
                        data: { ...serviceCategory, title: result.data.title },
                        action: DispatcherActionTypes.UPDATE
                    };
                }

                const category: ServiceCategory = {
                    id: uuid(),
                    priority: 0,
                    title: result.data.title,
                    services: []
                };

                return {
                    action: result.action,
                    data: category
                };


            })
        );
    }

    ngOnInit() {
    }

    onCancel() {
        this.dialogRef.close();
    }

    onSubmit(value: DataDispatcher<TitleFormData>) {
        this.dialogRef.close(value);
    }
}
