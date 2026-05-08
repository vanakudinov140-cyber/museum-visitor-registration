export interface SlotDTO {
  id: string;
  date: string;
  time: string;
  maxVisitors: number;
  bookedVisitors: number;
  available: number;
  isFull: boolean;
}

export interface RegisterResponse {
  success: boolean;
  booking: {
    id: string;
    date: string;
    timeSlot: string;
    userName: string;
  };
}
