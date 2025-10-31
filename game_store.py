from typing import Optional, Dict, Any
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from game_engine import MetaBoard
from minimax_agent import MinimaxAgent

# Load environment variables
load_dotenv('env')


class GameData:
    def __init__(self, board: MetaBoard, ai_agent: MinimaxAgent):
        self.board = board
        self.ai_agent = ai_agent


class GameStore:
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in env file")
        
        print(f"Initializing game store with Supabase URL: {supabase_url[:30]}...")
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.games: Dict[str, GameData] = {}

    def create_new_game(self, user_id: str) -> str:
        """Create a new game in Supabase and return the game ID"""
        from uuid import uuid4
        
        game_id = str(uuid4())
        new_board = MetaBoard()
        
        # Get state and convert to dict
        state = new_board.get_state()
        game_state = {
            "boards": [{"board": b.board, "winner": b.winner, "available_moves": b.available_moves} for b in state.boards],
            "meta_board": state.meta_board,
            "game_winner": state.game_winner,
            "next_board": state.next_board,
            "available_boards": state.available_boards,
            "move_history": state.move_history,
        }
        
        # Insert into Supabase
        self.supabase.table("games").insert({
            "id": game_id,
            "user_id": user_id,
            "game_state": game_state,
        }).execute()
        
        # Store in memory
        self.games[game_id] = GameData(
            board=new_board,
            ai_agent=MinimaxAgent(2, 4)
        )
        
        return game_id

    def get_game(self, game_id: str) -> Optional[GameData]:
        """Get game from cache or Supabase"""
        # Check cache first
        if game_id in self.games:
            return self.games[game_id]
        
        # Load from Supabase
        result = self.supabase.table("games").select("*").eq("id", game_id).execute()
        
        if not result.data:
            return None
        
        data = result.data[0]
        state = data["game_state"]
        
        # Reconstruct the board
        board = MetaBoard()
        
        # Reconstruct boards
        for i, b_state in enumerate(state["boards"]):
            board.boards[i].board = b_state["board"]
            board.boards[i].winner = b_state["winner"]
        
        board.meta_board = state["meta_board"]
        board.game_winner = state["game_winner"]
        board.next_board = state["next_board"]
        board.move_history = state["move_history"]
        
        game_data = GameData(
            board=board,
            ai_agent=MinimaxAgent(2, 4)
        )
        
        # Cache it
        self.games[game_id] = game_data
        
        return game_data

    def update_game(self, game_id: str, game_data: GameData) -> None:
        """Update game in Supabase"""
        self.games[game_id] = game_data
        
        state = game_data.board.get_state()
        
        # Convert dataclass to dict for JSON serialization
        game_state = {
            "boards": [{"board": b.board, "winner": b.winner, "available_moves": b.available_moves} for b in state.boards],
            "meta_board": state.meta_board,
            "game_winner": state.game_winner,
            "next_board": state.next_board,
            "available_boards": state.available_boards,
            "move_history": state.move_history,
        }
        
        self.supabase.table("games").update({
            "game_state": game_state,
        }).eq("id", game_id).execute()

    def delete_game(self, game_id: str) -> None:
        """Delete game from Supabase and cache"""
        self.supabase.table("games").delete().eq("id", game_id).execute()
        if game_id in self.games:
            del self.games[game_id]


# Global instance
game_store = GameStore()

