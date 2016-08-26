export type TournamentType = {
  tournamentID: number,
  buyIn: number,
  status: number,
  startDate: Date,
  players: number,
  goNext: Array<number>,
  gameNameID: number,
  Prizes: Array,
  rounds: number,

  settings: {
    regularity: number,
    hidden: boolean,
    tag: string
  },
}

export type ModalMessage = {
  data : Object;
  _id: string,
}

export type ProfileInfo = {
  tournaments: Array<TournamentType>,
  money: number,
  packs: Object,
}
