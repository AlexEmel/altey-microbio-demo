import { IApiRes } from '@/interfaces/api.interface';
import { AxiosError, AxiosResponse } from 'axios';

export const handleApiRes = async <T>(request: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const res = await request;
    return res.data as T;
  } catch (err) {
    if (err instanceof AxiosError) {
      const axiosErr = err as AxiosError<IApiRes<void>>;
      if (axiosErr.response?.data) {
        return axiosErr.response.data as T;
      } else {
        return { success: false, message: axiosErr.message } as T;
      }
    } else {
      return { success: false, message: 'Внутренняя ошибка сервера' } as T;
    }
  }
};
