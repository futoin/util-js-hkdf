import { Buffer } from "buffer";
import { expectType } from "tsd";
import hkdf_tls = require(".");

const ikm = "string-or-buffer";
const length = 16;
const salt = "strongly-encouraged";
const label = "optional-label";
const context = "optional-context";
const hash = "SHA-256";
const hash_len = 32;
const prk = Buffer.from("prk");

expectType<Buffer>(hkdf_tls(ikm, length, { salt, label, context, hash }));
expectType<Buffer>(hkdf_tls(ikm, length, { salt }));
expectType<Buffer>(hkdf_tls(ikm, length, { info }));
expectType<Buffer>(hkdf_tls(ikm, length, { hash }));
expectType<Buffer>(hkdf_tls(ikm, length));
expectType<Buffer>(hkdf_tls.info(length, label, context));
expectType<Buffer>(hkdf_tls.expand(hash, hash_len, prk, length, label, context));
