import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';

export default function App() {
  return (
    <ScrollView>
      <Text>Text 1</Text>
      <Text>text 2</Text>
      <ActivityIndicator></ActivityIndicator>
      <Image source={{uri: "https://cdn.vox-cdn.com/thumbor/RvcSv_hd-VrlfPg8Tl_JOfhoIoU=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/19534169/171109_08_11_37_5DS_0545__1_.jpg"}} 
      style={styles.tinyLogo}
      ></Image>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 500,
    height: 500,
  },
});
