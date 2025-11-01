import { api } from "@/lib/axios";

interface GetAllParams {
  page?: number;
  page_size?: number;
  check_type?: string;
}

export interface Stats {
  ddd?: Record<string, number>;
  fixo?: number;
  uf?: number;
  city?: number;
  invalid?: number;
  movel?: number;
  operadora?: Record<string, number>;
  portado?: number;
  total?: number;
  valid?: number;
}

interface Submitter {
  id: string;
  name: string;
}

export interface CheckerFile {
  id: string;
  stats: Stats | null | object;
  submitter: Submitter;
  check_type: string;
  original_file_name: string;
  s3_url: string;
  status: "completed" | "processing" | "failed";
  created_at: string;
  updated_at: string;
}

export interface CheckerResponse {
  data: CheckerFile[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface PhonePortateResponse {
  data?: {
    numero: string;
    operadora_original: string;
    operadora_atual?: string;
    data_portabilidade?: string;
    tipo: string;
  };
  error?: string;
}

export interface UploadFileResponse {
  id: string;
  message?: string;
  file_id?: string;
}

export class Checker {
  async getAll(params: GetAllParams = {}): Promise<CheckerResponse> {
    const { page = 1, page_size = 10, check_type = "portabilidade" } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
      check_type,
    });

    const response = await api.get(`/api/files/?${queryParams.toString()}`);

    return response.data;
  }

  async phonePortate(number: string): Promise<PhonePortateResponse> {
    const response = await api.get(`/api/check/portabilidade/${number}`);

    return response.data;
  }

  async importFile(file: File): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "portabilidade");

    const response = await api.post("/api/files/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async delete(id: string) {
    const response = await api.delete(`/api/files/${id}`);

    return response.data;
  }
}
