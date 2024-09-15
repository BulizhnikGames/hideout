export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.103.132:8080'
export const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://192.168.103.132:8080'

export const TextMessage = '0'
export const PlayerJoined = '1'
export const PlayerLeft = '2'
export const NewAdmin = '3'
export const StartGame = '4'
export const GameData = '5'
export const CharData = '6'
export const UpdateLock = '7'
export const UpdateGame = '8'
export const NewParam = '9'
export const DeleteParam = '10'
export const UpdatedChar = '11'