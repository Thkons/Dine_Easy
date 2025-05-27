import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { fetchAllReservations, confirmReservation, declineReservation } from '../services/ReservationService';

const SubadminDashboardScreen = () => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchAllReservations(token);
      setReservations(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleConfirm = async (id) => {
    try {
      await confirmReservation(token, id);
      Alert.alert('Success', 'Reservation confirmed');
      loadReservations();
    } catch (err) {
      Alert.alert('Error', 'Failed to confirm');
    }
  };

  const handleDecline = async (id) => {
    try {
      await declineReservation(token, id);
      Alert.alert('Declined', 'Reservation declined');
      loadReservations();
    } catch (err) {
      Alert.alert('Error', 'Failed to decline');
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 10 }}>
      <Text>User ID: {item.user_id}</Text>
      <Text>Restaurant ID: {item.restaurant_id}</Text>
      <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text>Time: {item.time}</Text>
      <Text>People: {item.people_count}</Text>
      <Text>Status: {item.status}</Text>

      {item.status === 'pending' && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Button title="Confirm" onPress={() => handleConfirm(item.reservation_id)} />
          <Button title="Decline" color="red" onPress={() => handleDecline(item.reservation_id)} />
        </View>
      )}
    </View>
  );

  return (
    <View style={{ padding: 16, flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Subadmin Dashboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default SubadminDashboardScreen;
