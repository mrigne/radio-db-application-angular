import { RouteParams } from './route.params';

export class ContainersRoutes {
    public static ROUTES_TREE = {
        name: 'containers',
        full: ContainersRoutes.containers,
        add: {
            name: 'add',
            full: ContainersRoutes.containersAdd
        },
        containerId: {
            name: `:${RouteParams.containerId}`,
            full: ContainersRoutes.containersContainerId,
            edit: {
                name: 'edit',
                full: ContainersRoutes.containersContainerIdEdit
            }
        }
    }

    public static containers(): string {
        return `/${ContainersRoutes.ROUTES_TREE.name}`;
    }

    public static containersAdd(): string {
        return `${ContainersRoutes.containers()}/${ContainersRoutes.ROUTES_TREE.add.name}`;
    }

    public static containersContainerId(containerId: string): string {
        return `${ContainersRoutes.containers()}/${containerId}`;
    }

    public static containersContainerIdEdit(containerId): string {
        return `${ContainersRoutes.containersContainerId(containerId)}/${ContainersRoutes.ROUTES_TREE.containerId.edit.name}`;
    }
}
