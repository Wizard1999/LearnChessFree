"""Operating characteristics of the master plan's proposed mastery gate:
   pass if >=8/10 independent tasks, then >=4/5 delayed unfamiliar tasks.
   (Assumes independent items with fixed per-item success probability p -- optimistic; item correlation makes it worse.)"""
from math import comb

def tail(n, k, p):
    return sum(comb(n, i) * p**i * (1-p)**(n-i) for i in range(k, n+1))

print(" true p | P(pass 8/10) | P(pass 4/5) | P(pass both) | note")
for p in [0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95]:
    a, b = tail(10, 8, p), tail(5, 4, p)
    print(f"  {p:4.2f}  |    {a:6.3f}    |   {b:6.3f}   |    {a*b:6.3f}    |")

# Bayesian alternative: Beta(1,1) prior, declare 'probably >=0.8' if P(p>=0.8 | data) >= 0.9. Sample size needed if true p = 0.9, 0.8
import random
random.seed(1)
def bayes_ok(s, f, thr=0.8, cert=0.9, N=4000):
    # P(p>=thr | Beta(1+s,1+f)) via sampling
    c = 0
    for _ in range(N):
        if random.betavariate(1+s, 1+f) >= thr: c += 1
    return c/N >= cert

def sequential(p, maxn=60):
    s=f=0
    for n in range(1, maxn+1):
        if random.random() < p: s+=1
        else: f+=1
        if n>=8 and bayes_ok(s,f): return n, True
    return maxn, False
print("\nSequential Beta-posterior rule (stop when P(p>=0.8)>=0.9), 300 simulated learners each:")
for p in [0.6, 0.7, 0.8, 0.9, 0.95]:
    res = [sequential(p) for _ in range(300)]
    passed = sum(1 for n,ok in res if ok)/300
    avg_n = sum(n for n,_ in res)/300
    print(f"  true p={p:.2f}: passed={passed:5.2f}  mean tasks used={avg_n:5.1f} (cap 60)")
