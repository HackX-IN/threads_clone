import { View, Text, Image, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "../Hooks/UserContect";
const User = ({ index, user }) => {
  const { userId } = useContext(UserContext);
  const [reqSent, setReqsent] = useState(false);
  const sentFollow = async (currentUserId, selectedUserId) => {
    try {
      const resp = await fetch(`http://192.168.1.7:5000/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });
      if (resp.ok) {
        setReqsent(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const unFollow = async (currentUserId, selectedUserId) => {
    try {
      const resp = await fetch(`http://192.168.1.7:5000/unfollow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });
      if (resp.ok) {
        setReqsent(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(user);
  return (
    <View
      className="flex-row items-center justify-between p-3 mt-4"
      key={index}
    >
      <View className="flex-row items-center gap-3">
        <Image
          source={{
            uri: "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png",
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
        />
        <Text className="font-bold text-lg text-center"> {user?.name}</Text>
      </View>
      {reqSent || user?.followers?.includes(userId) ? (
        <Pressable
          className="border-2 border-gray-300 items-center px-4 py-1.5"
          onPress={() => unFollow(userId, user._id)}
        >
          <Text className="text-md font-semibold ">Following</Text>
        </Pressable>
      ) : (
        <Pressable
          className="border-2 border-gray-300 items-center px-4 py-1.5"
          onPress={() => sentFollow(userId, user?._id)}
        >
          <Text className="text-md font-semibold ">Follow</Text>
        </Pressable>
      )}
    </View>
  );
};

export default User;
