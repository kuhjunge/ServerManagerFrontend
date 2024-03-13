const authUrl = 'https://kuhjunge.duckdns.org:55434/api';
// const authUrl = "https://localhost:8090/api";

function procRes(response) {
  if (response.status === 200) {
    return response.json();
  } else {
    throw new Error("DB Connection Error!");
  }
}

export async function doLogin(username = "", password = "") {
  const response = await fetch(`${authUrl}/users/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (response.status === 200) {
    return response.json();
  } else {
    return undefined;
  }
}

// ----- Benutzerverwaltung ---

export async function userRegister(user, token) {
  const response = await fetch(`${authUrl}/users/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return procRes(response);
}

export async function userGetAll(token) {
  const response = await fetch(`${authUrl}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return procRes(response);
}

export async function userUpdate(id, params, token) {
  const response = await fetch(`${authUrl}/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return procRes(response);
}

export async function userDelete(id, token) {
  const response = await fetch(`${authUrl}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return procRes(response);
}

export async function userGetById(id, token) {
  const response = await fetch(`${authUrl}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return procRes(response);
}

// ----- Projektzeit ---

export async function workTimeGet(userid, token) {
  const response = await fetch(`${authUrl}/users/zeiten/${userid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return procRes(response);
}

export async function workTimeDownload(jahr, id, token) {
  const response = await fetch(`${authUrl}/users/zeitenreport/${jahr}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.blob())
    .then((blob) => {
      var file = window.URL.createObjectURL(blob);
      var fileLink = document.createElement("a");
      fileLink.href = file;
      fileLink.download = "Projektzeitbericht.csv";
      fileLink.click();
    });
  return undefined;
}

export async function workTimeUpdate(worktime, token) {
  const response = await fetch(`${authUrl}/users/zeiten`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(worktime),
  });
  return procRes(response);
}

export async function workTimeDelete(id, token) {
  const response = await fetch(`${authUrl}/users/zeiten/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return procRes(response);
}

export async function workTimeCustomer(token) {
  const response = await fetch(`${authUrl}/users/zeiten/kunden`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return procRes(response);
}

// ----- Datenbankenauswahl -----

export async function databasesGetAll(token) {
  const response = await fetch(`${authUrl}/db`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return procRes(response);
}

export async function reserveDb(db, token) {
  const response = await fetch(`${authUrl}/db/ping`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(db),
  });
  return procRes(response);
}

// ----- Endpunktabfrage -----
export async function tableGet(tablename, token) {
  const response = await fetch(`${authUrl}/data/tbl/${tablename}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return procRes(response);
}
