export interface CaseFramework {
  TECHNICAL: {
    primaryConcept: string;
    discoveryInsight: string;
    focusedLearning: string;
    clinicalApplication: string;
    comprehensiveAnalysis: string;
  };
  CLINICAL: {
    primaryConcept: string;
    discoveryInsight: string;
    focusedLearning: string;
    clinicalApplication: string;
    comprehensiveAnalysis: string;
  };
  ANATOMICAL: {
    primaryConcept: string;
    discoveryInsight: string;
    focusedLearning: string;
    clinicalApplication: string;
    comprehensiveAnalysis: string;
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
      primaryConcept: "How We See It",
      discoveryInsight: "SWI makes gas bubbles 'bloom' larger than they really are",
      focusedLearning: "WHY does SWI show gas best? Gas bubbles contain air, which has different magnetic properties than brain tissue (diamagnetic vs brain's water). This difference disrupts the local magnetic field around each bubble. SWI sequences are designed to detect these magnetic field disruptions, making tiny gas bubbles appear much larger and darker than they really are - that's the 'blooming' effect.",
      clinicalApplication: "WHY blooming matters clinically: SWI uses long echo times that amplify susceptibility effects from diamagnetic gas. While FLAIR suppresses both CSF and gas (making gas invisible), and T2 shows some contrast, only SWI creates dramatic signal dropout that makes even microscopic gas bubbles visible. This sensitivity is crucial for detecting small amounts of post-operative gas or ruling out gas in trauma cases.",
      comprehensiveAnalysis: "WHY susceptibility physics work: Gas bubbles create local magnetic field inhomogeneity due to diamagnetic properties (magnetic susceptibility different from surrounding tissue). T2* sequences with long TE allow sufficient time for phase dispersion from field distortions. The magnitude images show signal dropout, while phase images can distinguish diamagnetic (gas) from paramagnetic (blood) substances. This explains why SWI detects gas that conventional sequences miss."
    },
    CLINICAL: {
      primaryConcept: "Why It Matters",
      discoveryInsight: "65M immediately post-posterior fossa surgery = Expected gas pattern",
      focusedLearning: "WHY does timing matter so much? After brain surgery, some air gets trapped in the skull and dissolves back into the blood over days to weeks. In our 65M patient examined immediately after posterior fossa surgery, these gas bubbles in the subarachnoid space and ventricles are completely expected. But if the same gas pattern appeared weeks later or in a trauma patient, it would mean something is wrong - ongoing leak or new injury.",
      clinicalApplication: "WHY posterior fossa surgery creates more gas: Opening the skull and brain exposes CSF spaces to air. Posterior fossa surgeries often require opening the fourth ventricle, explaining why our patient has gas in both subarachnoid space and lateral ventricles. Normal reabsorption: CO2 dissolves in minutes-hours, nitrogen takes days-weeks. Red flags: Volume increasing instead of decreasing, new neurologic symptoms, fever suggesting infection, or clear drainage indicating CSF leak.",
      comprehensiveAnalysis: "WHY gas becomes concerning: Post-operative pneumocephalus follows predictable reabsorption kinetics based on gas solubility (CO2 >> N2 >> noble gases). Complications arise when normal reabsorption is impaired (ongoing CSF leak) or when volume creates mass effect. Posterior fossa considerations: Proximity to brainstem makes even small mass effect significant. CSF leak risk higher due to complex anatomy and pressure gradients. Our patient's immediate post-op timing makes this expected finding, but follow-up imaging in 1-2 weeks should show decreasing volume."
    },
    ANATOMICAL: {
      primaryConcept: "Where It Matters",
      discoveryInsight: "Subarachnoid space + lateral ventricles after posterior fossa surgery = Expected distribution",
      focusedLearning: "WHY does location matter for gas bubbles? Our 65M patient has gas in subarachnoid space and lateral ventricles because posterior fossa surgery opens these connected fluid spaces. Gas naturally travels through CSF pathways. This distribution makes sense and is expected. If the same amount of gas appeared far from the surgery site, or if it caused brain compression (mass effect), that would be concerning and need immediate attention.",
      clinicalApplication: "WHY this distribution is expected: Posterior fossa surgery often requires opening the fourth ventricle, which connects to lateral ventricles and subarachnoid space through normal CSF flow pathways. Gas follows these routes. Location significance: Gas near surgical site = expected, gas remote from surgery = alternative source needed. Mass effect considerations: Small bubbles in CSF spaces usually harmless, large collections can compress eloquent brain regions requiring surgical evacuation.",
      comprehensiveAnalysis: "WHY posterior fossa anatomy creates this pattern: Fourth ventricle communication with lateral ventricles through cerebral aqueduct explains ventricular gas. Subarachnoid space involvement reflects dural opening and CSF exposure. Risk stratification by location: Brainstem proximity makes posterior fossa gas more concerning for mass effect than supratentorial locations. Eloquent structure considerations: Small volumes acceptable, but any neurologic symptoms warrant immediate surgical evaluation. Expected reabsorption pattern: Dependent portions clear first, trapped gas in non-dependent locations persists longer."
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
