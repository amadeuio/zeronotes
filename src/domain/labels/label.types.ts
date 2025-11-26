export interface LabelDB {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface LabelAPI {
  id: string;
  name: string;
}

export interface LabelCreateRequest {
  id: string;
  name: string;
}

export interface LabelUpdateRequest {
  name: string;
}
