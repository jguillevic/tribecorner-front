import { Routes } from "@angular/router";

export class EventRoutes {
    public static readonly displayEventsRoute: string = 'events/display';
    public static readonly editEventRoute: string = 'event/edit';
    public static readonly eventRoutes: Routes = [
        { 
            path: EventRoutes.displayEventsRoute,
            title: 'Agenda',
            loadComponent: () => import('../ui/page/display-events-page/display-events-page.component').then(module => module.DisplayEventsPageComponent)
        },
        { 
            path: EventRoutes.editEventRoute,
            title: 'Événement',
            loadComponent: () => import('../ui/page/edit-event-page/edit-event-page.component').then(module => module.EditEventPageComponent) 
        }
    ];
}