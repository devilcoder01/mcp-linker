export type serverConfig = {
  command: string;
  args?: string[];
  env?: Record<string, any>;
  disabled?: boolean;
  autoApprove?: string[];
};

export type Server = {
  id?: number;
  name: string;
  developer?: string;
  icon_url?: string;
  description: string;
  category?: string;
  source?: string;
  is_official?: boolean;
  is_hot?: boolean;
  is_featured?: boolean;
  configs: serverConfig[];
};

export interface Category {
  id: string;
  name: string;
  icon: JSX.Element;
  content: string;
}
