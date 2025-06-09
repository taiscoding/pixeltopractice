import { RadiologyCase } from './gasBubblesSWI';

export const traumaGasCase: RadiologyCase = {
  caseName: "Trauma Gas",
  framework: {
    TECHNICAL: {
      primaryConcept: "How We See It",
      discoveryInsight: "CT shows intrasinus gas = Traumatic vacuum phenomenon",
      focusedLearning: "**Trauma creates intrasinus gas** through a 'vacuum phenomenon' - like cracking your knuckles. When the skull fractures, especially across sutures, it creates negative pressure that sucks gas into blood vessels.\n\nUnlike post-operative gas in fluid spaces, **this is real gas inside a blood vessel**.\n\n→ *View Clinical Application to understand the emergency implications*",
      clinicalApplication: "**Traumatic vacuum phenomenon** occurs when fractures disrupt venous sinus integrity. CT shows hyperdense thrombosis in sigmoid sinus plus gas bubbles in transverse sinus.\n\nUnlike post-operative pneumocephalus in CSF spaces, **intrasinus gas indicates vascular injury** with high thrombosis risk.\n\n**Key CT findings:**\n• Hyperdense acute thrombus\n• Intrasinus gas bubbles\n• CT venography confirms filling defect",
      comprehensiveAnalysis: "**Vacuum phenomenon increases thrombosis risk** because gas-blood interface promotes platelet aggregation and coagulation cascade activation.\n\n**Technical imaging details:**\n• CT shows hyperdense acute thrombus plus intrasinus gas bubbles\n• CT venography confirms filling defect\n• MRI may show T1 hyperintense thrombus with flow void from gas\n\n**Physics explanation:** Fracture creates negative pressure gradient that draws atmospheric gas into disrupted venous sinus, creating gas-blood interface that accelerates clot formation."
    },
    CLINICAL: {
      primaryConcept: "Why It Matters",
      discoveryInsight: "20M trauma + Skull fracture crossing suture = Emergency thrombosis risk",
      focusedLearning: "**When skull fractures cross sutures**, it creates the highest risk for blood clot formation in brain drainage veins. Gas bubbles inside blood vessels increase clotting risk.\n\nUnlike surgical patients where gas is expected and harmless, **trauma gas signals immediate danger**.\n\n**Our 20-year-old male patient** fell from bike with fracture crossing lambdoid suture - this is a medical emergency.\n\n→ *View Clinical Application for emergency management*",
      clinicalApplication: "**Emergency management priorities:**\n\n**Immediate anticoagulation** considerations vs bleeding risk assessment\n• Heparin protocols for venous sinus thrombosis\n• Balance thrombosis prevention vs intracranial hemorrhage risk\n\n**Monitoring requirements:**\n• Serial neurologic exams\n• Follow-up CT venography\n• Watch for increased intracranial pressure\n\n**Clinical progression signs:**\n• Headache, seizures, focal deficits\n• Papilledema indicating elevated ICP",
      comprehensiveAnalysis: "**Skull fracture crossing sutures** creates highest risk scenario because sutures are sites of major venous sinus drainage. Lambdoid suture involvement specifically threatens transverse-sigmoid sinus complex.\n\n**Pathophysiology cascade:**\n1. Fracture disrupts sinus wall integrity\n2. Vacuum phenomenon introduces gas\n3. Gas-blood interface accelerates thrombosis\n4. Propagating clot threatens venous drainage\n\n**Risk stratification:** Young trauma patients have higher thrombosis risk due to hypercoagulable state from injury, making immediate intervention critical."
    },
    ANATOMICAL: {
      primaryConcept: "Where It Matters",
      discoveryInsight: "Lambdoid suture fracture → Transverse sinus gas → Sigmoid sinus thrombosis",
      focusedLearning: "**Location is critical** because the lambdoid suture runs directly along the transverse sinus pathway. When this fracture occurs, it can directly damage the major brain drainage system.\n\n**Our patient's anatomy:**\n• Fracture crosses lambdoid suture\n• Gas in left transverse sinus\n• Thrombosis in left sigmoid sinus\n• Fluid in mastoid air cells\n\n→ *View Clinical Application to understand drainage implications*",
      clinicalApplication: "**Venous drainage anatomy explains severity:**\n\n**Transverse-sigmoid complex** drains large portions of brain via:\n• Superior sagittal sinus → transverse sinus → sigmoid sinus → internal jugular vein\n\n**When this pathway is compromised:**\n• Venous pressure increases\n• Brain swelling develops\n• Alternative drainage routes may be insufficient\n\n**Associated findings:**\n• Mastoid air cell fluid suggests temporal bone involvement\n• Suture diastasis indicates significant force\n\n→ *View Comprehensive Analysis for detailed anatomy*",
      comprehensiveAnalysis: "**Lambdoid suture anatomy** makes this fracture pattern particularly dangerous because it houses the transverse sinus in its inner table groove.\n\n**Anatomical considerations:**\n• Transverse sinus lies within lambdoid suture groove\n• Sigmoid sinus continuation drains to jugular foramen\n• Mastoid involvement suggests extensive temporal bone injury\n\n**Drainage implications:**\n• Left-sided involvement affects dominant hemisphere drainage in most patients\n• Bilateral involvement would be catastrophic\n• Collateral drainage via superior sagittal and straight sinus systems may compensate partially\n\n**Fracture mechanics:** High-energy trauma required to create suture diastasis indicates severe force transmission to venous structures."
    }
  }
};

export const traumaGasNodePositions = {
  central: { x: 400, y: 300 },
  technical: { x: 200, y: 150 },
  clinical: { x: 600, y: 150 },
  anatomical: { x: 500, y: 450 }
};

export const traumaGasNodeColors = {
  central: "#8B5CF6",
  technical: "#3B82F6",
  clinical: "#10B981",
  anatomical: "#F59E0B"
};