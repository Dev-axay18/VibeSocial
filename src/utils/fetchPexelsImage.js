const generateImage = async () => {
  try {
    const response = await fetch('https://api.pexels.com/v1/search?query=technology&per_page=1', {
      headers: {
        Authorization: import.meta.env.VITE_PEXELS_API_KEY
      }
    });
    const data = await response.json();
    return data.photos[0]?.src.large || fallbackImage;
  } catch {
    return fallbackImage;
  }
}
