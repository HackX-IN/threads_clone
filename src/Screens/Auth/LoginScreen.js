import { View, Text, SafeAreaView, Image, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const Checkvalidate = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        navigation.replace("Main");
      }
    };
    Checkvalidate();
  }, []);

  const handleLogin = async () => {
    const user = {
      email,
      password,
    };
    try {
      const response = await axios.post("http://192.168.1.7:5000/login", user);
      console.log(response.data.token);
      AsyncStorage.setItem("token", response.data.token);
      navigation.navigate("Main");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <Image
        source={require("../../assets/images/logo.png")}
        className="w-24 h-24 mt-8 "
        style={{ resizeMode: "contain" }}
      />
      <Text className="text-2xl text-black font-bold mt-5 text-center">
        Login to your Account
      </Text>
      <View className="flex justify-center items-center p-2 mt-16 w-[100%]">
        <View className="flex-row w-[90%] p-2 border-2 border-gray-300 rounded-md items-center mt-5">
          <Ionicons name="mail" size={24} color="gray" />
          <TextInput
            placeholder="Enter your email"
            onChangeText={setEmail}
            value={email}
            className=" ml-2  text-gray-500 placeholder:text-black text-md w-full"
          />
        </View>
        <View className="flex-row w-[90%] p-2 border-2 border-gray-300 rounded-md items-center mt-5">
          <MaterialCommunityIcons
            name="form-textbox-password"
            size={24}
            color="gray"
          />
          <TextInput
            placeholder="Enter your Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            className=" ml-2  text-gray-500 placeholder:text-black text-md w-full"
          />
        </View>
        <View className="flex-row w-[80%] pt-4  rounded-md items-center  justify-between">
          <Text className=" text-black font-semibold" style={{ fontSize: 13 }}>
            Keep me Logged In
          </Text>
          <Text
            className=" text-blue-500 font-semibold"
            style={{ fontSize: 13 }}
          >
            Forget Password
          </Text>
        </View>
        <TouchableOpacity
          className="flex justify-center items-center  bg-black flex-row w-28 mt-12 py-1 rounded-md"
          onPress={handleLogin}
        >
          <Text className="text-white font-bold text-lg text-center">
            Login
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className="flex justify-center items-center  "
        onPress={() => navigation.navigate("Register")}
      >
        <Text className="text-black font-semibold text-center">
          Don't have an account? Sign-up
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;
