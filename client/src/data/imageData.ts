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
        "FLAIR": "/attached_assets/medical_images/gasbubbles_case/gasbubbles_mri_flair.jpg",
        "T2": "/attached_assets/medical_images/gasbubbles_case/gasbubbles_mri_t2.jpg", 
        "SWI": "/attached_assets/medical_images/gasbubbles_case/gasbubbles_mri_swi.jpg"
      }
    },
    defaultModality: "MRI",
    defaultView: "SWI"
  },
  trauma: {
    modalities: {
      "CT Head": {
        "Axial non-contrast": "/attached_assets/medical_images/trauma_case/trauma_ct_axial_noncontrast.jpg",
        "Sagittal non-contrast": "/attached_assets/medical_images/trauma_case/trauma_ct_sagittal_noncontrast.jpg",
        "Coronal non-contrast": "/attached_assets/medical_images/trauma_case/trauma_ct_coronal_noncontrast.jpg",
        "Axial bone window": "/attached_assets/medical_images/trauma_case/trauma_ct_axial_bone.jpg"
      },
      "CT Venogram": {
        "Axial venogram": "/attached_assets/medical_images/trauma_case/trauma_ctv_axial.jpg",
        "Coronal venogram": "/attached_assets/medical_images/trauma_case/trauma_ctv_coronal.jpg", 
        "Sagittal venogram": "/attached_assets/medical_images/trauma_case/trauma_ctv_sagittal.jpg"
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