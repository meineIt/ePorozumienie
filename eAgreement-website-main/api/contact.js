export default async function handler(req, res) {
    
    // only POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, timestamp, source } = req.body;

        // Walidacja danych
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Walidacja email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const webhookUrl = process.env.WEBHOOK_URL;
        const webhookApiKey = process.env.MAKE_API_KEY;

        if (webhookUrl) {
            const webhookResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-make-apikey': webhookApiKey
                },
                body: JSON.stringify({
                    name,
                    email,
                    timestamp,
                    source,
                    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    referer: req.headers.referer
                })
            });

            if (!webhookResponse.ok) {
                console.error('Webhook error:', webhookResponse.status);
            }
        }

        res.status(200).json({ 
            success: true, 
            message: 'Data received successfully',
            data: {
                name,
                email,
                timestamp,
                source
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}