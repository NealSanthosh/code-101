import React,{Component}from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    FlatList} from 'react-native';
import {Card, ListItem, Icon} from 'react-native-elements';
//import SantaAnimation from '../components/SantaClaus.js';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'



export default class MyDonationScreen extends Component{
    constructor(){
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            allDonations : [],
            donorName: ""
        }
    }
    static navigationOptions = { header: null };

    getDonorDetails=(donorId)=>{
      db.collection("users").where("email_id","==", donorId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          this.setState({
            "donorName" : doc.data().first_name + " " + doc.data().last_name
          })
        });
      })
    }
 
    getAllDonations =()=>{
      this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.userId) 
      .onSnapshot((snapshot)=>{ 
       var allDonations = snapshot.docs.map(
         document => document.data()
         ); 
         this.setState({
            allDonations : allDonations, 
           }); 
         }) 
       }

    sendNotification = (bookDetails, request_status)=>{
      var donorId = bookDetails.donor_id
      var requestId = bookDetails.request_id
      db.collection('all_notifications').where("request_id","==",requestId).where("donor_id","==",donorId).get()
      .then((snapshot)=>{
        snapshot.forEach(()=>{
          var message = ""
          if(requestStatus === "Book Sent"){ 
            message = this.state.donorName + " sent you book" 
          }else{ 
            message = this.state.donorName + " has shown interest in donating the book" 
          }
          db.collection("all_notifications").doc(doc.id)
          .update({ "message": message, "notification_status" : "unread", "date" : firebase.firestore.FieldValue.serverTimestamp() })
        })
      })
    }
    sendBook =(bookDetails)=>{
      if (bookDetails.request_status === "Book Sent") {
        var request_status = "Donor Interested"
        db.collection("all_donations").doc(bookDetails.doc_id).update({
          "request_status" : "Donor Interested" 
        })
        this.sendNotification(bookDetails, request_status)
      }else {
        var request_status = "Book Sent"
        db.collection("all_donations").doc(bookDetails.doc_id).update({
          "request_status" : "Book Sent" 
        })
        this.sendNotification(bookDetails, request_status)
      }
    }
  
    keyExtractor = (item, index) => index.toString()
    renderItem = ( {item, i} ) =>{
      return (
        <ListItem
          key={i}
          title={item.book_name}
          subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
          titleStyle={{ color: 'black', fontWeight: 'bold' }}
          leftElement={
            <Icon name="book" type="font-awesome" color ='#696969'/>}
          rightElement={
              <TouchableOpacity style={[ styles.button, { backgroundColor : item.request_status === "Book Sent" ? "green" : "#ff5722" } ]}
              onPress={
                this.sendBook(item)
              }>
                <Text style={{color:'#ffff'}}>{ item.request_status === "Book Sent" ? "Book Sent" : "Send Book" }</Text>
              </TouchableOpacity>
            }
          bottomDivider
        />
      )
    }
    componentDidMount(){
      console.log("Component Mounted");
      this.getDonorDetails(this.state.userId)
      this.getAllDonations()
    }
    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title="My Donations" navigation ={this.props.navigation}/>
                <View style={{flex:1}}>
                  {
                    this.state.allDonations.length === 0
                    ?(
                      <View style={styles.subtitle}>
                        <Text style={{ fontSize: 20}}>List Of All Book Donations</Text>
                      </View>
                    )
                    :(
                      <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.allDonations}
                        renderItem={this.renderItem}
                      />
                    )
                  }
                </View>
              </View>
        )
    }
}
const styles = StyleSheet.create({ 
    button:{ 
        width:100, 
        height:30, 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:"#ff5722", 
        shadowColor: "#000", 
        shadowOffset: { 
            width: 0, 
            height: 8 }, 
            elevation : 16 
    }, 
    subtitle :{ 
        flex:1, 
        fontSize: 20, 
        justifyContent:'center', 
        alignItems:'center' 
    } 
})