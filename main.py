from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from supabase import create_client, Client
from jose import JWTError, jwt
import base64
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv('env')

from game_store import game_store
from game_engine import MetaBoard, GameState


app = FastAPI(title="Ultimate Tic-Tac-Toe API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MoveRequest(BaseModel):
    board_index: int
    position: int
    player: int


def get_supabase_client() -> Client:
    """Get Supabase client"""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    return create_client(supabase_url, supabase_key)


class User:
    def __init__(self, id: str, email: Optional[str] = None):
        self.id = id
        self.email = email

async def verify_user(authorization: Optional[str] = Header(None)):
    """Verify user from authorization header by decoding JWT"""
    if not authorization or not authorization.startswith("Bearer "):
        print("No authorization header or doesn't start with Bearer")
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    token = authorization.replace("Bearer ", "")
    print(f"Received token: {token[:50]}...")
    
    try:
        # Decode JWT without verification for simplicity
        # In production, you should verify the signature
        parts = token.split('.')
        if len(parts) < 2:
            print("Invalid token format: not enough parts")
            raise HTTPException(status_code=401, detail="Invalid token format")
        
        # Decode payload
        payload = parts[1]
        # Add padding if needed
        payload += '=' * (4 - len(payload) % 4)
        
        try:
            decoded = base64.urlsafe_b64decode(payload)
            data = json.loads(decoded)
            print(f"Decoded token data: {json.dumps(data, indent=2)}")
        except Exception as decode_error:
            print(f"Error decoding token: {decode_error}")
            raise HTTPException(status_code=401, detail=f"Error decoding token: {str(decode_error)}")
        
        user_id = data.get('sub')
        if not user_id:
            print("No user ID in token")
            raise HTTPException(status_code=401, detail="No user ID in token")
        
        print(f"Authenticated user: {user_id}")
        return User(id=user_id, email=data.get('email'))
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in verify_user: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


@app.post("/api/game/new")
async def create_game(user=Depends(verify_user)):
    """Create a new game"""
    try:
        print(f"Creating game for user: {user.id}")
        game_id = game_store.create_new_game(user.id)
        print(f"Game created with ID: {game_id}")
        
        game_data = game_store.get_game(game_id)
        
        if not game_data:
            print("Failed to retrieve game data")
            raise HTTPException(status_code=500, detail="Failed to create game")
        
        state = game_data.board.get_state()
        
        # Convert dataclass to dict for JSON serialization
        state_dict = {
            "boards": [{"board": b.board, "winner": b.winner, "available_moves": b.available_moves} for b in state.boards],
            "meta_board": state.meta_board,
            "game_winner": state.game_winner,
            "next_board": state.next_board,
            "available_boards": state.available_boards,
            "move_history": state.move_history,
        }
        
        print(f"Returning game state")
        return {
            "game_id": game_id,
            "state": state_dict,
            "message": "New game created. You are X. Make your move.",
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in create_game: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/game/{game_id}/move")
async def make_move(
    game_id: str,
    move: MoveRequest,
    user=Depends(verify_user)
):
    """Make a move"""
    try:
        game_data = game_store.get_game(game_id)
        
        if not game_data:
            raise HTTPException(status_code=404, detail="Game not found")
        
        # Verify ownership (check in Supabase)
        supabase_client = get_supabase_client()
        result = supabase_client.table("games").select("user_id").eq("id", game_id).execute()
        
        if not result.data or result.data[0]["user_id"] != user.id:
            raise HTTPException(status_code=403, detail="Unauthorized to access this game")
        
        success, message = game_data.board.make_move(
            move.board_index,
            move.position,
            move.player
        )
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        game_over = game_data.board.game_winner is not None
        
        # Update in Supabase
        game_store.update_game(game_id, game_data)
        
        return {
            "game_id": game_id,
            "state": game_data.board.get_state().__dict__,
            "message": (
                f"Game Over! Winner: "
                + ("You (X)" if game_data.board.game_winner == 1 
                   else "AI (O)" if game_data.board.game_winner == 2 
                   else "Draw")
                if game_over
                else "Move successful. Waiting for AI..."
            ),
            "game_over": game_over,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/game/{game_id}/ai-move")
async def ai_move(game_id: str, user=Depends(verify_user)):
    """Get AI move"""
    try:
        game_data = game_store.get_game(game_id)
        
        if not game_data:
            raise HTTPException(status_code=404, detail="Game not found")
        
        # Verify ownership
        supabase_client = get_supabase_client()
        result = supabase_client.table("games").select("user_id").eq("id", game_id).execute()
        
        if not result.data or result.data[0]["user_id"] != user.id:
            raise HTTPException(status_code=403, detail="Unauthorized to access this game")
        
        if game_data.board.game_winner is not None:
            return {
                "game_id": game_id,
                "board_index": -1,
                "position": -1,
                "state": game_data.board.get_state().__dict__,
                "message": "Game is already over",
                "game_over": True,
            }
        
        move = game_data.ai_agent.get_best_move(game_data.board)
        
        if not move:
            raise HTTPException(status_code=400, detail="No valid moves available")
        
        board_index, position = move
        success, message = game_data.board.make_move(board_index, position, 2)
        
        if not success:
            raise HTTPException(status_code=400, detail=f"AI move failed: {message}")
        
        game_over = game_data.board.game_winner is not None
        
        # Update in Supabase
        game_store.update_game(game_id, game_data)
        
        return {
            "game_id": game_id,
            "board_index": board_index,
            "position": position,
            "state": game_data.board.get_state().__dict__,
            "message": (
                f"Game Over! Winner: "
                + ("You (X)" if game_data.board.game_winner == 1 
                   else "AI (O)" if game_data.board.game_winner == 2 
                   else "Draw")
                if game_over
                else "Your turn."
            ),
            "game_over": game_over,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/game/{game_id}/reset")
async def reset_game(game_id: str, user=Depends(verify_user)):
    """Reset game"""
    try:
        game_data = game_store.get_game(game_id)
        
        if not game_data:
            raise HTTPException(status_code=404, detail="Game not found")
        
        # Verify ownership
        supabase_client = get_supabase_client()
        result = supabase_client.table("games").select("user_id").eq("id", game_id).execute()
        
        if not result.data or result.data[0]["user_id"] != user.id:
            raise HTTPException(status_code=403, detail="Unauthorized to access this game")
        
        game_data.board.reset()
        
        # Update in Supabase
        game_store.update_game(game_id, game_data)
        
        return {
            "game_id": game_id,
            "state": game_data.board.get_state().__dict__,
            "message": "Game reset. Make your move.",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/health")
async def health():
    """Health check"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

