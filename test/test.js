/* global describe, it */
var fs = require('fs')
var graphlib = require('graphlib')

var api = require('../src/index.js')
var expect = require('chai').expect

describe('NPG Port Remodeler', function () {
/*
  it('port remodel test', function () {
    var portGraph = graphlib.json.read(JSON.parse(fs.readFileSync('test/fixtures/portGraph.graphlib')))

    var g = api.remodelPorts(portGraph)
    // fs.writeFileSync('test/fixtures/testgraph.graphlib', JSON.stringify(graphlib.json.write(g), null, 2))
    var curGraph = graphlib.json.write(g)
    var cmpGraph = JSON.parse(fs.readFileSync('test/fixtures/testgraph.graphlib'))

    expect(curGraph).to.deep.equal(cmpGraph)
  })
*/
  it('assigns the correct parents', () => {
    var facGraph = graphlib.json.read(JSON.parse(fs.readFileSync('test/fixtures/real_fac_dup.json')))
    
    var g = api.remodelPorts(facGraph)
    expect(g.parent('fac:choose_DUPLICATE_0_1_PORT_d2')).to.equal('fac')
  })

  it('can handle lambda functions', () => {
    var lambdaGraph = graphlib.json.read(JSON.parse(fs.readFileSync('test/fixtures/lambda.json')))

    var g = api.remodelPorts(lambdaGraph)
    expect(g.node('inc_lambda_PORT_i').hierarchyBorder).to.be.true
    expect(g.node('inc_lambda_PORT_i').nodeType).to.equal('inPort')
  })
})
