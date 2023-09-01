const express = require('express')
const router = express.Router()
// const needle = require('needle')
const Moralis = require('moralis').default
const apicache = require('apicache')

// ENV vars
const GOERLI_ADDRESS = process.env.GOERLI_ADDRESS
const CHAIN = process.env.CHAIN

// init cache
let cache = apicache.middleware

router.get('/', cache('2minutes'), async (req, res) => {
    try {    
        const apiRes = await Moralis.EvmApi.token.getWalletTokenBalances({
            "chain": CHAIN,
            "address": GOERLI_ADDRESS
        });
    
        const data = apiRes.raw
    
        res.status(200).json(data) 
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router