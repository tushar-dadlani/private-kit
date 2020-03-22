import React, {
    Component
} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Linking,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    BackHandler,
    Button
} from 'react-native';
import colors from "../constants/colors";
import LocationServices from '../services/LocationService';
import exportImage from './../assets/images/export.png';
import news from './../assets/images/newspaper.png';
import Geolocation from '@react-native-community/geolocation';

import pkLogo from './../assets/images/PKLogo.png';

import {GetStoreData, SetStoreData} from '../helpers/General';
import languages from './../locales/languages'

const width = Dimensions.get('window').width;

class LocationTracking extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLogging:'',
            lastPosition: 'unknown',
            initialPosition: 'unknown'
        }
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress); 
        GetStoreData('PARTICIPATE')
        .then(isParticipating => {
            console.log(isParticipating);
               
                if(isParticipating === 'true'){
                    this.setState({
                        isLogging:true
                    })
                    this.willParticipate()
                }
                else{
                    this.setState({
                        isLogging:false
                    }) 
                }
        })
        .catch(error => console.log(error))

        
        Geolocation.getCurrentPosition(
            position => {
              const initialPosition = JSON.stringify(position);
              this.setState({initialPosition});
            },
            error => Alert.alert('Error', JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
          )
          
        Geolocation.watchPosition(position => {
            const lastPosition = JSON.stringify(position);
            this.setState({lastPosition});
          });


    }

    componentWillUnmount() {     BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);   }   

    handleBackPress = () => {     
        BackHandler.exitApp(); // works best when the goBack is async     
        return true;   
    };   
    export() {
        this.props.navigation.navigate('ExportScreen', {})
    }

    import() {
        this.props.navigation.navigate('ImportScreen', {})
    }

    news() {
        this.props.navigation.navigate('NewsScreen', {})
    }


    setOptOut =()=>{
        this.setState({
            isLogging:false
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >

                <ScrollView contentContainerStyle={styles.main}>
                    <View style={styles.topView}>
                        <View style={styles.intro} >

                            <Text style={styles.headerTitle}>{languages.t('label.private_kit')}</Text>

                            {
                                this.state.isLogging  ? (
                                    <>
                                    <Image source={pkLogo} style={{width:132,height:164.4,alignSelf:'center',marginTop:12}} />

                                <TouchableOpacity onPress={() => this.setOptOut()} style={styles.stopLoggingButtonTouchable} >
                                <Text style={styles.stopLoggingButtonText}>{languages.t('label.stop_logging')}</Text>
                            </TouchableOpacity>
                            </>
                            ) : ( 
                            <>
                            <Image source={pkLogo} style={{width:132,height:164.4,alignSelf:'center',marginTop:12,opacity:.3}} />
                            <TouchableOpacity onPress={() => this.willParticipate()} style={styles.startLoggingButtonTouchable} >
                                <Text style={styles.startLoggingButtonText}>{languages.t('label.start_logging')}</Text>
                            </TouchableOpacity>
                            </>)
                            }

                           
                           {this.state.isLogging ?  
                            <Text style={styles.sectionDescription}>{languages.t('label.logging_message')}</Text> :
                            <Text style={styles.sectionDescription}>{languages.t('label.not_logging_message')}</Text> }
                        

                        </View>
                    </View>

                    <View style={styles.actionButtonsView}>
                        <TouchableOpacity onPress={() => this.import()}  style={styles.actionButtonsTouchable}>
                            <Image style={styles.actionButtonImage} source={exportImage} resizeMode={'contain'}></Image>
                            <Text style={styles.actionButtonText}>{languages.t('label.import')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.export()} style={styles.actionButtonsTouchable}>
                            <Image style={[styles.actionButtonImage,{transform:[{rotate:'180deg'}]}]} source={exportImage} resizeMode={'contain'}></Image>
                            <Text style={styles.actionButtonText}>{languages.t('label.export')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.news()} style={styles.actionButtonsTouchable}>
                            <Image style={styles.actionButtonImage} source={news} resizeMode={'contain'}></Image>
                            <Text style={styles.actionButtonText}>{languages.t('label.news')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Text style={[styles.sectionDescription, { textAlign: 'center', paddingTop: 15 }]}>{languages.t('label.url_info')} </Text>
                    <Text style={[styles.sectionDescription, { color: 'blue', textAlign: 'center',marginTop:0 }]} onPress={() => Linking.openURL('https://privatekit.mit.edu')}>{languages.t('label.private_kit_url')}</Text>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    // Container covers the entire screen
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.PRIMARY_TEXT,
        backgroundColor: colors.WHITE,
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: 38,
        padding: 0,
        fontFamily:'OpenSans-Bold'
    },
    subHeaderTitle: {
        textAlign: 'center',
        fontWeight: "bold",
        fontSize: 22,
        padding: 5
    },
    main: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: "80%"
    },
    block: {
        margin: 20,
        width: "100%"
    },
    footer: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingBottom: 10
    },
    intro: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    sectionDescription: {
        fontSize: 12,
        lineHeight: 24,
        fontFamily:'OpenSans-Regular',
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    startLoggingButtonTouchable:{
        borderRadius: 12,
        backgroundColor: "#665eff",
        height:52,
        alignSelf:'center',
        width:width*.7866,
        marginTop:30,
        justifyContent:'center'
    },
    startLoggingButtonText:{
        fontFamily: "OpenSans-Bold",
        fontSize: 14,
        lineHeight: 19,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff"
    },
    stopLoggingButtonTouchable:{
        borderRadius: 12,
        backgroundColor: "#fd4a4a",
        height:52,
        alignSelf:'center',
        width:width*.7866,
        marginTop:30,
        justifyContent:'center',
    },
    stopLoggingButtonText:{
        fontFamily: "OpenSans-Bold",
        fontSize: 14,
        lineHeight: 19,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff"
    },
    actionButtonsView:{
        width:width*.7866,
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:64
    },
    actionButtonsTouchable:{
        height: 76,
        borderRadius: 8,
        backgroundColor: "#454f63",
        width:width*.23,
        justifyContent:'center',
        alignItems:'center'
    },
    actionButtonImage:{
        height:21.6,
        width:32.2
    },
    actionButtonText:{
        opacity: 0.56,
        fontFamily: "OpenSans-Bold",
        fontSize: 12,
        lineHeight: 17,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff",
        marginTop:6
    }
});

export default LocationTracking;
