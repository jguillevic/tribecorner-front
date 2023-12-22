import { TranslocoTestingModule } from '@ngneat/transloco';
import fr from './assets/i18n/fr.json';
import editEventPageFr from './assets/i18n/event/ui/page/edit-event-page/fr.json';

export function getTranslocoModule() {
  return TranslocoTestingModule.forRoot({
    langs: { 
      fr,
      'event/page/edit-event-page/fr': editEventPageFr
     },
    translocoConfig: {
      availableLangs: ['fr'],
      defaultLang: 'fr',
    },
    preloadLangs: true
  });
}