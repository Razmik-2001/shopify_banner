require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const Auth = require('../models/authSchema');

const { HOST, SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES } = process.env;

class authController {

    static shopifyAuth = (req, res) => {
        const shop = req.query.shop;
        if (!shop) return res.status(400).send('Missing shop parameter');

        const stateValue = Math.random().toString(36).substring(2);
        const stateHmac = crypto
            .createHmac('sha256', SHOPIFY_API_SECRET)
            .update(stateValue)
            .digest('hex');

        const state = `${stateValue}:${stateHmac}`;

        const redirectUri = `${HOST}/auth/callback`;
        const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SCOPES}&redirect_uri=${redirectUri}&state=${state}`;

        return res.redirect(authUrl);
    };

    static shopifyAuthCallback = async (req, res) => {
        try {
            const { shop, code, state, host } = req.query;

            if (!state) return res.status(403).send('Missing state parameter');

            const [stateValue, stateHmac] = state.split(':');
            const checkHmac = crypto
                .createHmac('sha256', SHOPIFY_API_SECRET)
                .update(stateValue)
                .digest('hex');

            if (checkHmac !== stateHmac) {
                return res.status(403).send('Request origin cannot be verified');
            }

            if (!shop || !code) {
                return res.status(400).send('Missing required parameters');
            }

            const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
            const accessTokenPayload = {
                client_id: SHOPIFY_API_KEY,
                client_secret: SHOPIFY_API_SECRET,
                code,
            };

            const tokenResponse = await axios.post(accessTokenRequestUrl, accessTokenPayload);
            const accessToken = tokenResponse.data.access_token;

            await Auth.findOneAndUpdate(
                { shop },
                { accessToken },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            res.redirect(`${HOST}?host=${host}&shop=${shop}`);
        } catch (error) {
            console.error('Error in Shopify OAuth callback:', error.response?.data || error.message);
            return res.status(500).send('Error while getting access token');
        }
    };
}

module.exports = authController;
