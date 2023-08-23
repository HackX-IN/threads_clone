import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Login, Register } from "../Screens/Auth/index";
import { Activity, Home, Post, Profile } from "../Screens/Log/index";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: "black",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "ios-home" : "ios-home-outline"}
              size={24}
              color="black"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        options={{
          tabBarLabel: "Post",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "ios-create" : "ios-create-outline"}
              size={24}
              color="black"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Activity"
        component={Activity}
        options={{
          tabBarLabel: "Activity",
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo
              name={focused ? "heart" : "heart-outlined"}
              size={24}
              color="black"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "md-person" : "md-person-outline"}
              size={24}
              color="black"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const stack = createNativeStackNavigator();

function Index() {
  return (
    <stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <stack.Screen
        name="Main"
        component={MyTabs}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
    </stack.Navigator>
  );
}

export default Index;
