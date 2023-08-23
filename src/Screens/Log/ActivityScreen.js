import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { UserContext } from "../../Hooks/UserContect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_Decode from "jwt-decode";
import axios from "axios";
import User from "../../Components/User";

const ActivityScreen = () => {
  const [selectedBtn, setSelectedBtn] = useState("people");
  const [users, setUsers] = useState([]); // Initialize users as an empty array
  const { setUserId } = useContext(UserContext);

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const decodedToken = jwt_Decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
        const response = await axios.get(
          `http://192.168.1.7:5000/user/${userId}`
        );
        console.log(response.data.users);
        setUsers(response.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    GetUsers();
  }, []);

  const handleBtnClick = (btnName) => {
    setSelectedBtn(btnName);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ marginHorizontal: 5, marginTop: 3 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Activity</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 15,
            gap: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => handleBtnClick("people")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                backgroundColor: "#fff",
                borderWidth: 0.6,
              },
              selectedBtn === "people" ? { backgroundColor: "black" } : null,
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedBtn === "people" ? { color: "white" } : null,
              ]}
            >
              People
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleBtnClick("all")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                backgroundColor: "#fff",
                borderWidth: 0.6,
              },
              selectedBtn === "all" ? { backgroundColor: "black" } : null,
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedBtn === "all" ? { color: "white" } : null,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleBtnClick("request")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                backgroundColor: "#fff",
                borderWidth: 0.6,
              },
              selectedBtn === "request" ? { backgroundColor: "black" } : null,
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedBtn === "request" ? { color: "white" } : null,
              ]}
            >
              Requests
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          {selectedBtn === "people" && users.length > 0
            ? users.map((user, index) => {
                return <User user={user} key={index} />;
              })
            : null}
        </View>
      </View>
    </ScrollView>
  );
};

export default ActivityScreen;
