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

export const VenditaDettaglioStatoStampaColorRecord: Record<VenditaDettaglioStatoStampaEnum, string> = {
  [VenditaDettaglioStatoStampaEnum.PiattoDaPreparare]: '#FFC107',
  [VenditaDettaglioStatoStampaEnum.DaStampare]: '#FFC107',
  [VenditaDettaglioStatoStampaEnum.StampaInCorso]: '#2196F3',
  [VenditaDettaglioStatoStampaEnum.DaControllare]: '#2196F3',
  [VenditaDettaglioStatoStampaEnum.TerminatoConDifetti]: '#FF9800',
  [VenditaDettaglioStatoStampaEnum.TerminatoSenzaDifetti]: '#4CAF50'
};

export const VenditaDettaglioStatoStampaIconRecord: Record<VenditaDettaglioStatoStampaEnum, string> = {
  [VenditaDettaglioStatoStampaEnum.PiattoDaPreparare]: 'pi pi-folder',
  [VenditaDettaglioStatoStampaEnum.DaStampare]: 'pi pi-clock',
  [VenditaDettaglioStatoStampaEnum.StampaInCorso]: 'pi pi-print',
  [VenditaDettaglioStatoStampaEnum.DaControllare]: 'pi pi-camera',
  [VenditaDettaglioStatoStampaEnum.TerminatoConDifetti]: 'pi pi-exclamation-triangle',
  [VenditaDettaglioStatoStampaEnum.TerminatoSenzaDifetti]: 'pi pi-check-circle'
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
