import * as crypto from "crypto";

export default function getRandomString(length: number): string{
    return crypto.randomBytes(length / 2).toString('hex');
}
