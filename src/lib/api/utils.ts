export function generateRandomString() {
  let result = "";
  for (let j = 0; j < 32; j++) {
    if (j == 8 || j == 12 || j == 16 || j == 20) result = result + "-";
    const i = Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
    result = result + i;
  }
  return result;
}

export function keysToCamel(o: any): any {
  const isArray = (a: any) => Array.isArray(a);
  const isObject = (o: any) => o === Object(o) && !isArray(o) && typeof o !== "function";
  const toCamel = (s: string) =>
    s.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace("-", "").replace("_", ""));

  if (isObject(o)) {
    const n: any = {};
    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });
    return n;
  } else if (isArray(o)) {
    return o.map((i: any) => keysToCamel(i));
  }
  return o;
}

export async function getBusinessDetailsFromGoogle(placeId: string) {
  const mapsApiKey = process.env.GOOGLE_MAPS_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?fields=geometry,address_components,international_phone_number,website,business_status,name&place_id=${placeId}&key=${mapsApiKey}`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const res: any = await response.json();
  if (!res?.result) return null;

  const addressComponents = res.result.address_components;
  const formattedComponents = addressComponents.reduce(
    (acc: any, component: any) => {
      if (component.types.includes("locality")) {
        acc.city = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        acc.state = component.short_name;
      } else if (component.types.includes("country")) {
        acc.country = component.long_name;
      } else if (component.types.includes("postal_code")) {
        acc.postalCode = component.long_name;
      } else if (component.types.includes("route")) {
        acc.address = component.long_name;
      } else if (component.types.includes("street_number")) {
        acc.streetNumber = component.long_name;
      }
      return acc;
    },
    {}
  );

  return {
    address: formattedComponents,
    location: res.result.geometry.location,
    businessStatus: res.result.business_status,
    internationalPhoneNumber: res.result.international_phone_number ?? null,
    website: res.result.website ?? null,
    placeId: placeId,
    name: res.result.name,
  };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
