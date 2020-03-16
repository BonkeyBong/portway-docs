import React, { useEffect, useRef, useState, createRef } from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'
import Prism from 'prismjs'

import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-clike'
// import 'prismjs/themes/prism-twilight.css'

import './GuideStyles.scss'
// Our own Portway prism theme!
// http://k88hudson.github.io/syntax-highlighting-theme-generator/www/
import './prism-theme.css'

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const FIELD_TYPES = {
  TEXT: 2,
  IMAGE: 4,
}

function parseTitlesForToc(structuredValue) {
  const result = []
  structuredValue.forEach((item) => {
    if (HEADING_TAGS.includes(item.tag)) {
      result.push(item)
    }
  })
  return result
}

const GuideComponent = ({ guide }) => {
  const [tableOfContents, setTableOfContents] = useState([])
  const tocBlockRef = useRef()
  const tocItemsRef = useRef([])
  const tocActiveItemRef = useRef(null)
  const tickingRef = useRef(false)

  // window values
  const trackLength = useRef()

  function highlightTocItem(hId) {
    if (tocActiveItemRef.current !== hId) {
      tocActiveItemRef.current = hId
      tocItemsRef.current.forEach(item => item.ref.current.classList.remove('active'))
      try {
        const itemToHighlight = tocBlockRef.current.querySelector(`[data-id="${hId}"]`)
        if (itemToHighlight) {
          itemToHighlight.classList.add('active')
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  // SEt up window scroll values
  useEffect(() => {
    const windowHeight = window.innerHeight
    const documentHeight = document.body.offsetHeight
    trackLength.current = documentHeight - windowHeight
    // Reset refs
    tocItemsRef.current = []
    tocActiveItemRef.current = null
    tickingRef.current = false
  }, [guide])

  // Set up the table of contents
  useEffect(() => {
    if (guide) {
      const slugger = new marked.Slugger()
      // Create the table of contents
      let tocArray = []
      guide.fields.forEach((field) => {
        if (field.type === FIELD_TYPES.TEXT) {
          const fieldHeadings = parseTitlesForToc(field.structuredValue)
          tocArray = [...tocArray, ...fieldHeadings]
        }
      })
      tocArray.forEach((title, i) => {
        tocItemsRef.current.push(
          <li
            data-id={slugger.slug(title.children[0].data)}
            className={`guide__toc-item guide__toc-item--${title.tag}`}
            key={i}
            ref={createRef()}
          >
            {title.children[0].data}
          </li>
        )
      })
      setTableOfContents(tocArray)
    }
  }, [guide])

  // Set up the intersectionObserver
  useEffect(() => {
    let scrollHandler = function() {}
    if (tableOfContents.length > 0) {
      const headings = document.querySelectorAll('.guide__content h2')
      scrollHandler = (e) => {
        // Throttle this scroll event
        if (!tickingRef.current) {
          window.requestAnimationFrame(() => {
            const percentScrolled = Math.floor(document.documentElement.scrollTop / trackLength.current * 100)
            headings.forEach((heading) => {
              const topValue = heading.getBoundingClientRect().top
              const bottomValue = window.innerHeight - heading.getBoundingClientRect().bottom
              if (percentScrolled <= 50 && topValue < 150 && topValue > 0) {
                highlightTocItem(heading.getAttribute('id'))
              } else if (percentScrolled >= 50 && bottomValue > 150 && bottomValue < 1000) {
                highlightTocItem(heading.getAttribute('id'))
              }
            })
            tickingRef.current = false
          })
          tickingRef.current = true
        }
      }
      document.addEventListener('scroll', scrollHandler, { passive: true })
    }
    return () => {
      document.removeEventListener('scroll', scrollHandler, { passive: true })
    }
  }, [guide, tableOfContents.length])

  return (
    <>
      <article className="guide__content">
        {guide &&
        <h1>{guide.name}</h1>
        }
        {guide && guide.fields.map((field) => {
          switch (field.type) {
            case FIELD_TYPES.TEXT:
              const renderedMarkdown = marked(field.value, {
                highlight: (code, lang) => {
                  if (Prism.languages[lang]) {
                    return Prism.highlight(code, Prism.languages[lang], lang)
                  }
                },
                gfm: true,
              })
              return <div key={field.id} dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />
            case FIELD_TYPES.IMAGE:
              return <img key={field.id} src={field.value} alt={field.name} />
            default:
              return null
          }
        })}
      </article>
      <aside className="guide__toc">
        <div className="guide__toc-block">
          {tableOfContents.length > 0 &&
          <h3>In this guide...</h3>
          }
          <ol className="guide__toc-list" ref={tocBlockRef}>
            {tableOfContents.length > 0 && tocItemsRef.current.length > 0 && tocItemsRef.current}
          </ol>
        </div>
      </aside>
    </>
  )
}

GuideComponent.propTypes = {
  guide: PropTypes.object,
}

export default GuideComponent
