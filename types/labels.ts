export interface Label {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateLabelRequest {
  id: string;
  name: string;
}
