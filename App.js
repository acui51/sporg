import { useState, useContext, useEffect } from "react";
import * as eva from "@eva-design/eva";
import { View } from "react-native";
import {
  ApplicationProvider,
  Layout,
  IconRegistry,
  Text,
  TabBar,
  Tab,
  Toggle,
  Icon,
  Button,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native";
import { ThemeContext } from "./themeContext";
import HotScreen from "./screens/HotScreen";
import { supabase } from "./supabase";
import LoginScreen from "./screens/LoginScreen";

const { Navigator, Screen } = createMaterialTopTabNavigator();

const SporginScreen = () => (
  <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text category="h1">Sporg</Text>
  </Layout>
);

const TopTabBar = ({ navigation, state }) => (
  <TabBar
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <Tab title="HOT" />
    <Tab title="SPORGIN" />
  </TabBar>
);

const TabNavigator = () => (
  <Navigator tabBar={(props) => <TopTabBar {...props} />}>
    <Screen name="Hot" component={HotScreen} />
    <Screen name="Sporgin'" component={SporginScreen} />
  </Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

const Header = () => {
  const themeContext = useContext(ThemeContext);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
      }}
    >
      <Text category="h1">Sporg!</Text>
      <Toggle
        checked={themeContext.theme === "light"}
        onChange={themeContext.toggleTheme}
      />
    </View>
  );
};

const UploadPostButton = () => {
  const themeContext = useContext(ThemeContext);

  const uploadPost = async () => {
    const { error } = await supabase.from("posts").insert({
      title: "Uploaded Sporg",
      description: "Sporg",
      user_id: themeContext.user,
    });
  };

  return (
    <Button
      style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        borderRadius: 99999,
      }}
      accessoryLeft={<Icon name="plus" />}
      onPress={uploadPost}
    >
      Post
    </Button>
  );
};

export default () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider
        value={{ theme, toggleTheme, user: session?.user?.id }}
      >
        <ApplicationProvider
          {...eva}
          theme={theme === "light" ? eva.light : eva.dark}
        >
          <Layout style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, position: "relative" }}>
              {session ? (
                <>
                  <Header />
                  <AppNavigator />
                  <UploadPostButton />
                </>
              ) : (
                <LoginScreen />
              )}
            </SafeAreaView>
          </Layout>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  );
};
