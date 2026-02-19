export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
        success: true,
        message: 'Netflix Clone Backend API is active',
        endpoints: {
            health: '/api/health',
            login: '/api/login',
            register: '/api/register'
        }
    });
}
