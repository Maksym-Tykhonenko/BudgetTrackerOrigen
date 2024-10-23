import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReset } from '../constants/reset';

const ResetMenu = ({ visible, onClose }) => {    
    const { reset, resetKey } = useReset();
    const [budget, setBudget] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [limit, setLimit] = useState([]);
    const [forGoal, setForGoal] = useState(0);
    const [waste, setWaste] = useState(0);
    
    const handleResetAll = async () => {
        try {
            await AsyncStorage.removeItem('budget');
            await AsyncStorage.removeItem('transactions');
            await AsyncStorage.removeItem('goal');
            await AsyncStorage.removeItem('forGoal');
            await AsyncStorage.removeItem('limit');
            await AsyncStorage.removeItem('waste');
            await AsyncStorage.removeItem('income');
    
            setBudget(0);
            setTransactions([]);
            setForGoal(0);
            setGoals([]);
            setLimit([]);
            setWaste(0);
    
            reset();
            onClose();
    
            Alert.alert('Everything has been reset successfully');
        } catch (error) {
            Alert.alert('Storage Error', 'There was an error resetting all.');
        }
    };
    
    const handleResetGoal = async () => {
        try {
            await AsyncStorage.removeItem('goal');
            await AsyncStorage.removeItem('forGoal');
    
            setForGoal(0);
            setGoals([]);
    
            reset();
            onClose();
    
            Alert.alert('Goal has been reset successfully');
        } catch (error) {
            Alert.alert('Storage Error', 'There was an error resetting goal.');
        }
    };
    
    const handleResetLimit = async () => {
        try {
            await AsyncStorage.removeItem('waste');
            await AsyncStorage.removeItem('limit');
    
            setWaste(0);
            setLimit([]);
    
            reset();
            onClose();
    
            Alert.alert('Limit has been reset successfully');
        } catch (error) {
            Alert.alert('Storage Error', 'There was an error resetting limit.');
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

                    <TouchableOpacity style={styles.resetGoal} onPress={handleResetGoal}>
                        <Text style={styles.confirmBtnText}>Reset goal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetLimit} onPress={handleResetLimit}>
                        <Text style={styles.confirmBtnText}>Reset limit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetAll} onPress={handleResetAll}>
                        <Text style={styles.confirmBtnText}>Reset All</Text>
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
    resetGoal: {
        width: '100%',
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#14B910',
        marginBottom: 14
    },
    resetLimit: {
        width: '100%',
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#f9a13a',
        marginBottom: 14
    },
    resetAll: {
        width: '100%',
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#ff5b5b',
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

export default ResetMenu;
