#!/usr/bin/env python3
# extract_fw.py
# 사용법: python3 extract_fw.py flash_or_gz_filename
import sys, hashlib, gzip, io, zlib, os
from pathlib import Path
def sha256(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()

if len(sys.argv) != 2:
    print("Usage: python3 extract_fw.py <flash-or-gz-or-img>")
    sys.exit(1)

src = Path(sys.argv[1])
if not src.exists():
    print("File not found:", src); sys.exit(2)

print("Input:", src, "size=", src.stat().st_size)
data = src.read_bytes()

# 1) try to find gzip start
gz_sig = b'\x1f\x8b\x08'
gz_pos = data.find(gz_sig)
if gz_pos != -1:
    gz_out = Path("extracted.img.gz")
    print("Found gzip at offset", gz_pos, "-> writing", gz_out)
    # try to find boundary marker after gzip (boundary starts with '--' typically)
    boundary_pos = data.find(b'------WebKitFormBoundary', gz_pos+10)
    endpos = boundary_pos-4 if boundary_pos!=-1 else len(data)
    gz_out.write_bytes(data[gz_pos:endpos])
    print("wrote", gz_out, "size", gz_out.stat().st_size, "sha256", sha256(gz_out))
else:
    gz_out = None
    print("No gzip signature found in input.")

# 2) if we wrote gz, try to decompress fully; if fail, create partial decompressed file
img_out = Path("extracted.img")
partial_out = Path("partial_decompressed.bin")
squash_out = Path("squashfs.img")

if gz_out:
    try:
        with gzip.open(gz_out, "rb") as gf:
            content = gf.read()
        img_out.write_bytes(content)
        print("Full gzip decompressed ->", img_out, "size", img_out.stat().st_size, "sha256", sha256(img_out))
        data_to_scan = content
    except Exception as e:
        print("Full gzip decompress failed:", e)
        # partial via zlib
        chunk = gz_out.read_bytes()
        decomp = zlib.decompressobj(16+zlib.MAX_WBITS)
        outb = bytearray()
        pos=0
        step=65536
        while pos < len(chunk):
            end = min(pos+step, len(chunk))
            try:
                outb.extend(decomp.decompress(chunk[pos:end]))
            except Exception:
                pos += 1
                continue
            pos = end
        try:
            outb.extend(decomp.flush())
        except Exception:
            pass
        partial_out.write_bytes(bytes(outb))
        print("Wrote partial decompressed ->", partial_out, "size", partial_out.stat().st_size)
        data_to_scan = partial_out.read_bytes()
else:
    # if input itself might already be img or squash
    data_to_scan = data

# 3) find squashfs magic 'hsqs' (little-endian) or 'hsqs' bytes
sq_magic = b'hsqs'
sq_idx = data_to_scan.find(sq_magic)
if sq_idx == -1:
    # try alternative 'sqsh' / 'SQFS'
    for alt in [b'SQFS', b'sqfs', b'\x68\x73\x71\x73']:
        i = data_to_scan.find(alt)
        if i!=-1:
            sq_idx = i; break

if sq_idx != -1:
    squash_out.write_bytes(data_to_scan[sq_idx:])
    print("Extracted squashfs image at offset", sq_idx, "->", squash_out, "size", squash_out.stat().st_size, "sha256", sha256(squash_out))
else:
    print("No squashfs magic found in decompressed data.")

# 4) quick strings scan for likely locations (if squash produced)
if squash_out.exists():
    print("\n--- quick strings scan (first 200 matches) ---")
    import subprocess, shlex
    cmd = f"strings -a {str(squash_out)} | egrep -i 'flag\\{{|FLAG\\{{|flag.txt|/www/|/cgi-bin/|luci|sysauth|password|root' | sed -n '1,200p'"
    print("CMD:", cmd)
    out = subprocess.getoutput(cmd)
    if out.strip():
        print(out)
    else:
        print("(no hits in quick scan)")

print("\nDone. Files you may upload: extracted.img.gz (if present), extracted.img, partial_decompressed.bin, squashfs.img")

