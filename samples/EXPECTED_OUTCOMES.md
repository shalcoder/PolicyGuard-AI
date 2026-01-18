# Expected Outcomes for Edge Case Samples

This document outlines the "Win Condition" for PolicyGuard AI when testing the provided edge cases.

## 1. The Mosaic Effect (Healthcare)
*   **Path**: `samples/edge_case_1_mosaic_effect/`
*   **The Conflict**: The Policy allows "Anonymized" data but permits Zip + Birth Date + Gender. The PRD explicitly asks for these fields to group patients and enrich with "Voter Registration Logs".
*   **WIN CONDITION**: The AI must detect **Re-identification Risk** (or "Mosaic Effect").
    *   It should flag that combining `Zip Code` + `Birth Date` + `Gender` (uniquely identifying ~87% of the US population) violates the core intent of "Anonymized Research" even if the specific fields are technically listed as "Allowed".
    *   **Bonus Win**: Citations of "Latanya Sweeney" or specific mention that "Voter Registration Logs" de-anonymize the dataset.

## 2. Data Sovereignty vs. Backups (GDPR)
*   **Path**: `samples/edge_case_2_data_sovereignty/`
*   **The Conflict**: Policy mandates EU residency for *all* storage. PRD proposes "Cold Storage" backups in `us-east-1` (USA).
*   **WIN CONDITION**: The AI must detect a **Cross-Border Transfer Violation**.
    *   It should reject the argument that "Cold Storage" is not "processing". Under GDPR, storage *is* processing.
    *   It must flag `us-east-1` as a non-compliant region.

## 3. Immutable vs. Deletable (Blockchain)
*   **Path**: `samples/edge_case_3_immutable_ledger/`
*   **The Conflict**: Policy guarantees "Right to Erasure". PRD builds on an "Immutable Blockchain" where `Legal Name` is stored in plain text.
*   **WIN CONDITION**: The AI must detect a **Fundamental Architectural Conflict**.
    *   It should state that you cannot legally store PII (`Legal Name`) on an immutable ledger because it makes the "Right to Erasure" impossible to execute.
    *   **Recommendation**: It should suggest storing a *hash* on-chain and the PII in an off-chain database (which can be deleted).
