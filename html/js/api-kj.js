const authUrl = 'https://kuhjunge.duckdns.org:55434/api';
// const authUrl = "https://localhost:8090/api";

// ----- Servercontrol ---

export async function getState(id, token) {
  const response = await fetch(`${authUrl}/server/get/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return procRes(response);
}

export async function setState(id, val, token) {
  const response = await fetch(`${authUrl}/server/set/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: val,
  });
  return procRes(response);
}

