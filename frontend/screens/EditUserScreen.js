import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const EditUserScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('EditUserScreen userId:', userId); 
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`http://10.20.32.115:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        setUser(userData);
        setName(userData.name);
        setEmail(userData.email);
        setRole(userData.role);
      } catch (err) {
        Alert.alert('Error', 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `http://10.20.32.115:5000/api/users/${userId}`,
        { name, email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'User updated successfully');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to update user');
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit User</Text>

      <Text>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text>Role:</Text>
      <TextInput style={styles.input} value={role} onChangeText={setRole} />

      <Button title="Save Changes" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default EditUserScreen;
