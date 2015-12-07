import {Graph} from 'graphlib'

var api = {
  remodelPorts: function (portGraph) {
    var i = 0
    var g = new Graph({ directed: true, compound: true, multigraph: true })
    g.setNode('MAIN')

    for (let node of portGraph.nodes()) {
      if (node === 'MAIN') {
        // the parent node is by deafult named MAIN
        continue
      }
      g.setNode(node, portGraph.node(node))
      g.setParent(node, 'MAIN')
    }

    for (let edge of portGraph.edges()) {
      // console.log(edge)
      var value = portGraph.edge(edge)
      var outPortName = edge.v + '_OUTPORT_' + value.outPort
      var inPortName = edge.w + '_INPORT_' + value.inPort

      // if needed, add the in-port node, connect in-port node to process node
      if (!g.hasNode(inPortName)) {
        g.setNode(inPortName, { nodeType: 'inPort', portName: value.inPort })
        g.setParent(inPortName, 'MAIN')
      }
      g.setEdge(inPortName, edge.w, i++)

      // if needed, add the out-port node, connect process node to out-port node
      if (!g.hasNode(outPortName)) {
        g.setNode(outPortName, { nodeType: 'outPort', portName: value.outPort })
        g.setParent(outPortName, 'MAIN')
      }
      g.setEdge(edge.v, outPortName, i++)

      // connect the correct ports
      g.setEdge(outPortName, inPortName, i++)
    }
    console.log(g.nodes())
    console.log('--------------')
    // console.log(g.edges())
    for (let edge of g.edges()) {
      console.log(edge)
    }
    return g
  }
}

module.exports = api
