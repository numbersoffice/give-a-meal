/**
 * Geocode an address using Google Maps Geocoding API
 * @param address - Address to geocode
 * @returns {number, number} - Latitude and longitude
 */
export default async function geocodeAddress(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      return {
        lat: data.results[0].geometry.location.lat,
        lon: data.results[0].geometry.location.lng,
      };
    } else {
      console.error("Geocoding failed:", data.status);
    }
  } catch (error) {
    console.error("Error during geocoding:", error);
  }
}
