import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { ComponentInputHelper } from '../../../../helpers/component-input.helper';

@Component({
    selector: 'rdb-field-value',
    templateUrl: './field-value.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldValueComponent {
    public label$ = new BehaviorSubject<string>(null);
    public value$ = new BehaviorSubject<string>(null);

    public showField$ = combineLatest([this.label$, this.value$]).pipe(
        map(([label, value]) => label && value)
    );

    @Input()
    public set label(label: string) {
        ComponentInputHelper.setDistinctValueToBehaviourSubject(this.label$, label);
    }

    @Input()
    public set value(value: string) {
        ComponentInputHelper.setDistinctValueToBehaviourSubject(this.value$, value);
    }
}
