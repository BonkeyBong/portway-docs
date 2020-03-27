import React from 'react'
import PropTypes from 'prop-types'

import SEO from '../components/seo'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import GuideComponent from '../components/Guide/GuideComponent'
import GuidesListContainer from '../components/GuidesList/GuidesListContainer'

import './guidesStyles.scss'

const GuidesLayout = ({ pageContext }) => {
  return (
    <div className="document">
      <SEO title={pageContext.guide.name} />
      <Header />
      <main className="guides-container">
        <nav className="guides-container__navigation" role="navigation">
          <div className="guides-container__nav-block">
            <h3>Guides</h3>
            <GuidesListContainer />
          </div>
        </nav>
        <div className="guides-container__main">
          <GuideComponent guide={pageContext.guide} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

GuidesLayout.propTypes = {
  pageContext: PropTypes.object,
}

export default GuidesLayout
