
const BASE_URL =
  process.env.NODE_ENV=== 'development'
    ? 'http://localhost:5000'
    : 'https://ipl-dashboard2-92y5.vercel.app';
export default BASE_URL;