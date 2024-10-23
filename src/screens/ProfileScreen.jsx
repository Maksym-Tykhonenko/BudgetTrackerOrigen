import React from "react";
import { View, StyleSheet } from "react-native";
import Profile from "../components/Profile";
import Panel from "../components/Panel";

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Profile />
            </View>
            <View style={styles.panel}>
                <Panel />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profile: {
        flex: 1,
    },
    panel: {
        position: 'absolute',
        bottom: 0,
    },
});

export default ProfileScreen;
