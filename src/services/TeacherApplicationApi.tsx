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
): Promise<{ status: string; id: string }> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof Blob) {
      // Append video blob with a filename
      formData.append(key, value, "demo.webm");
    } else {
      formData.append(key, String(value));
    }
  });

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