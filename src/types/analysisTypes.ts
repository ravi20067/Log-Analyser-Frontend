export interface KillChainStage {
  stage: string;
  desc: string;
  status: "detected" | "critical";
}

export interface AffectedArea {//
  area: string;
  impact: number;
}

export interface RadarItem {//
  subject: string;
  A: number;
}

export interface TimelineItem {
  time: string;
  events: number;
}

export interface RiskItem {
  name: string;
  value: number;
  color: string;
}

export interface Indicator {
  type: string;
  value: string;
  severity: "Critical" | "High" | "Medium" | "Low";
}

export interface AnalysisResponse {
  attackName: string;
  riskScore: number;
  riskLevel: string;
  mitre: string[];
  incidentResponse: string[];
  killChainStages: KillChainStage[];
  affectedAreas: AffectedArea[]; // not
  radarData: RadarItem[]; // not 
  timelineData: TimelineItem[];
  riskPie: RiskItem[];
  indicators: Indicator[];
}
