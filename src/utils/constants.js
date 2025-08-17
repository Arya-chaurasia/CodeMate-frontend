//This is for AWS ec2 deployment
// export const BASE_URL = location.hostname === "localhost" ? "http://localhost:3000" :  "/api";


// For Create React App, use process.env; for Vite, use import.meta.env
export const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
