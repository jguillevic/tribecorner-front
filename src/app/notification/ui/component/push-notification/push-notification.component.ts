import {Component, OnDestroy, OnInit} from '@angular/core';
import {Messaging, getToken, onMessage} from '@angular/fire/messaging';
import {Subject, from, mergeMap, of, takeUntil, tap} from 'rxjs';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-push-notification',
    standalone: true,
    imports: [],
    templateUrl: './push-notification.component.html',
    styles: ``
})
export class PushNotificationComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();

    public constructor(
        private readonly messaging: Messaging
    ) { }

    public ngOnInit(): void {
        from(Notification.requestPermission())
        .pipe(
            takeUntil(this.destroy$),
            mergeMap((permission: NotificationPermission) => {
                if (permission === "granted") {
                    return from(
                        getToken(
                            this.messaging,
                            {vapidKey: environment.firebaseConfig.vapidPublicKey}
                        )
                    );
                }
                console.log('Permission non autorisée.');
                return of(undefined);
            }),
            tap((token: string|undefined) => {
                    if (token) {
                        console.log('FCM', {token});
                    }
                }
            )
        )
        .subscribe();

        onMessage(
            this.messaging
            , payload => {
                console.log('Message reçu. ', payload.notification);
            }
        );
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
