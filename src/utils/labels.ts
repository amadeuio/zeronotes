import type { Label, LabelDto } from '@/types';

export const mapLabelDtosToLabelsMap = (labelsDto: LabelDto[]): Record<string, Label> => {
  return labelsDto.reduce(
    (acc, labelDto) => {
      const { createdAt, updatedAt, ...label } = labelDto;
      acc[labelDto.id] = label;
      return acc;
    },
    {} as Record<string, Label>,
  );
};
