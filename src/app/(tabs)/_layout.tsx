import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const isIOS = Platform.OS === "ios";

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="pokedex">
        {isIOS ? (
          <Icon sf={{ default: "list.bullet", selected: "list.bullet" }} />
        ) : (
          <MaterialIcons name="format-list-bulleted" size={24} color="#999" />
        )}
        <Label>Pokedex</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        {isIOS ? (
          <Icon sf={{ default: "heart", selected: "heart.fill" }} />
        ) : (
          <MaterialIcons name="favorite-border" size={24} color="#999" />
        )}
        <Label>Favorites</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
