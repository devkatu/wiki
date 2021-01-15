// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

// ★APIにリクエストしたいときにつかう
// fetchをちょこっと使いやすくしたやつと思っていい
// putとかdeleteとかは自分で追加してみた

export async function client(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  // debug
  console.log(config, body);

  if (body) {
    config.body = JSON.stringify(body)
  }

  let data
  try {
    const response = await window.fetch(endpoint, config)
    data = await response.json()
    if (response.ok) {
      return data
    }
    throw new Error(response.statusText)
  } catch (err) {
    return Promise.reject(err.message ? err.message : data)
  }
}

client.get = function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: 'GET' })
}

client.post = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body })
}

client.put = function (endpoint, body, customConfig = {method: 'PUT'}){
  return client(endpoint, {...customConfig, body})
}

client.delete = function(endpoint, customConfig = {method: 'DELETE'}){
  return client(endpoint, {...customConfig})
}