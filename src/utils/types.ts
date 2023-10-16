export interface Room {
    room: string,
    client: string[],
}

export interface Client {
    id?: string,
    name?: string
}

export interface ReadyState {
    id?: string,
    ready?: boolean
}

export interface GameRes {
    id?: string,
    gesture?: number
}
