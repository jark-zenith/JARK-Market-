const API_BASE=import.meta.env.VITE_API_URL||'/api';

export async function apiGet(path){
 const response=await fetch(`${API_BASE}${path}`);
 if(!response.ok) throw new Error(`API request failed: ${response.status}`);
 return response.json();
}

export const api={health:()=>apiGet('/health'),catalog:()=>apiGet('/catalog')};
