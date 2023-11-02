import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import moment from "moment";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "../../components/apiConfig";
import COLORS from "../../consts/colors";
import { useNavigation } from "@react-navigation/native";

const ServiceProviderList = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const navigation = useNavigation();

  const route = useRoute();
  const serviceDuration = route.params?.serviceDuration;
  const businessOwnerId = route.params?.userId;
  const selectedServiceNames = route.params?.selectedServiceNames;

  const handleServiceProviderSelect = (provider) => {
    // Clear the previous selections
    setSelectedDay(null);
    setSelectedStartTime(null);
    setSelectedEndTime(null);
    setSelectedTimeSlot(null);

    // Set the new selected service provider
    setSelectedServiceProvider(provider);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  useEffect(() => {
    fetch(`${API_URL}/users/TMugCo4XGRQa8kmXEXJejTlSWUh1/serviceProviders`)
      .then((response) => response.json())
      .then((data) => {
        setServiceProviders(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const period = hours < 12 ? "AM" : "PM";
    return `${hours % 12}:${minutes} ${period}`;
  };

  const today = moment().format("dddd");
  const todayIndex = weekDays.indexOf(today);
  const filteredWeekDays = weekDays
    .slice(todayIndex)
    .concat(weekDays.slice(0, todayIndex));

  const calculateTimeSlots = () => {
    if (selectedStartTime && selectedEndTime && serviceDuration) {
      const startTime = moment(selectedStartTime, "HH:mm");
      const endTime = moment(selectedEndTime, "HH:mm");

      const timeSlots = [];
      let currentTime = startTime.clone();

      while (currentTime.isBefore(endTime)) {
        timeSlots.push(currentTime.format("HH:mm A"));
        currentTime.add(serviceDuration, "minutes");
      }

      return timeSlots;
    }
    return [];
  };

  const timeSlots = calculateTimeSlots();

  const numCols = 4;
  const numRows = Math.ceil(timeSlots.length / numCols);

  const timeSlotRows = [];
  for (let row = 0; row < numRows; row++) {
    const rowStart = row * numCols;
    const rowEnd = Math.min(rowStart + numCols, timeSlots.length);
    timeSlotRows.push(timeSlots.slice(rowStart, rowEnd));
  }
  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedStartTime(selectedServiceProvider.workingHours[day].start);
    setSelectedEndTime(selectedServiceProvider.workingHours[day].end);
  };
  const handleBooking = () => {
    // Check if all required data is available
    if (
      businessOwnerId &&
      selectedServiceProvider &&
      selectedDay &&
      selectedTimeSlot
    ) {
      // Define the booking data
      const bookingData = {
        businessOwnerId,
        serviceProviderId: selectedServiceProvider.serviceProviderId,
        selectedDate: selectedDay, // Replace with the actual date selection logic
        services: selectedServiceNames,
        imageUrl: selectedServiceProvider.imageUrl,
        serviceProviderName: selectedServiceProvider.name,
      };

      // Make a POST request to your Express server's API
      fetch(`${API_URL}/setBooking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the server (e.g., success or error)
          console.log("Booking response:", data);

          // Optionally, you can add code to navigate to a confirmation screen or perform other actions after booking.
        })
        .catch((error) => {
          console.error("Error making the booking:", error);
          // Handle the error, e.g., show an error message to the user.
        });
    } else {
      // Handle the case where required data is missing and show an error message to the user.
      console.error("Missing required data for booking");
      // Optionally, you can display an error message to the user.
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Select Specialist</Text>

        <FlatList
          data={serviceProviders}
          keyExtractor={(item) => item.serviceProviderId}
          horizontal={true}
          renderItem={({ item }) => (
            <View
              style={[
                styles.serviceProviderContainer,
                styles.serviceProviderItem,
                selectedServiceProvider === item &&
                  styles.selectedServiceProviderItem,
              ]}
            >
              <TouchableOpacity
                onPress={() => handleServiceProviderSelect(item)}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.serviceProviderImage}
                />
                <Text
                  style={[
                    styles.serviceProviderName,
                    selectedServiceProvider === item && styles.selectedDayText,
                  ]}
                >
                  {" "}
                  {item.name}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {selectedServiceProvider && (
          <View style={styles.workingHoursContainer}>
            <Text style={styles.sectionTitle}>Working Hours</Text>
            <ScrollView horizontal={true}>
              {filteredWeekDays.map((day, index) => {
                // Calculate the date for this day of the week
                const currentDate = moment().add(index, "days");
                const isToday = currentDate.isSame(moment(), "day"); // Check if it's today

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayColumn,
                      !selectedServiceProvider.workingHours[day].isEnabled && {
                        backgroundColor: "#e0e0e0",
                      },
                      selectedDay === day && styles.highlighted,
                    ]}
                    onPress={() => handleDaySelect(day)}
                  >
                    <View style={styles.dayInfoContainer}>
                      {isToday ? (
                        <Text
                          style={[
                            styles.todayText,
                            selectedDay === day && {
                              color: "white",
                            },
                          ]}
                        >
                          Today
                        </Text>
                      ) : (
                        <Text
                          style={[
                            styles.dayText,
                            selectedDay === day && styles.selectedDayText,
                          ]}
                        >
                          {day}
                        </Text>
                      )}
                      {/* Add conditional styling for day of the month circle and text */}
                      <View
                        style={[
                          styles.dayOfMonthCircle,
                          selectedDay === day && {
                            backgroundColor: "white",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayOfMonthText,
                            selectedDay === day && {
                              color: COLORS.primary,
                            },
                          ]}
                        >
                          {currentDate.date()}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.timeSlotsContainer}>
          <Text style={styles.sectionTitle}>Available Slot</Text>

          {timeSlotRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.timeSlotsRow}>
              {row.map((timeSlot, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.timeSlotItem,
                    selectedTimeSlot === timeSlot && styles.selectedTimeSlot,
                  ]}
                  onPress={() => handleTimeSlotSelect(timeSlot)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTimeSlot === timeSlot &&
                        styles.selectedTimeSlotText,
                    ]}
                  >
                    {timeSlot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      {selectedServiceProvider && selectedDay && selectedTimeSlot && (
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={handleBooking} // Call the handleBooking function when the button is pressed
        >
          <Text style={styles.bookNowButtonText}>Book Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  serviceProviderContainer: {
    marginRight: 10,
    alignItems: "center", // Center the content horizontally
    elevation: 2, // Add a subtle shadow effect
    backgroundColor: COLORS.white, // Add a background color if needed
    borderRadius: 10, // Customize border radius
    padding: 10, // Add padding to the group
  },
  serviceProviderItem: {
    alignItems: "center", // Center the content horizontally
  },
  serviceProviderImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10, // Add some margin for spacing
  },
  serviceProviderName: {
    textAlign: "center", // Center the text horizontally
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  serviceProviderItem: {
    width: 120,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  serviceProviderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  serviceProviderName: {
    marginTop: 8,
    fontWeight: "bold",
  },
  workingHoursContainer: {
    marginTop: 20,
    elevation: 2, // Add a subtle shadow effect
    backgroundColor: COLORS.white, // Add a background color if needed
    borderRadius: 10, // Customize border radius
    padding: 10, // Add padding to the group
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
  },
  dayColumn: {
    marginRight: 20,
    padding: 10,
    backgroundColor: "#e0e0e0",

    borderWidth: 1,
    borderColor: "gray",
  },

  selectedDayColumn: {
    backgroundColor: "lightblue", // Change the background color when selected
  },

  dayText: {
    fontWeight: "bold",
    marginBottom: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  selectedDay: {
    fontSize: 16,
    marginTop: 10,
  },
  timeRange: {
    fontSize: 16,
  },
  timeSlotsContainer: {
    marginTop: 20,

    elevation: 2, // Add a subtle shadow effect
    backgroundColor: COLORS.white, // Add a background color if needed
    borderRadius: 10, // Customize border radius
    padding: 10, // Add padding to the group
  },
  timeSlotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeSlotItem: {
    flex: 1,
    padding: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedTimeSlot: {
    backgroundColor: COLORS.primary,
  },
  bookNowButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bookNowButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceProviderItem: {
    marginRight: 10,
  },
  serviceProviderImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  serviceProviderName: {
    marginTop: 8,
    fontWeight: "bold",
    textAlign: "center",
  },

  dayColumn: {
    marginRight: 20,
    padding: 10,
    borderRadius: 8,
  },
  // Define the highlight style
  highlighted: {
    backgroundColor: COLORS.primary, // Customize the highlight color
  },
  selectedServiceProviderItem: {
    backgroundColor: COLORS.primary, // Change the background color when selected
  },
  selectedTimeSlotText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "white", // Set text color to white for selected time slot
  },
  selectedDayText: {
    fontWeight: "bold",
    marginBottom: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "white", // Set text color to white for selected day
  },
  dayOfMonthCircle: {
    width: 25, // Adjust the size of the circle as needed
    height: 25, // Adjust the size of the circle as needed
    borderRadius: 12, // Make sure it's half of the width and height to create a circle
    backgroundColor: COLORS.primary, // Change the background color as needed
    alignItems: "center", // Center the text horizontally
    justifyContent: "center", // Center the text vertically
  },

  dayOfMonthText: {
    color: "white", // Set the text color to white
    fontSize: 16, // Adjust the font size as needed
  },

  dayInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center horizontally
  },
  todayText: {
    color: COLORS.primary,
    fontSize: 19, // Adjust the font size as needed
    fontWeight: "bold", // Adjust the weight as needed
    textAlign: "center", // Center the text horizontally
    borderRadius: 8, // Adjust the border radius as needed
    paddingTop: 6,
    paddingBottom: 10, // Adjust the padding as needed
  },
});

export default ServiceProviderList;
