"""Tests for app.utils.crypto (symmetric decryption for admin login)."""
import base64

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from app.utils.crypto import decrypt_password


def _encrypt(plaintext: str, key_b64: str) -> str:
    """Helper to produce encrypted payload in same format as frontend (nonce + ciphertext + tag)."""
    key = base64.urlsafe_b64decode(key_b64)
    nonce = b"\x00" * 12  # deterministic for test
    aesgcm = AESGCM(key)
    ct = aesgcm.encrypt(nonce, plaintext.encode("utf-8"), None)
    return base64.urlsafe_b64encode(nonce + ct).decode()


def test_decrypt_password_returns_plaintext_when_valid():
    """decrypt_password returns plaintext when key and ciphertext are valid."""
    key_b64 = base64.urlsafe_b64encode(b"a" * 32).decode()
    encrypted = _encrypt("secret123", key_b64)
    result = decrypt_password(encrypted, key_b64)
    assert result == "secret123"


def test_decrypt_password_returns_none_when_key_empty():
    """decrypt_password returns None when key is empty."""
    assert decrypt_password("anything", "") is None
    assert decrypt_password("anything", "   ") is None


def test_decrypt_password_returns_none_when_encrypted_empty():
    """decrypt_password returns None when encrypted is empty."""
    key_b64 = base64.urlsafe_b64encode(b"a" * 32).decode()
    assert decrypt_password("", key_b64) is None


def test_decrypt_password_returns_none_when_key_wrong_length():
    """decrypt_password returns None when key does not decode to 32 bytes."""
    key_b64 = base64.urlsafe_b64encode(b"short").decode()
    encrypted = _encrypt("secret", base64.urlsafe_b64encode(b"a" * 32).decode())
    assert decrypt_password(encrypted, key_b64) is None


def test_decrypt_password_returns_none_when_ciphertext_invalid():
    """decrypt_password returns None when ciphertext is invalid or tampered."""
    key_b64 = base64.urlsafe_b64encode(b"a" * 32).decode()
    assert decrypt_password("invalid-base64!!!", key_b64) is None
    short_b64 = base64.urlsafe_b64encode(b"x" * 10).decode()
    assert decrypt_password(short_b64, key_b64) is None
