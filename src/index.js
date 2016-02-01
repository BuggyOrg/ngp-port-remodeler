import {Graph} from 'graphlib'
import {_} from 'lodash'

var api = {
  remodelPorts: function (portGraph) {
    var parents = [ ]
    var g = new Graph({ directed: true, compound: true, multigraph: false })
    // iterate over the edges of the port graph. all port information is stored in these edges
    for (let node of portGraph.nodes()) {
      g.setNode(node, portGraph.node(node))
      var parentNode = portGraph.node(node).parent
      // if needed, creates the parent node and creates the parent relation
      // also adds the parent node to an array of parent nodes for further usage
      if (parentNode) {
        if (!g.hasNode(parentNode)) {
          g.setNode(parentNode, portGraph.node(parentNode))
        }
        g.setParent(node, parentNode)
        parents.push(parentNode)
      }
    }
    parents = _.unique(parents)

    for (let edge of portGraph.edges()) {
      var label = portGraph.edge(edge)
      var outPortName = edge.v + '_PORT_' + label.outPort
      var inPortName = edge.w + '_PORT_' + label.inPort

      // if needed, add the in-port node
      if (!g.hasNode(inPortName)) {
        g.setNode(inPortName, { nodeType: 'inPort', portName: label.inPort })
        g.setParent(inPortName, portGraph.node(edge.w).parent)
      } else {
        g.setNode(inPortName, { nodeType: 'outPort', portName: label.inPort, hierarchyBorder: true })
      }
      // if needed, add the out-port node
      if (!g.hasNode(outPortName)) {
        g.setNode(outPortName, { nodeType: 'outPort', portName: label.outPort })
        g.setParent(outPortName, portGraph.node(edge.v).parent)
      } else {
        g.setNode(outPortName, { nodeType: 'inPort', portName: label.outPort, hierarchyBorder: true })
      }
      // connect the ports to it's corresponding process nodes
      // hierarchy information still exists, but it is not used anymore
      // That means: No edges from or to a node that is a parent of another node
      if (!_.contains(parents, edge.w)) {
        g.setEdge(inPortName, edge.w)
      }
      if (!_.contains(parents, edge.v)) {
        g.setEdge(edge.v, outPortName)
      }
      // connect the two ports from this edge
      g.setEdge(outPortName, inPortName)
    }
    return g
  }
}

module.exports = api
