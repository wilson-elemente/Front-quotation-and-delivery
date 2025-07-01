export interface QuoteRequestDTO {
  origin: string;
  destination: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface QuoteResponseDTO {
  priceCents: number;
}


export interface RegisterShipmentDTO {
  origin: string;
  destination: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  quotedPriceCents: number;
}

export interface ShipmentResponseDTO {
  id: number;
  origin: string;
  destination: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  chargeableWeight: number;
  quotedPriceCents: number;
  status: string;
  createdAt: string;
}