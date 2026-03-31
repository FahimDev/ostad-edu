import type { IComplianceDecision } from "../types/compliance-decision.interface";
import type { IComplianceRuleResult } from "../types/compliance-result.interface";
import type { IComplianceRule } from "../types/compliance-rule.interface";
import { Severity } from "../types/severity.enum";

export class RuleChainExecutor {
    
    execute(ctx: ComplianceContext, rules: IComplianceRule[]): IComplianceDecision {
        const results: IComplianceRuleResult[] = []
        let overall = Severity.PASS

        for (const rule of rules) {
            const result = rule.evaluate(ctx)
            results.push(result)
            if (result.severity === Severity.BLOCK) {
                overall = Severity.BLOCK
                break // Loop Exit
            }
            else if (result.severity === Severity.WARN) {
                overall = Severity.WARN
            }
        }

        return {overall, results}
    }
}