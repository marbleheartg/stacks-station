export const formatStx = (microStx: string | undefined | number) => {
  if (!microStx) return "0"
  const stx = Number(microStx) / 1_000_000
  return stx.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
}
