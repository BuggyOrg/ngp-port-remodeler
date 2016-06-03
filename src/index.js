import {Graph} from 'graphlib'
import _ from 'lodash'

var parent = function (graph, outP, inP) {
  if (graph.parent(outP) === graph.parent(inP)) {
    return graph.parent(outP)
  } else if (graph.parent(outP) === inP) {
    return inP
  } else {
    return outP
  }
}

var api = {
  remodelPorts: function (portGraph) {
    var parents = [ ]
    var g = new Graph({ directed: true, compound: true, multigraph: true })

    for (let node of portGraph.nodes()) {
      let lbl = portGraph.node(node)
      lbl.nodeType = 'process'
      g.setNode(node, lbl)
      var parentNode = portGraph.parent(node)
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

    for (let edge of _.reject(portGraph.edges(), (e) => portGraph.edge(e) && portGraph.edge(e).continuation)) {
      var label = portGraph.edge(edge)
      var outPortName = edge.v + '_PORT_' + label.outPort
      var inPortName = edge.w + '_PORT_' + label.inPort

      // if needed, add the in-port node
      if (portGraph.parent(edge.v) !== edge.w) {
        if (!g.hasNode(inPortName)) {
          let type = portGraph.node(edge.w).inputPorts[label.inPort]
          g.setNode(inPortName, { nodeType: 'inPort', portName: label.inPort, process: edge.w, type: type })
          g.setParent(inPortName, parent(portGraph, edge.w, edge.v))
        }
      } else {
        g.setNode(inPortName, { nodeType: 'outPort', portName: label.inPort, hierarchyBorder: true, process: edge.w })
      }
      // if needed, add the out-port node
      if (portGraph.parent(edge.w) !== edge.v) {
        if (!g.hasNode(outPortName)) {
          let type = portGraph.node(edge.w).inputPorts[label.inPort]
          g.setNode(outPortName, { nodeType: 'outPort', portName: label.outPort, process: edge.v, type: type })
          g.setParent(outPortName, parent(portGraph, edge.w, edge.v))
        }
      } else {
        g.setNode(outPortName, { nodeType: 'inPort', portName: label.outPort, hierarchyBorder: true, process: edge.v })
      }
      // connect the ports to it's corresponding process nodes
      // hierarchy information still exists, but it is not used anymore
      // That means: No edges from or to a node that is a parent of another node
      if (!_.contains(parents, edge.w)) {
        g.setEdge(inPortName, edge.w)
      }
      if (!_.contains(parents, edge.v) || portGraph.node(edge.v).id === 'functional/lambda') {
        g.setEdge(edge.v, outPortName)
      }
      // connect the two ports from this edge
      g.setEdge(outPortName, inPortName)
    }
    for (let edge of _.filter(portGraph.edges(), (e) => portGraph.edge(e) && portGraph.edge(e).continuation)) {
      g.setEdge(edge, portGraph.edge(edge))
    }
    return g
  }
}

module.exports = api
