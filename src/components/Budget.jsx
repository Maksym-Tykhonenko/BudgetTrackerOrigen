import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, Dimensions, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import TransactionsModal from "./TransactionsModal";
import GoalModal from "./GoalModal";
import TopUpGoalModal from "./TopUpGoalModal";
import LimitModal from "./LimitModal";
import ProgressBar from "./ProgressBar";
import Icons from "./Icons"
import { useReset } from "../constants/reset";

const { height, width } = Dimensions.get('window');

const Budget = () => {
    const [transactionModalVisible, setTransactionModalVisible] = useState(false);
    const [transactionType, setTransactionType] = useState(null);
    const [goalModalVisible, setGoalModalVisible] = useState(false);
    const [goalTopUpModalVisible, setGoalTopUpModalVisible] = useState(false);
    const [limitModalVisible, setLimitModalVisible] = useState(false);
    const [forGoal, setForGoal] = useState(0);
    const [waste, setWaste] = useState(0);

    const [budget, setBudget] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [limit, setLimit] = useState([]);

    const { resetKey } = useReset();

    const loadData = async () => {
        try {
            const [storedBudget, storedTransactions, storedForGoal, storedGoals, storedLimit] = await Promise.all([
                AsyncStorage.getItem('budget'),
                AsyncStorage.getItem('transactions'),
                AsyncStorage.getItem('forGoal'),
                AsyncStorage.getItem('goal'),
                AsyncStorage.getItem('limit'),
            ]);

            if (storedBudget) setBudget(parseFloat(storedBudget));
            if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
            if (storedForGoal) setForGoal(parseFloat(storedForGoal));
            if (storedGoals) setGoals(JSON.parse(storedGoals));
            if (storedLimit) setLimit(JSON.parse(storedLimit));

        } catch (error) {
            Alert.alert('Storage Error', 'There was an error retrieving data.');
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadData();
        if(resetKey) {
            setBudget(0);
            setTransactions([]);
            setForGoal(0);
            setGoals([]);
            setLimit([]);
            setWaste(0);    
        }
    }, [resetKey]);

    const updateBudget = async (amount) => {
        const newBudget = budget + amount;
        setBudget(newBudget);
        try {
            await AsyncStorage.setItem('budget', newBudget.toString());
        } catch (error) {
            Alert.alert('Storage Error', 'There was an error updating the budget.');
        }
    };

    const handleTransactionSubmit = (transactionDetails) => {
        setTransactions((prevTransactions) => {
            const newTransactions = [...prevTransactions, transactionDetails];
            AsyncStorage.setItem('transactions', JSON.stringify(newTransactions));
            return newTransactions;
        });

        const amount = parseFloat(transactionDetails.transaction.replace('$', '').replace('+ ', '').replace('- ', ''));
        updateBudget(transactionDetails.transactionType === 'add' ? amount : -amount);
    };

    const handleTopUpGoal = async (amount) => {
        const newBudget = budget - amount;
        const newForGoal = forGoal + amount;
        const newWaste = waste + amount;

        setBudget(newBudget);
        setForGoal(newForGoal);
        setWaste(newWaste);

        try {
            await AsyncStorage.setItem('budget', newBudget.toString());
            await AsyncStorage.setItem('forGoal', newForGoal.toString());
            await AsyncStorage.setItem('waste', newWaste.toString());
        } catch (error) {
            Alert.alert('Storage Error', 'There was an error updating the numbers.');
        }

    };

    const handleTransactionModalVisible = (type) => {
        setTransactionType(type);
        setTransactionModalVisible(!transactionModalVisible);
        if (!transactionModalVisible)
            loadData();;
    };

    const handleGoalModalVisible = async () => {
        if (goalModalVisible) {
            await loadData();
        }
        setGoalModalVisible(!goalModalVisible);
    };
    

    const handleTopUpModalVisible = () => {
        setGoalTopUpModalVisible(!goalTopUpModalVisible);
    }

    const handleLimitModalVisible = async () => {
        if (limitModalVisible) {
            await loadData();
        }
        setLimitModalVisible(!limitModalVisible);
    };
    

    const sumUsedTransactions = (transactions) => {
        return transactions.reduce((total, item) => {
            if (item.transactionType === 'waste') {
                const amount = parseFloat(item.transaction.replace('$', '').replace('+ ', '').replace('- ', ''));
                return total + amount;
            }
            return total;
        }, 0);
    };
    
    useEffect(() => {
        const usedSum = sumUsedTransactions(transactions);
        setWaste(usedSum);
    }, [transactions]);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}.${month}.${year}`;
    };

    return (
        <ImageBackground
        source={require('../assets/back/bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
            <View style={styles.balanceContainer}>
                <Text style={styles.titleText}>Total balance:</Text>
                <View style={styles.balanceBox}>
                    <View style={styles.dateBox}>
                        <Text style={styles.dateText}>{formatDate(new Date())}</Text>
                    </View>
                    <Text style={styles.balanceText}>{budget.toFixed(2)}$</Text>
                    <View style={styles.balanceBtnContainer}>
                        <TouchableOpacity style={styles.balanceAddBtn} onPress={() => handleTransactionModalVisible('add')}>
                            <View style={styles.icon}>
                                <Icons type={'add'}/>
                            </View>
                            <Text style={styles.balanceBtnText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.balanceWasteBtn} onPress={() => handleTransactionModalVisible('waste')}>
                            <View style={styles.icon}>
                                <Icons type={'waste'}/>
                            </View>
                            <Text style={styles.balanceBtnText}>Waste</Text>
                        </TouchableOpacity>
                    </View>
                    <Image source={require('../assets/decor/crown-small.png')} style={styles.crownSmall}/>
                    <Image source={require('../assets/decor/crown-big.png')} style={styles.crownBig}/>
                </View>
            </View>
            <ScrollView>

            <View style={styles.itemsContainer}>
                <Text style={styles.titleText}>Goals:</Text>
                {goals.length === 0 ? (
                <TouchableOpacity style={styles.goalsBtn} onPress={() => handleGoalModalVisible()}>
                    <View style={styles.icon}>
                        <Icons type={'add'}/>
                    </View>
                    <Text style={styles.btnText}>Set goal</Text>
                </TouchableOpacity>
                ) : (
                    goals.map((goal, index) => (
                        <View key={index} style={styles.goalBox}>
                            <View style={styles.goalTextContainer}>
                                <Text style={styles.goalAmount}>
                                    <Text style={styles.forGoalAmount}>{forGoal} / </Text>
                                     {goal.amount}
                                </Text>
                                <Text style={styles.goalText}>{goal.goal}</Text>
                                <Text style={styles.goalDate}>
                                    <Text style={styles.goalEndDate}>Ends: </Text>{goal.date}</Text>
                                <TouchableOpacity style={styles.goalAddBtn} onPress={() => handleTopUpModalVisible()}>
                                    <View style={styles.icon}>
                                        <Icons type={'add'}/>
                                    </View>
                                    <Text style={styles.balanceBtnText}>Add</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{height: '100%', paddingTop: 20}}>
                            <Image source={require('../assets/decor/violet-crown.png')} style={styles.progressImg}/>
                            <ProgressBar forGoal={forGoal} goalAmount={goal.amount} color2={"#14b910"} />
                            </View>
                        </View>
                    ))
                )}
            </View>

            <View style={styles.itemsContainer}>
                <Text style={styles.titleText}>Monthly limits:</Text>
                {limit.length === 0 ? (
                <TouchableOpacity style={styles.limitsBtn} onPress={() => handleLimitModalVisible()}>
                    <View style={styles.icon}>
                        <Icons type={'add'}/>
                    </View>
                    <Text style={styles.btnText}>Set monthly limit</Text>
                </TouchableOpacity>
                ) : (
                    limit.map((limit, index) => (
                        <View key={index} style={styles.limitBox}>
                            <View style={styles.limitTextContainer}>
                                <View style={{marginBottom: 10}}>
                                    <Text style={styles.limitSubtitle}>Used this month:</Text>
                                    <Text style={styles.wastedAmount}>{waste}$</Text>
                                </View>
                                <View>
                                    <Text style={styles.limitSubtitle}>Monthly limit:</Text>
                                    <Text style={styles.limitAmount}>{limit.amount}</Text>
                                </View>
                            </View>
                            <View style={{height: '100%', paddingTop: 18}}>
                            <Image source={require('../assets/decor/violet-crown.png')} style={styles.progressLimitImg}/>
                            <ProgressBar waste={waste} limitAmount={limit.amount} color={'#ffa800'} />
                            </View>
                        </View>
                    ))
                )}
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
            </ScrollView>

            <TransactionsModal 
                visible={transactionModalVisible} 
                onClose={handleTransactionModalVisible}
                transactionType={transactionType}
                onSubmit={handleTransactionSubmit}
                />

            <GoalModal
                visible={goalModalVisible} 
                onClose={handleGoalModalVisible}
                />

            <TopUpGoalModal 
                visible={goalTopUpModalVisible} 
                onClose={handleTopUpModalVisible}
                onAdd={(amount) => handleTopUpGoal(amount)}
                budget={budget}
                />

            <LimitModal 
                visible={limitModalVisible} 
                onClose={handleLimitModalVisible}
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
    balanceContainer: {
        width: '100%',
        marginBottom: height * 0.021,
        alignItems: 'flex-start'
    },
    titleText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        marginBottom: height * 0.016
    },
    crownSmall: {
        width: height * 0.11,
        height: height * 0.1,
        position: 'absolute',
        top: 10,
        left: 6
    },
    crownBig: {
        width: height * 0.21,
        height: height * 0.2,
        position: 'absolute',
        top: 20,
        right: 6
    },
    balanceBox: {
        width: '100%',
        height: height * 0.224,
        padding: 25,
        paddingTop: 13,
        alignItems: 'center',
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
        marginBottom: height * 0.025,
        zIndex: 2
    },
    balanceBtnContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 2
    },
    balanceAddBtn: {
        width: '47%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#14B910',
        flexDirection: 'row',
        padding: 8
    },
    balanceWasteBtn: {
        width: '47%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DAA848',
        flexDirection: 'row',
        padding: 8
    },
    icon: {
        width: 22,
        height: 22,
        marginRight: 7
    },
    balanceBtnText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff'
    },
    itemsContainer: {
        width: width * 0.87,
        alignItems: 'flex-start',
        marginBottom: height * 0.021
    },
    titleText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        marginBottom: height * 0.02
    },
    goalsBtn: {
        width: '100%',
        height: height * 0.095,
        backgroundColor: '#9893FF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: height * 0.026,
        borderRadius: 16,
        flexDirection: 'row'
    },
    goalBox: {
        width: '100%',
        height: height * 0.21,
        borderWidth: 0.5,
        borderColor: '#ddd',
        borderRadius: 16,
        backgroundColor: '#fafafa',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    goalAmount: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: height * 0.017
    },
    forGoalAmount: {
        color: '#14b910'
    },
    goalText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000',
        marginBottom: height * 0.01
    },
    goalDate: {
        fontSize: 14,
        fontWeight: '300',
        color: '#000',
        marginBottom: height * 0.01
    },
    goalEndDate: {
        color: '#454545'
    },
    goalAddBtn: {
        width: 119,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#14b910',
        borderRadius: 10
    },
    progressImg: {
        position: 'absolute',
        width: 50,
        height: 46,
        right: 12,
        top: -15,
        zIndex: 2
    },
    progressLimitImg: {
        position: 'absolute',
        width: 50,
        height: 46,
        right: 12,
        top: -22.5,
        zIndex: 2
    },
    limitsBtn: {
        width: '100%',
        height: height * 0.095,
        backgroundColor: '#F8D694',
        alignItems: 'center',
        justifyContent: 'center',
        padding: height * 0.026,
        borderRadius: 16,
        flexDirection: 'row'
    },
    limitBox: {
        width: '100%',
        height: height * 0.18,
        borderWidth: 0.5,
        borderColor: '#ddd',
        borderRadius: 16,
        backgroundColor: '#fafafa',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    limitTextContainer: {
        height: '100%'
    },
    wastedAmount: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffa800'
    },
    limitAmount: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000'
    },
    limitSubtitle: {
        fontSize: 12,
        fontWeight: '300',
        color: '#000'
    },
    btnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 7
    },
    transactionsContainer: {
        width: '100%',
        alignItems: 'flex-start',
        height: height * 0.225
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

export default Budget;