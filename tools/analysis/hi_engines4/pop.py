import re, json, zstandard, sys
from collections import Counter, defaultdict
sys.path.insert(0,'O:/_Chessteaching/tools')
SP="C:/Users/Ender/AppData/Local/Temp/claude/O---Chessteaching/4071769d-cf5b-453e-9168-98863c2f445a/scratchpad/"
data=zstandard.ZstdDecompressor().stream_reader(open('O:/_Chessteaching/library/data/lichess_db_standard_rated_2013-01.pgn.zst','rb')).read().decode('utf-8','replace')
cnt=defaultdict(lambda: defaultdict(Counter))  # prefix -> band -> move
for b in re.split(r"\n(?=\[Event )",data):
    try:
        w=int(re.search(r'\[WhiteElo "(\d+)"',b).group(1)); k=int(re.search(r'\[BlackElo "(\d+)"',b).group(1))
        mt=b.split("\n\n",1)[1].replace("\n"," ")
    except Exception: continue
    toks=[t for t in mt.split() if not re.match(r'^\d+\.',t) and t not in('1-0','0-1','1/2-1/2','*')]
    for ply in range(4,16):
        if ply>=len(toks): break
        mover = w if ply%2==0 else k
        band='low' if mover<1500 else ('high' if mover>=1900 else 'mid')
        cnt[' '.join(toks[:ply])][band][toks[ply]]+=1
out={p:{b:dict(c) for b,c in d.items()} for p,d in cnt.items() if sum(d['low'].values())>=25}
json.dump(out,open(SP+'pop.json','w')); print(len(out))
