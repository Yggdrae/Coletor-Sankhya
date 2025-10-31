import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (key: string) => {
    const value = await AsyncStorage.getItem(key);

    if(!value) return null;

    return JSON.parse(value);
}

export const saveData = async (key: string, value: any) => {
    const stringfiedValue = JSON.stringify(value);
    
    await AsyncStorage.setItem(key, stringfiedValue);

    return true;
}