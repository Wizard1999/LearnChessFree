import sys, json, chess
sys.path.insert(0,'O:/_Chessteaching/tools')
from engine import Engine
from multiprocessing import Pool
SP="C:/Users/Ender/AppData/Local/Temp/claude/O---Chessteaching/4071769d-cf5b-453e-9168-98863c2f445a/scratchpad/"
def sc(r): return (100000-abs(r['value']))*(1 if r['value']>0 else -1) if r['kind']=='mate' else r['value']
def job(items):
    e=Engine(); out=[]
    for pre,d in items:
        b=chess.Board()
        try:
            for t in pre.split(): b.push_san(t)
        except Exception: continue
        low=sorted(d['low'].items(),key=lambda x:-x[1]); tot=sum(d['low'].values())
        top,n=low[0]
        if n/tot<0.3: continue
        try: mv=b.parse_san(top)
        except Exception: continue
        best=e.search(b.fen(),depth=14)[1]; mine=e.search(b.fen(),depth=14,searchmoves=[mv.uci()])[1]
        loss=sc(best)-sc(mine)
        if loss>=100: out.append((loss,pre,b.fen(),top,n,tot,b.san(chess.Move.from_uci(best['pv'][0])),d))
    e.close(); return out
if __name__=='__main__':
    P=json.load(open(SP+'pop.json')); items=list(P.items())
    with Pool(16) as p: res=sum(p.map(job,[items[i::16] for i in range(16)]),[])
    res.sort(reverse=True)
    json.dump(res,open(SP+'pop2.json','w'))
    for r in res[:25]: print(r[0],r[1],'|',r[3],r[4],'/',r[5],'best',r[6],{k:dict(sorted(v.items(),key=lambda x:-x[1])[:3]) for k,v in r[7].items()})
