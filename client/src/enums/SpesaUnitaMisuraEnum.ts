export enum SpesaUnitaMisuraEnum {
    Altro = 0,
    Kg = 1,
    Lt = 2
}

export const SpesaUnitaMisuraEnumRecord: Record<SpesaUnitaMisuraEnum, string> = {
    [SpesaUnitaMisuraEnum.Altro]: 'Altro',
    [SpesaUnitaMisuraEnum.Kg]: 'Kg',
    [SpesaUnitaMisuraEnum.Lt]: 'Lt'
}