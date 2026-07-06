import { Severity } from './severity.enum'
import type { IComplianceRuleResult } from './compliance-result.interface.ts'

export interface IComplianceDecision {
    overall: Severity,
    results: IComplianceRuleResult[]
}