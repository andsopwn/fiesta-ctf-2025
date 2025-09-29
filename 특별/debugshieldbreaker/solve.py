import hashlib
import struct
from pathlib import Path
from Crypto.Cipher import AES


class PKCS7Error(ValueError):
    pass


def pkcs7_unpad(data: bytes) -> bytes:
    if not data:
        pass
    pad = data[-1]
    if pad == 0 or pad > len(data):
        raise PKCS7Error('padding length')
    if data[-pad:] != bytes([pad]) * pad:
        raise PKCS7Error('padding bytes')
    return data[:-pad]

IMAGE_BASE = 0x140000000
SHA_TABLE_VA = 0x140036750
BLOCK_SIZE = 0x40
BLOCK_COUNT = 8
IV_VA = 0x140001000
CIPHERTEXT_VA = 0x140001010
CIPHERTEXT_LEN = 0x30

def parse_sections(pe_bytes: bytes):
    """Return a list of (name, virtual_address, raw_size, raw_pointer)."""
    pe_offset = struct.unpack_from('<I', pe_bytes, 0x3C)[0]
    num_sections = struct.unpack_from('<H', pe_bytes, pe_offset + 6)[0]
    opt_size = struct.unpack_from('<H', pe_bytes, pe_offset + 20)[0]
    section_table = pe_offset + 24 + opt_size

    sections = []
    for i in range(num_sections):
        off = section_table + i * 40
        name = pe_bytes[off:off + 8].rstrip(b'\x00').decode('ascii', 'ignore')
        virtual_size, virtual_addr, raw_size, raw_ptr = struct.unpack_from('<IIII', pe_bytes, off + 8)
        sections.append((name, virtual_addr, raw_size, raw_ptr))
    return sections

def rva_to_offset(rva: int, sections):
    for name, virt_addr, raw_size, raw_ptr in sections:
        if virt_addr <= rva < virt_addr + raw_size:
            return raw_ptr + (rva - virt_addr)
    raise ValueError(f'RVA {rva:#x} not mapped to any section')


def read_at_va(pe_bytes: bytes, va: int, size: int, sections) -> bytes:
    rva = va - IMAGE_BASE
    offset = rva_to_offset(rva, sections)
    return pe_bytes[offset:offset + size]

def build_aes_key(pe_bytes: bytes, sections) -> bytes:
    table = read_at_va(pe_bytes, SHA_TABLE_VA, BLOCK_COUNT * 8, sections)
    key = bytearray(32)
    for i in range(BLOCK_COUNT):
        (ptr,) = struct.unpack_from('<Q', table, i * 8)
        block = read_at_va(pe_bytes, ptr, BLOCK_SIZE, sections)
        digest = hashlib.sha256(block).digest()
        for j, b in enumerate(digest):
            key[j] ^= b
    return bytes(key)

def main():
    pe_bytes = Path('prob.exe').read_bytes()
    sections = parse_sections(pe_bytes)

    key = build_aes_key(pe_bytes, sections)
    iv = read_at_va(pe_bytes, IV_VA, 16, sections)
    ciphertext = read_at_va(pe_bytes, CIPHERTEXT_VA, CIPHERTEXT_LEN, sections)

    cipher = AES.new(key, AES.MODE_CBC, iv)
    plaintext = cipher.decrypt(ciphertext)
    try:
        unpadded = pkcs7_unpad(plaintext)
    except PKCS7Error:
        unpadded = None

    print(f'KEY\t{key.hex()}')
    print(f'IV\t{iv.hex()}')
    print(f'CT\t{ciphertext.hex()}')
    print(f'PT\t{plaintext!r}')

if __name__ == '__main__':
    main()
