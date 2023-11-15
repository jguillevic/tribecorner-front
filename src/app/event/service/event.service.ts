import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from 'src/app/event/model/event.model';

@Injectable()
export class EventService {
  public constructor() { }

  public loadAllByDate(date: Date): Observable<Event[]> {
    const events: Event[] = this.generateEvents();
    return of(this.getEventsOfDay(events, date));
  }

  public loadOneById(eventId: number): Observable<Event> {
    const event:Event = new Event();
    event.id = eventId;
    return of(event);
  }

  public create(event: Event): Observable<Event> {
    return of (event);
  }

  public update(event: Event): Observable<Event> {
    return of (event);
  }

  private generateEvents(): Event[] {
    const events: Event[] = [];
    const currentDate = new Date();
    const eventNames = [
      'Réunion d\'équipe',
      'Conférence client',
      'Formation interne',
      'Déjeuner avec partenaires',
      'Présentation du projet',
      'Entretiens de recrutement',
      'Réunion de planification',
      'Atelier de brainstorming',
      'Développement de nouvelles fonctionnalités',
      'Pause café'
    ];

    for (let i = 0; i < 25; i++) {
      const newEvent = new Event();
      newEvent.id = i + 1;
      newEvent.name = eventNames[i % eventNames.length];
      newEvent.allDay = false;

      // Générer une durée aléatoire entre 30 minutes et 4 heures (en millisecondes)
      const duration = Math.floor(Math.random() * (4 * 60 - 30 + 1) + 30) * 60000;

      // Répartir les événements sur 10 jours (86400000 ms par jour)
      const daysToAdd = i % 10;
      newEvent.startingDateTime = new Date(currentDate.getTime() + daysToAdd * 86400000);
      newEvent.endingDateTime = new Date(newEvent.startingDateTime.getTime() + duration);

      events.push(newEvent);
    }

    return events;
  }

  // Méthode pour récupérer les événements d'un jour en particulier.
  private getEventsOfDay(events: Event[], date: Date): Event[] {
    const eventsOfDay: Event[] = events.filter(
      (event) =>
        event.startingDateTime.toDateString() === date.toDateString() ||
        (event.endingDateTime.toDateString() === date.toDateString() &&
          event.endingDateTime.getDate() !== event.startingDateTime.getDate())
    );

    return eventsOfDay;
  }
}