import sys,chess
sys.path.insert(0,'tools')
from engine import Engine
S="1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 d5 5.a3 Bxc3+ 6.bxc3 c5 7.cxd5 exd5 8.Bd3 0-0 9.Ne2 b6 10.0-0 Ba6 11.Bxa6 Nxa6 12.Bb2 Qd7 13.a4 Rfe8 14.Qd3 c4 15.Qc2 Nb8 16.Rae1 Nc6 17.Ng3 Na5 18.f3 Nb3 19.e4 Qxa4 20.e5 Nd7 21.Qf2 g6 22.f4 f5 23.exf6 Nxf6 24.f5 Rxe1 25.Rxe1 Re8 26.Re6 Rxe6 27.fxe6 Kg7 28.Qf4 Qe8 29.Qe5 Qe7 30.Ba3 Qxa3 31.Nh5+ gxh5 32.Qg5+ Kf8 33.Qxf6+ Kg8 34.e7 Qc1+ 35.Kf2 Qc2+ 36.Kg3 Qd3+ 37.Kh4 Qe4+ 38.Kxh5 Qe2+ 39.Kh4 Qe4+ 40.g4 Qe1+ 41.Kh5"
import re
toks=[t for t in re.split(r'\s+',S) if t and not re.match(r'\d+\.',t)]
toks=[re.sub(r'^\d+\.','',t) for t in re.split(r'\s+',S) if t]
b=chess.Board();mv=[]
for t in toks:
    t=re.sub(r'^\d+\.','',t)
    if not t: continue
    m=b.parse_san(t); mv.append((b.fen(),b.fullmove_number,b.turn,m.uci(),b.san(m))); b.push(m)
print(b.fen(), b.is_game_over(), len(mv))
e=Engine()
for fen,n,t,u,s in mv:
    if t and 17<=n<=33:
        r=e.search(fen,16,4)
        print(n,s,u,[(r[k]['value'] if r[k]['kind']=='cp' else 'M%d'%r[k]['value'],r[k]['pv'][0]) for k in sorted(r)])
e.close()
