import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import Icons from './Icons';

const GoalModal = ({ visible, onClose }) => {
    const [amount, setAmount] = useState('00.000');
    const [goal, setGoal] = useState('');
    const [date, setDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [errors, setErrors] = useState({
        amount: '',
        goal: '',
        date: '',
    });

    useEffect(() => {
        if (visible) {
            setDate(new Date());
            setAmount('00.000');
            setGoal('');
            setErrors({ amount: '', goal: '', date: ''});
        }
    }, [visible]);

    const handleAmountChange = (value) => {
        const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        setAmount(formattedValue);
    };

    const incrementAmount = () => {
        const currentAmount = parseFloat(amount) || 0;
        const newAmount = currentAmount + 25;
        setAmount(newAmount.toFixed(3));
    };

    const decrementAmount = () => {
        const currentAmount = parseFloat(amount) || 0;
        const newAmount = currentAmount - 25;
        setAmount(newAmount > 0 ? newAmount.toFixed(3) : '00.000');
    };

    const isMinusDisabled = () => {
        const amountValue = parseFloat(amount) || 0;
    
        if (amountValue <= 0) {
            return true;
        }
    
        return false;
    };    

    const handleDayPress = (day) => {
        setDate(new Date(day.dateString));
        setShowCalendar(false);
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!amount || parseFloat(amount) === 0) {
            newErrors.amount = 'Amount is required';
            valid = false;
        }

        if (!goal) {
            newErrors.goal = 'Goal is required';
            valid = false;
        }

        if (!date) {
            newErrors.date = 'Date is required';
            valid = false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date <= today) {
            newErrors.date = 'Please select a future date.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const goalDetails = {
                date: date.toLocaleDateString('en-GB').replace(/\//g, '.'),
                amount: `${amount}$`,
                goal,
            };
    
            try {
                const storedGoal = await AsyncStorage.getItem('goal');
                const goalArray = storedGoal ? JSON.parse(storedGoal) : [];
    
                goalArray.push(goalDetails);
    
                await AsyncStorage.setItem('goal', JSON.stringify(goalArray));
    
                onClose();
            } catch (error) {
                Alert.alert('Storage Error', 'There was an error saving the goal: ' + error.message);
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

                    <View style={styles.goalContainer}>
                    <TextInput
                        style={[styles.amountInput, amount === '00.000' && {color: '#8e8e8e'}]}
                        value={`${amount}$`}
                        onChangeText={handleAmountChange}
                        keyboardType="numeric"
                    />
                        <View style={styles.goalBtnContainer}>
                            <TouchableOpacity 
                                style={[styles.goalPlusIcon]}
                                onPress={incrementAmount}
                                >
                                <Icons type={'plus'}/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.goalMinusIcon, isMinusDisabled() && { opacity: 0.5 }]}
                                onPress={decrementAmount}
                                disabled={isMinusDisabled()}
                                >
                                <Icons type={'minus'}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {errors.amount ? <Text style={styles.error}>{errors.amount}</Text> : null}

                    <TextInput
                        style={[styles.goalInput, goal ? {fontWeight: '500'} : {fontWeight: '300'}]}
                        value={goal}
                        onChangeText={setGoal}
                        placeholder="Type your goal, ex. “To buy a car”"
                        placeholderTextColor={'#8e8e8e'}
                    />
                    {errors.goal ? <Text style={styles.error}>{errors.goal}</Text> : null}

                    <TouchableOpacity style={styles.dateContainer} onPress={() => setShowCalendar(!showCalendar)}>
                        <Text style={styles.calendarDate}><Text style={styles.calendarText}>Ends: </Text> {date.toLocaleDateString()}</Text>
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
                        <Text style={styles.confirmBtnText}>Set goal</Text>
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
    goalContainer: {
        width: '100%',
        height: 48,
        paddingVertical: 13,
        paddingHorizontal: 11,
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        marginBottom: 11
    },
    amountInput: {
        width: '100%',
        height: '100%',
        color: '#000',
        fontSize: 18,
        fontWeight: '600'
    },
    goalBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 13,
        right: 11
    },
    goalPlusIcon: {
        width: 15,
        height: 15,
        marginRight: 10
    },
    goalMinusIcon: {
        width: 25,
        height: 25,
    },
    goalInput: {
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
        color: '#000',
    },
    calendarDate: {
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

export default GoalModal;
