import { ActionReducerMap } from '@ngrx/store';
import { containersReducer, IContainer } from './containers';
import { IItem, itemsReducer } from './items';

export interface IState {
    items: IItem[];
    containers: IContainer[];
}

export const reducers: ActionReducerMap<IState> = {
    items: itemsReducer,
    containers: containersReducer
};
