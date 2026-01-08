import type { PlayerSeason, ScoringConfig } from '../types';

/**
 * Calculate fantasy points for a player-season based on scoring configuration.
 * Returns points rounded to 1 decimal place.
 */
export function calculateFantasyPoints(
  player: PlayerSeason,
  config: ScoringConfig
): number {
  let points = 0;

  // Passing
  points += player.passYds / config.passingYardsPerPoint;
  points += player.passTD * config.passingTD;
  points += player.passInt * config.interception;

  // Rushing
  points += player.rushYds / config.rushingYardsPerPoint;
  points += player.rushTD * config.rushingTD;
  points += player.rushAtt * config.rushingCarry;

  // Receiving
  points += player.recYds / config.receivingYardsPerPoint;
  points += player.recTD * config.receivingTD;
  points += player.rec * config.reception;

  // Fumbles
  points += player.fmbLost * config.fumbleLost;

  // Round to 1 decimal place
  return Math.round(points * 10) / 10;
}
