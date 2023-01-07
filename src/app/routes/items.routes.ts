import { RouteParams } from './route.params';

export class ItemsRoutes {
    public static ROUTES_TREE = {
        name: 'items',
        full: ItemsRoutes.items,
        add: {
            name: 'add',
            full: ItemsRoutes.itemsAdd
        },
        itemId: {
            name: `:${RouteParams.itemId}`,
            full: ItemsRoutes.itemsItemId,
            add: {
                name: 'add',
                full: ItemsRoutes.itemsItemIdAdd
            },
            eject: {
                name: 'eject',
                full: ItemsRoutes.itemsItemIdEject
            }
        }
    }

    public static items(): string {
        return `/${ItemsRoutes.ROUTES_TREE.name}`;
    }

    public static itemsAdd(): string {
        return `${ItemsRoutes.items()}/${ItemsRoutes.ROUTES_TREE.add.name}`;
    }

    public static itemsItemId(itemId: string): string {
        return `${ItemsRoutes.items()}/${itemId}`;
    }

    public static itemsItemIdAdd(itemId: string): string {
        return `${ItemsRoutes.itemsItemId(itemId)}/${ItemsRoutes.ROUTES_TREE.itemId.add.name}`;
    }

    public static itemsItemIdEject(itemId: string): string {
        return `${ItemsRoutes.itemsItemId(itemId)}/${ItemsRoutes.ROUTES_TREE.itemId.eject.name}`;
    }
}
