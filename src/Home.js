import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  FlatList,
} from "react-native";
import axios from "axios"; // Import Axios
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import COLORS from "./consts/colors";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BannerAd from "./components/BannerAd";
import { API_URL } from "./components/apiConfig";
import { MenuItems } from "./components/MenuContainer";
import DistanceCalculator from "./components/DistanceCalculator";
const { width } = Dimensions.get("screen");
const cardWidth = width / 1.8;

const HomeScreen = () => {
  const navigation = useNavigation();
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/users`) // Include the protocol (http://)
      .then((response) => {
        // Filter users with recommended=true
        const recommendedUsers = response.data.filter(
          (user) => user.recommended === true
        );
        const featuredusers = response.data.filter(
          (user) => user.featured == true
        );
        setRecommendedUsers(recommendedUsers);
        setFeaturedUsers(featuredusers);
        setLoading(false); // Set loading to false in case of an error
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);

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

  const renderUserItem = ({ item, type }) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={1}
      style={styles.userItems}
      onPress={() => navigation.navigate("DetailsScreen", item)}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: item.businessPicture }}
          style={styles.cardImage}
        />
        <View style={styles.cardDetails}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                {item.businessName}
              </Text>
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
            <Icon name="bookmark-border" size={26} color={COLORS.primary} />
          </View>
          {/* <StarRating
            disabled={true}
            maxStars={5}
            rating={item.rating}
            starSize={20}
            fullStarColor={COLORS.orange}
            emptyStarColor={COLORS.grey}
          /> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLoadingIndicator = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.orange} />
      <View>
        <View>
          <View style={styles.header}>
            <View style={{ paddingBottom: 15 }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: COLORS.black,
                }}
              >
                Discover
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: COLORS.black,
                  }}
                >
                  Book{" "}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: COLORS.primary,
                  }}
                >
                  What You Love
                </Text>
              </View>
            </View>
            <Icon name="person-outline" size={38} color={COLORS.black} />
          </View>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={30} style={{ marginLeft: 20 }} />
            <TextInput
              placeholder="Search"
              style={{ fontSize: 20, paddingLeft: 10 }}
            />
          </View>
          <BannerAd />
          <View style={styles.menuGroup}>
            <Text style={styles.topServicesText}>Top Services</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.menuContainer}
            >
              {MenuItems.map((MenuItem) => renderMenuItem(MenuItem))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.featuredGroup}>
          <Text style={styles.featuredText}>Featured</Text>
          {loading ? (
            renderLoadingIndicator()
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={featuredUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                renderUserItem({ item, type: "featured" })
              }
              ListEmptyComponent={() => (
                <Text>No featured users available.</Text>
              )} // Display this when there are no featured users
            />
          )}
        </View>
        <View style={styles.recommendedGroup}>
          <Text style={styles.recommendedText}>Recommended</Text>
          {loading ? (
            renderLoadingIndicator()
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={recommendedUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                renderUserItem({ item, type: "recommended" })
              }
              ListEmptyComponent={() => (
                <Text>No recommended users available.</Text>
              )} // Display this when there are no recommended users
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    alignItems: "center",
    marginRight: 30,
  },

  menuIcon: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
  },
  menuText: {
    color: COLORS.black,
    marginTop: 10,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  menuContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  menuGroup: {
    elevation: 2, // Add a subtle shadow effect
    backgroundColor: COLORS.white, // Add a background color if needed
    borderRadius: 10, // Customize border radius
    padding: 10, // Add padding to the group
  },

  topServicesText: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 20,
  },
  featuredGroup: {
    elevation: 2, // Add a subtle shadow effect
    backgroundColor: COLORS.white, // Add a background color if needed
    borderRadius: 10, // Customize border radius
    marginTop: 10,
    padding: 10,
  },
  featuredText: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 20,
  },

  recommendedGroup: {
    elevation: 2, // Add a subtle shadow effect
    backgroundColor: COLORS.white, // Add a background color if needed
    borderRadius: 10, // Customize border radius
    marginTop: 10,
    padding: 10,
    marginBottom: 2,
  },
  recommendedText: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 20,
  },
  card: {
    height: 250,
    width: cardWidth,
    elevation: 0.2,
    backgroundColor: COLORS.white,
    marginRight: 20,
    borderRadius: 10,
  },
  cardImage: {
    height: "65%",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
  },
  cardDetails: {
    padding: 10,
  },
});

export default HomeScreen;
