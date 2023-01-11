import { Component, Input } from '@angular/core';

@Component({
    selector: 'rdb-field-value',
    templateUrl: './field-value.component.html'
})
export class FieldValueComponent {
    @Input()
    public label: string;

    @Input()
    public value: string;
}
