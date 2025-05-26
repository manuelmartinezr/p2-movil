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
        try {
            const data = await DataService.getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    const addEvent = async (event) => {
        try {
            const newEvent = await DataService.addEvent(event);
            console.log('New event added:', newEvent);
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };
    const updateEvent = async (eventId, updates) => {
        // Lógica para actualizar un evento
        
    };
    const getEventTracks = async () => {
        // Lógica para obtener las pistas de eventos
        try {
            const data = await DataService.getEventTracks();
            setTracks(data);
        } catch (error) {
            console.error('Error fetching event tracks:', error);
        }
    };
    const addEventTrack = async (track) => {
        // Lógica para agregar una pista de evento
        try {
            const newTrack = await DataService.addEventTrack(track);
            console.log('New track added:', newTrack);
            setTracks((prevTracks) => [...prevTracks, newTrack]);
        } catch (error) {
            console.error('Error adding event track:', error);
        }
    };
    const getEventReviews = async (eventId) => {
        // Lógica para obtener las reseñas de un evento
    };
    const getEventParticipants = async (eventId) => {
        // Lógica para obtener los participantes de un evento
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
