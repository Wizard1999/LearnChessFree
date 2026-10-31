import sys, json, chess
sys.path.insert(0,'O:/_Chessteaching/tools')
from engine import Engine
from multiprocessing import Pool
import io, chess.pgn, re
D=8
def ev(info):
    r=info[1]; 
    v=r['value'] if r['kind']=='cp' else (10000 if r['value']>0 else -10000)
    if r['kind']=='mate' and r['value']==0: v=-10000
    return max(-1500,min(1500,v)), r['kind']=='mate', r['pv']
def job(a):
    gid,mt=a
    e=Engine()
    g=chess.pgn.read_game(io.StringIO(mt))
    b=g.board(); rows=[]
    moves=list(g.mainline_moves())[:100]
    # eval position before each move (side to move pov) and final
    evs=[]
    for i in range(len(moves)+1):
        fen=b.fen()
        if b.is_game_over(): 
            evs.append((-10000 if b.is_checkmate() else 0,b.is_checkmate(),[],fen)); 
        else:
            v,m,pv=ev(e.search(fen,depth=D)); evs.append((v,m,pv,fen))
        if i<len(moves): b.push(moves[i])
    e.close()
    out=[]; b=g.board()
    for i,mv in enumerate(moves):
        before=evs[i][0]; after=-evs[i+1][0]   # mover pov
        out.append(dict(ply=i,san=b.san(mv),uci=mv.uci(),fen=b.fen(),before=before,after=after,best=(evs[i][2] or [None])[0],
                        reply=(evs[i+1][2] or [None])[0],matereply=evs[i+1][1] and evs[i+1][0]>0))
        b.push(mv)
    return gid,out
if __name__=='__main__':
    SP="C:/Users/Ender/AppData/Local/Temp/claude/O---Chessteaching/4071769d-cf5b-453e-9168-98863c2f445a/scratchpad/"
    S=json.load(open(SP+'sample.json'))
    N=int(sys.argv[1]) if len(sys.argv)>1 else 10**9
    jobs=[]
    for grp,gs in S.items():
        for i,c in enumerate(gs[:N]): jobs.append((f"{grp}:{i}",c['mt']))
    with Pool(16) as p:
        res=dict(p.imap_unordered(job,jobs))
    json.dump(res,open(SP+'analysis.json','w'))
    print(len(res))
