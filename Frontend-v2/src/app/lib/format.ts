const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBn(n: number, padTo = 0) {
  return String(Math.max(0, Math.round(n)))
    .padStart(padTo, "0")
    .split("")
    .map((d) => BN_DIGITS[+d] ?? d)
    .join("");
}
