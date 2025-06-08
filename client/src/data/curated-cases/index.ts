import { gasBubblesSWICase, nodePositions as gasBubblesPositions, nodeColors as gasBubblesColors } from './gasBubblesSWI';
import { traumaGasCase, traumaGasNodePositions, traumaGasNodeColors } from './traumaGas';

export interface CaseData {
  case: any;
  nodePositions: any;
  nodeColors: any;
}

export const availableCases: Record<string, CaseData> = {
  'gas-bubbles-swi': {
    case: gasBubblesSWICase,
    nodePositions: gasBubblesPositions,
    nodeColors: gasBubblesColors
  },
  'trauma-gas': {
    case: traumaGasCase,
    nodePositions: traumaGasNodePositions,
    nodeColors: traumaGasNodeColors
  }
};

export const caseOptions = [
  { id: 'gas-bubbles-swi', name: 'Gas Bubbles on SWI', description: '65M post-posterior fossa surgery' },
  { id: 'trauma-gas', name: 'Trauma Gas', description: '20M bike fall with skull fracture' }
];

export * from './gasBubblesSWI';
export * from './traumaGas';