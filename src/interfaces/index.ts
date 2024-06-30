export type Image = {
  id: number;
  cdnUrl: string;
  displayOrder: number;
};

export type ToolLanguageFromTo = {
  toolLanguageResourceId: number;
  from: number;
  to: number;
};

export type ToolLanguage = ToolLanguageFromTo & {
  description: string;
  images: Image[];
};

export type Employee = {
  id: number;
  positionResourceId: number;
  displayOrder: number;
  toolLanguages: ToolLanguage[];
};
