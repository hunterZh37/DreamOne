import React, { useState, useEffect, useRef, Component } from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, ScrollView, StatusBar } from 'react-native';
import HeaderComponent from "./HeaderComponent";
import { LogBox } from 'react-native';

import {
  Pressable,
  Box,
  HStack,
  Spacer,
  Flex,
  Center,
  NativeBaseProvider,
  Modal,
  Button,
  FormControl,
  Input,
  Checkbox,
  extendTheme,
  Text,
  
} from "native-base";
import { Entypo } from '@expo/vector-icons';


//import FilterButton from './FilterButton';



export default function filterPage({ route, navigation }) {
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();//Ignore all log notifications
  const { selectedOccasion, lat, long } = route.params;
  console.log("uhu: " + lat + " " + long);
  const [occasion, useOccasion] = useState(selectedOccasion);
  const [filters, setFilters] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({});
  const [selecttedOptions, setSelectedOption] = useState([]);
  const [chips, setChips] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("");
  const [latitude, setLatitude] = useState(lat);
  const [longitude, setLongitude] = useState(long);
  const [searchFilter, setSearchFilter] = useState("");

  const businessData = [
    { 
      name : "Taste Of India", 
      address : "2623 Monroe St #150, Madison, WI 53715", 
      photo_ref : "https://www.blueosa.com/wp-content/uploads/2020/01/the-best-top-10-indian-dishes.jpg",
      distance : "1.2 mi",
      tags: ["indian", "brunch"] ,
      dayTime : "morning",
    },
    {
      name : "Curry in the Box", 
      address : "3050 Cahill Main #3, Fitchburg, WI 53711", 
      photo_ref : "https://s3.amazonaws.com/secretsaucefiles/photos/images/000/099/395/large/Spoon-NIndian-Naan-Eunice.jpg?1485295991",
      distance : "3.2 mi",
      tags: ["indian", "brunch"],
      dayTime : "morning"
    },
    {
      name : "Orient Wok",
      address : "532 S Park St #1620, Madison, WI 53715",
      photo_ref : "http://img1.wsimg.com/isteam/ip/b144c72e-bc03-4557-9b3f-4b76474493d0/FA3A1485.jpg",
      distance : "3.5 mi",
      tags : ["chinese", "brunch"],
      dayTime : "afternoon"
    },
    {
      name : "China Wok", 
      address : "204A S Century Ave #6, Waunakee, WI 53597", 
      photo_ref : "https://scpr.brightspotcdn.com/dims4/default/1c44946/2147483647/strip/true/crop/2226x1486+0+0/resize/880x587!/quality/90/?url=http%3A%2F%2Fscpr-brightspot.s3.amazonaws.com%2Fe6%2F3d%2Fbef3fcb2430099cb314a741a37ec%2Fgenghixcohen1.jpeg",
      distance : "4.0 mi",
      tags : ["chinese", "brunch"],
      dayTime : "afternoon"
    },
    {
      name : "Flaming Wok", 
      address : "902 Regen St, Madison, WI 53715", 
      photo_ref : "https://thelistwire.usatoday.com/wp-content/uploads/sites/99/2022/07/USATSI_15565219.jpg?w=800&h=512&crop=1",
      distance : "5.1 mi",
      tags : ["chinese", "brunch"],
      dayTime : "night"
    },
    {
      name : "Asian Noodle",
      address : "91 Regen St, Madison, WI 53715",
      photo_ref : "https://lindseyeatsla.com/wp-content/uploads/2021/11/LindseyEats_Spicy_Garlic_Noodles-3.jpg",
      distance : "5.4 mi",
      tags : ["chinese", "brunch"],
      dayTime : "night"

    },
    {
      name : "QQ Express",
      address : "1401 University Ave, Madison, WI 53715",
      photo_ref : "https://tiffycooks.com/wp-content/uploads/2021/09/Screen-Shot-2021-09-21-at-5.21.37-PM.png",
      distance : "6.2 mi",
      tags : ["chinese", "brunch"],
      dayTime : "night"
    }
]

  const theme = extendTheme({
    colors: {
      // Add new color
      primary: {
        50: '#FCE9DB',
        55: '#C99789',
        60: "#fed7aa",
        65: "FFE9DC"
      },
      // Redefinig only one shade, rest of the color will remain same.
      amber: {
        400: '#FCE9DB',
      },

    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: 'light',
    },
  });
  function saveHelper() {
    let temp = chips;

    selecttedOptions.forEach((item) => {

      if (chips.indexOf(item) < 0)
        //console.log("pushed chips: " + item);
        temp.push(item);
    })
    setChips(temp);
    setModalVisible(false);

  }
  useEffect(
    function effectFunction() {
      //console.log(JSON);
      async function fetchFilters() {
        const response = await fetch('https://ancient-island-59052.herokuapp.com/filters/' + occasion);
        const json = await response.json();
        //console.log("json" + JSON.stringify(json));
        //{"Food":["Chinese","Japenese","Mexican"],"shopping":["Local Small Market","Clothing Thrift Store"]
        //,"sightseeing":["Events","Local Festivals"]}
        setFilters(json);
        let selectedFilterState = {};
        for (const [filter, options] of Object.entries(json)) {
          selectedFilterState[filter] = [];
        }
        setSelectedFilter(selectedFilterState);
        //console.log("test:"  + JSON.stringify(selectedFilterState));
      }
      fetchFilters();

    }, [console.log(selecttedOptions)]);

  function getFilterFromItem(item) {
    return item.id.split(".")[0] // item.id.split(".")[0]
  };


  function list() {
    let temp = [];
    let x = -40;
    let index = 0;
    for (const [filter, options] of Object.entries(filters)) {
      let data = [];
      //console.log(JSON.stringify(selectedFilter[filter])); 
      options.map((item, index) => {
        data.push({ id: `${filter}.${index}`, name: item }); //id : Food.0 , name : Chinese
      })
      temp.push(
        <View key={index} style={{ alignItems: "center", justifyContent: "center", paddingBottom: 10 }}>
          <Pressable
            onPress={() => {
              setModalVisible(true);
              setOptions(data);
              setCurrentFilter(filter);

            }}
          >
            <Box p="5" rounded="8" bg="primary.50" width="300" >
              <Text style={{ textAlign: "center", color: "grey", fontSize: 20, }}>
                {filter}
              </Text>

            </Box>
          </Pressable>





        </View>
      );
      index += 1;
    }
    return temp;

  };


  async function apiCall(tempString) {
    setSearchFilter(tempString);
    
        navigation.navigate('Drag and Drop', { selectedOptions: selecttedOptions, lat: latitude, long: longitude, json: businessData });

    
  }
  async function switchPage() {
    let tempString = "";
    selecttedOptions.forEach((item) => {
      tempString = tempString + item + ":";
    })
    tempString = tempString.substr(0, tempString.length - 1);
    apiCall(tempString)
    // navigation.navigate('Drag and Drop', { selectedOptions: selecttedOptions,lat:latitude,long:longitude });
  }

  function showOptions() {
    let checkBox = []

    //console.log("options are: " + JSON.stringify(options));
    options.forEach((item) => {
      if (chips.indexOf(`${currentFilter}:${item.name}`) > -1) {
      } else {
        checkBox.push(
          <Checkbox value={item.name} colorScheme="orange">
            {item.name}
          </Checkbox>
        );
      }


    })
    return checkBox;
  }

  function storeOption(value) {
    let temp = selecttedOptions;
    //console.log("value is "  +value);
    value.forEach((item) => {
      if (temp.indexOf(`${currentFilter}:${item}`) < 0) {
        temp.push(`${currentFilter}:${item}`);
      }

    })
    setSelectedOption(temp);
  }
  function removeChip(item) {
    //console.log(item);
    let temp = chips;
    const returnList = temp.filter(chip => chip !== item);
    setChips(returnList);
    setSelectedOption(returnList);
  }
  function showChips() {
    let temp = [];
    chips.forEach((item) => {
      let itemName = item.split(":")[1];
      temp.push(
        <View style={{ padding: 5, alignItems: "center" }}>
          <Pressable onPress={() => { removeChip(item) }}>

            <Box p="3" rounded="100" width="170" bg="primary.50" shadow={7}
            >
              <View style={styles.chipBoxContainer}>
                <Text style={{  color: "black", paddingRight: 15 }}>
                  {/* style={{ textAlign: "center" }} */}
                  {itemName}
                </Text>
                <Entypo name="circle-with-cross" size={24} color="primary.65" />
              </View>
            </Box>
          </Pressable>
        </View>
      )

    })
    return temp;
  }
  return (
    <NativeBaseProvider theme={theme}>

      <HeaderComponent text={occasion} />

      <ScrollView >



        <Box safeAreaTop>
        <View style={{ top: 10, alignItems: "center" }}>
          <Box
            shadow="2"
            rounded="lg"
            w={{ base: "20", md: "100", lg: "md" }}
            bg="primary.55"
            style={{ padding: 4, width: 360 }}
          >
            <View style={styles.instruction}>
              <Text style={{ color: "white", fontSize: 20, top: -30, right: -30 }}>
                Specify your preferences from below
              </Text>

            </View>
            {list()}
          </Box>
        </View>
        <View style={styles.chipBox}>

          <Box p="5" rounded="8" bg="primary.55" width="360" >
            <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
              Your chosen Preferences:
            </Text>

            {showChips()}



          </Box>
        </View>
        <View>
          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Choose your Preferences</Modal.Header>
              <Modal.Body>
                <Checkbox.Group onChange={(value) => { storeOption(value) }}>
                  {showOptions()}
                </Checkbox.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    
                    onPress={() => {
                      setModalVisible(false)
                    }}
                  >
                    <Text style={{ color: "primary.55" }}>
                      Cancel
                    </Text>

                  </Button>
                  <Button
                    onPress={() => {
                      saveHelper()
                    }}
                    backgroundColor = "#C99789"
                    backcolor="primary.50"
                    
                  >
                    Save
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </View>
        </Box>
        <HStack backgroundColor = "#C99789" height = "130" top = "10" alignItems="center" safeAreaBottom shadow={6}>
        
        <Button onPress={() => switchPage()}
          height = "50"
          backgroundColor = "#C99789"
          width = {Dimensions.get('window').width}>

          
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ top: 3, fontSize: 20}}>
              SELECT PREFERENCES
            </Text>
            <Entypo name="arrow-with-circle-right" size={30}  style={{ left: 20, top:-4 }} />
          </View>

        </Button>
        </HStack>
        
      </ScrollView>


    </NativeBaseProvider>




  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",

  },
  picker: {
    marginVertical: 10,
    width: 200,
    top: -100,


  },
  button: {
    paddingTop: 50,
  },
  text: {
    fontSize: 18,
    paddingTop: 0,
    color: "grey",
    flex: 1,
    alignItems: "center",
  },
  instruction: {
    display: "flex",
    left: -30,
    top: 40,
    alignItems: "center",
    paddingBottom : 30,
  },
  chipBox: {
    alignItems: "center",
    justifyContent: "center",
    top: 40,
    paddingBottom: 100,
  },
  chipBoxContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",

  }
});