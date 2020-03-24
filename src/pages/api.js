import React from 'react'
import PropTypes from 'prop-types'

import APILayout from '../layouts/api'
import Redoc from '../components/Redoc/Redoc'

const APIPage = () => (
  <APILayout className="api" title="API">
    <Redoc />
  </APILayout>
)

APIPage.propTypes = {
  data: PropTypes.object,
}

export default APIPage
