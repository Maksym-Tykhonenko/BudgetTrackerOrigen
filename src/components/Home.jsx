import React, { useState } from "react"
import { View, Text,TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from "react-native"
import { useNavigation } from "@react-navigation/native";
import Welcome from "./Welcome";
import Expenses from "./Expenses";
import Goals from "./Goals";
import Crown from "./Crown";

const { height, width } = Dimensions.get('window');

const Home = () => {
    const navigation = useNavigation();
    const [componentIndex, setComponentIndex] = useState(0);

    const components = [ <Welcome />, <Expenses />, <Goals />, <Crown /> ]

    const handleButtonPress = () => {
        setComponentIndex((prevIndex) => (prevIndex + 1) % components.length);

        if(componentIndex === 3) {
            navigation.navigate('BudgetScreen')
        }
    };

    return (
        <ImageBackground
        source={require('../assets/back/bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >

        <View style={styles.container}>
            {components[componentIndex]}
            <View style={styles.infoContainer}>
                {
                    componentIndex === 0 && 
                    <Text style={styles.title}>Welcome to Budget Crown! 🎉</Text>
                }
                {
                    componentIndex === 1 && 
                    <Text style={styles.title}>Easily Track Your Expenses! 📊</Text>
                }
                {
                    componentIndex === 2 && 
                    <Text style={styles.title}>Easily Track Your Goals! 📊</Text>
                }
                {
                    componentIndex === 3 && 
                    <Text style={styles.title}>Set Your Budget! 💰</Text>
                }

                {
                    componentIndex === 0 && 
                    <Text style={styles.text}>Track your finances and earn crowns for good money habits.</Text>
                }
                {
                    componentIndex === 1 && 
                    <Text style={styles.text}>Set your spending limit and track it with simple statistics</Text>
                }
                {
                    componentIndex === 2 && 
                    <Text style={styles.text}>Set your goals and track it with simple statistics</Text>
                }
                {
                    componentIndex === 3 && 
                    <Text style={styles.text}>Always be "with the crown" and manage your money properly</Text>
                }

            <TouchableOpacity style={styles.btn} onPress={handleButtonPress}>
                <Text style={styles.btnText}>{componentIndex === 0 ? 'Start now' : componentIndex === 3 ? 'Start' : 'Next'}</Text>
            </TouchableOpacity>
            <Text style={styles.description}>
                *This mobile app is designed to track your budget by entering data yourself,
                 it has no connection with real money or banking system, with this app you can 
                 plan your budget and track it yourself
            </Text>

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
        paddingTop: height * 0.06,
    },
    infoContainer: {
        width: '100%',
        paddingHorizontal: width * 0.1,
        alignItems: 'center',
        position: 'absolute',
        bottom: height * 0.11
    },
    title: {
        color: '#F9A13A',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: height * 0.017
    },
    text: {
        fontWeight: '400',
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
        marginBottom: height * 0.034
    },
    btn: {
        width: 194,
        padding: height * 0.012,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#F9A13A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 3,
        marginBottom: height * 0.04
    },
    btnText: {
        fontWeight: '400',
        fontSize: 15,
        color: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 3,
    },
    description: {
        fontSize: 13,
        fontWeight: '300',
        textAlign: 'center',
        color: '#e8e7e4'
    }
})

export default Home;