const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  const { url, method } = req
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html')
    res.write(`
      <html>
        <head>
          <title>Nodezitto</title>
        </head>
        <body>
          <h1>Nodezitto</h1>
          <form action='/message' method='POST'>
            <label for='message'>Write your message</label>
            <input type='text' id='message' name='message' />
            <button type='submit'>Send</button>
          </form>
        </body>
      </html>
    `)
    return res.end()
  } else if (url === '/message' && method === 'POST') {
    const chunkDataList = []
    req.on('data', (chunk) => {
      chunkDataList.push(chunk)
    })
    return req.on('end', () => {
      const data = Buffer.concat(chunkDataList).toString()
      const message = data.split('=')[1]
      fs.writeFile('message.txt', message, 'utf-8', (err) => {
        res.statusCode = 302
        res.setHeader('Location', '/')
        res.end()
      })
    })
  }
})

server.listen(3000)
