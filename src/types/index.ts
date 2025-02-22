export interface Character {
  id: string;
  name: string;
  nameJp: string;
  description: string;
  imageUrl: string;
  specialMove: {
    name: string;
    description: string;
    icon: string;
    effect: 'doubleScore' | 'showAnswer' | 'blockCPU';
  };
  appearance: {
    hair: string;
    eyes: string;
    style: string;
  };
}

export type SpecialMoveEffect = 'doubleScore' | 'showAnswer' | 'blockCPU';