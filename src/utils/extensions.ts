// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

declare global {
  interface Array<T> {
    chunk(chunkSize: number): Array<Array<T>>
  }
}

Array.prototype.chunk = function (chunkSize: number) {
  const chunks = []
  const size = this.length
  let i = 0

  while (i < size) {
    chunks.push(this.slice(i, (i += chunkSize)))
  }

  return chunks
}

export {}
