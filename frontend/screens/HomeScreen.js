import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {user?.role}</Text>

      <Button title="Make Reservation" onPress={() => navigation.navigate('MakeReservation')} />
      <Button title="View Reservations" onPress={() => navigation.navigate('Reservations')} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />

      {user?.role === 'admin' && (
        <Button title="Admin Dashboard" onPress={() => navigation.navigate('AdminDashboard')} />
      )}

      {user?.role === 'subadmin' && (
        <Button title="Subadmin Dashboard" onPress={() => navigation.navigate('SubadminDashboard')} />
      )}

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
