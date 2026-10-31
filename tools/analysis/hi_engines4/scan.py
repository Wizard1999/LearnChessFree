import re, json, random, zstandard, sys
from collections import Counter, defaultdict
SP="C:/Users/Ender/AppData/Local/Temp/claude/O---Chessteaching/4071769d-cf5b-453e-9168-98863c2f445a/scratchpad/"
data=zstandard.ZstdDecompressor().stream_reader(open('library/data/lichess_db_standard_rated_2013-01.pgn.zst','rb')).read().decode('utf-8','replace')
blocks=re.split(r"\n(?=\[Event )",data)
print(len(blocks))
def band(e):
    return 'low' if e<1500 else ('mid' if e<1900 else 'high')
hook=re.compile(r"^1\. e4 e5 2\. Nf3 Nc6 3\. Bc4 Nf6 4\. Ng5 d5 5\. exd5 (\S+)")
hc=defaultdict(Counter); cand=[]
tcre=re.compile(r'\[TimeControl "(\d+)\+(\d+)"\]')
for b in blocks:
    try:
        w=int(re.search(r'\[WhiteElo "(\d+)"',b).group(1)); k=int(re.search(r'\[BlackElo "(\d+)"',b).group(1))
        res=re.search(r'\[Result "([^"]+)"',b).group(1)
        tm=tcre.search(b); 
        if not tm: continue
        base,inc=int(tm.group(1)),int(tm.group(2))
        mt=b.split("\n\n",1)[1].strip().replace("\n"," ")
    except Exception: continue
    if 'Termination "Normal"' not in b or res not in('1-0','0-1','1/2-1/2'): continue
    m=hook.match(mt)
    if m:
        # band by the player of black (who chooses)
        hc[band(k)][m.group(1)]+=1
    est=base+40*inc
    g=est>=480
    cand.append(dict(w=w,b=k,res=res,tc=f"{base}+{inc}",est=est,mt=mt))
print({k:dict(v.most_common(5)) for k,v in hc.items()})
json.dump({b:dict(c) for b,c in hc.items()},open(SP+'hook.json','w'))
random.seed(7)
def pick(f,n):
    pool=[c for c in cand if f(c) and len(c['mt'].split())>40]
    random.shuffle(pool); return pool[:n]
S=dict(
 low_slow=pick(lambda c:c['w']<1500 and c['b']<1500 and c['w']>=1000 and c['b']>=1000 and c['est']>=480,300),
 low_fast=pick(lambda c:c['w']<1500 and c['b']<1500 and c['w']>=1000 and c['b']>=1000 and c['est']<180,300),
 high_slow=pick(lambda c:c['w']>=2000 and c['b']>=2000 and c['est']>=180,200))
print({k:len(v) for k,v in S.items()})
json.dump(S,open(SP+'sample.json','w'))
print(len(cand), sum(1 for c in cand if c['w']<1500 and c['b']<1500), sum(1 for c in cand if c['w']>=2000 and c['b']>=2000))
