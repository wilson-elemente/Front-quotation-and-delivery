import axios from 'axios';
import type { RegisterShipmentDTO, ShipmentResponseDTO } from '../types';

const API_URL = 'http://localhost:3000';

export async function registerShipment(data: RegisterShipmentDTO): Promise<ShipmentResponseDTO> {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/shipment`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}