import React from "react";
import { View, StyleSheet } from "react-native";
import Statistic from "../components/Statistic";
import Panel from "../components/Panel";

const StatisticScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.statistic}>
                <Statistic />
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
    statistic: {
        flex: 1,
    },
    panel: {
        position: 'absolute',
        bottom: 0,
    },
});

export default StatisticScreen;
