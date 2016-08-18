'use strict'
const Observable = require('../../')
const Observ = require('observ')
const perf = require('vigour-performance')
var amount = 1e6

// process.hrtime = hrtime

const observr = Observ(0)
var observrCallCount = 0
observr(() => ++observrCallCount)

function emitObserv () {
  for (var i = 0; i < amount; i++) {
    observr.set(i)
  }
}

const obs = new Observable(0)
global.obsCallCount = 0
obs.on(() => ++global.obsCallCount)

function emitObservable () {
  for (var i = 0; i < amount; i++) {
    obs.set(i)
  }
}

perf(emitObservable, emitObserv, 1.25)

// 1.25 is slower then
// browser is way faster for emit observable
// way faster in es5 still...
// warn node is not fast for es6 yet!
// also need a setup function unfortunately
// bableing the stuff is still rly important for node for perf saves arround 150% to 100% 1.5x for everything is a lot
// polyfil for window.performance.now
// var performance = global.performance || {}
// var performanceNow =
//   performance.now ||
//   performance.mozNow ||
//   performance.msNow ||
//   performance.oNow ||
//   performance.webkitNow ||
//   function () { return (new Date()).getTime() }
// // generate timestamp or delta
// // see http://nodejs.org/api/process.html#process_process_hrtime
// function hrtime (previousTimestamp) {
//   var clocktime = performanceNow.call(performance) * 1e-3
//   var seconds = Math.floor(clocktime)
//   var nanoseconds = Math.floor((clocktime % 1) * 1e9)
//   if (previousTimestamp) {
//     seconds = seconds - previousTimestamp[0]
//     nanoseconds = nanoseconds - previousTimestamp[1]
//     if (nanoseconds < 0) {
//       seconds--
//       nanoseconds += 1e9
//     }
//   }
//   return [ seconds, nanoseconds ]
// }
