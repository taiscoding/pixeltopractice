
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
      "MRI FLAIR": {
        "Standard": "/medical_images/gasbubbles_case/gasbubbles_mri_flair.jpg"
      },
      "MRI T2": {
        "Standard": "/medical_images/gasbubbles_case/gasbubbles_mri_t2.jpg"
      },
      "MRI SWI": {
        "Standard": "/medical_images/gasbubbles_case/gasbubbles_mri_swi.jpg"
      }
    },
    defaultModality: "MRI SWI",
    defaultView: "Standard"
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
  },
  normalbrain: {
    modalities: {
      "MRI SWI": {
        "Standard": "/medical_images/normal_brain_case/normal_brain_swi.jpg"
      }
    },
    defaultModality: "MRI SWI",
    defaultView: "Standard"
  }
};

export const getCaseKey = (caseName: string): string => {
  if (caseName.toLowerCase().includes('gas bubbles')) {
    return 'gasbubbles';
  }
  if (caseName.toLowerCase().includes('trauma')) {
    return 'trauma';
  }
  if (caseName.toLowerCase().includes('normal brain')) {
    return 'normalbrain';
  }
  return 'gasbubbles'; // fallback
};
