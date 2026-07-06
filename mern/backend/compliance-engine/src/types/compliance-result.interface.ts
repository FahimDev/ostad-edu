import { Severity } from "./severity.enum";

export interface IComplianceRuleResult {
    ruleCode: string
    severity: Severity
    message: string
    meta?: Record<string, any>
}