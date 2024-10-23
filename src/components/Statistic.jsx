import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Alert, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { useReset } from "../constants/reset";

const { height, width } = Dimensions.get('window');

const Statistic = () => {
    const [transactions, setTransactions] = useState([]);
    const [date, setDate] = useState(new Date());
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const { resetKey } = useReset();

    const loadTransactions = async () => {
        try {
            const storedTransactions = await AsyncStorage.getItem('transactions');

            if (storedTransactions) {
                const parsedTransactions = JSON.parse(storedTransactions);
                setTransactions(parsedTransactions);
                filterTransactionsByDate(parsedTransactions, new Date());
            }

        } catch (error) {
            Alert.alert('Storage Error', 'There was an error retrieving data.');
        }
    };

    const filterTransactionsByDate = (transactions, selectedDate) => {
        const formattedDate = selectedDate.toLocaleDateString('en-GB').replace(/\//g, '.');
        const filtered = transactions.filter(transaction => transaction.date === formattedDate);
        setFilteredTransactions(filtered);
    };

    useEffect(() => {
        loadTransactions();
    }, [resetKey]);

    useEffect(() => {
        console.log('Stored Transactions:', transactions);
        console.log('Selected Date:', date.toLocaleDateString('en-GB'));
    }, [transactions, date]);
    

    const handleDayPress = (day) => {
        const selectedDate = new Date(day.dateString);
        setDate(selectedDate);
        filterTransactionsByDate(transactions, selectedDate);
    };

    return (
        <ImageBackground
        source={require('../assets/back/bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
            <Text style={styles.titleText}>Calendar</Text>
            <Calendar
            style={{ width: width * 0.88, borderRadius: 16, overflow: 'hidden', padding: 5}}
                            onDayPress={handleDayPress}
                            markedDates={{
                                [date.toISOString().split('T')[0]]: { selected: true, selectedColor: '#f9a500' }
                            }}
                            theme={{
                                selectedDayBackgroundColor: '#f9a500',
                                todayTextColor: '#f9a500',
                                arrowColor: '#f9a500',
                                textDayFontWeight: '500',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '500',
                            }}
                        />
            <View style={{height: height * 0.02}}/>
            <View style={styles.transactionsContainer}>
            <Text style={styles.dateText}>
                <Text style={styles.titleText}>List of transactions for </Text>
                {date.toLocaleDateString().replace(/\//g, '.')}
            </Text>
            {filteredTransactions.length === 0 ? (
                    <View style={styles.transBox}>
                        <Text style={styles.noTransText}>Here will be your transactions</Text>
                    </View>
                ) : (
                    <ScrollView>
                        {filteredTransactions.map((item, index) => (
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
        alignItems: 'flex-start',
        padding: 23,
        paddingBottom: 74,
        paddingTop: height * 0.07,
    },
    titleText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        marginBottom: height * 0.016
    },
    dateText: {
        fontSize: 17,
        fontWeight: '400',
        color: '#fff',
        marginBottom: height * 0.016
    },
    transactionsContainer: {
        width: '100%',
        alignItems: 'flex-start',
        height: height * 0.44,
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

export default Statistic;