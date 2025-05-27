import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ProfileScreen = () => {
  const { user, token, logout } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (user) {
     
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  
  const getProfile = async () => {
    try {
      const response = await axios.get('http://10.20.32.115:5000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { name, email } = response.data;
      setName(name);
      setEmail(email);
    } catch (error) {
      console.error('Failed to fetch profile:', error.response || error.message);
      Alert.alert('Error', 'Failed to fetch profile.');
    }
  };

  
  const handleSave = async () => {
    try {
      const updatedProfile = {
        name,
        email,
        password,
      };

      const response = await axios.put('http://10.20.32.115:5000/api/users/profile', updatedProfile, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update profile:', error.response || error.message);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        editable={false} 
      />

      <Text style={styles.label}>Password (leave blank to keep current):</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter new password"
        secureTextEntry
      />

      <Button title="Save Changes" onPress={handleSave} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
});

export default ProfileScreen;
