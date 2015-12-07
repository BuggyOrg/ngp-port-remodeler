/* global describe, it */
import {Graph} from 'graphlib'

var api = require('../src/index.js')
var expect = require('chai').expect

describe('NPG Port Remodeler', function () {
  it('port remodel test', function () {
    // old port graph
    var portGraph = new Graph({ directed: true, compound: true, multigraph: true })
    portGraph.setNode('MAIN')
    portGraph.setNode('0_ADD', { type: 'math/add' })
    portGraph.setNode('1_ADD', { type: 'math/add' })
    portGraph.setParent('0_ADD', 'MAIN')
    portGraph.setParent('1_ADD', 'MAIN')

    portGraph.setEdge('0_ADD', '1_ADD', { outPort: 'sum', inPort: 's1' }, 'edge0')
    portGraph.setEdge('MAIN', '0_ADD', { outPort: 'a', inPort: 's1' }, 'edge1')
    portGraph.setEdge('MAIN', '0_ADD', { outPort: 'b', inPort: 's2' }, 'edge2')
    portGraph.setEdge('MAIN', '1_ADD', { outPort: 'c', inPort: 's2' }, 'edge3')
    portGraph.setEdge('1_ADD', 'MAIN', { outPort: 'sum', inPort: 'output' }, 'edge4')

    // remodeled port graph
    var remodeledGraph = new Graph({ directed: true, compound: true, multigraph: true })
    // old process nodes
    remodeledGraph.setNode('MAIN')
    remodeledGraph.setNode('0_ADD', { nodeType: 'process', type: 'math/add' })
    remodeledGraph.setNode('1_ADD', { nodeType: 'process', type: 'math/add' })
    // new port nodes for the parent node
    remodeledGraph.setNode('MAIN_INPORT_a', { nodeType: 'inPort', portName: 'a' })
    remodeledGraph.setNode('MAIN_INPORT_b', { nodeType: 'inPort', portName: 'b' })
    remodeledGraph.setNode('MAIN_INPORT_c', { nodeType: 'inPort', portName: 'c' })
    remodeledGraph.setNode('MAIN_OUTPORT_output', { nodeType: 'outPort', portName: 'output' })
    // new port nodes for 0_ADD
    remodeledGraph.setNode('0_ADD_INPORT_s1', { nodeType: 'inPort', portName: 's1' })
    remodeledGraph.setNode('0_ADD_INPORT_s2', { nodeType: 'inPort', portName: 's2' })
    remodeledGraph.setNode('0_ADD_OUTPORT_sum', { nodeType: 'outPort', portName: 'sum' })
    // new port nodes for 1_ADD
    remodeledGraph.setNode('1_ADD_INPORT_s1', { nodeType: 'inPort', portName: 's1' })
    remodeledGraph.setNode('1_ADD_INPORT_s2', { nodeType: 'inPort', portName: 's2' })
    remodeledGraph.setNode('1_ADD_OUTPORT_sum', { nodeType: 'outPort', portName: 'sum' })
    // each node has the same parent
    remodeledGraph.setParent('0_ADD', 'MAIN')
    remodeledGraph.setParent('1_ADD', 'MAIN')
    remodeledGraph.setParent('0_ADD_INPORT_s1', 'MAIN')
    remodeledGraph.setParent('0_ADD_INPORT_s2', 'MAIN')
    remodeledGraph.setParent('0_ADD_OUTPORT_sum', 'MAIN')
    remodeledGraph.setParent('1_ADD_INPORT_s1', 'MAIN')
    remodeledGraph.setParent('1_ADD_INPORT_s2', 'MAIN')
    remodeledGraph.setParent('1_ADD_OUTPORT_sum', 'MAIN')
    // edges between main ports and inner ports
    remodeledGraph.setEdge('MAIN_INPORT_a', '0_ADD_INPORT_s1')
    remodeledGraph.setEdge('MAIN_INPORT_b', '0_ADD_INPORT_s2')
    remodeledGraph.setEdge('MAIN_INPORT_c', '1_ADD_INPORT_s2')
    remodeledGraph.setEdge('1_ADD_OUTPORT_sum', 'MAIN_OUTPORT_output')
    // edges between 0_ADD and its ports
    remodeledGraph.setEdge('0_ADD_INPORT_s1', '0_ADD')
    remodeledGraph.setEdge('0_ADD_INPORT_s2', '0_ADD')
    remodeledGraph.setEdge('0_ADD', '0_ADD_OUTPORT_sum')
    // edges between 1_ADD and its ports
    remodeledGraph.setEdge('1_ADD_INPORT_s1', '1_ADD')
    remodeledGraph.setEdge('1_ADD_INPORT_s2', '1_ADD')
    remodeledGraph.setEdge('1_ADD', '1_ADD_OUTPORT_sum')
    // edge between 0_ADD port and 1_ADD port
    remodeledGraph.setEdge('0_ADD_OUTPORT_sum', '1_ADD_INPORT_s1')

    var g = api.remodelPorts(portGraph)
    g
    // expect(g).to.deep.equal(remodeledGraph)
    expect(true).to.equal(false)
  })
})
