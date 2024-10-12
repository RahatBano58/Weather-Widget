"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
}

export default function WeatherWidget() {
    const [location, setLocation] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedLocation = location.trim();
        if (trimmedLocation === "") {
            setError("Please enter a valid location.");
            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if (!response.ok) {
                throw new Error("City not found");
            }
            const data = await response.json();
            const weatherData: WeatherData = {
                temperature: data.current.temp_c,
                description: data.current.condition.text,
                location: data.location.name,
                unit: "C",
            };
            setWeather(weatherData);
        } catch (error: unknown) {
            setError("City not found. Please try again.");
            setWeather(null);
        } finally {
            setIsLoading(false);
        }
    };

    function getTemperatureMessage(temperature: number, unit: string): string {
        if (unit === "C") {
            if (temperature < 0) {
                return `It's freezing at ${temperature}°C! Bundle up!`;
            } else if (temperature < 10) {
                return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
            } else if (temperature < 20) {
                return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
            } else if (temperature < 30) {
                return `It's pleasant at ${temperature}°C. Enjoy the nice weather!`;
            } else {
                return `It's hot at ${temperature}°C. Stay hydrated!`;
            }
        } else {
            // Placeholder for other temperature units (e.g., Fahrenheit)
            return `${temperature}°${unit}`;
        }
    }

    function getWeatherMessage(description: string): string {
        switch (description.toLowerCase()) {
            case "sunny":
                return "It's a beautiful sunny day!";
            case "partly cloudy":
                return "Expect some clouds and sunshine today.";
            case "cloudy":
                return "It's cloudy today. Be careful!";
            case "overcast":
                return "The sky is overcast.";
            case "rain":
                return "It's raining. Bring an umbrella.";
            case "thunderstorm":
                return "Thunderstorms are expected today.";
            case "snow":
                return "Bundle up! It's snowing.";
            case "mist":
                return "It's a misty day.";
            case "fog":
                return "Fog is expected today.";
            default:
                return description; // Default to returning the original description
        }
    }

    function getLocationMessage(location: string): string {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        return `Weather for ${location} ${isNight ? "at night" : "during the day"}`;
    }

    return (
        <div className="flex justify-center items-center h-screen ">
            <Card className="w-full max-w-md mx-auto text-center border-black">
                <CardHeader>
                    <CardTitle>Weather Widget</CardTitle> 
                    <CardDescription>Search for the current weather conditions in your city</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <Input
                            type="text"
                            placeholder="Enter a city name"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Search"}
                        </Button>
                    </form>
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                    {weather && (
                        <div className="mt-4 grid gap-2">
                            <div className="flex items-center gap-2">
                                <ThermometerIcon className="w-6 h-6" />
                                {getTemperatureMessage(weather.temperature, weather.unit)}
                            </div>
                            <div className="flex items-center gap-2">
                                <CloudIcon className="w-6 h-6" />
                                {getWeatherMessage(weather.description)}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-6 h-6" />
                                {getLocationMessage(weather.location)}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
