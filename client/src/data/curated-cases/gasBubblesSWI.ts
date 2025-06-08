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
      focusedLearning: "**SWI shows gas best** because gas bubbles contain air, which has different magnetic properties than brain tissue (*diamagnetic vs brain's water*). This difference disrupts the local magnetic field around each bubble.\n\nSWI sequences are designed to detect these magnetic field disruptions, making tiny gas bubbles appear much larger and darker than they really are - that's the **'blooming' effect**.",
      clinicalApplication: "**Blooming matters clinically** because SWI uses long echo times that amplify susceptibility effects from diamagnetic gas.\n\nWhile FLAIR suppresses both CSF and gas (making gas invisible), and T2 shows some contrast, **only SWI creates dramatic signal dropout** that makes even microscopic gas bubbles visible.\n\nThis sensitivity is crucial for:\n• Detecting small amounts of post-operative gas\n• Ruling out gas in trauma cases",
      comprehensiveAnalysis: "**Susceptibility physics explanation:** Gas bubbles create local magnetic field inhomogeneity due to diamagnetic properties (magnetic susceptibility different from surrounding tissue).\n\n**T2* sequences with long TE** allow sufficient time for phase dispersion from field distortions.\n\n**The magnitude images** show signal dropout, while **phase images** can distinguish diamagnetic (gas) from paramagnetic (blood) substances.\n\nThis explains why SWI detects gas that conventional sequences miss.\n\n→ *View Clinical Application to see why timing matters*"
    },
    CLINICAL: {
      primaryConcept: "Why It Matters",
      discoveryInsight: "65M immediately post-posterior fossa surgery = Expected gas pattern",
      focusedLearning: "**Timing matters** because after brain surgery, some air gets trapped in the skull and dissolves back into the blood over *days to weeks*.\n\nIn our **65-year-old male patient** examined immediately after posterior fossa surgery, these gas bubbles in the subarachnoid space and ventricles are completely expected.\n\nBut if the same gas pattern appeared *weeks later* or in a trauma patient, it would mean something is wrong - ongoing leak or new injury.",
      clinicalApplication: "**Posterior fossa surgery creates more gas** because opening the skull and brain exposes CSF spaces to air. Posterior fossa surgeries often require opening the fourth ventricle, explaining why our patient has gas in both subarachnoid space and lateral ventricles.\n\n**Normal reabsorption timeline:**\n• **CO₂** dissolves in *minutes-hours*\n• **Nitrogen** takes *days-weeks*\n\n**Red flags:**\n• Volume increasing instead of decreasing\n• New neurologic symptoms\n• Fever suggesting infection\n• Clear drainage indicating CSF leak\n\n→ *View Comprehensive Analysis for detailed pathophysiology*",
      comprehensiveAnalysis: "**Gas becomes concerning when:** Post-operative pneumocephalus follows predictable reabsorption kinetics based on gas solubility (**CO₂** > **N₂** > **noble gases**).\n\nComplications arise when:\n• Normal reabsorption is impaired (ongoing CSF leak)\n• Volume creates mass effect\n\n**Posterior fossa considerations:**\n• Proximity to brainstem makes even small mass effect significant\n• CSF leak risk higher due to complex anatomy and pressure gradients\n\n**Our patient's timeline:** Immediate post-op timing makes this an expected finding, but follow-up imaging in *1-2 weeks* should show decreasing volume."
    },
    ANATOMICAL: {
      primaryConcept: "Where It Matters",
      discoveryInsight: "Subarachnoid space + lateral ventricles after posterior fossa surgery = Expected distribution",
      focusedLearning: "**Location matters for gas bubbles** because our **65-year-old male patient** has gas in subarachnoid space and lateral ventricles since posterior fossa surgery opens these connected fluid spaces.\n\nGas naturally travels through **CSF pathways**. This distribution makes sense and is expected.\n\nIf the same amount of gas appeared *far from the surgery site*, or if it caused brain compression (*mass effect*), that would be concerning and need immediate attention.",
      clinicalApplication: "**This distribution is expected** because posterior fossa surgery often requires opening the fourth ventricle, which connects to lateral ventricles and subarachnoid space through normal CSF flow pathways. Gas follows these routes.\n\n**Location significance:**\n• Gas near surgical site = expected\n• Gas remote from surgery = alternative source needed\n\n**Mass effect considerations:**\n• Small bubbles in CSF spaces usually harmless\n• Large collections can compress eloquent brain regions requiring surgical evacuation\n\n→ *View Comprehensive Analysis for detailed pathophysiology*",
      comprehensiveAnalysis: "**Posterior fossa anatomy creates this pattern because:**\n\n**Fourth ventricle communication** with lateral ventricles through cerebral aqueduct explains ventricular gas. Subarachnoid space involvement reflects dural opening and CSF exposure.\n\n**Risk stratification by location:**\n• Brainstem proximity makes posterior fossa gas more concerning for mass effect than supratentorial locations\n• Eloquent structure considerations: Small volumes acceptable, but any neurologic symptoms warrant immediate surgical evaluation\n\n**Expected reabsorption pattern:** Dependent portions clear first, trapped gas in non-dependent locations persists longer."
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
