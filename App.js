import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Index from "./src/Routes/index";
import { UserProvider } from "./src/Hooks/UserContect";

export default function App() {
  return (
    <>
      <NavigationContainer>
        <UserProvider>
          <Index />
        </UserProvider>
      </NavigationContainer>
      <StatusBar style="auto" backgroundColor="#fff" translucent={false} />
    </>
  );
}
