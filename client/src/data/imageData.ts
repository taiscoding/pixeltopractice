export interface ImageModalities {
  [modality: string]: {
    [view: string]: string;
  };
}

export interface CaseImageData {
  modalities: ImageModalities;
  defaultModality: string;
  defaultView: string;
}

export const imageData: Record<string, CaseImageData> = {
  gasbubbles: {
    modalities: {
      "MRI": {
        "FLAIR": "/medical_images/gasbubbles_case/gasbubbles_mri_flair.jpg",
        "T2": "/medical_images/gasbubbles_case/gasbubbles_mri_t2.jpg", 
        "SWI": "/medical_images/gasbubbles_case/gasbubbles_mri_swi.jpg"
      }
    },
    defaultModality: "MRI",
    defaultView: "SWI"
  },
  trauma: {
    modalities: {
      "CT Head": {
        "Axial non-contrast": "/medical_images/trauma_case/trauma_ct_axial_noncontrast.jpg",
        "Sagittal non-contrast": "/medical_images/trauma_case/trauma_ct_sagittal_noncontrast.jpg",
        "Coronal non-contrast": "/medical_images/trauma_case/trauma_ct_coronal_noncontrast.jpg",
        "Axial bone window": "/medical_images/trauma_case/trauma_ct_axial_bone.jpg"
      },
      "CT Venogram": {
        "Axial venogram": "/medical_images/trauma_case/trauma_ctv_axial.jpg",
        "Coronal venogram": "/medical_images/trauma_case/trauma_ctv_coronal.jpg", 
        "Sagittal venogram": "/medical_images/trauma_case/trauma_ctv_sagittal.jpg"
      }
    },
    defaultModality: "CT Head",
    defaultView: "Axial non-contrast"
  }
};

export const getCaseKey = (caseName: string): string => {
  if (caseName.toLowerCase().includes('gas bubbles')) {
    return 'gasbubbles';
  }
  if (caseName.toLowerCase().includes('trauma')) {
    return 'trauma';
  }
  return 'gasbubbles'; // fallback
};