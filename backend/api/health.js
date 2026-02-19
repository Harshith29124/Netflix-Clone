export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
        status: 'OK',
        message: 'Server is running'
    });
}
