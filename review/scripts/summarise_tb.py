import json,sys,glob,os
for f in sorted(glob.glob(os.path.join(sys.argv[1],"tb_*.json"))):
    try: j=json.load(open(f))
    except Exception as e: print(os.path.basename(f),"BAD JSON",e); continue
    mv=j.get("moves",[])
    print(os.path.basename(f),"| root:",j.get("category"),"dtz",j.get("dtz"),"| n moves",len(mv))
    for cat in ("loss","draw","win"):   # category is from the point of view of the side to move AFTER the move
        print("   after-move category =",cat,":",", ".join(m["san"] for m in mv if m["category"]==cat))
