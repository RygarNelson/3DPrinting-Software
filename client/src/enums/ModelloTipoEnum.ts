export enum ModelloTipoEnum {
    PLA = 0,
    RESINA = 1
}

export const ModelloTipoEnumRecord: Record<ModelloTipoEnum, string> = {
    [ModelloTipoEnum.PLA]: 'PLA',
    [ModelloTipoEnum.RESINA]: 'Resina'
}