import { RadiologyCase } from './gasBubblesSWI';

// Node positions for Normal Brain case constellation
export const normalBrainNodePositions = {
  central: { x: 400, y: 300 },
  technical: { x: 200, y: 150 },
  clinical: { x: 600, y: 150 },
  anatomical: { x: 400, y: 450 }
};

// Node colors for Normal Brain case
export const normalBrainNodeColors = {
  central: '#4ade80',
  technical: '#06b6d4',
  clinical: '#f59e0b',
  anatomical: '#ec4899'
};

export const normalBrainCase: RadiologyCase = {
  caseName: "Normal Brain",
  framework: {
    TECHNICAL: {
      primaryConcept: "How We See It",
      discoveryInsight: "Normal brain MRI shows clear anatomy with no pathological changes",
      focusedLearning: "**SWI sequence demonstrates normal brain** with no susceptibility artifacts. Clear gray-white matter differentiation, normal ventricular size, no blood products or calcifications.\n\n**Key SWI findings:**\n• Homogeneous signal intensity\n• Preserved anatomical boundaries\n• No susceptibility artifacts\n• Normal vascular structures\n\n→ *View Clinical Application to understand baseline comparison importance*",
      clinicalApplication: "**Normal baseline for comparison learning.** Key features: homogeneous signal intensity, preserved anatomical boundaries, no restricted diffusion, normal vascular structures. Essential reference for identifying pathology.\n\n**Patient Context:**\n• 20-year-old male\n• First episode of psychosis\n• Normal brain anatomy established\n\n**SWI Technical Parameters:**\n• No microhemorrhages detected\n• Normal iron deposition patterns\n• Intact blood-brain barrier\n• Normal venous architecture",
      comprehensiveAnalysis: "**Normal brain SWI serves as educational baseline.** Demonstrates: intact blood-brain barrier, normal iron deposition patterns, preserved white matter integrity, normal deep gray structures. Critical comparison reference for identifying microhemorrhages, calcifications, or vascular malformations in pathological cases.\n\n**Advanced SWI Analysis:**\n• Phase imaging shows normal venous anatomy\n• Minimum intensity projection (minIP) demonstrates clear venous structures\n• No abnormal susceptibility effects\n• Symmetric bilateral brain anatomy\n• Normal cortical-subcortical differentiation\n\n**Educational Value:**\n• Establishes normal appearance for comparison\n• Demonstrates typical SWI contrast mechanisms\n• Reference for identifying subtle pathology\n• Foundation for understanding pathological changes"
    },
    CLINICAL: {
      primaryConcept: "What It Means",
      discoveryInsight: "Normal brain establishes baseline for psychiatric evaluation",
      focusedLearning: "**Normal structural imaging in first-episode psychosis** helps rule out organic causes. While psychiatric symptoms may be present, the brain shows no structural abnormalities.\n\n**Clinical Significance:**\n• Excludes organic brain pathology\n• Supports primary psychiatric diagnosis\n• Establishes baseline for future monitoring\n• Normal cognitive substrate confirmed\n\n→ *View Anatomical Context for structural details*",
      clinicalApplication: "**First-episode psychosis workup** requires excluding organic causes. Normal brain imaging supports primary psychiatric etiology and guides treatment planning.\n\n**Clinical Decision Points:**\n• Structural pathology excluded\n• Safe to proceed with psychiatric treatment\n• Baseline established for monitoring\n• Family counseling regarding prognosis\n\n**Differential Considerations:**\n• Normal pressure hydrocephalus: ruled out\n• Space-occupying lesions: excluded\n• Vascular malformations: not present\n• Inflammatory changes: absent",
      comprehensiveAnalysis: "**Normal brain imaging in psychiatric context** provides crucial clinical information. Excludes structural causes of psychosis, supports primary psychiatric diagnosis, and establishes monitoring baseline.\n\n**Comprehensive Clinical Framework:**\n• Neuroimaging-psychiatry interface understanding\n• Organic vs functional psychosis differentiation\n• Treatment planning implications\n• Prognostic counseling foundation\n• Long-term monitoring strategy\n\n**Evidence-Based Practice:**\n• Guidelines recommend imaging in first-episode psychosis\n• Normal findings support psychiatric treatment focus\n• Cost-effective approach to differential diagnosis\n• Patient and family reassurance regarding structural integrity"
    },
    ANATOMICAL: {
      primaryConcept: "Where We Look",
      discoveryInsight: "Normal brain anatomy provides comparison reference",
      focusedLearning: "**Normal brain anatomy on SWI** shows typical gray-white matter contrast, normal ventricular configuration, and preserved anatomical landmarks.\n\n**Key Anatomical Features:**\n• Symmetric cerebral hemispheres\n• Normal ventricular system\n• Preserved cortical ribbon\n• Intact deep gray structures\n• Normal white matter signal\n\n→ *View Technical Details for imaging specifics*",
      clinicalApplication: "**Anatomical reference for pathology detection.** Normal brain serves as comparison standard for identifying abnormalities in other cases.\n\n**Critical Anatomical Landmarks:**\n• Corpus callosum integrity\n• Basal ganglia symmetry\n• Ventricular size and shape\n• Cortical thickness uniformity\n• White matter signal homogeneity\n\n**SWI-Specific Anatomy:**\n• Venous architecture visualization\n• Iron deposition patterns\n• Susceptibility artifact absence\n• Vascular malformation exclusion",
      comprehensiveAnalysis: "**Comprehensive normal brain anatomy** demonstrates all major structural elements in typical configuration. Serves as educational foundation for understanding pathological variations.\n\n**Detailed Anatomical Assessment:**\n• Frontal, parietal, temporal, occipital lobe integrity\n• Cerebellar and brainstem normal morphology\n• Ventricular system within normal limits\n• Cortical-subcortical interface preservation\n• Vascular territory anatomy\n\n**Educational Anatomical Framework:**\n• Normal variant recognition\n• Age-appropriate changes understanding\n• Pathology detection preparation\n• Systematic evaluation approach\n• Comparative analysis foundation"
    }
  }
};