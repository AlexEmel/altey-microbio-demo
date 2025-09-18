export interface IApiRes<T> {
  success: boolean;
  payload?: T;
  error?: string;
}