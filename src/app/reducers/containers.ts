import {
    createActionGroup,
    createFeatureSelector,
    createReducer,
    createSelector,
    emptyProps,
    on,
    props
} from '@ngrx/store';
import { keyBy } from 'lodash';

export const containersActions = createActionGroup({
    source: 'Containers',
    events: {
        'Received Containers': props<{ containers: IContainer[] }>(),
        'Load Containers from API': emptyProps(),
        'Update Container By Id': props<{ newContainer: IContainer }>(),
        'Create New Container': props<{ newContainer: IContainer }>(),
        'Delete Container By Id': props<{ containerId: string }>()
    }
})

export interface IContainer {
    id: string;
    name: string;
    barcode: string;
}

export const initialState: IContainer[] = [];
export const containersReducer = createReducer(
    initialState,
    on(containersActions.receivedContainers, (_state, { containers }) => containers)
);

export const featureSelector = createFeatureSelector<IContainer[]>('containers');
export const containersSelector = createSelector(
    featureSelector,
    state => state
);

export const containersCollectionByIdSelector = createSelector(
    containersSelector,
    state => keyBy(state, 'id')
)

export const containerByIdSelector = (containerId: string) => createSelector(
    containersSelector,
    containers => containers.find(container => container.id === containerId)
);
