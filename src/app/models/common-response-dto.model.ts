export interface CommonResponseDTO<T> {
  data: T;
  status: string;
  message: string;
}
