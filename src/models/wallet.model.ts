export type Person = {
    id: number
    name: string
    limite: number
}

export type Wallet = Person & {
    valor: number
}