import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';

// You can explore the built-in icon families and icons on the web at https://oblador.github.io/react-native-vector-icons/
export const TabBarIcon = (props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) => {
  return <FontAwesome size={26} style={styles.tabBarIcon} {...props} />;
};

export const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});
