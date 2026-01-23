// Chamadas REST simples para Binance (públicas) - sem API key
// Ex.: /api/v3/ticker/price?symbol=BTCUSDT

export async function fetchPrice(symbol: string): Promise<string> {
  const s = symbol.toUpperCase();
  const url = `https://api.binance.com/api/v3/ticker/price?symbol=${encodeURIComponent(s)}`;
  
  console.log(`📊 Buscando preço REST: ${s}`)
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erro ao buscar preço REST: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  console.log(`✅ Preço ${s}: ${json.price}`)
  return json.price;
}

export async function fetch24hTicker(symbol: string) {
  const s = symbol.toUpperCase();
  const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(s)}`;
  
  console.log(`📊 Buscando ticker 24h: ${s}`)
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erro ao buscar ticker: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchKlines(symbol: string, interval: string = '1h', limit: number = 200) {
  const s = symbol.toUpperCase();
  const url = `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(s)}&interval=${interval}&limit=${limit}`;
  
  console.log(`📊 Buscando klines: ${s} ${interval}`)
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erro ao buscar klines: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  
  return data.map((k: any) => ({
    openTime: k[0],
    open: k[1],
    high: k[2],
    low: k[3],
    close: k[4],
    volume: k[5],
    closeTime: k[6]
  }));
}

export async function fetchAllUSDTPairs(): Promise<string[]> {
  const url = 'https://api.binance.com/api/v3/exchangeInfo';
  
  console.log('📊 Buscando todos pares USDT da Binance...')
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erro ao buscar pares: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  const pairs = data.symbols
    .filter((s: any) => s.symbol.endsWith('USDT') && s.status === 'TRADING')
    .map((s: any) => s.symbol)
    .sort();
    
  console.log(`✅ ${pairs.length} pares USDT encontrados`)
  
  return pairs;
}