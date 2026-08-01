import { Link } from 'react-router-dom'
import BrandLogo from '../../home/components/BrandLogo'
import '../styles/legal.css'

export default function LegalDocument({ document }) {
  return (
    <div className="legal-page">
      <header className="legal-page__header">
        <div className="legal-page__header-inner">
          <Link to="/" className="legal-page__brand" aria-label="Easy Logistics — Inicio">
            <BrandLogo variant="onDark" size="md" className="legal-page__logo" />
          </Link>
          <Link to="/" className="legal-page__back">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <div className="legal-page__inner">
        <article className="legal-page__article">
          <h1>{document.title}</h1>
          <p className="legal-page__meta">
            Última actualización: {document.updatedAt}
            {document.version ? ` · Versión ${document.version}` : ''}
          </p>
          <p className="legal-page__intro">{document.intro}</p>

          {document.sections.map((section) => (
            <section key={section.title} className="legal-page__section">
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.closing ? <p>{section.closing}</p> : null}
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
