import type { IComplianceRuleResult } from "./compliance-result.interface"

export interface IComplianceRule {

    code: string
    priority: number

    evaluate(ctx: ComplianceContext): IComplianceRuleResult
}
