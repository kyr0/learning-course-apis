#!/usr/bin/env node

import { createServer } from "http"
import { cpus } from "os"
const cluster = require('cluster')
const numcpus = cpus().length

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numcpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

} else {

  console.log(`Worker ${process.pid} started`);

  const httpServer = createServer((request, response) => {

    setTimeout(() => {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({  foo: 'bar' + process.pid }))
    }, 1000)
  })

  httpServer.listen(3000)

  console.log('Listenting on: http://localhost:3000')
}









