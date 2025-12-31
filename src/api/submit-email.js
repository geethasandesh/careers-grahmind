// API endpoint to submit emails to Google Sheets
export default async function handler(req, res) {
    console.log('📧 Email submission API called:', {
        method: req.method,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent']
    });

    if (req.method !== 'POST') {
        console.warn('❌ Invalid method attempted:', req.method);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, timestamp, source } = req.body;
    
    console.log('📝 Processing email submission:', {
        email: email ? email.substring(0, 3) + '***' + email.substring(email.indexOf('@')) : 'undefined',
        timestamp,
        source,
        hasApiKey: !!process.env.GOOGLE_API_KEY,
        hasSheetId: !!process.env.GOOGLE_SHEET_ID
    });

    // Validate required fields
    if (!email || !timestamp || !source) {
        console.error('❌ Missing required fields:', { email: !!email, timestamp: !!timestamp, source: !!source });
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate environment variables
    if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_SHEET_ID) {
        console.error('❌ Missing environment variables:', {
            hasApiKey: !!process.env.GOOGLE_API_KEY,
            hasSheetId: !!process.env.GOOGLE_SHEET_ID
        });
        return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
        const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1:append?valueInputOption=RAW&key=${process.env.GOOGLE_API_KEY}`;
        
        console.log('🔗 Making request to Google Sheets API');
        
        const response = await fetch(sheetsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [[email, timestamp, source]]
            }),
        });

        console.log('📊 Google Sheets API response:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('✅ Email successfully stored in Google Sheets:', {
                updatedRows: responseData.updates?.updatedRows || 'unknown',
                updatedRange: responseData.updates?.updatedRange || 'unknown'
            });
            res.status(200).json({ 
                message: 'Email submitted successfully',
                timestamp: new Date().toISOString()
            });
        } else {
            const errorText = await response.text();
            console.error('❌ Google Sheets API error:', {
                status: response.status,
                statusText: response.statusText,
                errorBody: errorText
            });
            throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('💥 Fatal error in email submission:', {
            errorMessage: error.message,
            errorStack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
}