import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import axios from "axios"; // Import Axios for making HTTP requests
import { useNavigation } from "@react-navigation/native";
import COLORS from "../consts/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { API_URL } from "../components/apiConfig";
import { MenuItems } from "../components/MenuContainer";
import DistanceCalculator from "../components/DistanceCalculator";
import { useSelector } from "react-redux";

const BarberShopUsers = () => {
  const [barbershopUsers, setBarbershopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Add searchQuery state
  const userId = useSelector((state) => state.user.userId);
  console.log("logged in user is", userId);
  const navigation = useNavigation();

  useEffect(() => {
    fetchBarbershopUsers();
  }, []);

  const fetchBarbershopUsers = async () => {
    try {
      // Make an HTTP GET request to fetch all users from the server
      const response = await axios.get(`${API_URL}/users`);
      const allUsers = response.data;

      // Filter the users to get only 'barbershop' users
      const barbershopUsers = allUsers.filter(
        (user) => user.businesscategories == "Barbershop"
      );

      // Update the state with the filtered 'barbershop' users
      setBarbershopUsers(barbershopUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Barbershop users:", error);
      setLoading(false);
    }
  };

  // ... rest of the code ...

  const filterUsersByLocation = (users, query) => {
    return users.filter(
      (user) =>
        user.location &&
        user.location.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  let filteredBarbershopUsers = barbershopUsers;
  if (searchQuery.trim() !== "") {
    filteredBarbershopUsers = filterUsersByLocation(
      barbershopUsers,
      searchQuery
    );
  }

  if (loading) {
    // Render loading screen here
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }
  const renderMenuItem = (menuItem) => (
    <TouchableOpacity
      key={menuItem.key || menuItem.name}
      style={styles.menuItem}
      onPress={() => {
        if (menuItem.key === "barbershop") {
          navigation.navigate("barbershop");
        }
      }}
    >
      <FontAwesomeIcon
        name={menuItem.icon}
        size={30}
        color={COLORS.white}
        style={styles.menuIcon}
      />
      <Text style={styles.menuText}>{menuItem.name}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      {/** */}
      <View style={{ backgroundColor: COLORS.orange }}>
        <View style={styles.header}>
          <View style={{ paddingBottom: 15 }}></View>
        </View>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={30} style={{ marginLeft: 20 }} />
          <TextInput
            placeholder="Search"
            style={{ fontSize: 20, paddingLeft: 10 }}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.menuContainer}
        >
          {MenuItems.map((MenuItem) => renderMenuItem(MenuItem))}
        </ScrollView>
      </View>
      {/** */}

      <FlatList
        data={filteredBarbershopUsers}
        keyExtractor={(item, index) => {
          return item.userId ? item.userId.toString() : index.toString();
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                console.log("User ID: " + item.id); // Log the user ID
                navigation.navigate("UserDetails", { userData: item });
              }}
            >
              <View style={styles.userContainer}>
                {item.businessPicture ? (
                  <Image
                    source={{ uri: item.businessPicture }}
                    style={styles.userImage}
                  />
                ) : null}
                <View style={styles.userInfoContainer}>
                  <Text style={styles.userName}>Name: {item.businessName}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                      name="location-pin"
                      size={18}
                      style={{ marginLeft: -5 }}
                      color={COLORS.primary}
                    />
                    <DistanceCalculator
                      serviceProviderLocation={{
                        latitude: item.location._latitude,
                        longitude: item.location._longitude,
                      }}
                    />

                    {/* <Text style={{ fontSize: 13 }}>{item.location._latitude}</Text> */}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    alignItems: "center",
    marginRight: 30,
  },
  menuIcon: {
    padding: 15,
    borderRadius: 10,
  },
  menuText: {
    color: COLORS.white,
    marginTop: 10,
    fontWeight: "bold",
  },
  userContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
    borderBottomColor: "gray", // Set the color of the border
    elevation: 2, // Add a subtle shadow effect
    backgroundColor: "#F4F2EE", // Add a background color if needed
    borderRadius: 10, // Customize border radius
    padding: 10, // Add padding to the group
  },
  userImage: {
    width: 340,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  userInfoContainer: {
    padding: 8,
    borderRadius: 8,
    width: "85%",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfo: {
    fontSize: 14,
    color: "#FFF",
  },
  container: {
    flex: 1,

    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInputContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.light,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderColor: "pink",
  },
});

export default BarberShopUsers;
