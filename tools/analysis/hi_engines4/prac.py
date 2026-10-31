import sys, json, chess
sys.path.insert(0,'O:/_Chessteaching/tools')
from engine import Engine
from multiprocessing import Pool
SP="C:/Users/Ender/AppData/Local/Temp/claude/O---Chessteaching/4071769d-cf5b-453e-9168-98863c2f445a/scratchpad/"
def sc(r): return (100000-abs(r['value']))*(1 if r['value']>0 else -1) if r['kind']=='mate' else r['value']
def job(fens):
    e=Engine(); out=[]
    for fen in fens:
        b=chess.Board(fen)
        top=e.search(fen,depth=14,multipv=4)
        if len(top)<2: continue
        best=sc(top[1])
        for k in (1,2,3,4):
            if k not in top: continue
            if best-sc(top[k])>60: continue
            mv=top[k]['pv'][0]; bb=b.copy(); bb.push(chess.Move.from_uci(mv))
            if bb.is_game_over(): continue
            rep=e.search(bb.fen(),depth=14,multipv=6)
            rs=sorted([sc(r) for r in rep.values()],reverse=True)
            good=sum(1 for x in rs if rs[0]-x<=50)
            gap=rs[0]-rs[1] if len(rs)>1 else 9999
            out.append((fen,mv,sc(top[k]),good,gap,len(rep)))
    e.close(); return out
if __name__=='__main__':
    A=json.load(open(SP+'analysis.json'))
    fens=[]
    for key,rows in A.items():
        if key.startswith('high'): continue
        for r in rows:
            if 14<=r['ply']<=40 and -80<=r['before']<=80 and len(chess.Board(r['fen']).piece_map())>=14: fens.append(r['fen'])
    import random; random.seed(5); random.shuffle(fens); fens=fens[:480]
    chunks=[fens[i::16] for i in range(16)]
    with Pool(16) as p: res=sum(p.map(job,chunks),[])
    json.dump(res,open(SP+'prac.json','w'))
    # pairs per fen
    from collections import defaultdict
    d=defaultdict(list)
    for fen,mv,s,g,gap,n in res: d[fen].append((mv,s,g,gap,n))
    for fen,L in d.items():
        a=[x for x in L if x[2]>=4 and x[4]>=6]; bq=[x for x in L if x[2]==1 and x[3]>=150]
        if a and bq: print(fen,a,bq)
