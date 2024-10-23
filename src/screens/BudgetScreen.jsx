import React from "react";
import { View, StyleSheet } from "react-native";
import Budget from "../components/Budget";
import Panel from "../components/Panel";

const BudgetScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.budgetContainer}>
                <Budget />
            </View>
            <View style={styles.panelContainer}>
                <Panel />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    budgetContainer: {
        flex: 1,
    },
    panelContainer: {
        position: 'absolute',
        bottom: 0,
    },
});

export default BudgetScreen;
