/** Reset scroll + hero pin state (GlobeOrbit / BrandAssembly ScrollTrigger). */
export function scrollToHomeTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

  const hero = document.querySelector('.orbit-hero')
  if (hero) {
    const globe = hero.querySelector('.globe-orbit')
    const copy = hero.querySelector('.orbit-hero__copy')
    const hint = hero.querySelector('.orbit-hero__hint')
    const veil = hero.querySelector('.orbit-hero__exit-veil')
    const brand = hero.querySelector('.lp-brand-assembly--hero')

    if (globe) globe.style.opacity = '1'
    if (copy) {
      copy.style.opacity = '1'
      copy.style.transform = ''
    }
    if (hint) hint.style.opacity = ''
    if (veil) veil.style.opacity = '0'
    if (brand) brand.style.opacity = '1'
  }

  window.requestAnimationFrame(() => {
    import('gsap/ScrollTrigger')
      .then(({ ScrollTrigger }) => {
        ScrollTrigger.update()
        ScrollTrigger.refresh(true)
      })
      .catch(() => {})
  })
}
