import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import Icons from './Icons';

const TransactionsModal = ({ visible, onClose, transactionType, onSubmit }) => {
    const [transaction, setTransaction] = useState('00.000');
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [errors, setErrors] = useState({
        transaction: '',
        name: '',
        date: '',
    });

    useEffect(() => {
        if (visible) {
            setDate(new Date());
            setTransaction('00.000');
            setName('');
            setErrors({ transaction: '', name: '', date: ''});
        }
    }, [visible]);

    const handleTransactionType = () => {
        if (transaction === '00.000') {
            return{
                color: '#8e8e8e'
            }
        }

        if (transactionType === 'add') {
            return {
                color: '#14b910'
            };
        } else {
            return {
                color: '#f66233'
            };
        };
    };
    
    const getTransactionWithSign = () => {
        if (transaction === '00.000') {
            return transaction + '$';
        }

        if (transactionType === 'add') {
            return `+ ${transaction}$`;
        } else {
            return `- ${transaction}$`;
        }
    };

    const incrementTransaction = () => {
        const currentTransaction = parseFloat(transaction) || 0;
        const newTransaction = currentTransaction + 25;
        setTransaction(newTransaction.toFixed(3));
    };

    const decrementTransaction = () => {
        const currentTransaction = parseFloat(transaction) || 0;
        const newTransaction = currentTransaction - 25;
        setTransaction(newTransaction > 0 ? newTransaction.toFixed(3) : '00.000');
    };

    const isMinusDisabled = () => {
        const transactionValue = parseFloat(transaction) || 0;
    
        if (transactionValue <= 0) {
            return true;
        }
    
        return false;
    };    

    const handleDayPress = (day) => {
        setDate(new Date(day.dateString));
        setShowCalendar(false);
    };

    const handleTransactionChange = (value) => {
        const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        setTransaction(formattedValue);
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!transaction || parseFloat(transaction) === 0) {
            newErrors.transaction = 'Transaction is required';
            valid = false;
        }

        if (!name) {
            newErrors.name = 'Name is required';
            valid = false;
        }

        if (!date) {
            newErrors.date = 'Date is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const transactionDetails = {
                transactionType,
                date: date.toLocaleDateString('en-GB').replace(/\//g, '.'),
                transaction: `${transactionType === 'add' ? '+ ' : '- '}${transaction}$`,
                name,
            };
    
            try {
                const storedTransactions = await AsyncStorage.getItem('transactions');
                const transactionsArray = storedTransactions ? JSON.parse(storedTransactions) : [];
    
                transactionsArray.push(transactionDetails);
    
                await AsyncStorage.setItem('transactions', JSON.stringify(transactionsArray));

                onSubmit(transactionDetails);
                onClose();
            } catch (error) {
                Alert.alert('Storage Error', 'There was an error saving the transaction.');
            }
        } else {
            Alert.alert('Validation Error', 'Please correct the errors before submitting.');
        }
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>

                    <View style={styles.transactionContainer}>
                    <TextInput
                        style={[styles.transactionInput, handleTransactionType()]}
                        value={getTransactionWithSign()}
                        onChangeText={handleTransactionChange}
                        keyboardType="numeric"
                    />
                        <View style={styles.transactionBtnContainer}>
                            <TouchableOpacity 
                                style={[styles.transactionPlusIcon]}
                                onPress={incrementTransaction}
                                >
                                <Icons type={'plus'}/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.transactionMinusIcon, isMinusDisabled() && { opacity: 0.5 }]}
                                onPress={decrementTransaction}
                                disabled={isMinusDisabled()}
                                >
                                <Icons type={'minus'}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {errors.transaction ? <Text style={styles.error}>{errors.transaction}</Text> : null}

                    <TextInput
                        style={[styles.nameInput, name ? {fontWeight: '500'} : {fontWeight: '300'}]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Type the title, for example 'Salary'"
                        placeholderTextColor={'#8e8e8e'}
                    />
                    {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

                    <TouchableOpacity style={styles.dateContainer} onPress={() => setShowCalendar(!showCalendar)}>
                        <Text style={styles.calendarText}>{date.toLocaleDateString()}</Text>
                        <View style={styles.calendarIcon}>
                            <Icons type={'calendar'}/>
                        </View>
                    </TouchableOpacity>
                    {errors.date ? <Text style={styles.error}>{errors.date}</Text> : null}

                    {showCalendar && (
                        <Calendar
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
                                textDayHeaderFontWeight: '500'
                            }}
                        />
                    )}

                    <TouchableOpacity style={styles.confirmBtn} onPress={handleSubmit}>
                        <Text style={styles.confirmBtnText}>Confirm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '75%',
        padding: 18,
        backgroundColor: 'white',
        borderRadius: 23,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 5,
    },
    transactionContainer: {
        width: '100%',
        height: 48,
        paddingVertical: 13,
        paddingHorizontal: 11,
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        marginBottom: 11
    },
    transactionInput: {
        width: '100%',
        height: '100%',
        color: '#8e8e8e',
        fontSize: 18,
        fontWeight: '600'
    },
    transactionBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 13,
        right: 11
    },
    transactionPlusIcon: {
        width: 15,
        height: 15,
        marginRight: 10
    },
    transactionMinusIcon: {
        width: 25,
        height: 25,
    },
    nameInput: {
        width: '100%',
        borderRadius: 12,
        marginBottom: 11,
        backgroundColor: '#F7F7F7',
        paddingVertical: 8,
        paddingHorizontal: 14,
        color: '#000',
        fontSize: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        marginBottom: 11,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    calendarText: {
        fontSize: 14,
        fontWeight: '300',
        color: '#d9d9d9',
        marginRight: 10
    },
    calendarIcon: {
        width: 20,
        height: 20
    },
    confirmBtn: {
        width: '100%',
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#f9a13a',
        marginBottom: 14
    },
    confirmBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff'
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: '300',
        color: '#ff5b5b'
    },
    error: {
        fontSize: 12,
        fontWeight: '300',
        color: 'red',
        marginBottom: 10,
        marginTop: -7
    }
});

export default TransactionsModal;
