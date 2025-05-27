import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { makeReservation, fetchRestaurants } from '../services/ReservationService';
import { useAuth } from '../context/AuthContext';

const MakeReservationScreen = () => {
  const [restaurantId, setRestaurantId] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState('');

  const [peopleCount, setPeopleCount] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await fetchRestaurants(token);
        setRestaurants(data);
        if (data.length > 0) setRestaurantId(data[0].restaurant_id.toString());
      } catch (err) {
        Alert.alert('Error', 'Failed to load restaurants');
      }
    };
    loadRestaurants();
  }, []);

  
  useEffect(() => {
    const hours = selectedTime.getHours().toString().padStart(2, '0');
    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
    setTime(`${hours}:${minutes}`);
  }, [selectedTime]);

  const onSubmit = async () => {
    if (!restaurantId || !date || !time || !peopleCount) {
      Alert.alert('Validation', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await makeReservation(token, {
        restaurant_id: parseInt(restaurantId),
        date: date.toISOString().split('T')[0], 
        time,
        people_count: parseInt(peopleCount),
      });
      Alert.alert('Success', 'Reservation created successfully');
      setPeopleCount('');
      setTime('');
    } catch (err) {
      Alert.alert('Error', 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Make a Reservation</Text>

      <Text style={{ marginBottom: 6 }}>Select Restaurant</Text>
      <Picker selectedValue={restaurantId} onValueChange={(value) => setRestaurantId(value)}>
        {restaurants.map((r) => (
          <Picker.Item label={r.name} value={r.restaurant_id.toString()} key={r.restaurant_id} />
        ))}
      </Picker>

      <Text style={{ marginTop: 16 }}>Select Date</Text>
      <Button title={date.toDateString()} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={{ marginTop: 16 }}>Select Time</Text>
      <Button title={time || 'Select Time'} onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selected) => {
            setShowTimePicker(false);
            if (selected) setSelectedTime(selected);
          }}
        />
      )}

      <Text style={{ marginTop: 16 }}>Number of People</Text>
      <TextInput
        keyboardType="number-pad"
        value={peopleCount}
        onChangeText={setPeopleCount}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16 }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Submit Reservation" onPress={onSubmit} />
      )}
    </ScrollView>
  );
};

export default MakeReservationScreen;
