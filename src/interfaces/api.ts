import { BaseQueryParams } from "./common";

export type Image = {
  data: string;
  displayOrder?: number;
};

export type ToolLanguage = {
  toolLanguageResourceId: number;
  from: number;
  to: number;
  description?: string;
  images?: Image[];
};

export type Position = {
  positionResourceId: number;
  displayOrder?: number;
  toolLanguages: ToolLanguage[];
};

export type Employee = {
  id?: number;
  name: string;
  positions: Position[];
};

export type EmployeeQueryParams = BaseQueryParams & {
  name?: string;
};

export type ToolLanguageResource = {
  toolLanguageResourceId: number;
  positionResourceId: number;
  name: string;
};

export type PositionResource = {
  positionResourceId: number;
  name: string;
  toolLanguageResources: ToolLanguageResource[];
};
