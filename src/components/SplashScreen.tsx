import * as React from "react";
import { StyleSheet } from "react-nativescript";

export function SplashScreen() {
    return (
        <flexboxLayout style={styles.container}>
            <image
                src="res://splash_screen"
                style={styles.logo}
                loadMode="sync"
                accessibilityLabel="Virtual Python Lab Logo"
                title="Virtual Python Lab Logo"
            />
            <label className="text-3xl font-bold text-white text-center mt-4">
                Virtual Python Lab
            </label>
            <label className="text-lg text-white text-center mt-2">
                Interactive Learning Environment
            </label>
        </flexboxLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2b5b84", // Python blue
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20
    },
});