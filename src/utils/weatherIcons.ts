import clearSkyDay from '../icons/weather/clear-day.svg';
import clearSkyNight from '../icons/weather/clear-night.svg';
import fewCloudsDay from '../icons/weather/partly-cloudy-day.svg';
import fewCloudsNight from '../icons/weather/partly-cloudy-night.svg';
import cloudy from '../icons/weather/cloudy.svg';
import overcast from '../icons/weather/overcast.svg';
import showerRainDay from '../icons/weather/partly-cloudy-day-drizzle.svg';
import showerRainNight from '../icons/weather/partly-cloudy-night-drizzle.svg';
import rainDay from '../icons/weather/partly-cloudy-day-rain.svg';
import rainNight from '../icons/weather/partly-cloudy-night-rain.svg';
import thunderstormDay from '../icons/weather/thunderstorms-day.svg';
import thunderstormNight from '../icons/weather/thunderstorms-night.svg';
import snowDay from '../icons/weather/partly-cloudy-day-snow.svg';
import snowNight from '../icons/weather/partly-cloudy-night-snow.svg';
import mistDay from '../icons/weather/fog-day.svg';
import mistNight from '../icons/weather/fog-night.svg';

type WeatherIcons = {
    [key: string]: string;
};

const weatherIcons:WeatherIcons = {};
weatherIcons['01d'] = clearSkyDay;
weatherIcons['01n'] = clearSkyNight;
weatherIcons['02d'] = fewCloudsDay;
weatherIcons['02n'] = fewCloudsNight;
weatherIcons['03d'] = cloudy;
weatherIcons['03n'] = cloudy;
weatherIcons['04d'] = overcast;
weatherIcons['04n'] = overcast;
weatherIcons['09d'] = showerRainDay;
weatherIcons['09n'] = showerRainNight;
weatherIcons['10d'] = rainDay;
weatherIcons['10n'] = rainNight;
weatherIcons['11d'] = thunderstormDay;
weatherIcons['11n'] = thunderstormNight;
weatherIcons['13d'] = snowDay;
weatherIcons['13n'] = snowNight;
weatherIcons['50d'] = mistDay;
weatherIcons['50n'] = mistNight;

export default weatherIcons;