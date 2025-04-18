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
  name_like?: string;
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

export type User = {
  id?: number;
  name: string;
  userId: string;
  level: string;
  parentId: string | null;
  nameForSearch?: string;
  leaf?: number;
  commissionSettingId?: string;
};

export type UserQueryParams = BaseQueryParams & {
  name_like?: string;
};

export type UserRelated = {
  id?: number;
  userId: string;
  parentId: string;
};

export type ConfigData = {
  key: string;
  value: unknown;
};


export type UserSetting = {
  timestamp: string;
  token: string;
  msg: string;
};