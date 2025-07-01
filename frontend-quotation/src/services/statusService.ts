import axios from 'axios';

const API_URL = 'http://localhost:3000';

export async function getShipmentStatusHistory(id: string) {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/shipment/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('Shipment status history response:', response.data);
  return response.data; 
}

