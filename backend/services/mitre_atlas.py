"""
PolicyGuard-AI: MITRE ATLAS Threat Matrix Mapper
Maps PolicyGuard threat types to the MITRE ATLAS adversarial AI taxonomy.
Ref: https://atlas.mitre.org/techniques
"""

from typing import List, Dict

# MITRE ATLAS Tactic → Technique mapping for AI threats
# Source: MITRE ATLAS v4 (2024)
ATLAS_TECHNIQUE_MAP: Dict[str, Dict] = {
    # Prompt Injection variants
    "prompt_injection":       {"tactic": "ML Attack Staging",   "tactic_id": "AML.TA0001", "technique": "Prompt Injection",                  "technique_id": "AML.T0051", "subtechnique": None},
    "indirect_injection":     {"tactic": "ML Attack Staging",   "tactic_id": "AML.TA0001", "technique": "Indirect Prompt Injection",          "technique_id": "AML.T0051.000", "subtechnique": "Indirect"},
    "jailbreak":              {"tactic": "ML Attack Staging",   "tactic_id": "AML.TA0001", "technique": "LLM Jailbreak",                      "technique_id": "AML.T0054", "subtechnique": None},
    "role_play_bypass":       {"tactic": "ML Attack Staging",   "tactic_id": "AML.TA0001", "technique": "Jailbreak via Role-Playing",         "technique_id": "AML.T0054.001", "subtechnique": "Role-Play"},

    # Data Exfiltration / Privacy
    "pii_leakage":            {"tactic": "Exfiltration",        "tactic_id": "AML.TA0010", "technique": "Exfiltration via ML Inference API", "technique_id": "AML.T0040", "subtechnique": None},
    "data_leak":              {"tactic": "Exfiltration",        "tactic_id": "AML.TA0010", "technique": "Exfiltration via ML Inference API", "technique_id": "AML.T0040", "subtechnique": None},
    "ip_disclosure":          {"tactic": "Exfiltration",        "tactic_id": "AML.TA0010", "technique": "System Prompt Extraction",           "technique_id": "AML.T0056", "subtechnique": None},
    "system_prompt_leak":     {"tactic": "Exfiltration",        "tactic_id": "AML.TA0010", "technique": "System Prompt Extraction",           "technique_id": "AML.T0056", "subtechnique": None},

    # Model Poisoning / Integrity
    "model_poisoning":        {"tactic": "ML Model Access",     "tactic_id": "AML.TA0005", "technique": "ML Supply Chain Compromise",         "technique_id": "AML.T0010", "subtechnique": None},
    "training_data_poison":   {"tactic": "ML Model Access",     "tactic_id": "AML.TA0005", "technique": "Poison Training Data",              "technique_id": "AML.T0020", "subtechnique": None},

    # Adversarial Examples
    "adversarial_input":      {"tactic": "ML Attack Staging",   "tactic_id": "AML.TA0001", "technique": "Adversarial Example Crafting",       "technique_id": "AML.T0043", "subtechnique": None},
    "evasion":                {"tactic": "Defense Evasion",     "tactic_id": "AML.TA0007", "technique": "Evade ML Model",                     "technique_id": "AML.T0015", "subtechnique": None},

    # Resource / Availability
    "rate_limit_abuse":       {"tactic": "Impact",              "tactic_id": "AML.TA0013", "technique": "Cost Harvesting",                    "technique_id": "AML.T0048", "subtechnique": None},
    "denial_of_ml_service":   {"tactic": "Impact",              "tactic_id": "AML.TA0013", "technique": "Denial of ML Service",               "technique_id": "AML.T0029", "subtechnique": None},

    # Hallucination / Misinformation
    "hallucination":          {"tactic": "Impact",              "tactic_id": "AML.TA0013", "technique": "LLM Hallucination Exploitation",      "technique_id": "AML.T0047", "subtechnique": None},
    "misinformation":         {"tactic": "Impact",              "tactic_id": "AML.TA0013", "technique": "Dissemination of Harmful Content",   "technique_id": "AML.T0049", "subtechnique": None},

    # Toxicity / Safety
    "toxicity":               {"tactic": "Impact",              "tactic_id": "AML.TA0013", "technique": "Harmful Content Generation",         "technique_id": "AML.T0046", "subtechnique": None},
    "bias":                   {"tactic": "Impact",              "tactic_id": "AML.TA0013", "technique": "Violating User Privacy",             "technique_id": "AML.T0058", "subtechnique": None},
}

# Generic fallback
DEFAULT_TECHNIQUE = {
    "tactic": "Impact",
    "tactic_id": "AML.TA0013",
    "technique": "Harmful Content Generation",
    "technique_id": "AML.T0046",
    "subtechnique": None
}

SEVERITY_RANK = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}


def _normalize_type(threat_type: str) -> str:
    """Normalize a threat type string into a lookup key."""
    return threat_type.lower().replace(" ", "_").replace("-", "_")


class MitreAtlasMapper:
    """
    Converts PolicyGuard threat reports to MITRE ATLAS-structured output.
    No external API or model needed — pure lookup table.
    """

    def map_threats_to_atlas(self, threats: List[Dict]) -> List[Dict]:
        """
        Map a list of PolicyGuard threat dicts to MITRE ATLAS technique cards.
        
        Input threat dict keys: type, severity, details (all optional except type)
        Returns: list of ATLAS-enriched threat cards
        """
        mapped = []
        for threat in threats:
            raw_type = threat.get("type", "unknown")
            key = _normalize_type(raw_type)

            # Fuzzy match: try substrings if exact key not found
            atlas_entry = ATLAS_TECHNIQUE_MAP.get(key)
            if not atlas_entry:
                for map_key, map_val in ATLAS_TECHNIQUE_MAP.items():
                    if map_key in key or key in map_key:
                        atlas_entry = map_val
                        break

            if not atlas_entry:
                atlas_entry = DEFAULT_TECHNIQUE

            severity = threat.get("severity", "MEDIUM").upper()

            mapped.append({
                "original_type": raw_type,
                "severity": severity,
                "severity_rank": SEVERITY_RANK.get(severity, 2),
                "details": threat.get("details", ""),
                "atlas": {
                    "tactic":         atlas_entry["tactic"],
                    "tactic_id":      atlas_entry["tactic_id"],
                    "technique":      atlas_entry["technique"],
                    "technique_id":   atlas_entry["technique_id"],
                    "subtechnique":   atlas_entry["subtechnique"],
                    "atlas_url": f"https://atlas.mitre.org/techniques/{atlas_entry['technique_id'].replace('.', '/')}"
                }
            })

        # Sort: most severe first
        mapped.sort(key=lambda x: x["severity_rank"], reverse=True)
        return mapped

    def build_full_report(self, threats: List[Dict], report_id: str = "N/A") -> Dict:
        """Build a full ATLAS-formatted report summary from a threat list."""
        mapped = self.map_threats_to_atlas(threats)
        unique_tactics = list({t["atlas"]["tactic"] for t in mapped})
        critical_count = sum(1 for t in mapped if t["severity"] == "CRITICAL")
        high_count = sum(1 for t in mapped if t["severity"] == "HIGH")

        return {
            "report_id": report_id,
            "atlas_version": "ATLAS v4 (2024)",
            "framework": "MITRE ATLAS",
            "framework_url": "https://atlas.mitre.org",
            "summary": {
                "total_threats": len(mapped),
                "critical": critical_count,
                "high": high_count,
                "tactics_identified": unique_tactics,
            },
            "threats": mapped
        }


# Global instance
atlas_mapper = MitreAtlasMapper()
