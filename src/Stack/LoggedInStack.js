import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
// Import your screen components
import HomeScreen from "../Home";
import BarbershopScreen from "../screens/barbershops";
import UserDetailsScreen from "../screens/DetailScreen.js/UserDetailsScreen";
import EmployeeList from "../screens/Specialists/specialists";
import Congratulations from "../screens/Congratulations/congratulations";
import Confirmation from "../screens/Confirmation/confirmation";
import LoginByPhoneNumber from "../screens/SignIn/SignIn";
import RegisterbyPhoneNumber from "../screens/SignUp/RegisterbyPhoneNumber";
import { setUserId } from "../redux/store";
import { connect } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingComponent from "../components/LoadingComponent";
import Appointments from "../screens/Appointments/Appointments";
import SettingScreen from "../screens/Setting/Setting";

const Stack = createNativeStackNavigator();
// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

const MainTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Map each route name to a corresponding icon
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Appointments":
              iconName = "event";
              break;
            case "Favorites":
              iconName = "favorite";
              break;
            case "Setting":
              iconName = "settings";
              break;
            default:
              iconName = "home";
              break;
          }

          // Render the icon using the Icon component
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarItemStyle: { justifyContent: "center", alignItems: "center" },
        tabBarActiveTintColor: "#069BA4",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Appointments" component={Appointments} />

      <Tab.Screen name="Favorites" component={BarbershopScreen} />

      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
};

const LoggedInStack = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  const checkUserLoggedIn = async () => {
    try {
      // Check if the user is logged in by retrieving the user ID from AsyncStorage.
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        // Dispatch the user ID to the Redux store if it exists.
        setUserId(userId);
      }
    } catch (error) {
      console.error("Error checking user login:", error);
    } finally {
      setLoading(false); // Set loading to false when the check is complete
    }
    if (loading) {
      // You can return a loading indicator or a blank screen while checking the user login.
      return <LoadingComponent />; // Replace LoadingComponent with your actual loading component.
    }
  };
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Main" component={MainTab} />
      <Stack.Screen name="barbershop" component={BarbershopScreen} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="EmployeeList" component={EmployeeList} />
      <Stack.Screen name="Congratulations" component={Congratulations} />
      <Stack.Screen name="confirmation" component={Confirmation} />
      <Stack.Screen name="LoginByPhoneNumber" component={LoginByPhoneNumber} />
      <Stack.Screen
        name="RegisterbyPhoneNumber"
        component={RegisterbyPhoneNumber}
      />
    </Stack.Navigator>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    setUserId: (myuserid) => dispatch(setUserId(myuserid)), // Dispatch the action
  };
};

export default connect(null, mapDispatchToProps)(LoggedInStack);
