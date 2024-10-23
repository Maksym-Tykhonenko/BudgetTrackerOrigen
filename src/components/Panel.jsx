import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, StyleSheet } from "react-native"
import Icons from "./Icons";

const Panel = () => {
    const navigation = useNavigation();
    const [activeButton, setActiveButton] = useState('BudgetScreen');

    const handleNavigate = (screen) => {
        setActiveButton(screen);
        navigation.navigate(screen);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const currentRoute = navigation.getState().routes[navigation.getState().index].name;
            setActiveButton(currentRoute);
        });

        return unsubscribe;
    }, [navigation]);
    
    return (
        <View style={styles.container}>

            <View style={styles.btnContainer}>
            <TouchableOpacity
                style={styles.button} 
                onPress={() => handleNavigate('StatisticScreen')}>
                <Icons type={'statistics'}  active={activeButton === 'StatisticScreen'}/>
            </TouchableOpacity>
            </View>

            <View style={styles.btnContainer}>
            <TouchableOpacity
                style={styles.button} 
                onPress={() => handleNavigate('BudgetScreen')}>
                <Icons type={'budget'}  active={activeButton === 'BudgetScreen'}/>
            </TouchableOpacity>
            </View>

            <View style={styles.btnContainer}>
            <TouchableOpacity
                style={styles.button} 
                onPress={() => handleNavigate('ProfileScreen')}>
                <Icons type={'profile'} active={activeButton === 'ProfileScreen'}/>
            </TouchableOpacity>
            </View>

            <View style={styles.btnContainer}>
            <TouchableOpacity
                style={styles.button} 
                onPress={() => handleNavigate('TransactionsScreen')}>
                <Icons type={'transactions'} active={activeButton === 'TransactionsScreen'}/>
            </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 23,
        paddingVertical: 17,
        flexDirection: 'row',
        backgroundColor: '#674ea7',
        alignSelf: "center",
    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 44,
        height: 44,
        padding: 3,
        zIndex: 2
    },
});

export default Panel;