import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataDispatcher, DispatcherActionTypes } from 'leon-angular-utils';

export interface TitleFormData {
    title: string;
}

@Component({
    selector: 'lib-title-form',
    templateUrl: './title-form.component.html',
    styleUrls: ['./title-form.component.scss']
})
export class TitleFormComponent implements OnInit, OnChanges {
    form: FormGroup;
    @Input()
    data: TitleFormData;
    @Output()
    noClicked: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    submitted: EventEmitter<DataDispatcher<TitleFormData>> = new EventEmitter<DataDispatcher<TitleFormData>>();

    constructor(private fb: FormBuilder) {
        this.form = this.createForm();
    }

    private createForm(): FormGroup {
        return this.form = this.fb.group({
            title: this.fb.control(null, Validators.required)
        });
    }

    private updateForm(data: TitleFormData) {
        this.title.patchValue(data?.title);
    }

    get title(): FormControl {
        return this.form.get('title') as FormControl;
    }

    ngOnInit() {
    }


    onSubmit(data: TitleFormData) {
        const dispatcher: DataDispatcher<TitleFormData> = {
            action: (this.data?.title) ? DispatcherActionTypes.UPDATE : DispatcherActionTypes.CREATE,
            data
        };
        this.submitted.emit(dispatcher);
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.data?.currentValue) {
            const newData: TitleFormData = changes.data.currentValue;
            this.updateForm(newData);
        }

    }
}
