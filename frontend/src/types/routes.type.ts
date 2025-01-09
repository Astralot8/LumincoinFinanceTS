export type RoutesType = {
  route: string,
  title?: string,
  filePathTemplate?: string,
  useLayout?: string | boolean,
  load?(): void,
  styles?: string[],
  
};

export type openRoute = (url: string) => Promise<void>;
