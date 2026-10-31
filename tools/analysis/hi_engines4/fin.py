import json
exec(open("C:/Users/Ender/AppData/Local/Temp/claude/O---Chessteaching/4071769d-cf5b-453e-9168-98863c2f445a/scratchpad/cls.py").read().split("out={}")[0])
R={g:stats(g)[0] for g in S}
def comb(a,b):
    o={}
    for k in('games','moves','blunders'): o[k]=a[k]+b[k]
    for k in('phase_blunders','phase_moves','kinds','first','adv'):
        o[k]={x:a[k].get(x,0)+b[k].get(x,0) for x in set(a[k])|set(b[k])}
    return o
low=comb(R['low_slow'],R['low_fast']); high=R['high_slow']
for n,x in(('low',low),('high',high)):
    print(n,x['games'],x['moves'],x['blunders'],round(100*x['blunders']/x['moves'],2))
    print({p:round(100*x['phase_blunders'][p]/x['phase_moves'][p],1) for p in x['phase_moves']}, x['phase_blunders'], x['phase_moves'])
    t=x['blunders']; print({k:(v,round(100*v/t)) for k,v in x['kinds'].items()})
    print(x['first'],x['adv'])
