import json, chess
from collections import Counter, defaultdict
SP="C:/Users/Ender/AppData/Local/Temp/claude/O---Chessteaching/4071769d-cf5b-453e-9168-98863c2f445a/scratchpad/"
A=json.load(open(SP+'analysis.json')); S=json.load(open(SP+'sample.json'))
V={1:1,2:3,3:3,4:5,5:9,6:0}
def phase(b,ply):
    m=sum(V[p.piece_type] for p in b.piece_map().values())
    if ply<20: return 'opening'
    return 'endgame' if m<=26+0 and False else ('endgame' if sum(V[p.piece_type] for p in b.piece_map().values() if p.piece_type!=1)<=30 else 'middlegame')
def kind(r):
    b=chess.Board(r['fen']); mv=chess.Move.from_uci(r['uci']); me=b.turn
    bb=b.copy(); bb.push(mv)
    if r['matereply'] or r['after']<=-5000: return 'mate'
    rep=r['reply']
    if rep:
        rm=chess.Move.from_uci(rep)
        if bb.is_capture(rm):
            vic=bb.piece_at(rm.to_square) 
            if vic and vic.piece_type>=2:
                return 'hung'
            if vic is None and bb.is_en_passant(rm): pass
            else: return 'hung' if vic and vic.piece_type>=2 else 'pawnloss'
    bm=r['best']
    if bm:
        m2=chess.Move.from_uci(bm)
        if b.is_capture(m2) or b.gives_check(m2): return 'missed'
    return 'other'
def stats(grp):
    st=Counter(); tot_moves=0; ph=Counter(); phm=Counter(); kinds=Counter(); games=0; first=Counter(); thrown=Counter(); wins=Counter()
    ex=defaultdict(list)
    for i,c in enumerate(S[grp]):
        rows=A.get(f"{grp}:{i}")
        if not rows: continue
        games+=1; fb=None
        maxadv=[0,0]  # white,black mover pov
        for r in rows:
            b=chess.Board(r['fen']); p=phase(b,r['ply']); phm[p]+=1; tot_moves+=1
            loss=r['before']-r['after']
            if loss>=200 and r['before']>-500:
                k=kind(r); ph[p]+=1; kinds[k]+=1; st['bl']+=1; ex[(p,k)].append((i,r,loss))
                if loss>=300 and fb is None: fb=(r['ply']%2, i)
        # first blunder outcome
        res=c['res']
        if fb is not None:
            first['n']+=1
            side='1-0' if fb[0]==0 else '0-1'
            if res!=side and res!='1/2-1/2': first['blunderer_lost']+=1
            elif res=='1/2-1/2': first['draw']+=1
        # thrown away: side had >=+300 after own move at some point (mover pov), not win
        for col in (0,1):
            adv=any((r['after'] if r['ply']%2==col else -r['after'])>=300 and False for r in rows)
        wadv=any(((r['after'] if r['ply']%2==0 else -r['after'])>=300) for r in rows)
        badv=any(((r['after'] if r['ply']%2==1 else -r['after'])>=300) for r in rows)
        for col,adv,wins_str in ((0,wadv,'1-0'),(1,badv,'0-1')):
            if adv:
                thrown['adv']+=1
                if res==wins_str: thrown['won']+=1
                elif res=='1/2-1/2': thrown['draw']+=1
    return dict(games=games,moves=tot_moves,blunders=st['bl'],per100=round(100*st['bl']/tot_moves,2),phase_blunders=dict(ph),phase_moves=dict(phm),kinds=dict(kinds),first=dict(first),adv=dict(thrown)),ex
out={}
for g in S:
    s,ex=stats(g); out[g]=s; print(g,json.dumps(s))
    json.dump({f"{k[0]}|{k[1]}":[(i,r,l) for i,r,l in v[:60]] for k,v in ex.items()},open(SP+f'ex_{g}.json','w'))
