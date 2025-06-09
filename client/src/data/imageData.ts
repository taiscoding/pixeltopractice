
// Import images
import gasbubblesMriFlair from '@/assets/medical_images/gasbubbles_case/gasbubbles_mri_flair.jpg';
import gasbubblesMriT2 from '@/assets/medical_images/gasbubbles_case/gasbubbles_mri_t2.jpg';
import gasbubblesMriSwi from '@/assets/medical_images/gasbubbles_case/gasbubbles_mri_swi.jpg';
import traumaCtAxialNoncontrast from '@/assets/medical_images/trauma_case/trauma_ct_axial_noncontrast.jpg';
import traumaCtSagittalNoncontrast from '@/assets/medical_images/trauma_case/trauma_ct_sagittal_noncontrast.jpg';
import traumaCtCoronalNoncontrast from '@/assets/medical_images/trauma_case/trauma_ct_coronal_noncontrast.jpg';
import traumaCtAxialBone from '@/assets/medical_images/trauma_case/trauma_ct_axial_bone.jpg';
import traumaCtvAxial from '@/assets/medical_images/trauma_case/trauma_ctv_axial.jpg';
import traumaCtvCoronal from '@/assets/medical_images/trauma_case/trauma_ctv_coronal.jpg';
import traumaCtvSagittal from '@/assets/medical_images/trauma_case/trauma_ctv_sagittal.jpg';

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
        "FLAIR": gasbubblesMriFlair,
        "T2": gasbubblesMriT2, 
        "SWI": gasbubblesMriSwi
      }
    },
    defaultModality: "MRI",
    defaultView: "SWI"
  },
  trauma: {
    modalities: {
      "CT Head": {
        "Axial non-contrast": traumaCtAxialNoncontrast,
        "Sagittal non-contrast": traumaCtSagittalNoncontrast,
        "Coronal non-contrast": traumaCtCoronalNoncontrast,
        "Axial bone window": traumaCtAxialBone
      },
      "CT Venogram": {
        "Axial venogram": traumaCtvAxial,
        "Coronal venogram": traumaCtvCoronal, 
        "Sagittal venogram": traumaCtvSagittal
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
