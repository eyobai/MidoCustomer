import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { API_URL } from "../../components/apiConfig";

export default function Appointments() {
  const [bookingsList, setBookingsList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const userId = useSelector((state) => state.user.userId);

  const fetchData = () => {
    setRefreshing(true);

    fetch(`${API_URL}/bookingsByUserId?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.bookings && data.bookings.length > 0) {
          const bookings = data.bookings.map((booking) => ({
            key: booking.id.toString(),
            businessName: booking.businessName,
            selectedDate: booking.selectedDate,
            selectedTimeSlot: booking.selectedTimeSlot,
          }));

          setBookingsList(bookings);
        } else {
          setBookingsList([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setBookingsList([]);
      })
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  if (bookingsList.length === 0) {
    return (
      <View style={styles.noAppointmentsContainer}>
        <Text style={styles.noAppointmentsHeader}>No Appointments</Text>
        <Text style={styles.noAppointmentsText}>
          Your upcoming appointments will appear when you book.
        </Text>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search Salons</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={bookingsList}
      renderItem={({ item }) => (
        <View style={styles.bookingContainer}>
          <Text style={styles.label}>Selected Shop:</Text>
          <Text style={styles.value}>{item.businessName}</Text>

          <Text style={styles.label}>Selected Date:</Text>
          <Text style={styles.value}>{item.selectedDate}</Text>

          <Text style={styles.label}>Selected Time Slot:</Text>
          <Text style={styles.value}>{item.selectedTimeSlot}</Text>
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  bookingContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noAppointmentsHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  noAppointmentsText: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
