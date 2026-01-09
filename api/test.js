export default function handler(req, res) {
  res.status(200).json({
    message: 'Simple test endpoint working',
    url: req.url,
    method: req.method,
    cwd: process.cwd(),
    env: process.env.VERCEL ? 'vercel' : 'local'
  });
}
