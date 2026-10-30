// Stage names of the recommended learning path (content/path.json, built by tools/build_path.py). A test keeps this list equal to the built file.
export const PATH_STAGES: { id: string; title: string; milestone: string }[] = [
  { id: 'S0', title: 'Moves and the board', milestone: 'You can name the squares and move every piece.' },
  { id: 'S1', title: 'Legal play', milestone: 'You can tell check, checkmate and stalemate apart and play only legal moves.' },
  { id: 'S2', title: 'First complete games', milestone: 'You can start, play and finish a game with simple opening habits, and look back at one unsure moment.' },
  { id: 'S3', title: 'First wins', milestone: 'You find mate in one, simple forks and pins, and finish a game with king and queen against king.' },
  { id: 'S4', title: 'Becoming independent', milestone: 'You test your move against the reply, finish with rook mate, and explain why you moved.' },
  { id: 'S5', title: 'Developing strength', milestone: 'You use tactics, plans and pawn structure without being told the theme.' },
  { id: 'S6', title: 'Advanced craft', milestone: 'You calculate longer lines, choose between plans, and convert advantages.' },
  { id: 'S7', title: 'Specialization', milestone: 'You direct training at your own demonstrated needs.' },
]
