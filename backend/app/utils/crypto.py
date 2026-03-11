"""Symmetric decryption for admin login (AES-256-GCM)."""
import base64
from typing import Optional

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


def _b64decode(s: str) -> bytes:
    """Decode base64 or base64url. Accepts both +/ and -_ alphabets."""
    s = s.replace("-", "+").replace("_", "/")
    pad = 4 - len(s) % 4
    if pad != 4:
        s = s + ("=" * pad)
    return base64.b64decode(s)


def decrypt_password(encrypted_b64: str, key_b64: str) -> Optional[str]:
    """
    Decrypt a password encrypted with AES-256-GCM.
    Expects encrypted_b64 = base64(nonce_12_bytes + ciphertext + tag_16_bytes), key_b64 = base64(32_byte_key).
    Accepts standard or url-safe base64. Returns None if key is missing, invalid, or decryption fails.
    """
    if not key_b64 or not encrypted_b64:
        return None
    try:
        key = _b64decode(key_b64)
        if len(key) != 32:
            return None
        data = _b64decode(encrypted_b64)
        if len(data) < 12 + 16:
            return None
        nonce = data[:12]
        ciphertext_with_tag = data[12:]
        aesgcm = AESGCM(key)
        plain = aesgcm.decrypt(nonce, ciphertext_with_tag, None)
        return plain.decode("utf-8")
    except Exception:
        return None
