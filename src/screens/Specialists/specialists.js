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
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";

import moment from "moment";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "../../components/apiConfig";
import COLORS from "../../consts/colors";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
const ServiceProviderList = () => {
  const userId = useSelector((state) => state.user.userId);

  const [serviceProviders, setServiceProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const navigation = useNavigation();
  const [bookingData, setBookingData] = useState({
    businessOwnerId: null,
    serviceProviderId: null,
    selectedDate: null,
    selectedCalendar: null,
    services: [],
    selectedServiceProviderImage: null,
    selectedServiceProviderName: null,
    totalPrice: 0,
    selectedTimeSlot: null,
    businessName: null,
  });

  const route = useRoute();

  const serviceDuration = route.params?.serviceDuration;
  const businessOwnerId = route.params?.userId;
  const selectedServiceNames = route.params?.selectedServiceNames;
  const totalPrice = route.params?.totalPrice;
  const businessName = route.params?.businessName;

  console.log(businessOwnerId);
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
    fetch(`${API_URL}/users/${businessOwnerId}/serviceProviders`)
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
    console.log(`User selected day: ${day}`);

    // Format the date as "DD/MM/YYYY" and update the selectedCalendar state
    const currentDate = moment().add(filteredWeekDays.indexOf(day), "days");
    const formattedDate = currentDate.format("DD/MM/YYYY");

    setSelectedCalendar(formattedDate);
  };

  // ...

  useEffect(() => {
    console.log("selected calendar is", selectedCalendar);
  }, [selectedCalendar]);
  const handleBooking = () => {
    // Check if all required data is available
    if (
      businessOwnerId &&
      selectedServiceProvider &&
      selectedDay &&
      selectedTimeSlot
    ) {
      const dayOfMonth = moment()
        .add(filteredWeekDays.indexOf(selectedDay), "days")
        .date();

      // Create a formatted date string in the "dd/mm/yy" format

      console.log("selected calendar is", selectedCalendar);
      // Update the bookingData state
      setBookingData({
        businessOwnerId,
        serviceProviderId: selectedServiceProvider.serviceProviderId,
        selectedDate: selectedDay,
        selectedCalendar, // Include selectedCalendar
        services: selectedServiceNames,
        selectedServiceProviderImage: selectedServiceProvider.imageUrl,
        selectedServiceProviderName: selectedServiceProvider.name,
        totalPrice,
        selectedTimeSlot: selectedTimeSlot,
        userId: userId,
        businessName,
      });

      // Create the request data with selectedCalendar
      const requestData = {
        businessOwnerId,
        serviceProviderId: selectedServiceProvider.serviceProviderId,
        selectedDate: selectedDay,
        selectedCalendar, // Include selectedCalendar
        services: selectedServiceNames,
        selectedServiceProviderImage: selectedServiceProvider.imageUrl,
        selectedServiceProviderName: selectedServiceProvider.name,
        totalPrice,
        businessName,
      };
      // Show the confirmation modal
      setIsConfirmationModalVisible(true);
    } else {
      // Handle the case where required data is missing
      console.error("Missing required data for booking");
      // Optionally, you can display an error message to the user.
    }
  };

  const handleConfirmation = () => {
    // Perform any actions you want when the user confirms the booking.
    // For example, you can navigate to a confirmation screen or display a success message.
    console.log("time slot is", selectedTimeSlot);
    // Make the API request to submit the booking data
    if (bookingData) {
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
          console.log("Booking response:", bookingData);
          // Optionally, you can navigate to a confirmation screen or display a success message.
          navigation.navigate("Congratulations");
        })
        .catch((error) => {
          console.error("Error making the booking:", error);
          // Handle the error, e.g., show an error message to the user.
        });

      // Close the confirmation modal
      setIsConfirmationModalVisible(false);
    }
  };
  const closeModal = () => {
    setIsConfirmationModalVisible(false);
  };
  return (
    <View style={{ flex: 1 }}>
      <Modal
        backdropOpacity={0.5}
        backdropColor={"rgba(0, 0, 0, 0.8)"}
        isVisible={isConfirmationModalVisible}
        animationType="slide"
        transparent={true}
        onBackdropPress={closeModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropTransitionOutTiming={0}
        backdropTransitionInTiming={0}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButtonContainer}
              onPress={() => setIsConfirmationModalVisible(false)}
              onPressIn={() => setIsPressed(true)}
              onPressOut={() => setIsPressed(false)}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <View
                style={[
                  styles.closeButton,
                  isPressed && { backgroundColor: "rgba(0, 0, 0, 0.3)" },
                ]}
              >
                <Feather name="x" size={24} color="white" />
              </View>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Booking Confirmation</Text>

            <View style={styles.imangeNameContainer}>
              <Image
                source={{ uri: bookingData.selectedServiceProviderImage }}
                style={styles.providerImage}
              />
              <Text style={styles.serviceProviderName}>
                {bookingData.selectedServiceProviderName}
              </Text>
            </View>
            <View style={styles.bookingDataContainer}>
              <View style={styles.bookingDataItem}>
                <Text style={styles.bookingDataLabel}>Date:</Text>
                <Text style={styles.bookingDataValue}>
                  {selectedDay} {bookingData.selectedCalendar}
                </Text>
              </View>

              <View style={styles.bookingDataItem}>
                <Text style={styles.bookingDataLabel}>Services:</Text>
                <Text style={styles.bookingDataValue}>
                  {selectedServiceNames.join(", ")}
                </Text>
              </View>
              <View style={styles.bookingDataItem}>
                <Text style={styles.bookingDataLabel}>Total Price:</Text>
                <Text style={styles.bookingDataValue}>
                  {bookingData.totalPrice.toFixed(2)} Birr
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmation}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
            <Text style={styles.sectionTitle}>Select a day</Text>
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
    marginTop: 8,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20, // Increase the font size
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
    marginBottom: 18,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,

    width: 300, // Adjust the width as needed
    position: "relative", // Add relative positioning
  },
  modalTitle: {
    fontSize: 20, // Increase the font size for the title
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  imangeNameContainer: {
    alignItems: "center",
  },
  providerImage: {
    width: 150, // Increase the image size
    height: 150, // Increase the image size
    borderRadius: 15, // Make it a perfect circle
    marginTop: 10,
    marginBottom: 10,
  },
  bookingDataContainer: {
    marginTop: 20,
  },
  bookingDataItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bookingDataLabel: {
    fontWeight: "bold",
    marginRight: 5,
    fontSize: 16,
  },
  bookingDataValue: {
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButtonContainer: {
    position: "absolute",
    top: 10, // Adjust the top positioning
    right: 10, // Adjust the right positioning
  },
  closeButton: {
    position: "absolute",
    top: 10, // Move it to the top
    right: 10, // Move it to the right
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 20, // Make it a circle
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ServiceProviderList;
