import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";

import { SplashScreen } from "./SplashScreen";
import { ScreenOne } from "./ScreenOne";
import { ScreenTwo } from "./ScreenTwo";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => {
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate splash screen duration
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <BaseNavigationContainer>
            <StackNavigator.Navigator
                initialRouteName="Screen One"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#2b5b84",
                    },
                    headerTintColor: "white",
                    headerShown: true,
                }}
            >
                <StackNavigator.Screen
                    name="One"
                    component={ScreenOne}
                    options={{
                        title: "Virtual Python Lab"
                    }}
                />
                <StackNavigator.Screen
                    name="Two"
                    component={ScreenTwo}
                />
            </StackNavigator.Navigator>
        </BaseNavigationContainer>
    );
}