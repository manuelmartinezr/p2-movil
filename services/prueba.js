const BASE_URL = 'https://unidb.openlab.uninorte.edu.co';
const CONTRACT_KEY = 'kljh-a532-6aaa5fddefa4';
import { DataService } from './DataService.js';

(async () => {
  try {
    // 1. Fetch all events
    const events = await DataService.getEvents();
    console.log('getEvents →', events);

    // 2. Fetch all event tracks
    const tracks = await DataService.getEventTracks();
    console.log('getEventTracks →', tracks);

    // 3. Create a new event
    // const newEventPayload = { id: 1, name: '🚀 Test Event', date: '2025-06-01' };
    // const created = await DataService.addEvent(newEventPayload);
    // console.log('addEvent →', created);
    // console.log('Created Event ID →', created.id);

    // 4. Update that same event
    const updated = await DataService.updateEvent(1748297163886, { name: '🔄 Updated Test Event' });
    console.log('updateEvent →', updated);

    // // 5. Create a new track for that event
    // const newTrackPayload = { event_id: created.id, name: 'Main Stage' };
    // const createdTrack = await DataService.addEventTrack(newTrackPayload);
    // console.log('addEventTrack →', createdTrack);

    // 6. Note: getEventReviews and getEventParticipants are not implemented yet,
    //    so they’ll return `undefined` unless you add them:
    // console.log('getEventReviews →', await DataService.getEventReviews?.(created.id));
    // console.log('getEventParticipants →', await DataService.getEventParticipants?.(created.id));
  }
  catch (err) {
    console.error('❌ Error:', err);
  }
})();
