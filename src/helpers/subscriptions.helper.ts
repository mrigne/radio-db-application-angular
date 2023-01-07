import { Subscription } from 'rxjs';

export class SubscriptionsHelper {
    public static unsubscribeFromAll(subscriptions: Subscription[]): void {
        if (subscriptions?.length) {
            subscriptions.forEach(subscription => {
                subscription?.unsubscribe();
            });
            subscriptions.length = 0;
        }
    }
}
