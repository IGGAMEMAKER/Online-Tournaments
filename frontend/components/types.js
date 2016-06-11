export type TournamentType = {
  tournamentID: number,
  buyIn: number,
  status: number,
  startDate: Date,
  players: number,
  goNext: Array<number>,
  gameNameID: number,
  Prizes: Array,

  settings: Object,
}
