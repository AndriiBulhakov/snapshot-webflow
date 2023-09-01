const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const apicache = require('apicache')

// ENV vars
const SNAPSHOT_PATH = process.env.SNAPSHOT_PATH
const SNAPSHOT_SPACE = process.env.SNAPSHOT_SPACE


router.post('/', async (req, res) => {
    try {
        let proposalsIds = [];
        const apiRes = await fetch(SNAPSHOT_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query Proposal {
                        proposals(
                            first: 20,
                            skip: 0,
                            where: {
                                space: "${SNAPSHOT_SPACE}"
                            },
                            orderBy: "created",
                            orderDirection: desc
                        ) {
                            id
                            title
                            body
                            choices
                            start
                            end
                            snapshot
                            state
                            author
                            space {
                                id
                                name
                            }
                        }
                    }
                `,
            }),
        })
        
        const apiRes2 = await fetch(SNAPSHOT_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query Votes {
                        votes (
                            first: 1000
                            skip: 0
                            where: {
                                space: "${SNAPSHOT_SPACE}"
                            }
                            orderBy: "created",
                            orderDirection: desc
                        ) {
                            id
                            voter
                            vp
                            vp_by_strategy
                            vp_state
                            created
                            proposal {
                                id
                            }
                            choice
                            space {
                                id
                            }
                        }
                    }
                `,
            }),
        })


        const apiData = await apiRes.json();
        const apiData2 = await apiRes2.json();


        const finalData = {
            apiData: apiData,
            apiData2: apiData2
        }

        res.status(200).json(finalData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;