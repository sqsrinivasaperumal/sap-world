module.exports = (app, env, rp) => {
  const requestCustom = require('../utils/request')
  const serverRoutes = require('../utils/serverRoutes')

  /**
   * Vendor Hoppoints.
   */
  app.get('/api/hoppoints/viewSummary', (req, res) => {
    let requestBody = { ...req.query }
    requestBody.id = req.session.restaurant.id
    requestCustom.get(serverRoutes.hopPointsSummary, req, res, requestBody)
  })
	/**
   * Vendor Hoppoints.
   */
  app.get('/api/hoppoints/transactions', (req, res) => {
    let requestBody = { ...req.query }
    requestBody.id = req.session.restaurant.id;
    requestCustom.get(serverRoutes.hopPointsTransactions, req, res, requestBody)
  })

}
