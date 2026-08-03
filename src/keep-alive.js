// This script runs in the background and pings your backend every 2 minutes
const BACKEND_URL = 'https://welcoming-energy.up.railway.app/ping';

const pingBackend = async () => {
  try {
    const response = await fetch(BACKEND_URL);
    if (response.ok) {
      console.log('🟢 Backend is awake.');
    } else {
      console.warn('🟡 Backend wake-up failed.');
    }
  } catch (error) {
    console.error('🔴 Backend is currently asleep or unreachable.');
  }
};

setInterval(pingBackend, 120000);
pingBackend();