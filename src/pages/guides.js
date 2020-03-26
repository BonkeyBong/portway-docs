import React from 'react'
import PropTypes from 'prop-types'

import Layout from '../layouts/layout'
import GuidesCardsContainer from '../components/GuidesCards/GuidesCardsContainer'

const GuidesPage = ({ data }) => (
  <Layout className="guides" title="Guides">
    <h3>Guides</h3>
    <p>
      Looking for ideas on what to do with Portway? You’ve come to the right place! We’re
      working hard to add interesting guides to the site so you can see all the things and API
      can do with your notes app.
    </p>
    <GuidesCardsContainer />
  </Layout>
)

GuidesPage.propTypes = {
  data: PropTypes.object,
}

export default GuidesPage
