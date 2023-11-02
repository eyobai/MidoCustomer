import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./src/Stack/MainStack";
import { Provider } from "react-redux";
import userIdReducer from "./src/redux/store";

import { combineReducers, createStore } from "redux";

import { LogBox, StatusBar } from "react-native";
import COLORS from "./src/consts/colors";
import { useState } from "react";
import { useEffect } from "react";
import LoggedInStack from "./src/Stack/LoggedInStack";
import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreAllLogs();

const rootReducer = combineReducers({
  user: userIdReducer,
});
const rootStore = createStore(rootReducer);
const App = () => {
  const [initialRoute, setInitialRoute] = useState();

  useEffect(() => {
    checkUserLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        setInitialRoute("Main");
      } else {
        setInitialRoute("SignIn");
      }
    });
  }, []);
  const checkUserLoggedIn = async () => {
    // Check if the user is logged in, e.g., by checking if a user ID is in AsyncStorage.
    const userId = await AsyncStorage.getItem("userId");
    return !!userId; // Return true if a user ID is found, indicating the user is logged in.
  };
  return (
    <Provider store={rootStore}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.orange}
        translucent={true}
      />
      <NavigationContainer>
        {initialRoute === "SignIn" ? <MainStack /> : <LoggedInStack />}
      </NavigationContainer>
    </Provider>
  );
};

export default App;
