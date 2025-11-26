export interface Label {
  id: string;
  name: string;
}

export type LabelDto = Label & {
  createdAt: Date;
  updatedAt: Date;
};
