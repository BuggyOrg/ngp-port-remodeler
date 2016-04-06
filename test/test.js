/* global describe, it */
var fs = require('fs')
var graphlib = require('graphlib')

var api = require('../src/index.js')
var expect = require('chai').expect

describe('NPG Port Remodeler', function () {
  it('port remodel test', function () {
    // old port graph
    /*
    var portGraph = new Graph({ directed: true, compound: true, multigraph: true })
    portGraph.setNode('EXAMPLE1', { parent: null })
    portGraph.setNode('0_STDIN', { nodeType: 'process', meta: 'io/stdin', type: 'atomic', parent: 'EXAMPLE1' })
    portGraph.setNode('1_INC', { nodeType: 'process', meta: 'math/inc', type: 'composite', parent: 'EXAMPLE1' })
    portGraph.setNode('2_STDOUT', { nodeType: 'process', meta: 'io/stdout', type: 'atomic', parent: 'EXAMPLE1' })
    portGraph.setParent('0_STDIN', 'EXAMPLE1')
    portGraph.setParent('1_INC', 'EXAMPLE1')
    portGraph.setParent('2_STDOUT', 'EXAMPLE1')

    portGraph.setNode('3_ADD', { nodeType: 'process', meta: 'math/add', type: 'atomic', parent: '1_INC' })
    portGraph.setNode('4_CONST1', { nodeType: 'process', meta: 'math/const1', type: 'atomic', parent: '1_INC' })
    portGraph.setParent('3_ADD', '1_INC')
    portGraph.setParent('4_CONST1', '1_INC')

    portGraph.setEdge('0_STDIN', '1_INC', { outPort: 'output', inPort: 'i' })
    portGraph.setEdge('1_INC', '2_STDOUT', { outPort: 'inc', inPort: 'input' })
    portGraph.setEdge('1_INC', '3_ADD', { outPort: 'i', inPort: 's1' })
    portGraph.setEdge('4_CONST1', '3_ADD', { outPort: 'const1', inPort: 's2' })
    portGraph.setEdge('3_ADD', '1_INC', { outPort: 'sum', inPort: 'inc' })
    fs.writeFileSync('test/fixtures/portGraph.graphlib', JSON.stringify(graphlib.json.write(portGraph), null, 2))*/

    var portGraph = graphlib.json.read(JSON.parse(fs.readFileSync('test/fixtures/portGraph.graphlib')))

    var g = api.remodelPorts(portGraph)
    // fs.writeFileSync('test/fixtures/testgraph.graphlib', JSON.stringify(graphlib.json.write(g), null, 2))
    var curGraph = graphlib.json.write(g)
    var cmpGraph = JSON.parse(fs.readFileSync('test/fixtures/testgraph.graphlib'))

    expect(curGraph).to.deep.equal(cmpGraph)
  })
})
