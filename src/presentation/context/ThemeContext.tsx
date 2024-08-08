import { createContext, PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { adaptNavigationTheme, PaperProvider } from 'react-native-paper';





const { LightTheme, DarkTheme } = adaptNavigationTheme({
reactNavigationLight: NavigationDefaultTheme,
reactNavigationDark: NavigationDarkTheme,
});


export const ThemeContext = createContext({
    isDark: false,
    theme: LightTheme,
});




export const ThemeContextProvider = ({children}: PropsWithChildren) => {
    const colorScheme = useColorScheme();

    const isDarkTheme = colorScheme==='dark';
    const theme = isDarkTheme ? DarkTheme : LightTheme;

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
                <ThemeContext.Provider value={{
                    isDark: isDarkTheme,
                    theme: theme,
                }}>
                    { children }
                </ThemeContext.Provider>
            </NavigationContainer>
        </PaperProvider>
    );
}
