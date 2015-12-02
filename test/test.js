/* global describe, it */

var api = require('../src/index.js')
var expect = require('chai').expect

describe('NPG Port Remodeler', function () {
  it('empty test', function () {
    api.emptyFunction()
    expect(true).to.equal(false)
  })
})
