const BASE_URL = 'https://unidb.openlab.uninorte.edu.co';
const CONTRACT_KEY = 'jga-a532-6aaa5fddefa4';
import { DataService } from './DataService.js';

(async () => {
  try {
    // 1. Fetch all events
    const events = await DataService.getEvents();
    console.log('getEvents →', events);

    // 2. Fetch all event tracks
    const tracks = await DataService.getEventTracks();
    console.log('getEventTracks →', tracks);

    // for (const track of tracks) {
    //   console.log(`Track ID: ${track.id}, Name: ${track.name}`);
    //   await DataService.deleteEventTrack(track.id);
    //   console.log(`Deleted Track ID: ${track.id}`);
    // }

    // 3. Create a new event
    // const newEventPayload = { 
    //   id: 1, 
    //   name: '🚀 Test Event', 
    //   location: 'Barranquilla, Colombia',
    //   date: '2025-05-30 15:25:00',
    //   maxParticipants: 1000,
    //  };
    // const created = await DataService.addEvent(newEventPayload);
    // console.log('addEvent →', created);

    // console.log('Created Event ID →', created.id);

    // const reviews = [
    //   { id: 1, event_id: created.id, rating: 5, comment: 'Amazing event!' },
    //   { id: 2, event_id: created.id, rating: 4, comment: 'Great experience!' }
    // ]
    // console.log('Adding reviews:', reviews);
    // for (const review of reviews) {
    //   const addedReview = await DataService.addEventReview(review);
    //   console.log('addEventReview →', addedReview);
    // }
    

    // 4. Update that same event
    // const updated = await DataService.updateEvent(created.id, { name: '🔄 Updated Test Event' });
    // console.log('updateEvent →', updated);

    // 5. Create a new track for that event
    // const newTrackPayload = { id: 1, name: 'Main Stage' };
    // const createdTrack = await DataService.addEventTrack(newTrackPayload);
    // console.log('addEventTrack →', createdTrack);

    // const fetchedReviews = await DataService.getEventReviews(1748636571038);
    // console.log('getEventReviews →', fetchedReviews);

    // const currentParticipants = await DataService.getEventParticipants(created.id);
    // console.log('getEventParticipants →', currentParticipants);

  }
  catch (err) {
    console.error('❌ Error:', err);
  }
})();
