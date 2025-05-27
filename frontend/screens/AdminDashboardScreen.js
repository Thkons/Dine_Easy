import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const AdminDashboardScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);

  const fetchAdminData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userRes = await axios.get('http://10.20.32.115:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const reservationRes = await axios.get('http://10.20.32.115:5000/api/reservations/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(userRes.data);
      setReservations(reservationRes.data);
    } catch (err) {
      Alert.alert('Error', 'Could not fetch data');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAdminData();
    }, [])
  );

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://10.20.32.115:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'User deleted');
      fetchAdminData();
    } catch (err) {
      Alert.alert('Error', 'Could not delete user');
    }
  };

  const handleEditUser = (user) => {
    navigation.navigate("EditUser", { userId: user.user_id });
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://10.20.32.115:5000/api/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Reservation deleted');
      fetchAdminData();
    } catch (err) {
      Alert.alert('Error', 'Could not delete reservation');
    }
  };

  const handleEditReservation = (reservation) => {
    navigation.navigate("EditReservation", { reservationId: reservation.reservation_id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <Text style={styles.sectionTitle}>Manage Users</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.userText}>{item.name} ({item.role})</Text>
            <Text style={styles.emailText}>{item.email}</Text>
            <View style={styles.actions}>
              <Button title="Edit" onPress={() => handleEditUser(item)} color="blue" />
              <Button title="Delete" onPress={() => handleDeleteUser(item.user_id)} color="red" />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.user_id.toString()}
      />

      <Text style={styles.sectionTitle}>Manage Reservations</Text>
      <FlatList
        data={reservations}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.reservationText}>
              {item.restaurant_name || 'Unknown Restaurant'}
            </Text>
            <Text style={styles.detailText}>
              Date: {new Date(item.date).toLocaleDateString()} | Time: {item.time} | People: {item.people_count}
            </Text>
            <Text style={styles.detailText}>
              Reserved by: {item.name || 'Unknown'}
            </Text>
            <Text>Status: {item.status ? item.status : 'Pending'}</Text>
            <View style={styles.actions}>
              <Button title="Edit" color="blue" onPress={() => handleEditReservation(item)} />
              <Button title="Delete" color="red" onPress={() => handleDeleteReservation(item.reservation_id)} />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.reservation_id.toString()}
        ListEmptyComponent={<Text>No reservations found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, marginTop: 20, marginBottom: 10, fontWeight: '600' },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  userText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 14,
    color: '#666',
  },
  reservationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
});

export default AdminDashboardScreen;
