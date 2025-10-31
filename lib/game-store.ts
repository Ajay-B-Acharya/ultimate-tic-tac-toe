import { MetaBoard, MiniBoard } from "./game-engine"
import { MinimaxAgent } from "./minimax-agent"
import { supabase } from "./supabase"

interface GameData {
  board: MetaBoard
  ai_agent: MinimaxAgent
}

const games: Map<string, GameData> = new Map()

// Load game from Supabase
export async function loadGameFromDB(gameId: string): Promise<GameData | null> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single()

  if (error || !data) {
    return null
  }

  const board = new MetaBoard()
  const state = data.game_state as any

  // Reconstruct the boards array
  board.boards = state.boards.map((b: any) => {
    const miniBoard = new MiniBoard()
    miniBoard.board = [...b.board]
    miniBoard.winner = b.winner
    return miniBoard
  })
  board.meta_board = [...state.meta_board]
  board.game_winner = state.game_winner
  board.next_board = state.next_board
  board.move_history = [...state.move_history]

  return {
    board,
    ai_agent: new MinimaxAgent(2, 4),
  }
}

// Save game to Supabase
export async function saveGameToDB(gameId: string, gameData: GameData): Promise<void> {
  await supabase
    .from("games")
    .update({
      game_state: gameData.board.get_state(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", gameId)
}

// Create new game in Supabase
export async function createNewGame(userId: string): Promise<string> {
  const newBoard = new MetaBoard()
  const { data, error } = await supabase
    .from("games")
    .insert({
      user_id: userId,
      game_state: newBoard.get_state(),
    })
    .select()
    .single()

  if (error || !data) {
    throw new Error("Failed to create game in database")
  }

  return data.id
}

// Get game - loads from cache or Supabase
export async function getGame(gameId: string): Promise<GameData | null> {
  if (games.has(gameId)) {
    return games.get(gameId)!
  }

  const gameData = await loadGameFromDB(gameId)
  if (gameData) {
    games.set(gameId, gameData)
  }
  return gameData
}

// Update game in memory and database
export async function updateGame(gameId: string, gameData: GameData): Promise<void> {
  games.set(gameId, gameData)
  await saveGameToDB(gameId, gameData)
}

// Delete game from database and cache
export async function deleteGame(gameId: string): Promise<void> {
  await supabase.from("games").delete().eq("id", gameId)
  games.delete(gameId)
}
