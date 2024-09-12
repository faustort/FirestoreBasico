import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Button, Provider, Surface, Text } from 'react-native-paper';
import InserirDocumento from './src/screens/InserirDocumento';
import ListarNotas from './src/screens/ListarNotas';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="InserirDocumento" component={InserirDocumento} />
          <Stack.Screen name="ListarNotas" component={ListarNotas} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const HomeScreen = ({ navigation }) => {
  return (
    <Surface style={{ flex: 1, alignItems: "center" }}>
      <Text>Home Screen</Text>
      <Button
        onPress={() => navigation.navigate('InserirDocumento')}
      >Inserir documento</Button>
      <Button
        onPress={() => navigation.navigate('ListarNotas')}
      >Ver notas</Button>
    </Surface>
  );
};