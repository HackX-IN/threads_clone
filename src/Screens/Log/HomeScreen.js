import React, { useCallback, useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native"; // Import Image component directly from react-native
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_Decode from "jwt-decode";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { UserContext } from "../../Hooks/UserContect";

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const token = await AsyncStorage.getItem("token");
      const User = jwt_Decode(token);
      console.log(User.userId);
      setUserId(User.userId);
    };
    getUser();
    getPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getPosts();
    }, [])
  );

  const getPosts = async () => {
    try {
      const response = await axios.get("http://192.168.1.7:5000/get-posts");
      console.log(response.data);
      setPosts(response.data);
    } catch (error) {
      console.log("error fetching Posts", error);
    }
  };

  const putLike = async (postId) => {
    try {
      const resp = await axios.put(
        `http://192.168.1.7:5000/post/${postId}/${userId}/like`
      );

      const updatedPosts = resp.data;

      const updatedPostList = posts.map(
        (post) => (post._id === updatedPosts._id ? updatedPosts : post) // Corrected mapping logic
      );
      setPosts(updatedPostList);
    } catch (error) {
      console.log("error liking Post", error);
    }
  };
  const unputLike = async (postId) => {
    // Corrected function name to unputLike
    try {
      const resp = await axios.put(
        `http://192.168.1.7:5000/post/${postId}/${userId}/unlike`
      );

      const updatedPosts = resp.data;

      const updatedPostList = posts.map((post) =>
        post._id === updatedPosts._id ? updatedPosts : post
      );
      setPosts(updatedPostList);
    } catch (error) {
      console.log("error unliking Post", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <ScrollView style={styles.scrollView}>
        {posts.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            <View style={styles.postContent}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.profileImage}
                resizeMode="contain"
              />
              <View style={styles.postTextContainer}>
                <Text style={styles.userName}>{post?.user[0]?.name}</Text>
                <Text style={styles.postText}>{post?.content}</Text>
                <View style={styles.iconsContainer}>
                  {post?.likes?.includes(userId) ? (
                    <Ionicons
                      name="heart"
                      size={24}
                      color="red"
                      onPress={() => unputLike(post?._id)}
                    />
                  ) : (
                    <Ionicons
                      name="heart-outline"
                      size={24}
                      color="black"
                      onPress={() => putLike(post?._id)}
                    />
                  )}
                  <Text>{post?.likes?.length}</Text>
                  <Octicons
                    name="comment"
                    size={24}
                    color="black"
                    style={styles.commentIcon}
                  />
                  <Text style={{ marginLeft: 2 }}>{post?.replies?.length}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  scrollView: {
    marginTop: 6,
    paddingHorizontal: 2,
  },
  postContainer: {
    borderTopWidth: 2,
    borderTopColor: "black",
    marginTop: 9,
  },
  postContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  profileImage: {
    width: 40,
    height: 40,
    marginBottom: 4,
    resizeMode: "contain",
  },
  postTextContainer: {
    flex: 1,
    marginLeft: 8,
    marginTop: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#47dc",
  },
  postText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0.5,
    marginLeft: 3,
  },
  commentIcon: {
    marginLeft: 6,
  },
});

export default HomeScreen;
