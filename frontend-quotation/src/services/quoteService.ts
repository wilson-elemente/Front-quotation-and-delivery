import axios from 'axios';
import  type { QuoteRequestDTO, QuoteResponseDTO } from '../types/index'; // crea este archivo si es necesario

const API_URL = 'http://localhost:3000';

export async function getQuote(data: QuoteRequestDTO): Promise<QuoteResponseDTO> {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/quote`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
