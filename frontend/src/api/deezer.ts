const BACKEND_URL = 'http://localhost:3001'; // Our backend proxy URL

export const fetchDeezerData = async (endpoint: string, queryParams?: Record<string, string>) => {
  const url = new URL(`${BACKEND_URL}/api/deezer/${endpoint}`);
  if (queryParams) {
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
  }

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from Deezer API via proxy:", error);
    return null;
  }
};
