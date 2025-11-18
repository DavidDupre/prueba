export interface SenderData {
  senderName: string;
  country: string;
  department: string;
  municipality: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  physicalStickerCode: string;
  ministryCode: string;
  broadcastChannel: string;
  requestDate: string;
}

export interface AffectedData {
  documentType: string;
  documentNumber: string;
  affectedName: string;
}

export type RequestDetail = string;

export interface SupportDocument {
  id: string;
  name: string;
  label: string;
  type: 'pdf' | 'image';
  url: string;
}