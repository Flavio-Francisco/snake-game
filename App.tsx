import { GestureHandlerRootView } from "react-native-gesture-handler";
import SnakeGame from "./src/main";
import { AuthContextProvider } from "./src/context/Auth";
import { StatusBar } from "react-native";
import { Theme } from "./Thema";
import Routes from "./src/routes";


export default function App() {
  return (
    <AuthContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar

        />
        <Routes />
      </GestureHandlerRootView>
    </AuthContextProvider>

  );
}


