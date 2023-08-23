import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = async () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(
        "http://192.168.1.7:5000/register",
        user
      );
      console.log(response.data);
      Alert.alert("Register Successful", response.data);
      navigation.navigate("Main");
      setName("");
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
        Register New Account
      </Text>
      <View className="flex justify-center items-center p-2 mt-16 w-[100%]">
        <View className="flex-row w-[90%] p-2 border-2 border-gray-300 rounded-md items-center">
          <Ionicons name="person-outline" size={24} color="gray" />
          <TextInput
            placeholder="Enter your name"
            className=" ml-2  text-gray-500 placeholder:text-black text-md w-full"
            onChangeText={setName}
            value={name}
          />
        </View>
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

        <TouchableOpacity
          className="flex justify-center items-center  bg-black flex-row w-28 mt-12 py-1 rounded-md"
          onPress={handleRegister}
        >
          <Text className="text-white font-bold text-lg text-center">
            Register
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className="flex justify-center items-center  "
        onPress={() => navigation.navigate("Login")}
      >
        <Text className="text-black font-semibold text-center">
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RegisterScreen;
