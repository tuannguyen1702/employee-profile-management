export type BaseSize = 'sm' | 'md' | 'lg';

export type SelectOptions = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type BaseQueryParams = {
  _page: string;
  _limit: string;
}
