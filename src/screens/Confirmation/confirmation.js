import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const Confirmation = () => {
  const route = useRoute();
  const { bookingData } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: bookingData.selectedServiceProviderImage }}
        style={styles.serviceProviderImage}
      />
      <Text style={styles.serviceProviderName}>
        {bookingData.selectedServiceProviderName}
      </Text>
      <Text style={styles.selectedServiceName}>{bookingData.services}</Text>
      <Text style={styles.selectedDate}>{bookingData.selectedDate}</Text>
      <Text style={styles.selectedCalendar}>
        {bookingData.selectedCalendar}
      </Text>
      <Text style={styles.totalPrice}>{bookingData.totalPrice} Birr</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5", // Added background color
  },
  serviceProviderImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Improved borderRadius
    marginBottom: 20, // Increased margin
  },
  serviceProviderName: {
    fontSize: 22, // Increased font size
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedServiceName: {
    fontSize: 18, // Increased font size
    marginBottom: 8, // Adjusted margin
  },
  selectedDate: {
    fontSize: 16,
    marginBottom: 8,
  },
  selectedCalendar: {
    fontSize: 16,
    marginBottom: 16, // Increased margin
  },
  totalPrice: {
    fontSize: 20, // Increased font size
    fontWeight: "bold",
  },
});

export default Confirmation;
