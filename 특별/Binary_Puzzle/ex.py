from z3 import *

w = [BitVec(f"w{i}", 16) for i in range(16, 48)]

v49 = [
    37579, 61717, 17610, 18733, 29327, 62894, 40252, 23200,
    23625, 11321, 14689, 23134, 55867, 39558, 49656, 29290,
    12786,  8829, 42613, 36754, 14134, 27522,  8742, 21858,
    65392, 15348, 37595, 30308,  8751,  3344, 14842, 34102,
]

bytes_hi = [BitVec(f"bhi{i}", 8) for i in range(32)]
bytes_lo = [BitVec(f"blo{i}", 8) for i in range(32)]

s = Solver()
for i in range(32):
    s.add(w[i] == ZeroExt(8, bytes_hi[i]) << 8 | ZeroExt(8, bytes_lo[i]))

v16, v17, v18, v19, v20, v21, v22, v23 = w[0:8]
v24, v25, v26, v27, v28, v29, v30, v31 = w[8:16]
v32, v33, v34, v35, v36, v37, v38, v39 = w[16:24]
v40, v41, v42, v43, v44, v45, v46, v47 = w[24:32]

v16 = v23 ^ v34 ^ (v45 + v16)
v17 = v32 ^ (7 * v17)
v18 = v16 + v18 - v45 - v45
v19 = v19 - v38
v20 = (v35 - v31) ^ v32 ^ (v30 + 3 * v20)
v21 = v21 ^ (v16 + v42 - v40)
v22 = v22 ^ ((v42 - v44 - v41) ^ v41)
v23 = v40 ^ (v30 + v23 - v46)
v24 = (v25 + v29) ^ (v24 - v26 - v42)
v25 = v42 + v25 - v32
v27 = v27 ^ (2 * v34)
v28 = v37 + 3 * v28 - v20 - v18
v29 = v29 - 4 * v38
v30 = v43 ^ (v30 - v18)
v31 = v31 * 2
v32 = v32 ^ (v32 + 3 * v29)
v33 = v33 ^ (v43 - v17)
v34 = v36 + v34 - v30
v35 = v35 + 2 * v42 - v36
v37 = v37 ^ (3 * v23)
v38 = v38 ^ ((2 * v34) ^ (v36 - v28))
v39 = v39 + v30 + v45
v40 = v40 ^ ((v21 + v27) ^ (v40 + v34 - v26))
v41 = v41 ^ (v43 - v35 - v22)
v42 = v35 ^ (v42 - v26 - 3 * v19)
v43 = v43 ^ (6 * v34 + v24)
v44 = v44 ^ (3 * v24 + v40)
v45 = v45 - v44 - v32
v46 = v22 ^ (v20 + v46)
v47 = v47 ^ (v28 + v45)

vt = [v16, v17, v18, v19, v20, v21, v22, v23,
      v24, v25, v26, v27, v28, v29, v30, v31,
      v32, v33, v34, v35, v36, v37, v38, v39,
      v40, v41, v42, v43, v44, v45, v46, v47]

for i in range(32):
    s.add(vt[i] == BitVecVal(v49[i], 16))

for i in range(32):
    s.add(And(bytes_hi[i] >= 0x20, bytes_hi[i] <= 0x7e))
    s.add(And(bytes_lo[i] >= 0x20, bytes_lo[i] <= 0x7e))

s.add(bytes_hi[0] == ord('f')) 
s.add(bytes_lo[0] == ord('i')) 
s.add(bytes_hi[1] == ord('e')) 
s.add(bytes_lo[1] == ord('s')) 
s.add(bytes_hi[2] == ord('t')) 
s.add(bytes_lo[2] == ord('a')) 
s.add(bytes_hi[3] == ord('{')) 
s.add(bytes_lo[31] == ord('}'))

if s.check() != sat:
    pass

m = s.model()

inp = []
for i in range(32):
    hi = m[bytes_hi[i]].as_long()
    lo = m[bytes_lo[i]].as_long()
    inp.extend([hi, lo])

b = bytes(inp)
print("Payload len:", len(b))
print(b)