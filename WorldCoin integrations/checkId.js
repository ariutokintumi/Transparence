const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Your Worldcoin API credentials
const worldcoinApiKey = process.env.WORLDCOIN_API_KEY;

// Endpoint to verify Worldcoin ID
app.get('/verify-worldcoin-id', async (req, res) => {
    const { worldcoinId } = req.query;

    try {
        const response = await axios.get(`https://api.worldcoin.org/v1/verifications/${worldcoinId}`, {
            headers: {
                'Authorization': `Bearer ${worldcoinApiKey}`
            }
        });

        // Check if the verification level meets the criteria
        if (response.data.verification_level === 'orb_scanned_and_cellphone_verified') {
            res.json({ verified: true });
        } else {
            res.json({ verified: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
