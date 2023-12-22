import { Routes } from "@angular/router";
import { provideTranslocoScope } from "@ngneat/transloco";

export class EventRoutes {
    public static readonly displayEventsRoute: string = 'events/display';
    public static readonly editEventRoute: string = 'event/edit';
    public static readonly eventRoutes: Routes = [
        { 
            path: EventRoutes.displayEventsRoute,
            title: 'Agenda',
            loadComponent: () => import('../ui/page/display-events/display-events.component').then(module => module.DisplayEventsComponent)
        },
        { 
            path: EventRoutes.editEventRoute,
            title: 'Événement',
            loadComponent: () => import('../ui/page/edit-event/edit-event.component').then(module => module.EditEventComponent),
            providers: [
                provideTranslocoScope({scope: 'event/ui/page/edit-event-page-component', alias: 'editEventPageComponent'})
            ]
        }
    ];
}