import { ContainersRoutes } from './containers.routes';
import { ItemsRoutes } from './items.routes';

export class AppRoutes {
    public static items = ItemsRoutes.ROUTES_TREE;
    public static containers = ContainersRoutes.ROUTES_TREE;
}
