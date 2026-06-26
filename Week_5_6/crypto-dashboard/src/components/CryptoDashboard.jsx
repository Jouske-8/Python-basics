import { useEffect, useMemo, useState } from "react";
import "./CryptoDashboard.css";

function CryptoDashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [topN, setTopN] = useState(10);
  const [sortBy, setSortBy] = useState("market_cap");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCoins();
  }, [topN]);

  async function fetchCoins() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${topN}&page=1&sparkline=false&price_change_percentage=24h`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch crypto data.");
      }

      const data = await response.json();
      setCoins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const displayedCoins = useMemo(() => {
    let filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) =>
      sortBy === "price"
        ? b.current_price - a.current_price
        : b.market_cap - a.market_cap
    );

    return filtered;
  }, [coins, search, sortBy]);

  return (
    <div className="dashboard">
      <div className="header">
        <h1>🚀 Crypto Dashboard</h1>
        <p>Live cryptocurrency prices powered by CoinGecko</p>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search coin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={topN} onChange={(e) => setTopN(Number(e.target.value))}>
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
          <option value={20}>Top 20</option>
          <option value={50}>Top 50</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="market_cap">Market Cap</option>
          <option value="price">Price</option>
        </select>

        <button onClick={fetchCoins}>Refresh</button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading market data...</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="coin-grid">
          {displayedCoins.map((coin) => (
            <div className="coin-card" key={coin.id}>
              <div className="coin-top">
                <img src={coin.image} alt={coin.name} />
                <div>
                  <h2>{coin.name}</h2>
                  <span>{coin.symbol.toUpperCase()}</span>
                </div>
              </div>

              <div className="coin-info">
                <p>
                  <strong>Price</strong>
                  <span>${coin.current_price.toLocaleString()}</span>
                </p>

                <p>
                  <strong>Market Cap</strong>
                  <span>${coin.market_cap.toLocaleString()}</span>
                </p>

                <p>
                  <strong>24h Change</strong>

                  <span
                    className={
                      coin.price_change_percentage_24h >= 0
                        ? "green"
                        : "red"
                    }
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CryptoDashboard;