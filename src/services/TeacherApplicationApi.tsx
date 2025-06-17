import { API_URL } from "@/constants";

export interface ApplicationData {
  [key: string]: any;
}

/**
 * Sends the teacher application data (including optional video blob) to the backend.
 * @param data - An object mapping form field names to values or Blob for video.
 */
export async function sendApplication(

  data: ApplicationData
) {
const formData = new FormData();
for (const [key, value] of Object.entries(data)) {
  const processedValue = Array.isArray(value) ? JSON.stringify(value) : value;
  formData.append(key, processedValue);
} 


  

  const response = await fetch(`${API_URL}/submit_application`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text}`);
  }

  return response.json();
}