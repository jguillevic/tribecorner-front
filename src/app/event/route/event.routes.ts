import { Routes } from "@angular/router";

export class EventRoutes {
    public static readonly displayEventsRoute: string = 'events/display';
    public static readonly editEventRoute: string = 'event/edit';
    public static readonly eventRoutes: Routes = [
        { 
            path: EventRoutes.displayEventsRoute,
            title: 'Agenda',
            loadComponent: () => import('../ui/display-events/display-events.component').then(module => module.DisplayEventsComponent) 
        },
        { 
            path: EventRoutes.editEventRoute,
            title: 'Événement',
            loadComponent: () => import('../ui/edit-event/edit-event.component').then(module => module.EditEventComponent) 
        }
    ];
}