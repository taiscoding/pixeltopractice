import { gasBubblesSWICase, nodePositions as gasBubblesPositions, nodeColors as gasBubblesColors } from './gasBubblesSWI';
import { traumaGasCase, traumaGasNodePositions, traumaGasNodeColors } from './traumaGas';
import { normalBrainCase, normalBrainNodePositions, normalBrainNodeColors } from './normalBrain';

export interface CaseData {
  case: any;
  nodePositions: any;
  nodeColors: any;
}

export const availableCases: Record<string, CaseData> = {
  'Gas Bubbles on SWI': {
    case: gasBubblesSWICase,
    nodePositions: gasBubblesPositions,
    nodeColors: gasBubblesColors
  },
  'Trauma Gas': {
    case: traumaGasCase,
    nodePositions: traumaGasNodePositions,
    nodeColors: traumaGasNodeColors
  },
  'Normal Brain': {
    case: normalBrainCase,
    nodePositions: normalBrainNodePositions,
    nodeColors: normalBrainNodeColors
  }
};

export const caseOptions = [
  { id: 'gas-bubbles-swi', name: 'Gas Bubbles on SWI', description: '65M post-posterior fossa surgery' },
  { id: 'trauma-gas', name: 'Trauma Gas', description: '20M bike fall with skull fracture' },
  { id: 'normal-brain', name: 'Normal Brain', description: '20M first episode psychosis' }
];

export * from './gasBubblesSWI';
export * from './traumaGas';
export * from './normalBrain';