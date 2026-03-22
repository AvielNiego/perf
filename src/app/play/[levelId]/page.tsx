import { allLevels } from '@/lib/levels';
import GameClient from './GameClient';

export function generateStaticParams() {
  return allLevels.map((level) => ({ levelId: level.id }));
}

export default function GamePage() {
  return <GameClient />;
}
