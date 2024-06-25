import { useEffect, useState } from "react";

export default function useAuth(code: string) {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");

  useEffect(() => {
    fetch("http://localhost:5124/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((res: any) => {
        res.json().then((data: any) => {
          localStorage.setItem('spotify_token', data.accessToken);
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          setExpiresIn(data.expiresIn);
          window.history.pushState({}, "", "/");
        });
      })
      .catch(() => {
        window.location.href = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(() => {
      fetch("http://localhost:5124/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAccessToken(data.accessToken);
          setExpiresIn(data.expiresIn);
        })
        .catch(() => {
          window.location.href = "/";
        });
    }, (parseInt(expiresIn) - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);
  return accessToken;
}
