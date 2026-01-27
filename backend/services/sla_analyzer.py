from services.gemini import GeminiService
from services.metrics import metrics_store
import json
import google.generativeai as genai

class SLAAnalyzer:
    """
    Gemini-powered SLA analysis service.
    Provides predictive risk analysis, recommendations, and anomaly detection.
    """
    
    def __init__(self):
        self.gemini = GeminiService()
    
    async def analyze_sla_risk(self) -> dict:
        """Use Gemini to predict SLA risk and provide intelligent recommendations"""
        
        # Get current metrics and history
        current = metrics_store.get_current_metrics()
        history = metrics_store.get_history(hours=24)
        
        # Calculate trends
        recent_history = history[-10:] if len(history) >= 10 else history
        
        # Build comprehensive prompt for Gemini
        prompt = f"""You are an expert SLA monitoring AI assistant. Analyze these metrics and provide intelligent predictions.

CURRENT METRICS (Real-time):
- Uptime: {current['uptime_percentage']}% (SLA Target: 99.9%)
- Average Response Time: {current['avg_response_time_ms']}ms
- P95 Response Time: {current['p95_response_time_ms']}ms
- P99 Response Time: {current['p99_response_time_ms']}ms
- Requests per Minute: {current['requests_per_minute']}
- Success Rate: {current['success_rate']}%
- Failed Requests: {current['failed_requests']}
- PII Blocks: {current['pii_blocks']}
- Policy Violations: {current['policy_violations']}
- SLA Status: {current['sla_status']}

HISTORICAL TREND (Last 10 data points from 24h):
{json.dumps(recent_history, indent=2)}

ANALYSIS REQUIRED:
1. Calculate risk score (0-100) for SLA breach in next hour
2. Identify top risk factors with severity and impact
3. Analyze performance trend (improving/stable/degrading)
4. Provide actionable recommendations with priority
5. Forecast next hour metrics
6. Detect any anomalies or unusual patterns

Respond ONLY with valid JSON (no markdown, no code blocks):
{{
  "risk_score": <number 0-100>,
  "risk_level": "<low|medium|high|critical>",
  "risk_factors": [
    {{
      "factor": "<description>",
      "severity": "<low|medium|high|critical>",
      "impact_percentage": <number 0-100>
    }}
  ],
  "trend_analysis": {{
    "direction": "<improving|stable|degrading>",
    "confidence": <number 0-1>,
    "summary": "<brief explanation>"
  }},
  "recommendations": [
    {{
      "priority": "<low|medium|high|critical>",
      "action": "<specific action>",
      "reason": "<why this is needed>",
      "expected_impact": "<what will improve>"
    }}
  ],
  "forecast": {{
    "next_hour_uptime": <percentage>,
    "next_hour_avg_latency": <milliseconds>,
    "breach_probability": <number 0-1>
  }},
  "anomalies": ["<list of detected anomalies>"],
  "insights": "<key insight about system health>"
}}"""
        
        try:
            # Call Gemini with JSON mode
            response = await self.gemini.generate_content(prompt)
            
            # Clean response (remove markdown code blocks if present)
            response_text = response.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            # Parse JSON response
            analysis = json.loads(response_text)
            
            # Add metadata
            analysis['timestamp'] = current['timestamp']
            analysis['current_uptime'] = current['uptime_percentage']
            analysis['current_latency'] = current['avg_response_time_ms']
            
            return analysis
            
        except json.JSONDecodeError as e:
            print(f"[SLA Analyzer] JSON parse error: {e}")
            print(f"[SLA Analyzer] Response: {response_text[:500]}")
            
            # Return fallback analysis
            return self._get_fallback_analysis(current)
        except Exception as e:
            print(f"[SLA Analyzer] Error: {e}")
            return self._get_fallback_analysis(current)
    
    def _get_fallback_analysis(self, current: dict) -> dict:
        """Provide rule-based analysis if Gemini fails"""
        
        # Calculate simple risk score
        risk_score = 0
        risk_factors = []
        
        # Check uptime
        if current['uptime_percentage'] < 99.9:
            risk_score += 30
            risk_factors.append({
                "factor": "Uptime below SLA target",
                "severity": "high",
                "impact_percentage": 30
            })
        
        # Check response time
        if current['avg_response_time_ms'] > 500:
            risk_score += 25
            risk_factors.append({
                "factor": "High average response time",
                "severity": "medium",
                "impact_percentage": 25
            })
        
        # Check error rate
        if current['success_rate'] < 99:
            risk_score += 20
            risk_factors.append({
                "factor": "Elevated error rate",
                "severity": "medium",
                "impact_percentage": 20
            })
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = "critical"
        elif risk_score >= 40:
            risk_level = "high"
        elif risk_score >= 20:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        return {
            "risk_score": min(risk_score, 100),
            "risk_level": risk_level,
            "risk_factors": risk_factors if risk_factors else [
                {
                    "factor": "System operating normally",
                    "severity": "low",
                    "impact_percentage": 0
                }
            ],
            "trend_analysis": {
                "direction": "stable",
                "confidence": 0.7,
                "summary": "System metrics are within acceptable ranges."
            },
            "recommendations": [
                {
                    "priority": "low",
                    "action": "Continue monitoring",
                    "reason": "No immediate issues detected",
                    "expected_impact": "Maintain current SLA compliance"
                }
            ],
            "forecast": {
                "next_hour_uptime": current['uptime_percentage'],
                "next_hour_avg_latency": current['avg_response_time_ms'],
                "breach_probability": risk_score / 100
            },
            "anomalies": [],
            "insights": "System is operating within normal parameters.",
            "timestamp": current['timestamp'],
            "current_uptime": current['uptime_percentage'],
            "current_latency": current['avg_response_time_ms'],
            "fallback": True
        }

# Global instance
sla_analyzer = SLAAnalyzer()
