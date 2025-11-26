import { LabelAPI, LabelDB } from "./label.types";

export const labelMappers = {
  dbToAPI: (db: LabelDB): LabelAPI => ({
    id: db.id,
    name: db.name,
  }),
};
