import {
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import { UserContext } from "../../Hooks/UserContect";

const PostScreen = () => {
  const { userId, setUserId } = useContext(UserContext);
  const [content, setContent] = useState("");
  const AddPost = async () => {
    const postData = { userId };
    if (content) {
      postData.content = content;
    }
    try {
      await axios
        .post("http://192.168.1.7:5000/create-post", postData)
        .then((resp) => {
          console.log(resp.data);
          setContent("");
        })
        .catch((err) => {
          console.log("error creating Post", err);
        });
    } catch (error) {
      console.log("error creating Post", error);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className=" flex-row items-center gap-3 mx-3 mt-3">
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
        <Text className="text-md text-center font-semibold">Inamul</Text>
      </View>
      <TextInput
        placeholder="Write the content..."
        numberOfLines={4}
        onChangeText={(text) => setContent(text)}
        value={content}
        className="p-3 w-[full] rounded-md mx-3 text-black  placeholder: text-md font-semibold"
      />
      <Pressable
        className="flex justify-center items-center  "
        onPress={() => AddPost()}
        disabled={!content}
      >
        <Text
          className="font-semibold text-center text-md"
          style={{ color: !content ? "gray" : "#49c5eb" }}
        >
          Share Post
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default PostScreen;
