import WeatherWidget from "@/components/weather_widget";

export default function Home(){
   return (
    <div className="flex h-screen text-center justify-center items-center bg-gradient-to-t from-blue-400 to-white">
        <WeatherWidget />
    </div>
   )
}