import React from "react"
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"
import ProgressBarDecor from "./ProgressBarDecor";

const { height, width } = Dimensions.get('window');

const Expenses = () => {

    return (
        <View style={styles.container}>
            <View style={styles.budgetContainer}>
                <Text style={styles.budgetTitle}>Monthly limits:</Text>
                <View style={styles.budgetBox}>
                    <View style={styles.budgetTextContainer}>

                        <View style={styles.budgetItem}>
                            <Text style={styles.budgetTitleSmall}>Used this month:</Text>
                            <Text style={styles.budgetValueUsed}>2524.13$</Text>
                        </View>
                        <View style={styles.budgetItem}>
                            <Text style={styles.budgetTitleSmall}>Monthly limit:</Text>
                            <Text style={styles.budgetValueLimit}>3000.00$</Text>
                        </View>
                    </View>

                    <View style={styles.budgetBarContainer}>
                        <Image source={require('../assets/decor/crown-gold.png')} style={styles.progressImg}/>
                        <ProgressBarDecor waste={'2524.13'} limitAmount={'3000'} color={"#ffa800"}/>
                    </View>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    budgetContainer: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent:'center',
        paddingHorizontal: width * 0.08,
        marginTop: height * 0.23
    },
    budgetTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        marginBottom: height * 0.013
    },
    budgetBox: {
        width: '100%',
        height: height * 0.19,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderColor: '#ddd',
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: height * 0.085
    },
    budgetTextContainer: {
        alignItems: 'flex-start'
    },
    budgetBarContainer: {
        alignItems: 'flex-end',
        height: '100%',
        paddingTop: 5,
    },
    budgetItem: {
        marginBottom: height * 0.01,
        width: '100%',
        alignItems: 'flex-start'
    },
    budgetTitleSmall: {
        fontSize: 12,
        fontWeight: '300',
        color: '#000'
    },
    budgetValueUsed: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFA800'
    },
    budgetValueLimit: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000'
    },
    progressImg: {
        position: 'absolute',
        width: 85,
        height: 85,
        right: -5,
        top: -60,
        zIndex: 2
    },
})

export default Expenses;