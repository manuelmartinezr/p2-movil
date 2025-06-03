// habla con el API del webservice para obtener los datos
const BASE_URL = 'https://unidb.openlab.uninorte.edu.co';
const CONTRACT_KEY = 'probandoparademo-4bb8-a532-6aaa5fddefa4';
import { getLocalVersion } from '../utils/localstorage.js';

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
    async addEventHelper(event) {
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
      console.log('DataService.addEventHelper', json.entry);
      return json.entry;
    },
    async addEvent(event) {
      const created = await this.addEventHelper(event);
    
      // const patchResult = await this.updateEvent(created.entry_id, { id: created.entry_id });
      console.log('DataService.addEventHelper', created);
      const patch = {
        ...created.data,
        id: parseInt(created.entry_id) // Asegúrate de que el ID sea el entry_id
      };
      console.log('DataService.addEvent patch', patch);
      const newEvent = await this.updateEvent(created.entry_id, patch);
      console.log('DataService.addEvent', newEvent);
      return newEvent;
    },
    async updateEvent(eventId, updates){
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/events/update/${eventId}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name : 'events',
          data: updates,
          where: { id: eventId }
        }),
      });
      const json = await handleResponse(res);
      console.log('DataService.updateEvent', json.entry.data);
      return json.entry.data;
    },
    async updateEventTrack(trackId, updates){
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/event_tracks/update/${trackId}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name : 'event_tracks',
          data: updates,
          where: { id: trackId }
        }),
      });
      const json = await handleResponse(res);
      console.log('DataService.updateEventTrack', json.entry.data);
      return json.entry.data;
    },
    async getEventTracks(){
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/event_tracks/all?format=json`;
      const res = await fetch(url);
      const json = await handleResponse(res);  
      const dataArray = json.data.map(e => e.data);
      console.log('DataService.getEventTracks', dataArray);
      return dataArray;
    },
    async addEventTrackHelper(track) {
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
      console.log('DataService.addEventTrackHelper', json.entry);
      return json.entry;
    },
    async addEventTrack(track){
      const created = await this.addEventTrackHelper(track);

      console.log('DataService.addEventTrackHelper', created);

      const patch = {
        ...created.data,
        id: parseInt(created.entry_id) // Asegúrate de que el ID sea el entry_id
      };
      console.log('DataService.addEventTrack patch', patch);
      const newTrack = await this.updateEventTrack(created.entry_id, patch);
      console.log('DataService.addEventTrack', newTrack);
      return newTrack;
    },
    async getEventReviews(eventId){
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/event_reviews/all?format=json&event_id=${eventId}`;
      const res = await fetch(url);
      const json = await handleResponse(res);  
      const dataArray = json.data.map(e => e.data);
      console.log('DataService.getEventReviews', dataArray);
      return dataArray;
    },
    async getEventParticipants(eventId){
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/events/all?format=json&id=${eventId}`;
      const res = await fetch(url);
      const json = await handleResponse(res);  
      const event_participants = json.data[0].data.currentParticipants;
      return event_participants;
    },
    async getEventMaxParticipants(eventId){
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/events/all?format=json&id=${eventId}`;
      const res = await fetch(url);
      const json = await handleResponse(res);  
      const max_participants = json.data[0].data.maxParticipants;
      return max_participants;
    },
    async addEventReview(review) {
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name : 'event_reviews',
          data: review
        }),
      });
      const json = await handleResponse(res);
      console.log('DataService.addEventReview', json.entry.data);
      return json.entry.data;
    },
    async deleteEvent(eventId) {
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/events/delete/${eventId}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to delete event with ID ${eventId}`);
      }
      console.log(`Event with ID ${eventId} deleted successfully`);
      return { success: true };
    },
    async deleteEventTrack(trackId) {
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/event_tracks/delete/${trackId}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to delete event track with ID ${trackId}`);
      }
      console.log(`Track with ID ${trackId} deleted successfully`);
      console.log('response', res.body); 
      return { success: true };
    },
    async bumpApiVersion() {
      const current = (await getLocalVersion())|| 0;
      const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'version',
          data: { version: current + 1 },
          where: { version: current }
        }),
      });
      const json = await handleResponse(res);
      console.log('DataService.bumpApiversion', json);
      return json;
    }
}