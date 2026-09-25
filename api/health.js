export default function handler(req,res){res.status(200).json({ok:true,service:'jark-market-api',version:'0.1.0',timestamp:new Date().toISOString()})}
