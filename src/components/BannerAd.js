import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";

const BannerAd = () => {
  const bannerImageUrl =
    "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/hair-salon-summer-promo-banner-design-template-528ff4abd3f1db406d83eab50d1f7994_screen.jpg?ts=1561539295";
  return (
    <TouchableOpacity
      style={styles.adContainer}
      onPress={() => {
        // Handle ad click action if needed
      }}
    >
      <Image
        source={{ uri: bannerImageUrl }}
        style={styles.adImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    marginTop: 20,
    padding: 10,
    alignItems: "center",
  },
  adImage: {
    width: "100%",
    height: 180, // You can adjust the height as needed
    borderRadius: 5, // Optional: Add border radius for rounded corners
  },
});
export default BannerAd;
