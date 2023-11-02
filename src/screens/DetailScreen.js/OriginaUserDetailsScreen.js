import React, { useState, useEffect } from "react";
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
import { collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../../firebase.config";
import COLORS from "../../consts/colors";
const app = initializeApp(firebaseConfig);
const firebaseFirestore = getFirestore(app);

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
  menuContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Added flex property
    justifyContent: "space-between", // Added justifyContent property
  },
  serviceName: {
    marginRight: 8,
    fontWeight: "bold",
  },
  servicePrice: {
    marginRight: 8,
  },
  bookButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  bookButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  serviceDuration: {
    marginTop: 8,
  },
});

const UserDetailsScreen = ({ route }) => {
  const { userData } = route.params;
  const [selectedMenuItem, setSelectedMenuItem] = useState("Services");
  const [serviceData, setServiceData] = useState([]);
  const navigation = useNavigation();
  console.log(userData.userId);
  useEffect(() => {
    const fetchServiceData = async () => {
      const q = query(
        collection(firebaseFirestore, "services"),
        where("userId", "==", userData.userId)
      );
      try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const services = querySnapshot.docs.map((doc) => doc.data());
          setServiceData(services);
        }
      } catch (error) {
        console.log("Error fetching service data:", error);
      }
    };

    fetchServiceData();
  }, [userData.userId]);
  const handleBookButtonPress = (service) => {
    console.log("Selected Service:", service.name);
    console.log("Price:", service.price);
    console.log("Duration:", service.duration);
    console.log("id", service.userId);

    // Navigate to EmployeeList screen
    navigation.navigate("EmployeeList", {
      userId: userData.userId,
      serviceDetails: service,
    });
  };

  const handleMenuItemPress = (item) => {
    setSelectedMenuItem(item);
  };

  const menuItems = ["Services", "Profile", "Customer Review", "Contact"];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.userDetails}>
        <Image
          source={{ uri: userData.imageUrl }}
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
        <Text style={styles.location}>{userData.location}</Text>
      </View>

      <View style={styles.menuContainer}>
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
      </View>

      <View style={styles.menuLine} />

      {selectedMenuItem === "Services" && (
        <View style={styles.container}>
          {serviceData.map((service, index) => (
            <View key={index} style={styles.serviceContainer}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>price: {service.price}</Text>
              </View>

              <Text style={styles.serviceDuration}>
                Duration: {service.duration}
              </Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookButtonPress(service)}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default UserDetailsScreen;
