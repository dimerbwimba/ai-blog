import cities from "@/data/world-cities.json"; // We'll create this

export interface City {
  name: string;
  country: string;
  countryCode: string;
  region?: string;
}

export const CitiesService = {
  async searchCities(query: string): Promise<City[]> {
    // For now, we'll use static data
    // You can replace this with an actual API call
    const filteredCities = cities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Limit to 10 results

    return filteredCities;
  },

  async getPopularCities(): Promise<City[]> {
    return [
      { name: "Paris", country: "France", countryCode: "FR" },
      { name: "London", country: "United Kingdom", countryCode: "GB" },
      { name: "New York", country: "United States", countryCode: "US" },
      { name: "Tokyo", country: "Japan", countryCode: "JP" },
      { name: "Dubai", country: "United Arab Emirates", countryCode: "AE" },
      // Add more popular cities
    ];
  }
}; 