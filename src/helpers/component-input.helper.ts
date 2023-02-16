import { isEqual } from 'lodash';
import { BehaviorSubject } from 'rxjs';

export class ComponentInputHelper {
    public static setDistinctValueToBehaviourSubject<T>(behaviourSubject: BehaviorSubject<T>, value: T, defaultValue?: T): void {
        const normalizedValue = value ?? defaultValue;
        if (!isEqual(behaviourSubject.value, normalizedValue)) {
            behaviourSubject.next(value);
        }
    }
}
