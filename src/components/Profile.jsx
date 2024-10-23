import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResetMenu from "./ResetMenu";
import Icons from "./Icons";
import { useReset } from "../constants/reset";

const { height } = Dimensions.get('window');

const Profile = () => {
    const [transactions, setTransactions] = useState([]);
    const [budget, setBudget] = useState(0);
    const [resetMenuVisible, setResetMenuVisible] = useState(false);
    const { resetKey } = useReset();

    const loadBudgetAndTransactions = async () => {
        try {
            const storedBudget = await AsyncStorage.getItem('budget');
            const storedTransactions = await AsyncStorage.getItem('transactions');

            if (storedBudget) {
                setBudget(parseFloat(storedBudget));
            }
            if (storedTransactions) {
                setTransactions(JSON.parse(storedTransactions));
            }

        } catch (error) {
            Alert.alert('Storage Error', 'There was an error retrieving data.');
        }
    };

    useEffect(() => {
        loadBudgetAndTransactions();
        if(resetKey) {
            setBudget(0);
            setTransactions([]);  
        }
    }, [resetKey]);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}.${month}.${year}`;
    };

    const handleResetMenuVisible = async () => {
        if(!resetMenuVisible) {
            await loadBudgetAndTransactions();
        }

        setResetMenuVisible(!resetMenuVisible);
    }

    return (
        <ImageBackground
        source={require('../assets/back/bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
            <TouchableOpacity style={styles.resetMenu} onPress={() => handleResetMenuVisible()}>
                <Icons type={'menu'}/>
            </TouchableOpacity>
            <Text style={[styles.titleText, {color: '#fff'}]}>My profile</Text>
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 26}}>
                <View style={styles.imgContainer}>
                    <Image style={styles.Image} source={require('../assets/decor/image.png')}/>
                </View>
                <Text style={[styles.titleText, {width: 112, alignSelf: 'center', color: '#fff'}]}>The king of your money</Text>
            </View>
            <View style={styles.balanceContainer}>
                <Text style={[styles.titleText, {color: '#fff'}]}>Total balance:</Text>
                <View style={styles.balanceBox}>
                    <View style={styles.dateBox}>
                        <Text style={styles.dateText}>{formatDate(new Date())}</Text>
                    </View>
                    <Text style={styles.balanceText}>{budget.toFixed(2)}$</Text>
                    <Image source={require('../assets/decor/crown-small.png')} style={styles.crownSmall}/>
                    <Image source={require('../assets/decor/crown-big.png')} style={styles.crownBig}/>
                </View>
            </View>
            <View style={styles.transactionsContainer}>
                <Text style={[styles.titleText, {color: '#fff'}]}>List of transactions</Text>
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

            <ResetMenu 
                visible={resetMenuVisible} 
                onClose={handleResetMenuVisible}
                />
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
    resetMenu: {
        position: 'absolute',
        top: height * 0.07,
        right: 23,
        width: 30,
        height: 30,
    },
    imgContainer: {
        width: height * 0.13,
        height: height * 0.13,
        borderRadius: 100,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 23
    },
    Image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    balanceContainer: {
        width: '100%',
        marginBottom: height * 0.021,
        alignItems: 'flex-start'
    },
    titleText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        marginBottom: height * 0.016,
    },
    crownSmall: {
        width: height * 0.14,
        height: height * 0.13,
        position: 'absolute',
        top: 0,
        left: 6
    },
    crownBig: {
        width: height * 0.14,
        height: height * 0.13,
        position: 'absolute',
        top: 35,
        right: 10
    },
    balanceBox: {
        width: '100%',
        height: height * 0.18,
        padding: 25,
        paddingTop: 13,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#454545',
        borderRadius: 16
    },
    dateBox: {
        padding: 4,
        width: 110,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9A13A',
        borderRadius: 30,
        marginBottom: height * 0.025,
        zIndex: 2
    },
    dateText: {
        fontSize: 14,
        fontWeight: '300',
        color: '#fff'
    },
    balanceText: {
        fontSize: 32,
        fontWeight: '600',
        color: '#fff',
        zIndex: 2
    },
    titleText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#000',
        marginBottom: height * 0.016,
        alignSelf: 'flex-start'
    },
    transactionsContainer: {
        width: '100%',
        alignItems: 'flex-start',
        height: height * 0.42,
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


export default Profile;