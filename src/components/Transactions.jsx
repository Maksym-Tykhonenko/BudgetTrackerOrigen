import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Dimensions, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReset } from "../constants/reset";

const { height } = Dimensions.get('window');

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [income, setIncome] = useState(0);
    const [spending, setSpending] = useState(0);
    const [forGoal, setForGoal] = useState(0);
    const { resetKey } = useReset();

    const loadTransactions = async () => {
        try {
            const storedTransactions = await AsyncStorage.getItem('transactions');
            const storedForGoal = await AsyncStorage.getItem('forGoal');

            if (storedTransactions) {
                setTransactions(JSON.parse(storedTransactions));
            }

            if (storedForGoal) {
                setForGoal(parseFloat(storedForGoal));
            }
            
        } catch (error) {
            Alert.alert('Storage Error', 'There was an error retrieving data.');
        }
    };

    console.log(forGoal)

    useEffect(() => {
        loadTransactions();
    }, [resetKey]);

    const sumIncomeTransactions = (transactions) => {
        return transactions.reduce((total, item) => {
            if (item.transactionType === 'add') {
                const amount = parseFloat(item.transaction.replace('$', '').replace('+ ', '').replace('- ', ''));
                return total + amount;
            }
            return total;
        }, 0);
    };

    const sumUsedTransactions = (transactions, forGoal) => {
        return transactions.reduce((total, item) => {
            const amount = parseFloat(item.transaction.replace('$', '').replace('+ ', '').replace('- ', ''));
            if (item.transactionType === 'waste') {
                return total + amount;
            }
            return total;
        }, 0) + forGoal;
    };
    
    useEffect(() => {
        const addedSum = sumIncomeTransactions(transactions);
        const addedSpending = sumUsedTransactions(transactions, forGoal);
        setIncome(addedSum);
        setSpending(addedSpending);
    }, [transactions, forGoal]);
    

    return (
        <ImageBackground
        source={require('../assets/back/bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
            <View style={{width: '100%', alignItems: 'flex-start', marginBottom: 18}}>
                <Text style={styles.titleText}>Total earned for all time</Text>
                <View style={styles.earnedContainer}>
                    <Text style={styles.statText}>{income}$</Text>
                </View>
            </View>
            <View  style={{width: '100%', alignItems: 'flex-start', marginBottom: 27}}>
                <Text style={styles.titleText}>Total used for all time</Text>
                <View style={styles.wastedContainer}>
                    <Text style={styles.statText}>{spending}$</Text>
                </View>
            </View>
            <View style={styles.transactionsContainer}>
                <Text style={styles.titleText}>List of transactions</Text>
                {transactions.length === 0 ? (
                    <View style={styles.transBox}>
                        <Text style={styles.noTransText}>Here will be your transactions</Text>
                    </View>
                ) : (
                    <ScrollView>
                        {transactions.map((item, index) => (
                            <View key={index} style={styles.transBox}>
                                <View style={styles.transactionTextContainer}>
                                    <Text style={styles.transactionDate}>{item.date}</Text>
                                    <Text style={styles.transactionName}>{item.name}</Text>
                                </View>
                                <Text style={[styles.transactionAmount, item.transactionType === 'add' ? {color: '#14b910'} : {color: '#f66233'}]}>
                                    {item.transaction}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      },
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 23,
        paddingBottom: 74,
        paddingTop: height * 0.07,
    },
    earnedContainer: {
        width: '100%',
        padding: 15,
        backgroundColor: '#14b910',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wastedContainer: {
        width: '100%',
        padding: 15,
        backgroundColor: '#f66233',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statText: {
        fontSize: 32,
        fontWeight: '600',
        color: '#fff',
    },
    titleText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        marginBottom: height * 0.016
    },
    transactionsContainer: {
        width: '100%',
        alignItems: 'flex-start',
        height: height * 0.55,
        paddingBottom: 20
    },
    transBox: {
        width: '100%',
        height: height * 0.076,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#DDD',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: height * 0.021,
        borderRadius: 16,
        flexDirection: 'row',
        marginBottom: 8
    },
    noTransText: {
        fontSize: 14,
        fontWeight: '300',
        color: '#B7B7B7'
    },
    transactionTextContainer: {
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    transactionDate: {
        fontSize: 12,
        fontWeight: '300',
        color: '#c9c9c9',
        marginBottom: 5
    },
    transactionName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000'
    },
    transactionAmount: {
        fontSize: 18,
        fontWeight: '600',
    }
});


export default Transactions;