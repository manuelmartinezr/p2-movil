// habla con el API del webservice para obtener los datos

const BASE_URL = 'https://unidb.openlab.uninorte.edu.co';
const CONTRACT_KEY = 'eop-bdad-4bb8-a532-6aaa5fddefa4';

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
      const dataArray = json.data.map(e => e.data);
      console.log('DataService.getEvents', dataArray);
      return dataArray;
      
    },
    async addEvent(event) {
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name : 'events',
          data: event
        }),
      });
      const json = await handleResponse(res);
      console.log('DataService.addEvent', json.entry.data);
      return json.entry.data;
    },
    async addEventTrack(track){
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name : 'event_tracks',
          data: track
        }),
      });
      const json = await handleResponse(res);
      console.log('DataService.addEventTrack', json.entry.data);
      return json.entry.data;
    },
    async updateEvent(eventId, updates){
    },
    async getEventTracks(){
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/event_tracks/all?format=json`;
      const res = await fetch(url);
      const json = await handleResponse(res);  
      const dataArray = json.data.map(e => e.data);
      console.log('DataService.getEventTracks', dataArray);
      return dataArray;
    },
    async getEventReviews(eventId){
    },
    async getEventParticipants(eventId){
    },
}