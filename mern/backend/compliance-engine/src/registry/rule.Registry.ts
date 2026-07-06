import type { IComplianceRule } from "../types/compliance-rule.interface";

export class RuleRegistry {
    constructor(private rules: IComplianceRule[]) {

    }

    getOrderRules(): IComplianceRule[] {
        return [...this.rules].sort((a,b) => {
            if (a.priority !== b.priority){
                return a.priority - b.priority
            }
            return a.code.localeCompare(b.code)
        }

        )
    }
}