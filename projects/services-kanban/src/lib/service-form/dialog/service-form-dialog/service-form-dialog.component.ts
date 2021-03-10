import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from '../../../service';
import { DataDispatcher, DispatcherActionTypes } from 'leon-angular-utils';

export interface ServiceFormDialogData {
    service?: Service;
}

@Component({
    selector: 'lib-service-form-dialog',
    templateUrl: './service-form-dialog.component.html',
    styleUrls: ['./service-form-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ServiceFormDialogComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<ServiceFormDialogComponent>, @Inject(MAT_DIALOG_DATA) public data?: ServiceFormDialogData) {
    }

    public static openDialog(dialog: MatDialog, data: ServiceFormDialogData):
        Observable<DataDispatcher<Service>> {

        const dialogRef = dialog.open(ServiceFormDialogComponent, {
            data
        });

        return dialogRef.afterClosed().pipe(
            map((result: DataDispatcher<Service>) => {
                if (result === undefined) {
                    return { ...result, action: DispatcherActionTypes.CLOSE_DIALOG };
                }
                return result;
            })
        );
    }

    ngOnInit() {
    }

    onSubmit(dispatcher: DataDispatcher<Service>) {
        this.dialogRef.close(dispatcher);
    }
}
