import type { ScoringConfig, PositionFilter, YearFilter } from '../types';

export const DEFAULT_SCORING: ScoringConfig = {
  passingYardsPerPoint: 25,
  passingTD: 4,
  interception: -2,
  rushingYardsPerPoint: 10,
  rushingTD: 6,
  receivingYardsPerPoint: 10,
  receivingTD: 6,
  reception: 0, // Standard scoring (0 = standard, 0.5 = half-PPR, 1 = full PPR)
  fumbleLost: -2,
};

export const POSITIONS: PositionFilter[] = ['All', 'QB', 'RB', 'WR', 'TE'];

export const YEAR_FILTERS: { value: YearFilter; label: string }[] = [
  { value: 'Last35', label: 'Last 35 Years' },
  { value: '2020s', label: "2020's" },
  { value: '2010s', label: "2010's" },
  { value: '2000s', label: "2000's" },
  { value: '1990s', label: "1990's" },
  { value: '1980s', label: "1980's" },
  { value: '1970s', label: "1970's" },
];

// Generate individual years from 2024 down to 1970
export const INDIVIDUAL_YEARS: { value: number; label: string }[] = Array.from(
  { length: 2024 - 1970 + 1 },
  (_, i) => {
    const year = 2024 - i;
    return { value: year, label: String(year) };
  }
);

export const MAX_RESULTS = 500;
