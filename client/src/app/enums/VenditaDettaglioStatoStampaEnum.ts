export enum VenditaDettaglioStatoStampaEnum {
    DaStampare = 0,
    StampaInCorso = 1,
    DaLavare = 2,
    DaCurare = 3,
    TerminatoSenzaDifetti = 4,
    TerminatoConDifetti = 5,
    Fallito = 6
}

export const VenditaDettaglioStatoStampaEnumRecord: Record<VenditaDettaglioStatoStampaEnum, string> = {
    [VenditaDettaglioStatoStampaEnum.DaStampare]: 'Da Stampare',
    [VenditaDettaglioStatoStampaEnum.StampaInCorso]: 'Stampa In Corso',
    [VenditaDettaglioStatoStampaEnum.DaLavare]: 'Da Lavare',
    [VenditaDettaglioStatoStampaEnum.DaCurare]: 'Da Curare',
    [VenditaDettaglioStatoStampaEnum.TerminatoSenzaDifetti]: 'Terminato Senza Difetti',
    [VenditaDettaglioStatoStampaEnum.TerminatoConDifetti]: 'Terminato Con Difetti',
    [VenditaDettaglioStatoStampaEnum.Fallito]: 'Fallito'
}