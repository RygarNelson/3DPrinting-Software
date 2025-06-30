export enum SpesaTipoEnum {
    Altro = 0,
    Resina = 1,
    PLA = 2,
    Alcool = 3
}

export const SpesaTipoEnumRecord: Record<SpesaTipoEnum, string> = {
    [SpesaTipoEnum.Altro]: 'Altro',
    [SpesaTipoEnum.Resina]: 'Resina',
    [SpesaTipoEnum.PLA]: 'PLA',
    [SpesaTipoEnum.Alcool]: 'Alcool'
}