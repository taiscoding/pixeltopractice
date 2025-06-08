export interface CaseFramework {
  TECHNICAL: {
    primaryConcept: string;
    explanation: string;
    keyPhysics: string[];
    whyItMatters: string;
  };
  CLINICAL: {
    primaryConcept: string;
    timeline: string;
    context: string;
    urgency: string;
  };
  ANATOMICAL: {
    primaryConcept: string;
    significance: string;
    considerations: string;
  };
}

export interface RadiologyCase {
  caseName: string;
  framework: CaseFramework;
}

export const gasBubblesSWICase: RadiologyCase = {
  caseName: "Gas Bubbles on SWI",
  framework: {
    TECHNICAL: {
      primaryConcept: "Susceptibility-Weighted Imaging (SWI)",
      explanation: "Magnetic susceptibility differences create signal dropout, making SWI exquisitely sensitive to gas bubbles.",
      keyPhysics: ["T2* effects and signal loss", "Blooming artifacts enhancement", "Phase information utilization"],
      whyItMatters: "Understanding the physics helps predict when gas will be visible and distinguishable from other susceptibility artifacts."
    },
    CLINICAL: {
      primaryConcept: "Timeline-Dependent Significance",
      timeline: "Under 1 week normal post-op, after 1 week concerning for infection",
      context: "Post-operative vs traumatic gas, patient symptoms and presentation, associated inflammatory changes",
      urgency: "Timeline determines whether immediate intervention is needed or if monitoring is appropriate"
    },
    ANATOMICAL: {
      primaryConcept: "Location Suggests Etiology",
      significance: "Gas location provides crucial clues about the underlying cause and appropriate management",
      considerations: "Surgical site vs remote location, superficial vs deep parenchymal, mass effect and compression risk, proximity to critical structures"
    }
  }
};

export const nodePositions = {
  central: { x: 400, y: 300 },
  technical: { x: 200, y: 150 },
  clinical: { x: 600, y: 150 },
  anatomical: { x: 500, y: 450 }
};

export const nodeColors = {
  central: "#2563EB",
  technical: "#2563EB",
  clinical: "#059669",
  anatomical: "#D97706"
};
