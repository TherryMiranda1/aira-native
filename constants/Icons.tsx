import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

export const ICON_SMALL = 24;
export const ICON_MEDIUM = 28;
export const ICON_LARGE = 32;

export const ICON_SIZES = {
  XS: ICON_SMALL / 2,
  SMALL: ICON_SMALL,
  MEDIUM: ICON_MEDIUM,
  LARGE: ICON_LARGE,
};

export enum IconType {
  Entypo = "Entypo",
  FontAwesome = "FontAwesome",
  Ionicons = "Ionicons",
  AntDesign = "AntDesign",
}

export const IconComponents = {
  Entypo: <Entypo />,
  FontAwesome: <FontAwesome />,
  Ionicons: <Ionicons />,
  AntDesign: <AntDesign />,
};
