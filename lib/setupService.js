import { db } from '@/lib/db'; // (Pas aan naar jouw database connectie)

export async function getTopSetups(limit = 3) {
  const setups = await db.setup.findMany({
    orderBy: {
      score: 'desc', // Sorteer op hoogste score
    },
    take: limit,
    select: {
      id: true,
      name: true,
      trend: true,
      indicators: true,
      score: true,
    },
  });

  return setups;
}
