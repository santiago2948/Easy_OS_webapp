const cache = new Map()

/** Precarga una imagen y cachea la promesa para no repetir descargas. */
export function preloadImage(src) {
  if (!src) return Promise.resolve(null)
  if (cache.has(src)) return cache.get(src)

  const promise = new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(src)
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`))
    img.src = src
  })

  cache.set(src, promise)
  return promise
}

export function preloadImages(sources, { staggerMs = 0 } = {}) {
  return sources.reduce(
    (chain, src, index) =>
      chain.then(() =>
        new Promise((resolve) => {
          const run = () => preloadImage(src).then(resolve).catch(resolve)
          if (staggerMs && index > 0) {
            window.setTimeout(run, staggerMs * index)
          } else {
            run()
          }
        }),
      ),
    Promise.resolve(),
  )
}
