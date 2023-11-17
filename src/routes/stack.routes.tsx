
import { createStackNavigator } from '@react-navigation/stack';
import { Theme } from '../../Thema';
import Login from '../login';
import Register from '../register';
import SnakeGame from '../main';










const { Navigator, Screen } = createStackNavigator();

export default function Stack() {
  return (
    <Navigator>
      <Screen
        name='Login'
        component={Login}
        options={{

          headerShown: false
        }}

      />
      <Screen
        name='Register'
        component={Register}
        options={{

          headerShown: false
        }}
      />

      <Screen
        name='Snake'
        component={SnakeGame}
        options={{

          headerShown: false
        }}

      />


    </Navigator>
  )
}
