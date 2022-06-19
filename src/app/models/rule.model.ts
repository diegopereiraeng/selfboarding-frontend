export interface TemplateRule {
  id: string; 
  yaml?: string
  versionLabel?: string
}

export class Rule {
  identifier?: string;
  name?: string;
  description?: string;
  tags?: any;
  enabled?: boolean;
  templateMatchType?: string;
  templatesRule?: Array<TemplateRule>;
  field?: string;
  clause?: string;
  value?: string;
  project?: string;
  organization?: string;
  lastUpdatedAt?: number;
  createdAt?: number;
  weight?: number;

  public constructor(identifier?: string, name?: string, description?: string, enabled?: boolean, templateMatchType?: string, templatesRule?: Array<TemplateRule>, field?: string, clause?: string, value?: string, project?: string, organization?: string, weight?: number)  
  {


    if (name !== undefined) {
      this.name = name;
    }
    if (description !== undefined) {
        this.description = description;
    }
    if (identifier !== undefined) {
        this.identifier = identifier;
    }
    if (templatesRule !== undefined) {
        this.templatesRule = templatesRule;
    }
    if (field !== undefined) {
        this.field = field;
    }
    if (clause !== undefined) {
        this.clause = clause;
    }
    if (value !== undefined) {
        this.value = value;
    }
    if (project !== undefined) {
        this.project = project;
    }
    if (organization !== undefined) {
        this.organization = organization;
    }
    if (weight !== undefined) {
        this.weight = weight;
    }
    if (value !== undefined) {
        this.value = value;
    }
    this.lastUpdatedAt = new Date().valueOf()
    this.createdAt = new Date().valueOf()
  }

}
