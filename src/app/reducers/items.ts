import {
    createActionGroup,
    createFeatureSelector,
    createReducer,
    createSelector,
    emptyProps,
    on,
    props
} from '@ngrx/store';

export const itemsActions = createActionGroup({
    source: 'Items',
    events: {
        'Received Items': props<{ items: IItem[] }>(),
        'Load Items from API': emptyProps(),
        'Update Item By Id': props<{ newItem: IItem }>(),
        'Create New Item': props<{ newItem: IItem }>(),
        'Delete Item By Id': props<{ itemId: string }>()
    }
})

export interface IItem {
    id?: string;
    name: string;
    containerId: string;
    count: number;
}

export const initialState: IItem[] = [];
export const itemsReducer = createReducer(
    initialState,
    on(itemsActions.receivedItems, (_state, { items }) => items)
);

export const featureSelector = createFeatureSelector<IItem[]>('items');
export const itemsSelector = createSelector(
    featureSelector,
    state => state
);

export const itemsSelectorById = (itemId: string) => createSelector(
    itemsSelector,
    items => items.find(item => item.id === itemId)
);
