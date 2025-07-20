export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Forward the request to Boulevard
  const BLVD_API_KEY = process.env.BLVD_API_KEY; // Store this in your Vercel env vars!
  const BLVD_BUSINESS_ID = process.env.BLVD_BUSINESS_ID;
  const apiUrl = `https://dashboard.boulevard.io/api/2020-01/${BLVD_BUSINESS_ID}/client`;

  const apiRes = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(BLVD_API_KEY + ':').toString('base64'),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(req.body)
  });

  const data = await apiRes.json();
  res.status(apiRes.status).json(data);
}
