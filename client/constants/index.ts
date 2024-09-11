export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
export const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://127.0.0.1:8000'

export const TextMessage = '0'
export const PlayerJoined = '1'
export const PlayerLeft = '2'
export const NewAdmin = '3'
export const StartGame = '4'
export const GameData = '5'