// habla con el API del webservice para obtener los datos

const BASE_URL = 'https://unidb.openlab.uninorte.edu.co';
const CONTRACT_KEY = 'e83b7ac8-bdad-4bb8-a532-6aaa5fddefa4';

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export const DataService = {
    async getEvents() {
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/events/all?format=json`;
      const res = await fetch(url);
      const json = await handleResponse(res);  
      console.log('DataService.getEvents', json);
    },
    async addEvent() {
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // table_name : 'events',
          // data: {
          
        }),
      });
      const json = await handleResponse(res);
      console.log('DataService.addEvent', json);
    },
     async addEventTrack(track){ 
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            table_name : 'event_tracks', // Mirar si el nombre de la tabla es correcto
            data: track 
          }),
        });
        const json = await handleResponse(res);
        console.log('DataService.addEventTrack', json);
        return json;
      } catch (error) {
        console.error('Error adding event track:', error);
        throw error;
      }
    },

    async updateEvent(eventId, updates){
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/update/${eventId}`;
      try {
        const res = await fetch(url, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            table_name: 'events', 
            data: updates 
          }),
        });
        const json = await handleResponse(res);
        console.log('DataService.updateEvent', json);
        return json;
      } catch (error) {
        console.error(`Error updating event ${eventId}:`, error);
        throw error;
      }
    },

    async getEventTracks(eventId){ 
     
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/event_tracks/${eventId}?format=json`;
      try {
        const res = await fetch(url);
        const json = await handleResponse(res);  
        console.log(`DataService.getEventTracks for event ${eventId}`, json);
        return json;
      } catch (error) {
        console.error(`Error fetching event tracks for event ${eventId}:`, error);
        throw error;
      }
    },

    async getEventReviews(eventId){ 
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/event_reviews/${eventId}?format=json`;
      try {
        const res = await fetch(url);
        const json = await handleResponse(res);  
        console.log(`DataService.getEventReviews for event ${eventId}`, json);
        return json;
      } catch (error) {
        console.error(`Error fetching event reviews for event ${eventId}:`, error);
        throw error;
      }
    },

    async getEventParticipants(eventId){ 
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/event_participants/${eventId}?format=json`;
      try {
        const res = await fetch(url);
        const json = await handleResponse(res);  
        console.log(`DataService.getEventParticipants for event ${eventId}`, json);
        return json;
      } catch (error) {
        console.error(`Error fetching event participants for event ${eventId}:`, error);
        throw error;
      }
    },
}
