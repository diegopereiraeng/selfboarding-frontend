export class Repository {
  id?: any;
  name?: string;
  description?: string;
  enabled?: boolean;
  branch?: string;
  language?: string;
  subLanguages?: Array<string>;
  owner?: string;
  contributors?: Array<string>;
  provider?: string;
  link?: string;
}
