export enum VenditaStatoSpedizioneEnum {
    DaSpedire = 0,
    SpedizioneInCorso = 1,
    SpedizioneTerminataParzialmente = 2,
    SpedizioneTerminataCompletamente = 3,
    SpedizioneFallita = 4
}

export const VenditaStatoSpedizioneEnumRecord: Record<VenditaStatoSpedizioneEnum, string> = {
    [VenditaStatoSpedizioneEnum.DaSpedire]: 'Da Spedire',
    [VenditaStatoSpedizioneEnum.SpedizioneInCorso]: 'Spedizione In Corso',
    [VenditaStatoSpedizioneEnum.SpedizioneTerminataParzialmente]: 'Spedizione Terminata Parzialmente',
    [VenditaStatoSpedizioneEnum.SpedizioneTerminataCompletamente]: 'Spedizione Terminata Completamente',
    [VenditaStatoSpedizioneEnum.SpedizioneFallita]: 'Spedizione Fallita'
}