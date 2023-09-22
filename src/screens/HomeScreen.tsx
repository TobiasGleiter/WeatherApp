import {debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import {MapIcon} from 'react-native-heroicons/solid';
import * as Progress from 'react-native-progress';
import {fetchLocations, fetchWeatherForecast} from '../api/weather';
import {weatherImages} from '../constants';
import {getData, storeData} from '../utils/store';

export default function HomeScreen() {
  const isDarkMode = useColorScheme() === 'dark';

  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleSearchDebounced = debounce(search => {
    if (search && search.length > 2)
      fetchLocations({city: search}).then((data: any) => {
        setLocations(data);
      });
  }, 300);

  // Event handler for TextInput change
  const handleTextChange = (newText: string) => {
    handleSearchDebounced(newText); // Pass the new text to the debounced function
  };

  const toggleSearch = (theShowSearch: boolean) => {
    setShowSearch(theShowSearch);
  };

  const handleLocation = (location: any) => {
    setLoading(true);
    setLocations([]);
    fetchWeatherForecast({
      city: location.name,
      days: '3',
    }).then(data => {
      setWeather(data);
      setShowSearch(false);
      storeData('city', location.name);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchWeatherDataFromStore();
  }, []);

  const fetchWeatherDataFromStore = async () => {
    let myCity = await getData('city');
    let city = 'Pleidelsheim';

    if (myCity) {
      city = myCity;
    }
    fetchWeatherForecast({
      city,
      days: '3',
    }).then(data => {
      // console.log('got data: ',data.forecast.forecastday);
      setWeather(data);
      setLoading(false);
    });
  };

  const {current, location, forecast}: any = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Image
        blurRadius={70}
        source={require('../public/background.jpg')}
        className="absolute h-full w-full"
      />
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          {/** Search section */}
          <View className="h-[7px] mx-4 relative z-50">
            <View
              className={`flex flex-row items-center py-3 justify-end rounded-full ${
                showSearch ? 'bg-white/20' : 'bg-transparent'
              } `}>
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextChange}
                  placeholder="Search City"
                  placeholderTextColor={'lightgray'}
                  className="ml-6 flex-1 text-base text-white pb-1"
                />
              ) : null}
              <TouchableOpacity
                className="bg-white/30 rounded-full p-2 m-1"
                onPress={() => toggleSearch(!showSearch)}>
                <MagnifyingGlassIcon size={25} color={'white'} />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-16 rounded-3xl divide-y-0.5">
                {locations.map((location: any, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(location)}
                      key={index}
                      className="flex-row items-center border-0 p-3 px-4 mb-1">
                      <MapIcon size={20} color="gray" />
                      <Text className="ml-2 text-black text-lg">
                        {location?.name}, {location?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          {/** Forecaset section */}
          <View className="mx-4 flex justify-around flex-1 mb-2 mt-6">
            {/** Location */}
            <Text className="text-white text-center text-2xl font-bold">
              {location?.name}{' '}
              <Text className=" text-lg font-semibold text-gray-300">
                {location?.country}
              </Text>
            </Text>
            {/** Weather image */}
            <View className="flex-row justify-center">
              <Image
                source={weatherImages[current?.condition?.text || 'other']}
                className="h-52 w-52"
              />
            </View>
            {/** degree celsius */}
            <View className="space-y-2">
              <Text className="text-center font-bold text-white text-6xl ml-5">
                {current?.temp_c} &#176;C
              </Text>
              <Text className="text-center font-bold text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            {/** Other stats */}
            <View className="flex-row justify-between mx-4">
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../public/icons/wind.png')}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.wind_kph} km/h
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../public/icons/drop.png')}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.humidity} %
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../public/icons/sun.png')}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>
          {/** forecast for next days  */}
          <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size={22} color="white" />
              <Text className="text-white text-base">Daily forecast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 15}}
              showsHorizontalScrollIndicator={false}>
              {forecast?.forecastday?.map((item: any, index: number) => {
                const date = new Date(item.date);
                const options: object = {weekday: 'long'};
                let dayName = date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0];

                return (
                  <View
                    key={index}
                    className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4 bg-white/20">
                    <Image
                      // source={{uri: 'https:'+item?.day?.condition?.icon}}
                      source={
                        weatherImages[item?.day?.condition?.text || 'other']
                      }
                      className="w-11 h-11"
                    />
                    <Text className="text-white">{dayName}</Text>
                    <Text className="text-white text-xl font-semibold">
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
