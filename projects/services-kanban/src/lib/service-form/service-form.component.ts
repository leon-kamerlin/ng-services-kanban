import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as uuid from 'uuid';
import { DataDispatcher, DispatcherActionTypes, SelectorView } from 'leon-angular-utils';
import { Service } from '../service';


@Component({
    selector: 'lib-service-form',
    templateUrl: './service-form.component.html',
    styleUrls: ['./service-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceFormComponent implements OnInit, OnChanges {
    minutes: number[] = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
    genders: SelectorView[] = [
        {
            value: 'male',
            viewValue: 'Male'
        },
        {
            value: 'female',
            viewValue: 'Female'
        },
        {
            value: 'both',
            viewValue: 'Both'
        },
    ];

    paymentOptions: SelectorView[] = [
        {
            value: 'pay-at-venue',
            viewValue: 'Pay at Venue'
        },
        {
            value: 'pay-with-credit-card',
            viewValue: 'Pay with credit card'
        },
        {
            value: 'both',
            viewValue: 'Both'
        }
    ];
    form: FormGroup;
    @Input()
    service: Service;
    @Output()
    submitted: EventEmitter<DataDispatcher<Service>> = new EventEmitter<DataDispatcher<Service>>();
    colors = ['purple', 'blue', 'green', 'yellow', 'red', 'gray'];

    constructor(private fb: FormBuilder) {
        this.form = this.createForm();
    }

    ngOnInit() {

    }

    private createForm(data?: Service): FormGroup {
        return this.fb.group({
            name: this.fb.control(null, [Validators.required]),
            description: this.fb.control(null, [Validators.required]),
            estimatedTime: this.fb.control(null, [Validators.required]),
            price: this.fb.control(null, [Validators.required]),
            gender: this.fb.control(null, [Validators.required]),
            paymentOption: this.fb.control(null, [Validators.required]),
            color: this.fb.control(null, [Validators.required])
        });
    }

    get names(): FormControl {
        return this.form.get('name') as FormControl;
    }

    get description(): FormControl {
        return this.form.get('description') as FormControl;
    }

    get estimatedTime(): FormControl {
        return this.form.get('estimatedTime') as FormControl;
    }

    get prices(): FormControl {
        return this.form.get('price') as FormControl;
    }

    get gender(): FormControl {
        return this.form.get('gender') as FormControl;
    }

    get instantBooking(): FormControl {
        return this.form.get('instantBooking') as FormControl;
    }

    get paymentOption(): FormControl {
        return this.form.get('paymentOption') as FormControl;
    }

    get color(): FormControl {
        return this.form.get('color') as FormControl;
    }

    onSubmit(service: Service) {
        let dispatcher: DataDispatcher<Service>;
        if (this.service === undefined) {
            dispatcher = {
                data: { ...service, id: uuid() },
                action: DispatcherActionTypes.CREATE
            };
        } else {
            dispatcher = {
                data: { ...service, id: this.service.id },
                action: DispatcherActionTypes.UPDATE
            };
        }

        this.submitted.emit(dispatcher);
    }

    delete(service: Service) {
        const dispatcher: DataDispatcher<Service> = {
            data: { ...service, id: this.service.id },
            action: DispatcherActionTypes.DELETE
        };

        this.submitted.emit(dispatcher);
    }

    ngOnChanges(changes: SimpleChanges) {
        const service: Service = changes?.service?.currentValue;
        if (service) {
            this.names.patchValue(service.name);
            this.description.patchValue(service.description);
            this.estimatedTime.patchValue(service.estimatedTime);
            this.prices.patchValue(service.price);
            this.gender.patchValue(service.gender);
            this.paymentOption.patchValue(service.paymentOption);
            this.color.patchValue(service.color);
        }
    }
}
