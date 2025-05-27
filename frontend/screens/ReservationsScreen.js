import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { getUserReservations, updateReservation, deleteReservation } from '../services/ReservationService';
import { useAuth } from '../context/AuthContext';

const ReservationsScreen = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const { token } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getUserReservations(token);
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

  const handleEdit = (reservation) => {
    setSelectedReservation({ ...reservation });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const { reservation_id, date, time, people_count } = selectedReservation;
      await updateReservation(token, { reservation_id, date, time, people_count });
      Alert.alert('Success', 'Reservation updated');
      setEditModalVisible(false);
      loadReservations();
    } catch (err) {
      Alert.alert('Error', 'Failed to update reservation');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm', 'Delete this reservation?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReservation(token, id);
            Alert.alert('Deleted', 'Reservation deleted');
            loadReservations();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete reservation');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
  <View style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 10 }}>
    <Text>Restaurant ID: {item.restaurant_id}</Text>
    <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
    <Text>Time: {item.time}</Text>
    <Text>People: {item.people_count}</Text>
    <Text>Status: {item.status ? item.status : 'Pending'}</Text>
    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
      <Button title="Edit" onPress={() => handleEdit(item)} />
      <Button title="Delete" color="red" onPress={() => handleDelete(item.reservation_id)} />
    </View>
  </View>
);


  return (
    <View style={{ padding: 16, flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>My Reservations</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={renderItem}
        />
      )}

     {/* Edit Modal */}
<Modal visible={editModalVisible} animationType="slide">
  <View style={{ padding: 16, marginTop: 60 }}>
    <Text style={{ fontSize: 20, marginBottom: 16 }}>Edit Reservation</Text>

    <Text>Date (YYYY-MM-DD)</Text>
    <TouchableOpacity
      onPress={() => setShowDatePicker(true)}
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
      }}
    >
      <Text>{selectedReservation?.date}</Text>
    </TouchableOpacity>
    {showDatePicker && (
      <DateTimePicker
        value={new Date(selectedReservation?.date)}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(event, selectedDate) => {
          setShowDatePicker(Platform.OS === 'ios'); 
          if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setSelectedReservation({ ...selectedReservation, date: formattedDate });
          }
        }}
      />
    )}

    <Text>Time (HH:MM)</Text>
    <TouchableOpacity
      onPress={() => setShowTimePicker(true)}
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
      }}
    >
      <Text>{selectedReservation?.time}</Text>
    </TouchableOpacity>
    {showTimePicker && (
      <DateTimePicker
        value={new Date(`1970-01-01T${selectedReservation?.time}:00`)}
        mode="time"
        is24Hour={true}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(event, selectedTime) => {
          setShowTimePicker(Platform.OS === 'ios'); 
          if (selectedTime) {
            const hours = selectedTime.getHours().toString().padStart(2, '0');
            const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            setSelectedReservation({ ...selectedReservation, time: formattedTime });
          }
        }}
      />
    )}

    <Text>People Count</Text>
    <TextInput
      value={selectedReservation?.people_count.toString()}
      keyboardType="number-pad"
      onChangeText={(val) =>
        setSelectedReservation({ ...selectedReservation, people_count: parseInt(val) || 0 })
      }
      style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }}
    />

    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Button title="Cancel" color="gray" onPress={() => setEditModalVisible(false)} />
      <Button title="Save" onPress={handleUpdate} />
    </View>
  </View>
</Modal>
    </View>
  );
};

export default ReservationsScreen;
