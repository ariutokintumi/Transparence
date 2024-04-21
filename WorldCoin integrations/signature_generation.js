const crypto = require('crypto');

// Function to generate a signature
function generateSignature(data) {
    const signer = crypto.createSign('sha256');
    signer.update(data);
    const privateKey = process.env.BACKEND_PRIVATE_KEY;
    return signer.sign(privateKey, 'hex');
}

// Example endpoint to create a signature
app.get('/create-signature', (req, res) => {
    const { data } = req.query;
    const signature = generateSignature(data);
    res.json({ signature });
});
