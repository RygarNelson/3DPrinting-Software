export enum VenditaStatoSpedizioneEnum {
    DaSpedire = 0,
    SpedizioneInCorso = 1,
    SpedizioneTerminataParzialmente = 2,
    SpedizioneTerminataCompletamente = 3,
    SpedizioneFallita = 4,
    SpedizioneReso = 5,
}

export const VenditaStatoSpedizioneEnumRecord: Record<VenditaStatoSpedizioneEnum, string> = {
    [VenditaStatoSpedizioneEnum.DaSpedire]: 'Da Spedire',
    [VenditaStatoSpedizioneEnum.SpedizioneInCorso]: 'In Corso',
    [VenditaStatoSpedizioneEnum.SpedizioneTerminataParzialmente]: 'Terminata Parzialmente',
    [VenditaStatoSpedizioneEnum.SpedizioneTerminataCompletamente]: 'Terminata Completamente',
    [VenditaStatoSpedizioneEnum.SpedizioneFallita]: 'Fallita',
    [VenditaStatoSpedizioneEnum.SpedizioneReso]: 'Reso'
}