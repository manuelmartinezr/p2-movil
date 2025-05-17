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
        const response = await fetch(`${BASE_URL}/data/events/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Contract-Key': CONTRACT_KEY,
            },
        });
        return handleResponse(response);
    },
    async addEvent(event) {
        const response = await fetch(`${BASE_URL}/data/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Contract-Key': CONTRACT_KEY,
            },
            body: JSON.stringify(event),
        });
        return handleResponse(response);
    },
    async addEventTrack(track){
    },
    async updateEvent(eventId, updates){
    },
    async getEventTracks(){
    },
    async getEventReviews(eventId){
    },
    async getEventParticipants(eventId){
    },
}