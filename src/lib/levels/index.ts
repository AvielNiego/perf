import { act1 } from './act1';
import { act2 } from './act2';
import { act3 } from './act3';
import { act4 } from './act4';
import { act5 } from './act5';
import { Act, Level } from './types';

export const acts: Act[] = [act1, act2, act3, act4, act5];
export const allLevels: Level[] = acts.flatMap(act => act.levels);
export const getLevelById = (id: string): Level | undefined => allLevels.find(l => l.id === id);
export const getActById = (id: number): Act | undefined => acts.find(a => a.id === id);
export { type Act, type Level, type Lesson, type Quest, type Badge, type Rank, RANKS, ALL_BADGES } from './types';
