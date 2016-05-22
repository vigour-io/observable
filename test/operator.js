'use strict'
var Observable = require('../')
var test = require('tape')

test('operator $primitive transform using $condition', function (t) {
  t.plan(4)
  var someCondition = false
  const obs = new Observable({
    key: 'obs',
    val: 'value',
    $transform: {
      val (val) {
        return val.toUpperCase()
      },
      $condition () {
        return someCondition
      }
    }
  })
  t.equal(obs.compute(), 'value', 'does not transform when condition is falsy')
  someCondition = true
  t.equal(obs.compute(), 'VALUE', 'transforms to uppercase when condition is truthy')
  const obs2 = new Observable()
  obs.set({ $transform: { $condition: obs2 } })
  t.equal(obs.compute(), 'value', '$condition set to empty reference does not transform')
  obs.once(function () {
    t.equal(obs.compute(), 'VALUE', 'transforms to uppercase when reference is set to true, fires listener')
  })
  obs2.set(true)
})

test('operator primitive $transform using custom type and $condition', function (t) {
  t.plan(2)
  const reference = new Observable(20)
  const Obs = new Observable({
    properties: {
      $someCase: {
        type: '$transform',
        $condition: {
          val: reference,
          $transform (val) { return val > 10 }
        }
      }
    },
    Child: 'Constructor'
  }).Constructor
  const instance = new Obs({ field: { $someCase: 'hello' } })
  t.equal(instance.field.compute(), 'hello', 'nested $transform outputs "hello"')
  instance.field.once(() => {
    t.equal(
      instance.field.compute(),
      instance.field,
      'setting condition to false fires listener and ignores operator'
    )
  })
  reference.set(5)
})

test('operator object $transform', function (t) {
  t.plan(2)
  const obs = new Observable({
    key: 'obs',
    val: 'value',
    $transform: [
      (val) => val.toUpperCase(),
      (val) => { return { field: val, field2: 2 } }
    ]
  })
  t.deepEqual(obs.compute().keys(), ['field', 'field2'], 'correct fields after object transform')
  t.equal(obs.compute().field.val, 'VALUE', 'use multiple transforms')
})
