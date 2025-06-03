import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useData } from '../providers/DataProvider';

export default function DashboardScreen() {
  // Estados para los desplegables
  const [isEventsExpanded, setIsEventsExpanded] = useState(true);
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Datos de ejemplo con max_participants y reviews
  const { 
    events, 
    getEventReviews, 
    getEventParticipants, 
    getEventMaxParticipants 
  } = useData();

  // const eventsData = [
  //   {
  //     id: 1,
  //     name: 'Conferencia Anual',
  //     subscribers: 1245,
  //     max_participants: 1500,
  //     rating: 4.5,
  //     reviews: [
  //       { id: 1, comment: 'Excelente contenido, muy útil para mi trabajo', rating: 5 },
  //       { id: 2, comment: 'Los speakers fueron muy profesionales', rating: 4 },
  //       { id: 3, comment: 'El horario fue perfecto', rating: 5 },
  //       { id: 4, comment: 'El material proporcionado fue excelente', rating: 4 }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: 'Taller de Marketing',
  //     subscribers: 892,
  //     max_participants: 1000,
  //     rating: 3.8,
  //     reviews: [
  //       { id: 1, comment: 'Podría ser más práctico', rating: 3 },
  //       { id: 2, comment: 'Buen material de referencia', rating: 4 }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     name: 'Seminario Web',
  //     subscribers: 1532,
  //     max_participants: 2000,
  //     rating: 4.2,
  //     reviews: [
  //       { id: 1, comment: 'Muy informativo y bien organizado', rating: 5 },
  //       { id: 2, comment: 'La plataforma funcionó perfectamente', rating: 4 },
  //       { id: 3, comment: 'Duración adecuada', rating: 4 }
  //     ]
  //   }
  // ];

  // Constantes de paginación
  
  const [loading, setLoading] = useState(true);
  const [participantsData, setParticipantsData] = useState({});
  const [maxCapacityData, setMaxCapacityData] = useState({});
  const [currentReviews, setCurrentReviews] = useState([]);

  
  const REVIEWS_PER_PAGE = 2;

  useEffect(() => {
    const loadEventMetrics = async () => {
      const participants = {};
      const maxCapacities = {};

      await Promise.all(events.map(async (event) => {
        participants[event.id] = await getEventParticipants(event.id);
        maxCapacities[event.id] = await getEventMaxParticipants(event.id);
      }));

      setParticipantsData(participants);
      setMaxCapacityData(maxCapacities);
      setLoading(false);
    };

    loadEventMetrics();
  }, [events]);

  // Funciones toggle
  const toggleEvents = () => setIsEventsExpanded(!isEventsExpanded);
  const toggleFeedback = () => {
    setIsFeedbackExpanded(!isFeedbackExpanded);
    setCurrentPage(1);
  };
  
  const toggleEventReviews = async (eventId) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
      setCurrentPage(1);
      const reviews = await getEventReviews(eventId);
      setCurrentReviews(reviews);
    }
  };


  const getPaginatedReviews = () => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    return currentReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
  };

  const getTotalPages = () => {
    return Math.ceil(currentReviews.length / REVIEWS_PER_PAGE);
  };

  const getAverageRating = () => {
    if (currentReviews.length === 0) return 0;
    const sum = currentReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / currentReviews.length;
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1128" />
      <Text style={styles.title}>📊 Dashboard</Text>
      
      {/* Sección Event Statistics con tabla */}
      <TouchableOpacity onPress={toggleEvents}>
        <View style={styles.dropdownHeader}>
          <Text style={styles.item}>• Event statistics</Text>
          <Text style={styles.arrow}>{isEventsExpanded ? '▼' : '▶'}</Text>
        </View>
      </TouchableOpacity>

      {isEventsExpanded && (
        <View style={styles.dropdownContent}>
          {/* Tabla de suscripciones */}
          <View style={styles.table}>
            {/* Encabezados */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, styles.firstColumn]}>Evento</Text>
              <Text style={styles.tableHeader}>Suscriptores</Text>
              <Text style={styles.tableHeader}>Cupo máximo</Text>
              <Text style={styles.tableHeader}>% ocupado</Text>
            </View>
            
            {/* Filas de datos */}
            {events.map((event) => {
              const current = participantsData[event.id] || 0;
              const max = maxCapacityData[event.id] || 1;
              const occupancyPercentage = (current / max) * 100;
              const occupancyColor = occupancyPercentage >= 90 ? '#FF6B6B' : 
                                  occupancyPercentage >= 75 ? '#FFD166' : '#06D6A0';
              
              return (
                <View key={event.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.firstColumn]}>- {event.name}</Text>
                  <Text style={styles.tableCell}>{current}</Text>
                  <Text style={styles.tableCell}>{max}</Text>
                  <Text style={[styles.tableCell, { color: occupancyColor }]}>
                    {occupancyPercentage.toFixed(1)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Sección User Feedback */}
      <TouchableOpacity onPress={toggleFeedback}>
        <View style={styles.dropdownHeader}>
          <Text style={styles.item}>• User feedback</Text>
          <Text style={styles.arrow}>{isFeedbackExpanded ? '▼' : '▶'}</Text>
        </View>
      </TouchableOpacity>

      {isFeedbackExpanded && (
        <View style={styles.dropdownContent}>
          {events.map((event) => (
            <View key={event.id}>
              <TouchableOpacity onPress={() => toggleEventReviews(event.id)}>
                <View style={styles.feedbackHeader}>
                  <Text style={styles.eventName}>- {event.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>
                      {expandedEvent === event.id ? getAverageRating().toFixed(1) : '--'}
                    </Text>
                    <Text style={styles.ratingStar}>★</Text>
                    <Text style={styles.arrow}>{expandedEvent === event.id ? '▼' : '▶'}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {expandedEvent === event.id && (
                <View style={styles.reviewsContent}>
                  {getPaginatedReviews().map((review) => (
                    <View key={review.id} style={styles.reviewItem}>
                      <Text style={styles.reviewComment}>"{review.comment}"</Text>
                      <Text style={styles.reviewRating}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </Text>
                    </View>
                  ))}

                  {/* Controles de paginación */}
                  {currentReviews.length > REVIEWS_PER_PAGE && (
                    <View style={styles.pagination}>
                      <TouchableOpacity 
                        onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <Text style={[
                          styles.pageButton,
                          currentPage === 1 && styles.disabledButton
                        ]}>◀ Anterior</Text>
                      </TouchableOpacity>
                      
                      <Text style={styles.pageText}>
                        Página {currentPage} de {getTotalPages()}
                      </Text>
                      
                      <TouchableOpacity 
                        onPress={() => setCurrentPage(p => Math.min(getTotalPages(), p + 1))}
                        disabled={currentPage >= getTotalPages()}
                      >
                        <Text style={[
                          styles.pageButton,
                          currentPage >= getTotalPages() && styles.disabledButton
                        ]}>Siguiente ▶</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1128',
    padding: 24,
    paddingTop: 60,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  item: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 10,
  },
  dropdownContent: {
    marginLeft: 20,
    marginBottom: 10,
  },
  
  /* Estilos para la tabla */
  table: {
    borderWidth: 1,
    borderColor: '#33415C',
    borderRadius: 6,
    marginBottom: 15,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#33415C',
    paddingVertical: 8,
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 12,
  },
  tableCell: {
    flex: 1,
    color: '#DDDDDD',
    textAlign: 'center',
    fontSize: 12,
  },
  firstColumn: {
    flex: 2,
    textAlign: 'left',
    paddingLeft: 10,
  },
  
  /* Estilos para User Feedback */
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 14,
    color: '#DDDDDD',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 2,
  },
  ratingStar: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 8,
  },
  reviewsContent: {
    marginLeft: 30,
    marginBottom: 8,
  },
  reviewItem: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
  },
  reviewComment: {
    fontSize: 12,
    color: '#CCCCCC',
    marginVertical: 2,
  },
  reviewRating: {
    fontSize: 12,
    color: '#FFD700',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  pageButton: {
    color: '#FFFFFF',
    fontSize: 12,
    padding: 5,
  },
  disabledButton: {
    color: '#666666',
  },
  pageText: {
    color: '#AAAAAA',
    fontSize: 12,
  },
});