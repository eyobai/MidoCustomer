import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import moment from "moment";
import Date from "./Date";

const Calendar = ({ onSelectDate, selected }) => {
  const [dates, setDates] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentMonth, setCurrentMonth] = useState();

  const getCurrentMonth = () => {
    const month = moment(dates[0])
      .add(scrollPosition / 60, "days")
      .format("MMMM");
    setCurrentMonth(month);
  };

  // get the dates from today to 10 days from now, format them as strings and store them in state
  const getDates = () => {
    const _dates = [];
    for (let i = 0; i < 10; i++) {
      const date = moment().add(i, "days");
      _dates.push(date);
    }
    setDates(_dates);
  };

  useEffect(() => {
    getDates();
    getCurrentMonth();
  }, [scrollPosition]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.title}>{currentMonth}</Text>
        </View>
        <View style={styles.dateSection}>
          <View style={styles.scroll}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              // onScroll is a native event that returns the number of pixels the user has scrolled
              scrollEventThrottle={16}
              onScroll={(e) => setScrollPosition(e.nativeEvent.contentOffset.x)}
            >
              {dates.map((date, index) => (
                <Date
                  key={index}
                  date={date}
                  onSelectDate={onSelectDate}
                  selected={selected}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e6ffe6", // Replace this with your desired background color
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dateSection: {
    width: "100%",
    padding: 20,
  },
  scroll: {
    height: 150,
  },
});
