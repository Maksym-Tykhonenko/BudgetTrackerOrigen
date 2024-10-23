import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from './Icons';

const TopUpGoalModal = ({ visible, onClose, onAdd, budget }) => {
    const [amount, setAmount] = useState('00.000');
    const [errors, setErrors] = useState({
        amount: ''
    });

    useEffect(() => {
        if (visible) {
            setAmount('00.000');
            setErrors({ amount: ''});
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

    const handleAmountStyle = () => {
        if (amount === '00.000') {
            return {
                color: '#8e8e8e'
            };
        } else {
            return {
                color: '#14b910'
            };
        };
    };

    const handleAddBtnStyle = () => {
        if (amount === '00.000') {
            return {
                backgroundColor: '#8e8e8e'
            };
        } else {
            return {
                backgroundColor: '#14b910'
            };
        };
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!amount || parseFloat(amount) === 0) {
            newErrors.amount = 'Amount is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const goalTopUp = () => {
        if(budget >= amount) {
            onAdd(parseFloat(amount));
        }else {
            alert('You do not have enough budget for toping up goal');
        }
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const goalDetails = {
                amount: `${amount}$`,
            };
    
            try {
                const storedGoal = await AsyncStorage.getItem('goalTopUp');
                const goalArray = storedGoal ? JSON.parse(storedGoal) : [];
    
                goalArray.push(goalDetails);
    
                await AsyncStorage.setItem('goalTopUp', JSON.stringify(goalArray));
    
                goalTopUp();
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
                        style={[styles.amountInput, handleAmountStyle()]}
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
                    {errors.goal ? <Text style={styles.error}>{errors.goal}</Text> : null}

                    <Text style={styles.text}>FROM TOTAL BALANCE</Text>

                    <TouchableOpacity style={[styles.confirmBtn, handleAddBtnStyle()]} onPress={handleSubmit}>
                        <Text style={styles.confirmBtnText}>Add money to goal</Text>
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
        alignItems: 'flex-start',
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
    goalTopUp: {
        fontSize: 12,
        fontWeight: '300',
        alignSelf: 'left',
        color: '#000',
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
    cancelBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
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
    },
    text: {
        marginBottom: 13,
        color: '#000',
        fontSize: 12,
        fontWeight: '300'
    }
});

export default TopUpGoalModal;
