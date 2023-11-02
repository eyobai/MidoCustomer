import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

const DistanceCalculator = ({ serviceProviderLocation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const calculateDistance = (userLocation, serviceProviderLocation) => {
    if (!userLocation || !serviceProviderLocation) {
      return "N/A";
    }

    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    // Convert degrees to radians
    const userLatRad = userLocation.latitude * (Math.PI / 180);
    const userLonRad = userLocation.longitude * (Math.PI / 180);
    const serviceProviderLatRad =
      serviceProviderLocation.latitude * (Math.PI / 180);
    const serviceProviderLonRad =
      serviceProviderLocation.longitude * (Math.PI / 180);

    // Haversine formula
    const dLat = serviceProviderLatRad - userLatRad;
    const dLon = serviceProviderLonRad - userLonRad;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLatRad) *
        Math.cos(serviceProviderLatRad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;

    if (!isNaN(distance)) {
      return distance.toFixed(2);
    } else {
      console.error(
        "Distance calculation failed. Check user and serviceProviderLocation data."
      );
      return "N/A";
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Location permission denied");
          setIsLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting user location:", error);
        setIsLoading(false);
      }
    };

    getLocation();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="small" />;
  }

  const distance = calculateDistance(userLocation, serviceProviderLocation);

  return <Text>{distance}</Text>;
};

export default DistanceCalculator;
