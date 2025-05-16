// llama a DataService para obtener/crear/editar/borrar datos
// expone vía Context el estado
// hace wrap a los componentes que consuman el contexto

export const DataContext = createContext({
    events: [], // todos los eventos
    tracks: [], // todos los tracks
    reviews: [], // reseñas de un evento específico
    addEvent: () => {},
    addEventTrack: () => {},
    updateEvent: () => {},
    getEventTracks: () => {},
    getEventReviews: () => {},
    getEventParticipants: () => {},
});
export const DataProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [reviews, setReviews] = useState([]);

    const addEvent = async (event) => {
        // Lógica para agregar un evento
    };

    const addEventTrack = async (track) => {
        // Lógica para agregar una pista de evento
    };

    const updateEvent = async (eventId, updates) => {
        // Lógica para actualizar un evento
    };

    const getEventTracks = async () => {
        // Lógica para obtener las pistas de eventos
    };

    const getEventReviews = async (eventId) => {
        // Lógica para obtener las reseñas de un evento
    };

    const getEventParticipants = async (eventId) => {
        // Lógica para obtener los participantes de un evento
    };

    return (
        <DataContext.Provider value={{ events, tracks, reviews, addEvent, addEventTrack, updateEvent, getEventTracks, getEventReviews, getEventParticipants }}>
            {children}
        </DataContext.Provider>
    );
}