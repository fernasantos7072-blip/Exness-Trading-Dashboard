// Hook para conectar em tempo real aos streams públicos da Binance.
// Usa o endpoint combinada: wss://stream.binance.com:9443/stream?streams=...
import { useEffect, useRef, useState } from "react";

type TickerData = {
  price: string;
  prevPrice?: string;
  open?: string;
  high?: string;
  low?: string;
  volume?: string;
  eventTime?: number;
  priceChangePercent?: string;
};

type Status = "idle" | "connecting" | "connected" | "closed" | "error";

export function useBinanceTicker(symbols: string[]) {
  const [data, setData] = useState<Record<string, TickerData>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempt = useRef(0);
  const shouldReconnect = useRef(true);
  const symbolsKey = symbols.map((s) => s.toUpperCase()).join(",");

  useEffect(() => {
    if (!symbols || symbols.length === 0) {
      setStatus("idle");
      return;
    }

    shouldReconnect.current = true;

    const streams = symbols
      .map((s) => `${s.toLowerCase()}@ticker`)
      .join("/");

    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    let closedByHook = false;
    function connect() {
      console.log('🔌 Conectando WebSocket Binance...', symbols)
      setStatus("connecting");
      setError(null);

      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('✅ WebSocket Binance conectado!')
          reconnectAttempt.current = 0;
          setStatus("connected");
        };

        ws.onmessage = (ev) => {
          try {
            const msg = JSON.parse(ev.data);
            const payload = msg.data;
            if (!payload || !payload.s) return;

            const sym = payload.s as string;
            const price = payload.c ?? payload.a ?? payload.o ?? null;
            const priceChange = payload.P ?? payload.p ?? null;
            
            setData((prev) => {
              const prevEntry = prev[sym]?.price;
              return {
                ...prev,
                [sym]: {
                  price: price?.toString() ?? prev[sym]?.price ?? "0",
                  prevPrice: prevEntry,
                  open: payload.o,
                  high: payload.h,
                  low: payload.l,
                  volume: payload.v ?? payload.q,
                  eventTime: payload.E,
                  priceChangePercent: priceChange?.toString(),
                },
              };
            });
          } catch (e) {
            console.warn("❌ Binance parse error", e);
          }
        };

        ws.onerror = (ev) => {
          console.error("❌ Binance WS error", ev);
          setError("WebSocket error");
          setStatus("error");
        };

        ws.onclose = (ev) => {
          console.log('🔌 WebSocket Binance fechado', ev.code, ev.reason)
          wsRef.current = null;
          if (closedByHook) {
            setStatus("closed");
            return;
          }
          setStatus("closed");
          if (shouldReconnect.current) {
            reconnectAttempt.current = Math.min(reconnectAttempt.current + 1, 8);
            const timeout = Math.min(1000 * 2 ** reconnectAttempt.current, 30000);
            console.log(`🔄 Reconectando em ${timeout}ms...`)
            setTimeout(() => {
              connect();
            }, timeout);
          }
        };
      } catch (err: any) {
        console.error('❌ Erro ao criar WebSocket', err)
        setError(String(err));
        setStatus("error");
      }
    }

    connect();

    return () => {
      console.log('🛑 Fechando WebSocket Binance')
      shouldReconnect.current = false;
      closedByHook = true;
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [symbolsKey]);

  return { data, status, error };
}