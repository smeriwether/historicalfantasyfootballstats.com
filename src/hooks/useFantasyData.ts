import { useState, useEffect, useMemo } from 'react';
import type { PlayerSeason, PlayerSeasonWithPoints } from '../types';
import { useFantasyStore } from '../stores/fantasyStore';
import { calculateFantasyPoints } from '../utils/calculations';
import { filterByPosition, filterByYearRange } from '../utils/filters';
import { MAX_RESULTS } from '../utils/constants';

export function useFantasyData() {
  const [rawData, setRawData] = useState<PlayerSeason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { positionFilter, yearFilter, scoringConfig } = useFantasyStore();

  // Load data on mount
  useEffect(() => {
    fetch('/data/fantasy_data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load data');
        return res.json();
      })
      .then((data: PlayerSeason[]) => {
        setRawData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Calculate filtered and scored data
  const data = useMemo<PlayerSeasonWithPoints[]>(() => {
    if (loading || !rawData.length) return [];

    // Apply filters
    let filtered = filterByPosition(rawData, positionFilter);
    filtered = filterByYearRange(filtered, yearFilter);

    // Calculate fantasy points for each player
    const withPoints = filtered.map((player) => ({
      ...player,
      fantasyPoints: calculateFantasyPoints(player, scoringConfig),
      rank: 0, // Placeholder, will be set after sorting
    }));

    // Sort by fantasy points descending
    withPoints.sort((a, b) => b.fantasyPoints - a.fantasyPoints);

    // Limit to top N results and assign ranks
    const topResults = withPoints.slice(0, MAX_RESULTS);
    topResults.forEach((player, index) => {
      player.rank = index + 1;
    });

    return topResults;
  }, [rawData, loading, positionFilter, yearFilter, scoringConfig]);

  return { data, loading, error };
}
