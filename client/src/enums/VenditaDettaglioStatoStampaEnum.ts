export enum VenditaDettaglioStatoStampaEnum {
  DaStampare = 0,
  StampaInCorso = 1,
  //DaLavare = 2,
  //DaCurare = 3,
  TerminatoSenzaDifetti = 4,
  TerminatoConDifetti = 5,
  //Fallito = 6,
  DaControllare = 7,
  PiattoDaPreparare = 8
}

export const VenditaDettaglioStatoStampaEnumRecord: Record<VenditaDettaglioStatoStampaEnum, string> = {
  [VenditaDettaglioStatoStampaEnum.DaStampare]: 'Da Stampare',
  [VenditaDettaglioStatoStampaEnum.StampaInCorso]: 'Stampa In Corso',
  [VenditaDettaglioStatoStampaEnum.DaControllare]: 'Da Controllare',
  [VenditaDettaglioStatoStampaEnum.TerminatoSenzaDifetti]: 'Terminato Senza Difetti',
  [VenditaDettaglioStatoStampaEnum.TerminatoConDifetti]: 'Terminato Con Difetti',
  //[VenditaDettaglioStatoStampaEnum.Fallito]: 'Fallito',
  [VenditaDettaglioStatoStampaEnum.PiattoDaPreparare]: 'Piatto Da Preparare'
};

export const VenditaDettaglioStatoStampaEnumOrder: VenditaDettaglioStatoStampaEnum[] = [
  VenditaDettaglioStatoStampaEnum.PiattoDaPreparare,
  VenditaDettaglioStatoStampaEnum.DaStampare,
  VenditaDettaglioStatoStampaEnum.StampaInCorso,
  VenditaDettaglioStatoStampaEnum.DaControllare,
  VenditaDettaglioStatoStampaEnum.TerminatoSenzaDifetti,
  VenditaDettaglioStatoStampaEnum.TerminatoConDifetti
  //VenditaDettaglioStatoStampaEnum.Fallito
];
