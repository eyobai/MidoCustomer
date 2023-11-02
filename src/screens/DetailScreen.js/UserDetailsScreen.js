import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "react-native-vector-icons";
import COLORS from "../../consts/colors";
import DistanceCalculator from "../../components/DistanceCalculator";

const UserDetailsScreen = ({ route }) => {
  const { userData } = route.params;
  const [selectedMenuItem, setSelectedMenuItem] = useState("Services");
  const [selectedServices, setSelectedServices] = useState([]);
  const navigation = useNavigation();

  const handleServiceSelection = (service) => {
    const isSelected = selectedServices.includes(service);

    if (isSelected) {
      setSelectedServices(selectedServices.filter((item) => item !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleBookButtonPress = () => {
    if (selectedServices.length > 0) {
      const selectedServiceNames = selectedServices.map(
        (service) => service.name
      );
      const selectedServicePrices = selectedServices.map((service) =>
        parseFloat(service.price)
      ); // Convert to numbers
      const selectedServiceDurations = selectedServices.map((service) =>
        parseFloat(service.duration)
      ); // Convert to numbers

      // Calculate the total price by summing selected prices
      const totalPrice = selectedServicePrices.reduce(
        (acc, price) => acc + price,
        0
      );

      // Calculate the total duration by summing selected durations
      const totalDuration = selectedServiceDurations.reduce(
        (acc, duration) => acc + duration,
        0
      );

      console.log("Selected Service Names:", selectedServiceNames);
      console.log("Total Price:", totalPrice);
      console.log("Total Duration:", totalDuration);

      navigation.navigate("EmployeeList", {
        userId: userData.id,
        serviceDuration: totalDuration,
        selectedServiceNames: selectedServiceNames,
        businessName: userData.businessName,
        imageUrl: userData.imageUrl,
        totalPrice: totalPrice,
      });
      // Now, you have the data for the selected services with correctly added prices and durations
      // You can use or display this data as needed.
    }
  };

  const handleMenuItemPress = (item) => {
    setSelectedMenuItem(item);
  };

  const menuItems = ["Services", "Portfolio", "Customer Review", "Information"];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.userDetails}>
        <Image
          source={{ uri: userData.businessPicture }}
          style={styles.userImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.businessInfoContainer}>
        <Text style={styles.businessName}>{userData.businessName}</Text>
        <View style={styles.phoneContainer}>
          <MaterialIcons
            name="phone"
            size={18}
            color={COLORS.primary}
            style={styles.phoneIcon}
          />
          <Text style={styles.phoneText}>{userData.phone}</Text>
        </View>
      </View>
      <View style={styles.locationContainer}>
        <MaterialIcons
          name="location-on"
          size={18}
          color={COLORS.primary}
          style={styles.locationIcon}
        />
        <DistanceCalculator
          serviceProviderLocation={{
            latitude: userData.location._latitude,
            longitude: userData.location._longitude,
          }}
        />
        {/* <Text style={styles.location}>{userData.location}</Text> */}
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.menuScrollView}
        showsHorizontalScrollIndicator={false}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              selectedMenuItem === item && styles.activeMenuItem,
            ]}
            onPress={() => handleMenuItemPress(item)}
          >
            <Text
              style={[
                styles.menuItemText,
                selectedMenuItem === item && styles.activeMenuItemText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.menuLine} />

      {selectedMenuItem === "Services" && userData.services ? (
        <View style={styles.container}>
          {userData.services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={styles.serviceContainer}
              onPress={() => handleServiceSelection(service)}
            >
              <View style={styles.serviceInfo}>
                <View style={styles.serviceNameContainer}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                </View>
                <View style={styles.servicePriceContainer}>
                  <Text style={styles.servicePrice}>{service.price} Birr</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      selectedServices.includes(service) &&
                        styles.selectedRadioButton,
                    ]}
                    onPress={() => handleServiceSelection(service)}
                  >
                    {selectedServices.includes(service) && (
                      <MaterialIcons
                        name="check"
                        style={styles.radioButtonIcon}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text>No services available</Text>
      )}

      <TouchableOpacity
        style={styles.bottomBookButton}
        onPress={handleBookButtonPress}
      >
        <Text style={styles.bottomBookButtonText}>Book</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  userImage: {
    width: windowWidth,
    aspectRatio: 16 / 9,
    borderRadius: 8,
    marginBottom: 8,
  },
  userDetails: {
    alignItems: "center",
  },
  businessInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  businessName: {
    fontSize: 18,
    textAlign: "left",
    fontWeight: "bold",
    marginRight: 8,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneIcon: {
    marginRight: 4,
  },
  phoneText: {
    fontSize: 18,
    color: COLORS.primary,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationIcon: {
    marginRight: 4,
  },
  location: {
    fontSize: 18,
    textAlign: "left",
    color: COLORS.primary,
  },
  menuScrollView: {
    paddingHorizontal: 8,
    alignItems: "center",
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#ECECEC",
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activeMenuItem: {
    backgroundColor: COLORS.primary,
  },
  activeMenuItemText: {
    color: "white",
  },
  menuLine: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 16,
  },
  serviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 10,
    // Add a 1-pixel border at the bottom
    borderBottomColor: "gray", // Set the color of the border
    elevation: 2, // Add a subtle shadow effect
    backgroundColor: "#F4F2EE", // Add a background color if needed
    borderRadius: 10, // Customize border radius
    padding: 10, // Add padding to the group
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  serviceName: {
    fontWeight: "bold",
    fontSize: 20,
  },
  servicePrice: {
    fontSize: 20,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadioButton: {
    backgroundColor: COLORS.primary,
  },
  radioButtonIcon: {
    fontSize: 16,
    color: "white",
  },
  bottomBookButton: {
    marginTop: 16,

    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: COLORS.primary,

    padding: 16,
    alignItems: "center",
  },
  bottomBookButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
});

export default UserDetailsScreen;
