import React from "react";
import { View, StyleSheet } from "react-native";
import Transactions from "../components/Transactions";
import Panel from "../components/Panel";

const TransactionsScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.transactions}>
                <Transactions />
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
    transactions: {
        flex: 1,
    },
    panel: {
        position: 'absolute',
        bottom: 0,
    },
});

export default TransactionsScreen;
