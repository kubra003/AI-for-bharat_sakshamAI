import axios from 'axios';

// API Base URL - Replace with your actual API Gateway URL after deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://10wxt88kuh.execute-api.ap-south-1.amazonaws.com/prod';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Helper function to convert base64 to blob
const base64ToBlob = (base64, contentType = 'image/jpeg') => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

// Vision Assistance APIs

export const detectObjects = async (imageBase64, language = 'en') => {
  try {
    const response = await apiClient.post('/vision/detect-objects', {
      image: imageBase64,
      language: language
    });
    return response.data;
  } catch (error) {
    console.error('Error detecting objects:', error);
    throw error;
  }
};

export const extractText = async (imageBase64, language = 'en') => {
  try {
    const response = await apiClient.post('/vision/extract-text', {
      image: imageBase64,
      language: language
    });
    return response.data;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
};

export const recognizeFace = async (imageBase64, userId) => {
  try {
    const response = await apiClient.post('/vision/recognize-face', {
      image: imageBase64,
      userId: userId
    });
    return response.data;
  } catch (error) {
    console.error('Error recognizing face:', error);
    throw error;
  }
};

export const detectCurrency = async (imageBase64, language = 'en') => {
  try {
    const response = await apiClient.post('/detect-currency', {
      image: imageBase64,
      language: language
    });
    return response.data;
  } catch (error) {
    console.error('Error detecting currency:', error);
    throw error;
  }
};

// Communication APIs

export const textToSpeech = async (text, language = 'en', voiceGender = 'female') => {
  try {
    const response = await apiClient.post('/text-to-speech', {
      text: text,
      language: language,
      voiceGender: voiceGender
    });
    return response.data;
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
};

export const speechToText = async (audioBlob, language = 'en') => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language', language);

    const response = await apiClient.post('/communication/speech-to-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error converting speech to text:', error);
    throw error;
  }
};

// Healthcare APIs

export const simplifyMedicalReport = async (imageBase64, language = 'en') => {
  try {
    const response = await apiClient.post('/healthcare/simplify-report', {
      image: imageBase64,
      language: language
    });
    return response.data;
  } catch (error) {
    console.error('Error simplifying medical report:', error);
    throw error;
  }
};

export const readPrescription = async (imageBase64, language = 'en') => {
  try {
    const response = await apiClient.post('/read-prescription', {
      image: imageBase64,
      language: language
    });
    return response.data;
  } catch (error) {
    console.error('Error reading prescription:', error);
    throw error;
  }
};

// Information Assistant APIs

export const askQuestion = async (question, language = 'en', conversationId = null) => {
  try {
    const response = await apiClient.post('/information/ask', {
      question: question,
      language: language,
      conversationId: conversationId
    });
    return response.data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
};

export const getGovernmentSchemes = async (language = 'en', category = 'all') => {
  try {
    const response = await apiClient.get('/information/schemes', {
      params: {
        language: language,
        category: category
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching government schemes:', error);
    throw error;
  }
};

// Emergency APIs

export const sendEmergencyAlert = async (userId, location) => {
  try {
    const response = await apiClient.post('/emergency/alert', {
      userId: userId,
      location: location,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error sending emergency alert:', error);
    throw error;
  }
};

export const getEmergencyContacts = async (userId) => {
  try {
    const response = await apiClient.get(`/emergency/contacts/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    throw error;
  }
};

export const updateEmergencyContacts = async (userId, contacts) => {
  try {
    const response = await apiClient.put(`/emergency/contacts/${userId}`, {
      contacts: contacts
    });
    return response.data;
  } catch (error) {
    console.error('Error updating emergency contacts:', error);
    throw error;
  }
};

// User APIs

export const getUserProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/user/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await apiClient.put(`/user/profile/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export default apiClient;
