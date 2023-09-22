import axios from 'axios';
import {apiKey} from '../constants';

const forecastEndpoint = (params: any) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.city}&days=${params.days}&aqi=no`;
const locationsEndpoint = (params: any) =>
  `https://api.weatherapi.com/v1/search.json?key=35bef169b6f84160bb1191504232109&q=${params.city}`;

const apiCall = async (endpoint: any) => {
  const options = {
    method: 'GET',
    url: endpoint,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const fetchWeatherForecast = (params: any) => {
  let forecastUrl = forecastEndpoint(params);
  return apiCall(forecastUrl);
};

export const fetchLocations = (params: any) => {
  let locationsUrl = locationsEndpoint(params);
  return apiCall(locationsUrl);
};
