// llama a DataService para obtener/crear/editar/borrar datos
// expone vía Context el estado
// hace wrap a los componentes que consuman el contexto
import { createContext, useContext, useEffect, useState } from 'react';
import { DataService } from '../services/DataService';

export const DataContext = createContext({
    events: [], // todos los eventos
    tracks: [], // todos los tracks
    reviews: [], // reseñas de un evento específico
    addEvent: () => {},
    addEventTrack: () => {},
    updateEvent: () => {},
    getEvents: () => {},
    getEventTracks: () => {},
    getEventReviews: () => {},
    getEventParticipants: () => {},
});
export const DataProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const event_data = await DataService.getEvents();
                setEvents(event_data);
                const track_data = await DataService.getEventTracks();
                setTracks(track_data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchData();
    }, []);

    const getEvents = async () => {
        // devuelve un array de eventos
        // getEvents → [
        //   {
        //     id: 1748565262911,
        //     name: '🚀 Test Event',
        //     date: '2025-06-01',
        //     currentParticipants: 0
        //   }
        // ]
        try {
            const data = await DataService.getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    const addEvent = async (event) => {
        // espera un json de forma { id: 1, name: '🚀 Test Event', date: '2025-06-01', currentParticipants:0 ... etc.
        // devuelve el evento agregado
        // addEvent → { id: 1748565262911, name: '🚀 Test Event', date: '2025-06-01', currentParticipants: 0 ... etc. }
        try {
            const newEvent = await DataService.addEvent(event);
            console.log('New event added:', newEvent);
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };
    const updateEvent = async (eventId, updates) => {
        // busca un evento por id y lo reemplaza con los datos de updates
        // esencialmente, reemplaza un evento por otro
        // es necesario que updates contenga los datos completos del evento, no solo los campos a actualizar
        // devuelve el evento actualizado
        // updateEvent → { id: 1748565262911, name: '🔄 Updated Test Event', date: '2025-06-01', currentParticipants: 0 ... etc. }
        try {
            const updatedEvent = await DataService.updateEvent(eventId, updates);
            console.log('Event updated:', updatedEvent);
            setEvents((prevEvents) =>
                prevEvents.map((event) => (event.id === eventId ? updatedEvent : event))
            );
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };
    const getEventTracks = async () => {
        // Lógica para obtener las pistas de eventos
        // devuelve un array de pistas de eventos
        // DataService.getEventTracks [
        //   { id: 1, name: 'Ciberseguridad' },
        //   { id: 2, name: 'Bases de datos' }
        // ]

        try {
            const data = await DataService.getEventTracks();
            setTracks(data);
        } catch (error) {
            console.error('Error fetching event tracks:', error);
        }
    };
    const addEventTrack = async (track) => {
        // Lógica para agregar una pista de evento
        // espera un json de forma { id: 1, name: 'Ciberseguridad' }
        // devuelve el track agregado
        // addEventTrack → { id: 1, name: 'Ciberseguridad' }
        try {
            const newTrack = await DataService.addEventTrack(track);
            console.log('New track added:', newTrack);
            setTracks((prevTracks) => [...prevTracks, newTrack]);
        } catch (error) {
            console.error('Error adding event track:', error);
        }
    };
    const getEventReviews = async (eventId) => {
        // devuelve un array de reseñas de un evento específico
        //
        // getEventReviews → [
        //   {
        //     id: 1,
        //     event_id: '1748565262911',
        //     rating: 5,
        //     comment: 'Amazing event!'
        //   },
        //   {
        //     id: 2,
        //     event_id: '1748565262911',
        //     rating: 4,
        //     comment: 'Great experience!'
        //   }
        // ]
        try {
            const data = await DataService.getEventReviews(eventId);
            setReviews(data);
            return data;
        } catch (error) {
            console.error('Error fetching event reviews:', error);
            return [];
        }
    };
    const getEventParticipants = async (eventId) => {
        // Lógica para obtener los participantes de un evento
        // espera un id de evento y devuelve un entero (currentParticipants)
        // getEventParticipants → 10
        try {
            const data = await DataService.getEventParticipants(eventId);
            return data;
        } catch (error) {
            console.error('Error fetching event participants:', error);
            return;
        }
    };
    const deleteEvent = async (eventId) => {
        // Lógica para eliminar un evento
        // espera un id de evento y elimina el evento
        // devuelve true si se eliminó correctamente, false si no
        try {
            const response = await DataService.deleteEvent(eventId);
            if (response.success) {
                setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting event:', error);
            return false;
        }
    };

    return (
        <DataContext.Provider value={{ events, tracks, reviews, addEvent, addEventTrack, updateEvent, getEvents, getEventTracks, getEventReviews, getEventParticipants }}>
            {children}
        </DataContext.Provider>
    );
}
export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
