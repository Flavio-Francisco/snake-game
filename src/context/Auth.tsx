import React, { useEffect } from "react";
import { ReactNode, SetStateAction, createContext, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export interface AuthUserData {
  token: string
  user: {
    id: number;
    avatar: string;
    name: string;
    password: string;
    score: number;
  }

}


export interface AuthContextDataProps {
  user: AuthUserData;
  singnIn: (data: AuthUserData) => Promise<void>;
  singnOut: () => void;
  setAvatar: (avatar: string) => void

}

interface AuthContextProviderProps {
  children: ReactNode;

}


export const AuthContext = createContext({} as AuthContextDataProps);


export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<AuthUserData>({} as AuthUserData);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem("userData");

      console.log(storagedUser);

      if (storagedUser) {
        setUser(JSON.parse(storagedUser));
      }
    }


    loadStorageData();
  }, []);


  async function singnIn(data: AuthUserData) {
    if (data) {
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        setUser(data)

      } catch (error) {
        console.error("Error storing user data in AsyncStorage:", error);
      }

    }

  }


  function setAvatar(avatar: string) {
    try {
      const userData = user;
      userData.user.avatar = avatar;
      AsyncStorage.setItem('userData', JSON.stringify(userData));

    } catch (error) {
      console.log(error);

    }
  }



  function singnOut() {

    AsyncStorage.removeItem('userData').catch((error) => {
      console.error("Error removing user data from AsyncStorage:", error);
    })

    setUser({
      token: '',
      user: {

        name: "",
        avatar: "",
        id: 0,
        password: '',
        score: 0
      },

    });


  }

  return (
    <AuthContext.Provider
      value={{
        singnOut,
        user,
        singnIn,

        setAvatar,

      }}
    >

      {children}
    </AuthContext.Provider>
  )

}