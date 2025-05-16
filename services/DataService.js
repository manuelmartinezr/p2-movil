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
    },
    async addEvent(event) {
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