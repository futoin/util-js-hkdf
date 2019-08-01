import { expectType } from "tsd";
import hkdf from ".";

const ikm = "string-or-buffer";
const length = 16;
const salt = "strongly-encouraged";
const info = "optional-context";
const hash = "SHA-256";
const hash_len = 32;
const prk = Buffer.from("prk");

expectType<Buffer>(hkdf(ikm, length, { salt, info, hash }));
expectType<Buffer>(hkdf(ikm, length, { salt }));
expectType<Buffer>(hkdf(ikm, length, { info }));
expectType<Buffer>(hkdf(ikm, length, { hash }));
expectType<Buffer>(hkdf(ikm, length));
expectType<number>(hkdf.hash_length(hash));
expectType<Buffer>(hkdf.extract(hash, hash_len, ikm, salt));
expectType<Buffer>(hkdf.expand(hash, hash_len, prk, length, info));
