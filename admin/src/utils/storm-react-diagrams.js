/**
 * This is a copy of storm-react-diagrams/dist/main.js with 2 replaces:
 * '"_"' replaced as 'lodash'
 * 'var _ = __webpack_require__(0);' replaced as 'var _ = require("lodash")'
 * Cleaner solution is to use webpack alias: {resolve} in webpack config, but strapi plugin doesn't allow
 * to change webpack config on plugin level, so users of this plugin would need to manually update
 * src/admin/webpack.config.js in their project. This override makes it easier.
 */

(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory(require('lodash'), require('react'));
  } else if (typeof define === 'function' && define.amd) define(['lodash', 'react'], factory);
  else if (typeof exports === 'object') exports['storm-react-diagrams'] = factory(require('lodash'), require('react'));
  else root['storm-react-diagrams'] = factory(root['lodash'], root['React']);
})(window, function (__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__1__) {
  return (function (modules) {
    var installedModules = {};

    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      var module = (installedModules[moduleId] = { i: moduleId, l: false, exports: {} });
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.l = true;
      return module.exports;
    }

    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function (exports, name, getter) {
      if (!__webpack_require__.o(exports, name)) {
        Object.defineProperty(exports, name, { configurable: false, enumerable: true, get: getter });
      }
    };
    __webpack_require__.r = function (exports) {
      Object.defineProperty(exports, '__esModule', { value: true });
    };
    __webpack_require__.n = function (module) {
      var getter =
        module && module.__esModule
          ? function getDefault() {
              return module['default'];
            }
          : function getModuleExports() {
              return module;
            };
      __webpack_require__.d(getter, 'a', getter);
      return getter;
    };
    __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = '';
    return __webpack_require__((__webpack_require__.s = 45));
  })([
    function (module, exports) {
      module.exports = __WEBPACK_EXTERNAL_MODULE__0__;
    },
    function (module, exports) {
      module.exports = __WEBPACK_EXTERNAL_MODULE__1__;
    },
    function (module, exports) {
      var DiagonalMovement = { Always: 1, Never: 2, IfAtMostOneObstacle: 3, OnlyWhenNoObstacles: 4 };
      module.exports = DiagonalMovement;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var BaseWidget = (function (_super) {
        __extends(BaseWidget, _super);

        function BaseWidget(name, props) {
          var _this = _super.call(this, props) || this;
          _this.className = name;
          return _this;
        }

        BaseWidget.prototype.bem = function (selector) {
          return (this.props.baseClass || this.className) + selector + ' ';
        };
        BaseWidget.prototype.getClassName = function () {
          return (this.props.baseClass || this.className) + ' ' + (this.props.className ? this.props.className + ' ' : '');
        };
        BaseWidget.prototype.getProps = function () {
          return __assign({}, this.props.extraProps || {}, { className: this.getClassName() });
        };
        return BaseWidget;
      })(React.Component);
      exports.BaseWidget = BaseWidget;
    },
    function (module, exports) {
      function backtrace(node) {
        var path = [[node.x, node.y]];
        while (node.parent) {
          node = node.parent;
          path.push([node.x, node.y]);
        }
        return path.reverse();
      }

      exports.backtrace = backtrace;

      function biBacktrace(nodeA, nodeB) {
        var pathA = backtrace(nodeA),
          pathB = backtrace(nodeB);
        return pathA.concat(pathB.reverse());
      }

      exports.biBacktrace = biBacktrace;

      function pathLength(path) {
        var i,
          sum = 0,
          a,
          b,
          dx,
          dy;
        for (i = 1; i < path.length; ++i) {
          a = path[i - 1];
          b = path[i];
          dx = a[0] - b[0];
          dy = a[1] - b[1];
          sum += Math.sqrt(dx * dx + dy * dy);
        }
        return sum;
      }

      exports.pathLength = pathLength;

      function interpolate(x0, y0, x1, y1) {
        var abs = Math.abs,
          line = [],
          sx,
          sy,
          dx,
          dy,
          err,
          e2;
        dx = abs(x1 - x0);
        dy = abs(y1 - y0);
        sx = x0 < x1 ? 1 : -1;
        sy = y0 < y1 ? 1 : -1;
        err = dx - dy;
        while (true) {
          line.push([x0, y0]);
          if (x0 === x1 && y0 === y1) {
            break;
          }
          e2 = 2 * err;
          if (e2 > -dy) {
            err = err - dy;
            x0 = x0 + sx;
          }
          if (e2 < dx) {
            err = err + dx;
            y0 = y0 + sy;
          }
        }
        return line;
      }

      exports.interpolate = interpolate;

      function expandPath(path) {
        var expanded = [],
          len = path.length,
          coord0,
          coord1,
          interpolated,
          interpolatedLen,
          i,
          j;
        if (len < 2) {
          return expanded;
        }
        for (i = 0; i < len - 1; ++i) {
          coord0 = path[i];
          coord1 = path[i + 1];
          interpolated = interpolate(coord0[0], coord0[1], coord1[0], coord1[1]);
          interpolatedLen = interpolated.length;
          for (j = 0; j < interpolatedLen - 1; ++j) {
            expanded.push(interpolated[j]);
          }
        }
        expanded.push(path[len - 1]);
        return expanded;
      }

      exports.expandPath = expandPath;

      function smoothenPath(grid, path) {
        var len = path.length,
          x0 = path[0][0],
          y0 = path[0][1],
          x1 = path[len - 1][0],
          y1 = path[len - 1][1],
          sx,
          sy,
          ex,
          ey,
          newPath,
          i,
          j,
          coord,
          line,
          testCoord,
          blocked;
        sx = x0;
        sy = y0;
        newPath = [[sx, sy]];
        for (i = 2; i < len; ++i) {
          coord = path[i];
          ex = coord[0];
          ey = coord[1];
          line = interpolate(sx, sy, ex, ey);
          blocked = false;
          for (j = 1; j < line.length; ++j) {
            testCoord = line[j];
            if (!grid.isWalkableAt(testCoord[0], testCoord[1])) {
              blocked = true;
              break;
            }
          }
          if (blocked) {
            lastValidCoord = path[i - 1];
            newPath.push(lastValidCoord);
            sx = lastValidCoord[0];
            sy = lastValidCoord[1];
          }
        }
        newPath.push([x1, y1]);
        return newPath;
      }

      exports.smoothenPath = smoothenPath;

      function compressPath(path) {
        if (path.length < 3) {
          return path;
        }
        var compressed = [],
          sx = path[0][0],
          sy = path[0][1],
          px = path[1][0],
          py = path[1][1],
          dx = px - sx,
          dy = py - sy,
          lx,
          ly,
          ldx,
          ldy,
          sq,
          i;
        sq = Math.sqrt(dx * dx + dy * dy);
        dx /= sq;
        dy /= sq;
        compressed.push([sx, sy]);
        for (i = 2; i < path.length; i++) {
          lx = px;
          ly = py;
          ldx = dx;
          ldy = dy;
          px = path[i][0];
          py = path[i][1];
          dx = px - lx;
          dy = py - ly;
          sq = Math.sqrt(dx * dx + dy * dy);
          dx /= sq;
          dy /= sq;
          if (dx !== ldx || dy !== ldy) {
            compressed.push([lx, ly]);
          }
        }
        compressed.push([px, py]);
        return compressed;
      }

      exports.compressPath = compressPath;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseModel_1 = __webpack_require__(6);

      var PointModel = (function (_super) {
        __extends(PointModel, _super);

        function PointModel(link, points) {
          var _this = _super.call(this) || this;
          _this.x = points.x;
          _this.y = points.y;
          _this.parent = link;
          return _this;
        }

        PointModel.prototype.getSelectedEntities = function () {
          if (_super.prototype.isSelected.call(this) && !this.isConnectedToPort()) {
            return [this];
          }
          return [];
        };
        PointModel.prototype.isConnectedToPort = function () {
          return this.parent.getPortForPoint(this) !== null;
        };
        PointModel.prototype.getLink = function () {
          return this.getParent();
        };
        PointModel.prototype.deSerialize = function (ob, engine) {
          _super.prototype.deSerialize.call(this, ob, engine);
          this.x = ob.x;
          this.y = ob.y;
        };
        PointModel.prototype.serialize = function () {
          return _.merge(_super.prototype.serialize.call(this), { x: this.x, y: this.y });
        };
        PointModel.prototype.remove = function () {
          if (this.parent) {
            this.parent.removePoint(this);
          }
          _super.prototype.remove.call(this);
        };
        PointModel.prototype.updateLocation = function (points) {
          this.x = points.x;
          this.y = points.y;
        };
        PointModel.prototype.getX = function () {
          return this.x;
        };
        PointModel.prototype.getY = function () {
          return this.y;
        };
        PointModel.prototype.isLocked = function () {
          return _super.prototype.isLocked.call(this) || this.getParent().isLocked();
        };
        return PointModel;
      })(BaseModel_1.BaseModel);
      exports.PointModel = PointModel;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseEntity_1 = __webpack_require__(13);
      var _ = require('lodash');
      var BaseModel = (function (_super) {
        __extends(BaseModel, _super);

        function BaseModel(type, id) {
          var _this = _super.call(this, id) || this;
          _this.type = type;
          _this.selected = false;
          return _this;
        }

        BaseModel.prototype.getParent = function () {
          return this.parent;
        };
        BaseModel.prototype.setParent = function (parent) {
          this.parent = parent;
        };
        BaseModel.prototype.getSelectedEntities = function () {
          if (this.isSelected()) {
            return [this];
          }
          return [];
        };
        BaseModel.prototype.deSerialize = function (ob, engine) {
          _super.prototype.deSerialize.call(this, ob, engine);
          this.type = ob.type;
          this.selected = ob.selected;
        };
        BaseModel.prototype.serialize = function () {
          return _.merge(_super.prototype.serialize.call(this), { type: this.type, selected: this.selected });
        };
        BaseModel.prototype.getType = function () {
          return this.type;
        };
        BaseModel.prototype.getID = function () {
          return this.id;
        };
        BaseModel.prototype.isSelected = function () {
          return this.selected;
        };
        BaseModel.prototype.setSelected = function (selected) {
          if (selected === void 0) {
            selected = true;
          }
          this.selected = selected;
          this.iterateListeners(function (listener, event) {
            if (listener.selectionChanged) {
              listener.selectionChanged(__assign({}, event, { isSelected: selected }));
            }
          });
        };
        BaseModel.prototype.remove = function () {
          this.iterateListeners(function (listener, event) {
            if (listener.entityRemoved) {
              listener.entityRemoved(event);
            }
          });
        };
        return BaseModel;
      })(BaseEntity_1.BaseEntity);
      exports.BaseModel = BaseModel;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      Object.defineProperty(exports, '__esModule', { value: true });
      var closest = __webpack_require__(70);
      var PathFinding_1 = __webpack_require__(16);
      var Path = __webpack_require__(51);
      var Toolkit = (function () {
        function Toolkit() {}

        Toolkit.UID = function () {
          if (Toolkit.TESTING) {
            Toolkit.TESTING_UID++;
            return '' + Toolkit.TESTING_UID;
          }
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0;
            var v = c === 'x' ? r : (r & 3) | 8;
            return v.toString(16);
          });
        };
        Toolkit.closest = function (element, selector) {
          if (document.body.closest) {
            return element.closest(selector);
          }
          return closest(element, selector);
        };
        Toolkit.generateLinePath = function (firstPoint, lastPoint) {
          return 'M' + firstPoint.x + ',' + firstPoint.y + ' L ' + lastPoint.x + ',' + lastPoint.y;
        };
        Toolkit.generateCurvePath = function (firstPoint, lastPoint, curvy) {
          if (curvy === void 0) {
            curvy = 0;
          }
          var isHorizontal = Math.abs(firstPoint.x - lastPoint.x) > Math.abs(firstPoint.y - lastPoint.y);
          var curvyX = isHorizontal ? curvy : 0;
          var curvyY = isHorizontal ? 0 : curvy;
          return (
            'M' +
            firstPoint.x +
            ',' +
            firstPoint.y +
            ' C ' +
            (firstPoint.x + curvyX) +
            ',' +
            (firstPoint.y + curvyY) +
            '\n    ' +
            (lastPoint.x - curvyX) +
            ',' +
            (lastPoint.y - curvyY) +
            ' ' +
            lastPoint.x +
            ',' +
            lastPoint.y
          );
        };
        Toolkit.generateDynamicPath = function (pathCoords) {
          var path = Path();
          path = path.moveto(pathCoords[0][0] * PathFinding_1.ROUTING_SCALING_FACTOR, pathCoords[0][1] * PathFinding_1.ROUTING_SCALING_FACTOR);
          pathCoords.slice(1).forEach(function (coords) {
            path = path.lineto(coords[0] * PathFinding_1.ROUTING_SCALING_FACTOR, coords[1] * PathFinding_1.ROUTING_SCALING_FACTOR);
          });
          return path.print();
        };
        Toolkit.TESTING = false;
        Toolkit.TESTING_UID = 0;
        return Toolkit;
      })();
      exports.Toolkit = Toolkit;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      Object.defineProperty(exports, '__esModule', { value: true });
      var AbstractFactory = (function () {
        function AbstractFactory(name) {
          this.type = name;
        }

        AbstractFactory.prototype.getType = function () {
          return this.type;
        };
        return AbstractFactory;
      })();
      exports.AbstractFactory = AbstractFactory;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseModel_1 = __webpack_require__(6);
      var _ = require('lodash');
      var NodeModel = (function (_super) {
        __extends(NodeModel, _super);

        function NodeModel(nodeType, id) {
          if (nodeType === void 0) {
            nodeType = 'default';
          }
          var _this = _super.call(this, nodeType, id) || this;
          _this.x = 0;
          _this.y = 0;
          _this.extras = {};
          _this.ports = {};
          return _this;
        }

        NodeModel.prototype.setPosition = function (x, y) {
          var oldX = this.x;
          var oldY = this.y;
          _.forEach(this.ports, function (port) {
            _.forEach(port.getLinks(), function (link) {
              var point = link.getPointForPort(port);
              point.x = point.x + x - oldX;
              point.y = point.y + y - oldY;
            });
          });
          this.x = x;
          this.y = y;
        };
        NodeModel.prototype.getSelectedEntities = function () {
          var entities = _super.prototype.getSelectedEntities.call(this);
          if (this.isSelected()) {
            _.forEach(this.ports, function (port) {
              entities = entities.concat(
                _.map(port.getLinks(), function (link) {
                  return link.getPointForPort(port);
                })
              );
            });
          }
          return entities;
        };
        NodeModel.prototype.deSerialize = function (ob, engine) {
          var _this = this;
          _super.prototype.deSerialize.call(this, ob, engine);
          this.x = ob.x;
          this.y = ob.y;
          this.extras = ob.extras;
          _.forEach(ob.ports, function (port) {
            var portOb = engine.getPortFactory(port.type).getNewInstance();
            portOb.deSerialize(port, engine);
            _this.addPort(portOb);
          });
        };
        NodeModel.prototype.serialize = function () {
          return _.merge(_super.prototype.serialize.call(this), {
            x: this.x,
            y: this.y,
            extras: this.extras,
            ports: _.map(this.ports, function (port) {
              return port.serialize();
            }),
          });
        };
        NodeModel.prototype.doClone = function (lookupTable, clone) {
          if (lookupTable === void 0) {
            lookupTable = {};
          }
          clone.ports = {};
          _.forEach(this.ports, function (port) {
            clone.addPort(port.clone(lookupTable));
          });
        };
        NodeModel.prototype.remove = function () {
          _super.prototype.remove.call(this);
          _.forEach(this.ports, function (port) {
            _.forEach(port.getLinks(), function (link) {
              link.remove();
            });
          });
        };
        NodeModel.prototype.getPortFromID = function (id) {
          for (var i in this.ports) {
            if (this.ports[i].id === id) {
              return this.ports[i];
            }
          }
          return null;
        };
        NodeModel.prototype.getPort = function (name) {
          return this.ports[name];
        };
        NodeModel.prototype.getPorts = function () {
          return this.ports;
        };
        NodeModel.prototype.removePort = function (port) {
          if (this.ports[port.name]) {
            this.ports[port.name].setParent(null);
            delete this.ports[port.name];
          }
        };
        NodeModel.prototype.addPort = function (port) {
          port.setParent(this);
          this.ports[port.name] = port;
          return port;
        };
        NodeModel.prototype.updateDimensions = function (_a) {
          var width = _a.width,
            height = _a.height;
          this.width = width;
          this.height = height;
        };
        return NodeModel;
      })(BaseModel_1.BaseModel);
      exports.NodeModel = NodeModel;
    },
    function (module, exports) {
      module.exports = {
        manhattan: function (dx, dy) {
          return dx + dy;
        },
        euclidean: function (dx, dy) {
          return Math.sqrt(dx * dx + dy * dy);
        },
        octile: function (dx, dy) {
          var F = Math.SQRT2 - 1;
          return dx < dy ? F * dx + dy : F * dy + dx;
        },
        chebyshev: function (dx, dy) {
          return Math.max(dx, dy);
        },
      };
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseAction = (function () {
        function BaseAction(mouseX, mouseY) {
          this.mouseX = mouseX;
          this.mouseY = mouseY;
          this.ms = new Date().getTime();
        }

        return BaseAction;
      })();
      exports.BaseAction = BaseAction;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseModel_1 = __webpack_require__(6);
      var _ = require('lodash');
      var PortModel = (function (_super) {
        __extends(PortModel, _super);

        function PortModel(name, type, id, maximumLinks) {
          var _this = _super.call(this, type, id) || this;
          _this.name = name;
          _this.links = {};
          _this.maximumLinks = maximumLinks;
          return _this;
        }

        PortModel.prototype.deSerialize = function (ob, engine) {
          _super.prototype.deSerialize.call(this, ob, engine);
          this.name = ob.name;
          this.maximumLinks = ob.maximumLinks;
        };
        PortModel.prototype.serialize = function () {
          return _.merge(_super.prototype.serialize.call(this), {
            name: this.name,
            parentNode: this.parent.id,
            links: _.map(this.links, function (link) {
              return link.id;
            }),
            maximumLinks: this.maximumLinks,
          });
        };
        PortModel.prototype.doClone = function (lookupTable, clone) {
          if (lookupTable === void 0) {
            lookupTable = {};
          }
          clone.links = {};
          clone.parentNode = this.getParent().clone(lookupTable);
        };
        PortModel.prototype.getNode = function () {
          return this.getParent();
        };
        PortModel.prototype.getName = function () {
          return this.name;
        };
        PortModel.prototype.getMaximumLinks = function () {
          return this.maximumLinks;
        };
        PortModel.prototype.setMaximumLinks = function (maximumLinks) {
          this.maximumLinks = maximumLinks;
        };
        PortModel.prototype.removeLink = function (link) {
          delete this.links[link.getID()];
        };
        PortModel.prototype.addLink = function (link) {
          this.links[link.getID()] = link;
        };
        PortModel.prototype.getLinks = function () {
          return this.links;
        };
        PortModel.prototype.createLinkModel = function () {
          if (_.isFinite(this.maximumLinks)) {
            var numberOfLinks = _.size(this.links);
            if (this.maximumLinks === 1 && numberOfLinks >= 1) {
              return _.values(this.links)[0];
            } else if (numberOfLinks >= this.maximumLinks) {
              return null;
            }
          }
          return null;
        };
        PortModel.prototype.updateCoords = function (_a) {
          var x = _a.x,
            y = _a.y,
            width = _a.width,
            height = _a.height;
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
        };
        PortModel.prototype.canLinkToPort = function (port) {
          return true;
        };
        PortModel.prototype.isLocked = function () {
          return _super.prototype.isLocked.call(this) || this.getParent().isLocked();
        };
        return PortModel;
      })(BaseModel_1.BaseModel);
      exports.PortModel = PortModel;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var Toolkit_1 = __webpack_require__(7);
      var _ = require('lodash');
      var BaseEntity = (function () {
        function BaseEntity(id) {
          this.listeners = {};
          this.id = id || Toolkit_1.Toolkit.UID();
          this.locked = false;
        }

        BaseEntity.prototype.getID = function () {
          return this.id;
        };
        BaseEntity.prototype.doClone = function (lookupTable, clone) {
          if (lookupTable === void 0) {
            lookupTable = {};
          }
        };
        BaseEntity.prototype.clone = function (lookupTable) {
          if (lookupTable === void 0) {
            lookupTable = {};
          }
          if (lookupTable[this.id]) {
            return lookupTable[this.id];
          }
          var clone = _.clone(this);
          clone.id = Toolkit_1.Toolkit.UID();
          clone.clearListeners();
          lookupTable[this.id] = clone;
          this.doClone(lookupTable, clone);
          return clone;
        };
        BaseEntity.prototype.clearListeners = function () {
          this.listeners = {};
        };
        BaseEntity.prototype.deSerialize = function (data, engine) {
          this.id = data.id;
        };
        BaseEntity.prototype.serialize = function () {
          return { id: this.id };
        };
        BaseEntity.prototype.iterateListeners = function (cb) {
          var event = {
            id: Toolkit_1.Toolkit.UID(),
            firing: true,
            entity: this,
            stopPropagation: function () {
              event.firing = false;
            },
          };
          for (var i in this.listeners) {
            if (this.listeners.hasOwnProperty(i)) {
              if (!event.firing) {
                return;
              }
              cb(this.listeners[i], event);
            }
          }
        };
        BaseEntity.prototype.removeListener = function (listener) {
          if (this.listeners[listener]) {
            delete this.listeners[listener];
            return true;
          }
          return false;
        };
        BaseEntity.prototype.addListener = function (listener) {
          var uid = Toolkit_1.Toolkit.UID();
          this.listeners[uid] = listener;
          return uid;
        };
        BaseEntity.prototype.isLocked = function () {
          return this.locked;
        };
        BaseEntity.prototype.setLocked = function (locked) {
          if (locked === void 0) {
            locked = true;
          }
          this.locked = locked;
          this.iterateListeners(function (listener, event) {
            if (listener.lockChanged) {
              listener.lockChanged(__assign({}, event, { locked: locked }));
            }
          });
        };
        return BaseEntity;
      })();
      exports.BaseEntity = BaseEntity;
    },
    function (module, exports, __webpack_require__) {
      var Heap = __webpack_require__(15);
      var Util = __webpack_require__(4);
      var Heuristic = __webpack_require__(10);
      var DiagonalMovement = __webpack_require__(2);

      function JumpPointFinderBase(opt) {
        opt = opt || {};
        this.heuristic = opt.heuristic || Heuristic.manhattan;
        this.trackJumpRecursion = opt.trackJumpRecursion || false;
      }

      JumpPointFinderBase.prototype.findPath = function (startX, startY, endX, endY, grid) {
        var openList = (this.openList = new Heap(function (nodeA, nodeB) {
            return nodeA.f - nodeB.f;
          })),
          startNode = (this.startNode = grid.getNodeAt(startX, startY)),
          endNode = (this.endNode = grid.getNodeAt(endX, endY)),
          node;
        this.grid = grid;
        startNode.g = 0;
        startNode.f = 0;
        openList.push(startNode);
        startNode.opened = true;
        while (!openList.empty()) {
          node = openList.pop();
          node.closed = true;
          if (node === endNode) {
            return Util.expandPath(Util.backtrace(endNode));
          }
          this._identifySuccessors(node);
        }
        return [];
      };
      JumpPointFinderBase.prototype._identifySuccessors = function (node) {
        var grid = this.grid,
          heuristic = this.heuristic,
          openList = this.openList,
          endX = this.endNode.x,
          endY = this.endNode.y,
          neighbors,
          neighbor,
          jumpPoint,
          i,
          l,
          x = node.x,
          y = node.y,
          jx,
          jy,
          dx,
          dy,
          d,
          ng,
          jumpNode,
          abs = Math.abs,
          max = Math.max;
        neighbors = this._findNeighbors(node);
        for (i = 0, l = neighbors.length; i < l; ++i) {
          neighbor = neighbors[i];
          jumpPoint = this._jump(neighbor[0], neighbor[1], x, y);
          if (jumpPoint) {
            jx = jumpPoint[0];
            jy = jumpPoint[1];
            jumpNode = grid.getNodeAt(jx, jy);
            if (jumpNode.closed) {
              continue;
            }
            d = Heuristic.octile(abs(jx - x), abs(jy - y));
            ng = node.g + d;
            if (!jumpNode.opened || ng < jumpNode.g) {
              jumpNode.g = ng;
              jumpNode.h = jumpNode.h || heuristic(abs(jx - endX), abs(jy - endY));
              jumpNode.f = jumpNode.g + jumpNode.h;
              jumpNode.parent = node;
              if (!jumpNode.opened) {
                openList.push(jumpNode);
                jumpNode.opened = true;
              } else {
                openList.updateItem(jumpNode);
              }
            }
          }
        }
      };
      module.exports = JumpPointFinderBase;
    },
    function (module, exports, __webpack_require__) {
      module.exports = __webpack_require__(66);
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      Object.defineProperty(exports, '__esModule', { value: true });
      var PF = __webpack_require__(68);
      exports.ROUTING_SCALING_FACTOR = 5;
      var pathFinderInstance = new PF.JumpPointFinder({
        heuristic: PF.Heuristic.manhattan,
        diagonalMovement: PF.DiagonalMovement.Never,
      });
      var PathFinding = (function () {
        function PathFinding(diagramEngine) {
          this.instance = pathFinderInstance;
          this.diagramEngine = diagramEngine;
        }

        PathFinding.prototype.calculateDirectPath = function (from, to) {
          var matrix = this.diagramEngine.getCanvasMatrix();
          var grid = new PF.Grid(matrix);
          return pathFinderInstance.findPath(
            this.diagramEngine.translateRoutingX(Math.floor(from.x / exports.ROUTING_SCALING_FACTOR)),
            this.diagramEngine.translateRoutingY(Math.floor(from.y / exports.ROUTING_SCALING_FACTOR)),
            this.diagramEngine.translateRoutingX(Math.floor(to.x / exports.ROUTING_SCALING_FACTOR)),
            this.diagramEngine.translateRoutingY(Math.floor(to.y / exports.ROUTING_SCALING_FACTOR)),
            grid
          );
        };
        PathFinding.prototype.calculateLinkStartEndCoords = function (matrix, path) {
          var startIndex = path.findIndex(function (point) {
            return matrix[point[1]][point[0]] === 0;
          });
          var endIndex =
            path.length -
            1 -
            path
              .slice()
              .reverse()
              .findIndex(function (point) {
                return matrix[point[1]][point[0]] === 0;
              });
          if (startIndex === -1 || endIndex === -1) {
            return undefined;
          }
          var pathToStart = path.slice(0, startIndex);
          var pathToEnd = path.slice(endIndex);
          return {
            start: { x: path[startIndex][0], y: path[startIndex][1] },
            end: { x: path[endIndex][0], y: path[endIndex][1] },
            pathToStart: pathToStart,
            pathToEnd: pathToEnd,
          };
        };
        PathFinding.prototype.calculateDynamicPath = function (routingMatrix, start, end, pathToStart, pathToEnd) {
          var _this = this;
          var grid = new PF.Grid(routingMatrix);
          var dynamicPath = pathFinderInstance.findPath(start.x, start.y, end.x, end.y, grid);
          var pathCoords = pathToStart.concat(dynamicPath, pathToEnd).map(function (coords) {
            return [_this.diagramEngine.translateRoutingX(coords[0], true), _this.diagramEngine.translateRoutingY(coords[1], true)];
          });
          return PF.Util.compressPath(pathCoords);
        };
        return PathFinding;
      })();
      exports.default = PathFinding;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseModel_1 = __webpack_require__(6);
      var _ = require('lodash');
      var LabelModel = (function (_super) {
        __extends(LabelModel, _super);

        function LabelModel(type, id) {
          var _this = _super.call(this, type, id) || this;
          _this.offsetX = 0;
          _this.offsetY = 0;
          return _this;
        }

        LabelModel.prototype.deSerialize = function (ob, engine) {
          _super.prototype.deSerialize.call(this, ob, engine);
          this.offsetX = ob.offsetX;
          this.offsetY = ob.offsetY;
        };
        LabelModel.prototype.serialize = function () {
          return _.merge(_super.prototype.serialize.call(this), { offsetX: this.offsetX, offsetY: this.offsetY });
        };
        return LabelModel;
      })(BaseModel_1.BaseModel);
      exports.LabelModel = LabelModel;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var LabelModel_1 = __webpack_require__(17);
      var _ = require('lodash');
      var DefaultLabelModel = (function (_super) {
        __extends(DefaultLabelModel, _super);

        function DefaultLabelModel() {
          var _this = _super.call(this, 'default') || this;
          _this.offsetY = -23;
          return _this;
        }

        DefaultLabelModel.prototype.setLabel = function (label) {
          this.label = label;
        };
        DefaultLabelModel.prototype.deSerialize = function (ob, engine) {
          _super.prototype.deSerialize.call(this, ob, engine);
          this.label = ob.label;
        };
        DefaultLabelModel.prototype.serialize = function () {
          return _.merge(_super.prototype.serialize.call(this), { label: this.label });
        };
        return DefaultLabelModel;
      })(LabelModel_1.LabelModel);
      exports.DefaultLabelModel = DefaultLabelModel;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var LinkModel_1 = __webpack_require__(21);
      var _ = require('lodash');
      var DefaultLabelModel_1 = __webpack_require__(18);
      var LabelModel_1 = __webpack_require__(17);
      var DefaultLinkModel = (function (_super) {
        __extends(DefaultLinkModel, _super);

        function DefaultLinkModel(type) {
          if (type === void 0) {
            type = 'default';
          }
          var _this = _super.call(this, type) || this;
          _this.color = 'rgba(255,255,255,0.5)';
          _this.width = 3;
          _this.curvyness = 50;
          return _this;
        }

        DefaultLinkModel.prototype.serialize = function () {
          return _.merge(_super.prototype.serialize.call(this), {
            width: this.width,
            color: this.color,
            curvyness: this.curvyness,
          });
        };
        DefaultLinkModel.prototype.deSerialize = function (ob, engine) {
          _super.prototype.deSerialize.call(this, ob, engine);
          this.color = ob.color;
          this.width = ob.width;
          this.curvyness = ob.curvyness;
        };
        DefaultLinkModel.prototype.addLabel = function (label) {
          if (label instanceof LabelModel_1.LabelModel) {
            return _super.prototype.addLabel.call(this, label);
          }
          var labelOb = new DefaultLabelModel_1.DefaultLabelModel();
          labelOb.setLabel(label);
          return _super.prototype.addLabel.call(this, labelOb);
        };
        DefaultLinkModel.prototype.setWidth = function (width) {
          this.width = width;
          this.iterateListeners(function (listener, event) {
            if (listener.widthChanged) {
              listener.widthChanged(__assign({}, event, { width: width }));
            }
          });
        };
        DefaultLinkModel.prototype.setColor = function (color) {
          this.color = color;
          this.iterateListeners(function (listener, event) {
            if (listener.colorChanged) {
              listener.colorChanged(__assign({}, event, { color: color }));
            }
          });
        };
        return DefaultLinkModel;
      })(LinkModel_1.LinkModel);
      exports.DefaultLinkModel = DefaultLinkModel;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var _ = require('lodash');
      var PortModel_1 = __webpack_require__(12);
      var DefaultLinkModel_1 = __webpack_require__(19);
      var DefaultPortModel = (function (_super) {
        __extends(DefaultPortModel, _super);

        function DefaultPortModel(isInput, name, label, id) {
          if (label === void 0) {
            label = null;
          }
          var _this = _super.call(this, name, 'default', id) || this;
          _this.in = isInput;
          _this.label = label || name;
          return _this;
        }

        DefaultPortModel.prototype.deSerialize = function (object, engine) {
          _super.prototype.deSerialize.call(this, object, engine);
          this.in = object.in;
          this.label = object.label;
        };
        DefaultPortModel.prototype.serialize = function () {
          return _.merge(_super.prototype.serialize.call(this), { in: this.in, label: this.label });
        };
        DefaultPortModel.prototype.link = function (port) {
          var link = this.createLinkModel();
          link.setSourcePort(this);
          link.setTargetPort(port);
          return link;
        };
        DefaultPortModel.prototype.canLinkToPort = function (port) {
          if (port instanceof DefaultPortModel) {
            return this.in !== port.in;
          }
          return true;
        };
        DefaultPortModel.prototype.createLinkModel = function () {
          var link = _super.prototype.createLinkModel.call(this);
          return link || new DefaultLinkModel_1.DefaultLinkModel();
        };
        return DefaultPortModel;
      })(PortModel_1.PortModel);
      exports.DefaultPortModel = DefaultPortModel;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseModel_1 = __webpack_require__(6);
      var PointModel_1 = __webpack_require__(5);
      var _ = require('lodash');
      var LinkModel = (function (_super) {
        __extends(LinkModel, _super);

        function LinkModel(linkType, id) {
          if (linkType === void 0) {
            linkType = 'default';
          }
          var _this = _super.call(this, linkType, id) || this;
          _this.points = [
            new PointModel_1.PointModel(_this, { x: 0, y: 0 }),
            new PointModel_1.PointModel(_this, {
              x: 0,
              y: 0,
            }),
          ];
          _this.extras = {};
          _this.sourcePort = null;
          _this.targetPort = null;
          _this.labels = [];
          return _this;
        }

        LinkModel.prototype.deSerialize = function (ob, engine) {
          var _this = this;
          _super.prototype.deSerialize.call(this, ob, engine);
          this.extras = ob.extras;
          this.points = _.map(ob.points || [], function (point) {
            var p = new PointModel_1.PointModel(_this, { x: point.x, y: point.y });
            p.deSerialize(point, engine);
            return p;
          });
          _.forEach(ob.labels || [], function (label) {
            var labelOb = engine.getLabelFactory(label.type).getNewInstance();
            labelOb.deSerialize(label, engine);
            _this.addLabel(labelOb);
          });
          if (ob.target) {
            this.setTargetPort(this.getParent().getNode(ob.target).getPortFromID(ob.targetPort));
          }
          if (ob.source) {
            this.setSourcePort(this.getParent().getNode(ob.source).getPortFromID(ob.sourcePort));
          }
        };
        LinkModel.prototype.serialize = function () {
          return _.merge(_super.prototype.serialize.call(this), {
            source: this.sourcePort ? this.sourcePort.getParent().id : null,
            sourcePort: this.sourcePort ? this.sourcePort.id : null,
            target: this.targetPort ? this.targetPort.getParent().id : null,
            targetPort: this.targetPort ? this.targetPort.id : null,
            points: _.map(this.points, function (point) {
              return point.serialize();
            }),
            extras: this.extras,
            labels: _.map(this.labels, function (label) {
              return label.serialize();
            }),
          });
        };
        LinkModel.prototype.doClone = function (lookupTable, clone) {
          if (lookupTable === void 0) {
            lookupTable = {};
          }
          clone.setPoints(
            _.map(this.getPoints(), function (point) {
              return point.clone(lookupTable);
            })
          );
          if (this.sourcePort) {
            clone.setSourcePort(this.sourcePort.clone(lookupTable));
          }
          if (this.targetPort) {
            clone.setTargetPort(this.targetPort.clone(lookupTable));
          }
        };
        LinkModel.prototype.remove = function () {
          if (this.sourcePort) {
            this.sourcePort.removeLink(this);
          }
          if (this.targetPort) {
            this.targetPort.removeLink(this);
          }
          _super.prototype.remove.call(this);
        };
        LinkModel.prototype.isLastPoint = function (point) {
          var index = this.getPointIndex(point);
          return index === this.points.length - 1;
        };
        LinkModel.prototype.getPointIndex = function (point) {
          return this.points.indexOf(point);
        };
        LinkModel.prototype.getPointModel = function (id) {
          for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].id === id) {
              return this.points[i];
            }
          }
          return null;
        };
        LinkModel.prototype.getPortForPoint = function (point) {
          if (this.sourcePort !== null && this.getFirstPoint().getID() === point.getID()) {
            return this.sourcePort;
          }
          if (this.targetPort !== null && this.getLastPoint().getID() === point.getID()) {
            return this.targetPort;
          }
          return null;
        };
        LinkModel.prototype.getPointForPort = function (port) {
          if (this.sourcePort !== null && this.sourcePort.getID() === port.getID()) {
            return this.getFirstPoint();
          }
          if (this.targetPort !== null && this.targetPort.getID() === port.getID()) {
            return this.getLastPoint();
          }
          return null;
        };
        LinkModel.prototype.getFirstPoint = function () {
          return this.points[0];
        };
        LinkModel.prototype.getLastPoint = function () {
          return this.points[this.points.length - 1];
        };
        LinkModel.prototype.setSourcePort = function (port) {
          if (port !== null) {
            port.addLink(this);
          }
          if (this.sourcePort !== null) {
            this.sourcePort.removeLink(this);
          }
          this.sourcePort = port;
          this.iterateListeners(function (listener, event) {
            if (listener.sourcePortChanged) {
              listener.sourcePortChanged(__assign({}, event, { port: port }));
            }
          });
        };
        LinkModel.prototype.getSourcePort = function () {
          return this.sourcePort;
        };
        LinkModel.prototype.getTargetPort = function () {
          return this.targetPort;
        };
        LinkModel.prototype.setTargetPort = function (port) {
          if (port !== null) {
            port.addLink(this);
          }
          if (this.targetPort !== null) {
            this.targetPort.removeLink(this);
          }
          this.targetPort = port;
          this.iterateListeners(function (listener, event) {
            if (listener.targetPortChanged) {
              listener.targetPortChanged(__assign({}, event, { port: port }));
            }
          });
        };
        LinkModel.prototype.point = function (x, y) {
          return this.addPoint(this.generatePoint(x, y));
        };
        LinkModel.prototype.addLabel = function (label) {
          label.setParent(this);
          this.labels.push(label);
        };
        LinkModel.prototype.getPoints = function () {
          return this.points;
        };
        LinkModel.prototype.setPoints = function (points) {
          var _this = this;
          _.forEach(points, function (point) {
            point.setParent(_this);
          });
          this.points = points;
        };
        LinkModel.prototype.removePoint = function (pointModel) {
          this.points.splice(this.getPointIndex(pointModel), 1);
        };
        LinkModel.prototype.removePointsBefore = function (pointModel) {
          this.points.splice(0, this.getPointIndex(pointModel));
        };
        LinkModel.prototype.removePointsAfter = function (pointModel) {
          this.points.splice(this.getPointIndex(pointModel) + 1);
        };
        LinkModel.prototype.removeMiddlePoints = function () {
          if (this.points.length > 2) {
            this.points.splice(0, this.points.length - 2);
          }
        };
        LinkModel.prototype.addPoint = function (pointModel, index) {
          if (index === void 0) {
            index = 1;
          }
          pointModel.setParent(this);
          this.points.splice(index, 0, pointModel);
          return pointModel;
        };
        LinkModel.prototype.generatePoint = function (x, y) {
          if (x === void 0) {
            x = 0;
          }
          if (y === void 0) {
            y = 0;
          }
          return new PointModel_1.PointModel(this, { x: x, y: y });
        };
        return LinkModel;
      })(BaseModel_1.BaseModel);
      exports.LinkModel = LinkModel;
    },
    function (module, exports, __webpack_require__) {
      var Heap = __webpack_require__(15);
      var Util = __webpack_require__(4);
      var Heuristic = __webpack_require__(10);
      var DiagonalMovement = __webpack_require__(2);

      function BiAStarFinder(opt) {
        opt = opt || {};
        this.allowDiagonal = opt.allowDiagonal;
        this.dontCrossCorners = opt.dontCrossCorners;
        this.diagonalMovement = opt.diagonalMovement;
        this.heuristic = opt.heuristic || Heuristic.manhattan;
        this.weight = opt.weight || 1;
        if (!this.diagonalMovement) {
          if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
          } else {
            if (this.dontCrossCorners) {
              this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
              this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
          }
        }
        if (this.diagonalMovement === DiagonalMovement.Never) {
          this.heuristic = opt.heuristic || Heuristic.manhattan;
        } else {
          this.heuristic = opt.heuristic || Heuristic.octile;
        }
      }

      BiAStarFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
        var cmp = function (nodeA, nodeB) {
            return nodeA.f - nodeB.f;
          },
          startOpenList = new Heap(cmp),
          endOpenList = new Heap(cmp),
          startNode = grid.getNodeAt(startX, startY),
          endNode = grid.getNodeAt(endX, endY),
          heuristic = this.heuristic,
          diagonalMovement = this.diagonalMovement,
          weight = this.weight,
          abs = Math.abs,
          SQRT2 = Math.SQRT2,
          node,
          neighbors,
          neighbor,
          i,
          l,
          x,
          y,
          ng,
          BY_START = 1,
          BY_END = 2;
        startNode.g = 0;
        startNode.f = 0;
        startOpenList.push(startNode);
        startNode.opened = BY_START;
        endNode.g = 0;
        endNode.f = 0;
        endOpenList.push(endNode);
        endNode.opened = BY_END;
        while (!startOpenList.empty() && !endOpenList.empty()) {
          node = startOpenList.pop();
          node.closed = true;
          neighbors = grid.getNeighbors(node, diagonalMovement);
          for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];
            if (neighbor.closed) {
              continue;
            }
            if (neighbor.opened === BY_END) {
              return Util.biBacktrace(node, neighbor);
            }
            x = neighbor.x;
            y = neighbor.y;
            ng = node.g + (x - node.x === 0 || y - node.y === 0 ? 1 : SQRT2);
            if (!neighbor.opened || ng < neighbor.g) {
              neighbor.g = ng;
              neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.parent = node;
              if (!neighbor.opened) {
                startOpenList.push(neighbor);
                neighbor.opened = BY_START;
              } else {
                startOpenList.updateItem(neighbor);
              }
            }
          }
          node = endOpenList.pop();
          node.closed = true;
          neighbors = grid.getNeighbors(node, diagonalMovement);
          for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];
            if (neighbor.closed) {
              continue;
            }
            if (neighbor.opened === BY_START) {
              return Util.biBacktrace(neighbor, node);
            }
            x = neighbor.x;
            y = neighbor.y;
            ng = node.g + (x - node.x === 0 || y - node.y === 0 ? 1 : SQRT2);
            if (!neighbor.opened || ng < neighbor.g) {
              neighbor.g = ng;
              neighbor.h = neighbor.h || weight * heuristic(abs(x - startX), abs(y - startY));
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.parent = node;
              if (!neighbor.opened) {
                endOpenList.push(neighbor);
                neighbor.opened = BY_END;
              } else {
                endOpenList.updateItem(neighbor);
              }
            }
          }
        }
        return [];
      };
      module.exports = BiAStarFinder;
    },
    function (module, exports, __webpack_require__) {
      var Heap = __webpack_require__(15);
      var Util = __webpack_require__(4);
      var Heuristic = __webpack_require__(10);
      var DiagonalMovement = __webpack_require__(2);

      function AStarFinder(opt) {
        opt = opt || {};
        this.allowDiagonal = opt.allowDiagonal;
        this.dontCrossCorners = opt.dontCrossCorners;
        this.heuristic = opt.heuristic || Heuristic.manhattan;
        this.weight = opt.weight || 1;
        this.diagonalMovement = opt.diagonalMovement;
        if (!this.diagonalMovement) {
          if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
          } else {
            if (this.dontCrossCorners) {
              this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
              this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
          }
        }
        if (this.diagonalMovement === DiagonalMovement.Never) {
          this.heuristic = opt.heuristic || Heuristic.manhattan;
        } else {
          this.heuristic = opt.heuristic || Heuristic.octile;
        }
      }

      AStarFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
        var openList = new Heap(function (nodeA, nodeB) {
            return nodeA.f - nodeB.f;
          }),
          startNode = grid.getNodeAt(startX, startY),
          endNode = grid.getNodeAt(endX, endY),
          heuristic = this.heuristic,
          diagonalMovement = this.diagonalMovement,
          weight = this.weight,
          abs = Math.abs,
          SQRT2 = Math.SQRT2,
          node,
          neighbors,
          neighbor,
          i,
          l,
          x,
          y,
          ng;
        startNode.g = 0;
        startNode.f = 0;
        openList.push(startNode);
        startNode.opened = true;
        while (!openList.empty()) {
          node = openList.pop();
          node.closed = true;
          if (node === endNode) {
            return Util.backtrace(endNode);
          }
          neighbors = grid.getNeighbors(node, diagonalMovement);
          for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];
            if (neighbor.closed) {
              continue;
            }
            x = neighbor.x;
            y = neighbor.y;
            ng = node.g + (x - node.x === 0 || y - node.y === 0 ? 1 : SQRT2);
            if (!neighbor.opened || ng < neighbor.g) {
              neighbor.g = ng;
              neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.parent = node;
              if (!neighbor.opened) {
                openList.push(neighbor);
                neighbor.opened = true;
              } else {
                openList.updateItem(neighbor);
              }
            }
          }
        }
        return [];
      };
      module.exports = AStarFinder;
    },
    function (module, exports) {
      function Node(x, y, walkable) {
        this.x = x;
        this.y = y;
        this.walkable = walkable === undefined ? true : walkable;
      }

      module.exports = Node;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var BaseWidget_1 = __webpack_require__(3);
      var NodeWidget = (function (_super) {
        __extends(NodeWidget, _super);

        function NodeWidget(props) {
          var _this = _super.call(this, 'srd-node', props) || this;
          _this.state = {};
          return _this;
        }

        NodeWidget.prototype.shouldComponentUpdate = function () {
          return this.props.diagramEngine.canEntityRepaint(this.props.node);
        };
        NodeWidget.prototype.getClassName = function () {
          return 'node ' + _super.prototype.getClassName.call(this) + (this.props.node.isSelected() ? this.bem('--selected') : '');
        };
        NodeWidget.prototype.render = function () {
          return React.createElement(
            'div',
            __assign({}, this.getProps(), {
              'data-nodeid': this.props.node.id,
              style: { top: this.props.node.y, left: this.props.node.x },
            }),
            this.props.children
          );
        };
        return NodeWidget;
      })(BaseWidget_1.BaseWidget);
      exports.NodeWidget = NodeWidget;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var _ = require('lodash');
      var NodeWidget_1 = __webpack_require__(25);
      var BaseWidget_1 = __webpack_require__(3);
      var NodeLayerWidget = (function (_super) {
        __extends(NodeLayerWidget, _super);

        function NodeLayerWidget(props) {
          var _this = _super.call(this, 'srd-node-layer', props) || this;
          _this.updateNodeDimensions = function () {
            if (!_this.props.diagramEngine.nodesRendered) {
              var diagramModel = _this.props.diagramEngine.getDiagramModel();
              _.map(diagramModel.getNodes(), function (node) {
                node.updateDimensions(_this.props.diagramEngine.getNodeDimensions(node));
              });
            }
          };
          _this.state = {};
          return _this;
        }

        NodeLayerWidget.prototype.componentDidUpdate = function () {
          this.updateNodeDimensions();
          this.props.diagramEngine.nodesRendered = true;
        };
        NodeLayerWidget.prototype.render = function () {
          var _this = this;
          var diagramModel = this.props.diagramEngine.getDiagramModel();
          return React.createElement(
            'div',
            __assign({}, this.getProps(), {
              style: {
                transform:
                  'translate(' + diagramModel.getOffsetX() + 'px,' + diagramModel.getOffsetY() + 'px) scale(' + diagramModel.getZoomLevel() / 100 + ')',
              },
            }),
            _.map(diagramModel.getNodes(), function (node) {
              return React.createElement(
                NodeWidget_1.NodeWidget,
                {
                  diagramEngine: _this.props.diagramEngine,
                  key: node.id,
                  node: node,
                },
                _this.props.diagramEngine.generateWidgetForNode(node)
              );
            })
          );
        };
        return NodeLayerWidget;
      })(BaseWidget_1.BaseWidget);
      exports.NodeLayerWidget = NodeLayerWidget;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseWidget_1 = __webpack_require__(3);
      var LinkWidget = (function (_super) {
        __extends(LinkWidget, _super);

        function LinkWidget(props) {
          var _this = _super.call(this, 'srd-link', props) || this;
          _this.state = {};
          return _this;
        }

        LinkWidget.prototype.shouldComponentUpdate = function () {
          return this.props.diagramEngine.canEntityRepaint(this.props.link);
        };
        LinkWidget.prototype.render = function () {
          return this.props.children;
        };
        return LinkWidget;
      })(BaseWidget_1.BaseWidget);
      exports.LinkWidget = LinkWidget;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var LinkWidget_1 = __webpack_require__(27);
      var _ = require('lodash');
      var BaseWidget_1 = __webpack_require__(3);
      var LinkLayerWidget = (function (_super) {
        __extends(LinkLayerWidget, _super);

        function LinkLayerWidget(props) {
          var _this = _super.call(this, 'srd-link-layer', props) || this;
          _this.state = {};
          return _this;
        }

        LinkLayerWidget.prototype.render = function () {
          var _this = this;
          var diagramModel = this.props.diagramEngine.getDiagramModel();
          return React.createElement(
            'svg',
            __assign({}, this.getProps(), {
              style: {
                transform:
                  'translate(' + diagramModel.getOffsetX() + 'px,' + diagramModel.getOffsetY() + 'px) scale(' + diagramModel.getZoomLevel() / 100 + ')',
              },
            }),
            this.props.diagramEngine.canvas &&
              _.map(diagramModel.getLinks(), function (link) {
                if (_this.props.diagramEngine.nodesRendered && !_this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id]) {
                  if (link.sourcePort !== null) {
                    try {
                      var portCenter = _this.props.diagramEngine.getPortCenter(link.sourcePort);
                      link.points[0].updateLocation(portCenter);
                      var portCoords = _this.props.diagramEngine.getPortCoords(link.sourcePort);
                      link.sourcePort.updateCoords(portCoords);
                      _this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id] = true;
                    } catch (ignore) {}
                  }
                  if (link.targetPort !== null) {
                    try {
                      var portCenter = _this.props.diagramEngine.getPortCenter(link.targetPort);
                      _.last(link.points).updateLocation(portCenter);
                      var portCoords = _this.props.diagramEngine.getPortCoords(link.targetPort);
                      link.targetPort.updateCoords(portCoords);
                      _this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id] = true;
                    } catch (ignore) {}
                  }
                }
                var generatedLink = _this.props.diagramEngine.generateWidgetForLink(link);
                if (!generatedLink) {
                  throw new Error('no link generated for type: ' + link.getType());
                }
                return React.createElement(
                  LinkWidget_1.LinkWidget,
                  {
                    key: link.getID(),
                    link: link,
                    diagramEngine: _this.props.diagramEngine,
                  },
                  React.cloneElement(generatedLink, { pointAdded: _this.props.pointAdded })
                );
              })
          );
        };
        return LinkLayerWidget;
      })(BaseWidget_1.BaseWidget);
      exports.LinkLayerWidget = LinkLayerWidget;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseAction_1 = __webpack_require__(11);
      var SelectingAction = (function (_super) {
        __extends(SelectingAction, _super);

        function SelectingAction(mouseX, mouseY) {
          var _this = _super.call(this, mouseX, mouseY) || this;
          _this.mouseX2 = mouseX;
          _this.mouseY2 = mouseY;
          return _this;
        }

        SelectingAction.prototype.getBoxDimensions = function () {
          return {
            left: this.mouseX2 > this.mouseX ? this.mouseX : this.mouseX2,
            top: this.mouseY2 > this.mouseY ? this.mouseY : this.mouseY2,
            width: Math.abs(this.mouseX2 - this.mouseX),
            height: Math.abs(this.mouseY2 - this.mouseY),
            right: this.mouseX2 < this.mouseX ? this.mouseX : this.mouseX2,
            bottom: this.mouseY2 < this.mouseY ? this.mouseY : this.mouseY2,
          };
        };
        SelectingAction.prototype.containsElement = function (x, y, diagramModel) {
          var z = diagramModel.getZoomLevel() / 100;
          var dimensions = this.getBoxDimensions();
          return (
            x * z + diagramModel.getOffsetX() > dimensions.left &&
            x * z + diagramModel.getOffsetX() < dimensions.right &&
            y * z + diagramModel.getOffsetY() > dimensions.top &&
            y * z + diagramModel.getOffsetY() < dimensions.bottom
          );
        };
        return SelectingAction;
      })(BaseAction_1.BaseAction);
      exports.SelectingAction = SelectingAction;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseAction_1 = __webpack_require__(11);
      var MoveItemsAction = (function (_super) {
        __extends(MoveItemsAction, _super);

        function MoveItemsAction(mouseX, mouseY, diagramEngine) {
          var _this = _super.call(this, mouseX, mouseY) || this;
          _this.moved = false;
          diagramEngine.enableRepaintEntities(diagramEngine.getDiagramModel().getSelectedItems());
          var selectedItems = diagramEngine.getDiagramModel().getSelectedItems();
          selectedItems = selectedItems.filter(function (item) {
            return !diagramEngine.isModelLocked(item);
          });
          _this.selectionModels = selectedItems.map(function (item) {
            return { model: item, initialX: item.x, initialY: item.y };
          });
          return _this;
        }

        return MoveItemsAction;
      })(BaseAction_1.BaseAction);
      exports.MoveItemsAction = MoveItemsAction;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseAction_1 = __webpack_require__(11);
      var MoveCanvasAction = (function (_super) {
        __extends(MoveCanvasAction, _super);

        function MoveCanvasAction(mouseX, mouseY, diagramModel) {
          var _this = _super.call(this, mouseX, mouseY) || this;
          _this.initialOffsetX = diagramModel.getOffsetX();
          _this.initialOffsetY = diagramModel.getOffsetY();
          return _this;
        }

        return MoveCanvasAction;
      })(BaseAction_1.BaseAction);
      exports.MoveCanvasAction = MoveCanvasAction;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var AbstractFactory_1 = __webpack_require__(8);
      var AbstractNodeFactory = (function (_super) {
        __extends(AbstractNodeFactory, _super);

        function AbstractNodeFactory() {
          return (_super !== null && _super.apply(this, arguments)) || this;
        }

        return AbstractNodeFactory;
      })(AbstractFactory_1.AbstractFactory);
      exports.AbstractNodeFactory = AbstractNodeFactory;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var BaseWidget_1 = __webpack_require__(3);
      var PortWidget = (function (_super) {
        __extends(PortWidget, _super);

        function PortWidget(props) {
          var _this = _super.call(this, 'srd-port', props) || this;
          _this.state = { selected: false };
          return _this;
        }

        PortWidget.prototype.getClassName = function () {
          return 'port ' + _super.prototype.getClassName.call(this) + (this.state.selected ? this.bem('--selected') : '');
        };
        PortWidget.prototype.render = function () {
          var _this = this;
          return React.createElement(
            'div',
            __assign({}, this.getProps(), {
              onMouseEnter: function () {
                _this.setState({ selected: true });
              },
              onMouseLeave: function () {
                _this.setState({ selected: false });
              },
              'data-name': this.props.name,
              'data-nodeid': this.props.node.getID(),
            })
          );
        };
        return PortWidget;
      })(BaseWidget_1.BaseWidget);
      exports.PortWidget = PortWidget;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var PortWidget_1 = __webpack_require__(33);
      var BaseWidget_1 = __webpack_require__(3);
      var DefaultPortLabel = (function (_super) {
        __extends(DefaultPortLabel, _super);

        function DefaultPortLabel(props) {
          return _super.call(this, 'srd-default-port', props) || this;
        }

        DefaultPortLabel.prototype.getClassName = function () {
          return _super.prototype.getClassName.call(this) + (this.props.model.in ? this.bem('--in') : this.bem('--out'));
        };
        DefaultPortLabel.prototype.render = function () {
          var port = React.createElement(PortWidget_1.PortWidget, {
            node: this.props.model.getParent(),
            name: this.props.model.name,
          });
          var label = React.createElement('div', { className: 'name' }, this.props.model.label);
          return React.createElement('div', __assign({}, this.getProps()), this.props.model.in ? port : label, this.props.model.in ? label : port);
        };
        return DefaultPortLabel;
      })(BaseWidget_1.BaseWidget);
      exports.DefaultPortLabel = DefaultPortLabel;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var _ = require('lodash');
      var DefaultPortLabelWidget_1 = __webpack_require__(34);
      var BaseWidget_1 = __webpack_require__(3);
      var DefaultNodeWidget = (function (_super) {
        __extends(DefaultNodeWidget, _super);

        function DefaultNodeWidget(props) {
          var _this = _super.call(this, 'srd-default-node', props) || this;
          _this.state = {};
          return _this;
        }

        DefaultNodeWidget.prototype.generatePort = function (port) {
          return React.createElement(DefaultPortLabelWidget_1.DefaultPortLabel, { model: port, key: port.id });
        };
        DefaultNodeWidget.prototype.render = function () {
          return React.createElement(
            'div',
            __assign({}, this.getProps(), { style: { background: this.props.node.color } }),
            React.createElement('div', { className: this.bem('__title') }, React.createElement('div', { className: this.bem('__name') }, this.props.node.name)),
            React.createElement(
              'div',
              { className: this.bem('__ports') },
              React.createElement('div', { className: this.bem('__in') }, _.map(this.props.node.getInPorts(), this.generatePort.bind(this))),
              React.createElement('div', { className: this.bem('__out') }, _.map(this.props.node.getOutPorts(), this.generatePort.bind(this)))
            )
          );
        };
        return DefaultNodeWidget;
      })(BaseWidget_1.BaseWidget);
      exports.DefaultNodeWidget = DefaultNodeWidget;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var AbstractFactory_1 = __webpack_require__(8);
      var AbstractLinkFactory = (function (_super) {
        __extends(AbstractLinkFactory, _super);

        function AbstractLinkFactory() {
          return (_super !== null && _super.apply(this, arguments)) || this;
        }

        return AbstractLinkFactory;
      })(AbstractFactory_1.AbstractFactory);
      exports.AbstractLinkFactory = AbstractLinkFactory;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var PointModel_1 = __webpack_require__(5);
      var Toolkit_1 = __webpack_require__(7);
      var PathFinding_1 = __webpack_require__(16);
      var _ = require('lodash');
      var BaseWidget_1 = __webpack_require__(3);
      var DefaultLinkWidget = (function (_super) {
        __extends(DefaultLinkWidget, _super);

        function DefaultLinkWidget(props) {
          var _this = _super.call(this, 'srd-default-link', props) || this;
          _this.addPointToLink = function (event, index) {
            if (
              !event.shiftKey &&
              !_this.props.diagramEngine.isModelLocked(_this.props.link) &&
              _this.props.link.points.length - 1 <= _this.props.diagramEngine.getMaxNumberPointsPerLink()
            ) {
              var point = new PointModel_1.PointModel(_this.props.link, _this.props.diagramEngine.getRelativeMousePoint(event));
              point.setSelected(true);
              _this.forceUpdate();
              _this.props.link.addPoint(point, index);
              _this.props.pointAdded(point, event);
            }
          };
          _this.findPathAndRelativePositionToRenderLabel = function (index) {
            var lengths = _this.refPaths.map(function (path) {
              return path.getTotalLength();
            });
            var labelPosition =
              lengths.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue;
              }, 0) *
              (index / (_this.props.link.labels.length + 1));
            var pathIndex = 0;
            while (pathIndex < _this.refPaths.length) {
              if (labelPosition - lengths[pathIndex] < 0) {
                return { path: _this.refPaths[pathIndex], position: labelPosition };
              }
              labelPosition -= lengths[pathIndex];
              pathIndex++;
            }
          };
          _this.calculateLabelPosition = function (label, index) {
            if (!_this.refLabels[label.id]) {
              return;
            }
            var _a = _this.findPathAndRelativePositionToRenderLabel(index),
              path = _a.path,
              position = _a.position;
            var labelDimensions = {
              width: _this.refLabels[label.id].offsetWidth,
              height: _this.refLabels[label.id].offsetHeight,
            };
            var pathCentre = path.getPointAtLength(position);
            var labelCoordinates = {
              x: pathCentre.x - labelDimensions.width / 2 + label.offsetX,
              y: pathCentre.y - labelDimensions.height / 2 + label.offsetY,
            };
            _this.refLabels[label.id].setAttribute('style', 'transform: translate(' + labelCoordinates.x + 'px, ' + labelCoordinates.y + 'px);');
          };
          _this.refLabels = {};
          _this.refPaths = [];
          _this.state = { selected: false };
          if (props.diagramEngine.isSmartRoutingEnabled()) {
            _this.pathFinding = new PathFinding_1.default(_this.props.diagramEngine);
          }
          return _this;
        }

        DefaultLinkWidget.prototype.calculateAllLabelPosition = function () {
          var _this = this;
          _.forEach(this.props.link.labels, function (label, index) {
            _this.calculateLabelPosition(label, index + 1);
          });
        };
        DefaultLinkWidget.prototype.componentDidUpdate = function () {
          if (this.props.link.labels.length > 0) {
            window.requestAnimationFrame(this.calculateAllLabelPosition.bind(this));
          }
        };
        DefaultLinkWidget.prototype.componentDidMount = function () {
          if (this.props.link.labels.length > 0) {
            window.requestAnimationFrame(this.calculateAllLabelPosition.bind(this));
          }
        };
        DefaultLinkWidget.prototype.generatePoint = function (pointIndex) {
          var _this = this;
          var x = this.props.link.points[pointIndex].x;
          var y = this.props.link.points[pointIndex].y;
          return React.createElement(
            'g',
            { key: 'point-' + this.props.link.points[pointIndex].id },
            React.createElement('circle', {
              cx: x,
              cy: y,
              r: 5,
              className: 'point ' + this.bem('__point') + (this.props.link.points[pointIndex].isSelected() ? this.bem('--point-selected') : ''),
            }),
            React.createElement('circle', {
              onMouseLeave: function () {
                _this.setState({ selected: false });
              },
              onMouseEnter: function () {
                _this.setState({ selected: true });
              },
              'data-id': this.props.link.points[pointIndex].id,
              'data-linkid': this.props.link.id,
              cx: x,
              cy: y,
              r: 15,
              opacity: 0,
              className: 'point ' + this.bem('__point'),
            })
          );
        };
        DefaultLinkWidget.prototype.generateLabel = function (label) {
          var _this = this;
          var canvas = this.props.diagramEngine.canvas;
          return React.createElement(
            'foreignObject',
            {
              key: label.id,
              className: this.bem('__label'),
              width: canvas.offsetWidth,
              height: canvas.offsetHeight,
            },
            React.createElement(
              'div',
              {
                ref: function (ref) {
                  return (_this.refLabels[label.id] = ref);
                },
              },
              this.props.diagramEngine.getFactoryForLabel(label).generateReactWidget(this.props.diagramEngine, label)
            )
          );
        };
        DefaultLinkWidget.prototype.generateLink = function (path, extraProps, id) {
          var _this = this;
          var props = this.props;
          var Bottom = React.cloneElement(
            props.diagramEngine
              .getFactoryForLink(this.props.link)
              .generateLinkSegment(this.props.link, this, this.state.selected || this.props.link.isSelected(), path),
            {
              ref: function (ref) {
                return ref && _this.refPaths.push(ref);
              },
            }
          );
          var Top = React.cloneElement(
            Bottom,
            __assign({}, extraProps, {
              strokeLinecap: 'round',
              onMouseLeave: function () {
                _this.setState({ selected: false });
              },
              onMouseEnter: function () {
                _this.setState({ selected: true });
              },
              ref: null,
              'data-linkid': this.props.link.getID(),
              strokeOpacity: this.state.selected ? 0.1 : 0,
              strokeWidth: 20,
              onContextMenu: function () {
                if (!_this.props.diagramEngine.isModelLocked(_this.props.link)) {
                  event.preventDefault();
                  _this.props.link.remove();
                }
              },
            })
          );
          return React.createElement('g', { key: 'link-' + id }, Bottom, Top);
        };
        DefaultLinkWidget.prototype.isSmartRoutingApplicable = function () {
          var _a = this.props,
            diagramEngine = _a.diagramEngine,
            link = _a.link;
          if (!diagramEngine.isSmartRoutingEnabled()) {
            return false;
          }
          if (link.points.length !== 2) {
            return false;
          }
          if (link.sourcePort === null || link.targetPort === null) {
            return false;
          }
          return true;
        };
        DefaultLinkWidget.prototype.render = function () {
          var _this = this;
          var diagramEngine = this.props.diagramEngine;
          if (!diagramEngine.nodesRendered) {
            return null;
          }
          var points = this.props.link.points;
          var paths = [];
          if (this.isSmartRoutingApplicable()) {
            var directPathCoords = this.pathFinding.calculateDirectPath(_.first(points), _.last(points));
            var routingMatrix = diagramEngine.getRoutingMatrix();
            var smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);
            if (smartLink) {
              var start = smartLink.start,
                end = smartLink.end,
                pathToStart = smartLink.pathToStart,
                pathToEnd = smartLink.pathToEnd;
              var simplifiedPath = this.pathFinding.calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd);
              paths.push(
                this.generateLink(
                  Toolkit_1.Toolkit.generateDynamicPath(simplifiedPath),
                  {
                    onMouseDown: function (event) {
                      _this.addPointToLink(event, 1);
                    },
                  },
                  '0'
                )
              );
            }
          }
          if (paths.length === 0) {
            if (points.length === 2) {
              var isHorizontal = Math.abs(points[0].x - points[1].x) > Math.abs(points[0].y - points[1].y);
              var xOrY = isHorizontal ? 'x' : 'y';
              var margin = 50;
              if (Math.abs(points[0][xOrY] - points[1][xOrY]) < 50) {
                margin = 5;
              }
              var pointLeft = points[0];
              var pointRight = points[1];
              if (pointLeft[xOrY] > pointRight[xOrY]) {
                pointLeft = points[1];
                pointRight = points[0];
              }
              paths.push(
                this.generateLink(
                  Toolkit_1.Toolkit.generateCurvePath(pointLeft, pointRight, this.props.link.curvyness),
                  {
                    onMouseDown: function (event) {
                      _this.addPointToLink(event, 1);
                    },
                  },
                  '0'
                )
              );
              if (this.props.link.targetPort === null) {
                paths.push(this.generatePoint(1));
              }
            } else {
              var _loop_1 = function (j) {
                paths.push(
                  this_1.generateLink(
                    Toolkit_1.Toolkit.generateLinePath(points[j], points[j + 1]),
                    {
                      'data-linkid': this_1.props.link.id,
                      'data-point': j,
                      onMouseDown: function (event) {
                        _this.addPointToLink(event, j + 1);
                      },
                    },
                    j
                  )
                );
              };
              var this_1 = this;
              for (var j = 0; j < points.length - 1; j++) {
                _loop_1(j);
              }
              for (var i = 1; i < points.length - 1; i++) {
                paths.push(this.generatePoint(i));
              }
              if (this.props.link.targetPort === null) {
                paths.push(this.generatePoint(points.length - 1));
              }
            }
          }
          this.refPaths = [];
          return React.createElement(
            'g',
            __assign({}, this.getProps()),
            paths,
            _.map(this.props.link.labels, function (labelModel) {
              return _this.generateLabel(labelModel);
            })
          );
        };
        DefaultLinkWidget.defaultProps = {
          color: 'black',
          width: 3,
          link: null,
          engine: null,
          smooth: false,
          diagramEngine: null,
        };
        return DefaultLinkWidget;
      })(BaseWidget_1.BaseWidget);
      exports.DefaultLinkWidget = DefaultLinkWidget;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var DefaultPortModel_1 = __webpack_require__(20);
      var _ = require('lodash');
      var NodeModel_1 = __webpack_require__(9);
      var Toolkit_1 = __webpack_require__(7);
      var DefaultNodeModel = (function (_super) {
        __extends(DefaultNodeModel, _super);

        function DefaultNodeModel(name, color) {
          if (name === void 0) {
            name = 'Untitled';
          }
          if (color === void 0) {
            color = 'rgb(0,192,255)';
          }
          var _this = _super.call(this, 'default') || this;
          _this.name = name;
          _this.color = color;
          return _this;
        }

        DefaultNodeModel.prototype.addInPort = function (label) {
          return this.addPort(new DefaultPortModel_1.DefaultPortModel(true, Toolkit_1.Toolkit.UID(), label));
        };
        DefaultNodeModel.prototype.addOutPort = function (label) {
          return this.addPort(new DefaultPortModel_1.DefaultPortModel(false, Toolkit_1.Toolkit.UID(), label));
        };
        DefaultNodeModel.prototype.deSerialize = function (object, engine) {
          _super.prototype.deSerialize.call(this, object, engine);
          this.name = object.name;
          this.color = object.color;
        };
        DefaultNodeModel.prototype.serialize = function () {
          return _.merge(_super.prototype.serialize.call(this), { name: this.name, color: this.color });
        };
        DefaultNodeModel.prototype.getInPorts = function () {
          return _.filter(this.ports, function (portModel) {
            return portModel.in;
          });
        };
        DefaultNodeModel.prototype.getOutPorts = function () {
          return _.filter(this.ports, function (portModel) {
            return !portModel.in;
          });
        };
        return DefaultNodeModel;
      })(NodeModel_1.NodeModel);
      exports.DefaultNodeModel = DefaultNodeModel;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var BaseWidget_1 = __webpack_require__(3);
      var DefaultLabelWidget = (function (_super) {
        __extends(DefaultLabelWidget, _super);

        function DefaultLabelWidget(props) {
          return _super.call(this, 'srd-default-label', props) || this;
        }

        DefaultLabelWidget.prototype.render = function () {
          return React.createElement('div', __assign({}, this.getProps()), this.props.model.label);
        };
        return DefaultLabelWidget;
      })(BaseWidget_1.BaseWidget);
      exports.DefaultLabelWidget = DefaultLabelWidget;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var AbstractFactory_1 = __webpack_require__(8);
      var AbstractLabelFactory = (function (_super) {
        __extends(AbstractLabelFactory, _super);

        function AbstractLabelFactory() {
          return (_super !== null && _super.apply(this, arguments)) || this;
        }

        return AbstractLabelFactory;
      })(AbstractFactory_1.AbstractFactory);
      exports.AbstractLabelFactory = AbstractLabelFactory;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var AbstractLabelFactory_1 = __webpack_require__(40);
      var DefaultLabelModel_1 = __webpack_require__(18);
      var DefaultLabelWidget_1 = __webpack_require__(39);
      var DefaultLabelFactory = (function (_super) {
        __extends(DefaultLabelFactory, _super);

        function DefaultLabelFactory() {
          return _super.call(this, 'default') || this;
        }

        DefaultLabelFactory.prototype.generateReactWidget = function (diagramEngine, label) {
          return React.createElement(DefaultLabelWidget_1.DefaultLabelWidget, { model: label });
        };
        DefaultLabelFactory.prototype.getNewInstance = function (initialConfig) {
          return new DefaultLabelModel_1.DefaultLabelModel();
        };
        return DefaultLabelFactory;
      })(AbstractLabelFactory_1.AbstractLabelFactory);
      exports.DefaultLabelFactory = DefaultLabelFactory;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var AbstractFactory_1 = __webpack_require__(8);
      var AbstractPortFactory = (function (_super) {
        __extends(AbstractPortFactory, _super);

        function AbstractPortFactory() {
          return (_super !== null && _super.apply(this, arguments)) || this;
        }

        return AbstractPortFactory;
      })(AbstractFactory_1.AbstractFactory);
      exports.AbstractPortFactory = AbstractPortFactory;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var DefaultPortModel_1 = __webpack_require__(20);
      var AbstractPortFactory_1 = __webpack_require__(42);
      var DefaultPortFactory = (function (_super) {
        __extends(DefaultPortFactory, _super);

        function DefaultPortFactory() {
          return _super.call(this, 'default') || this;
        }

        DefaultPortFactory.prototype.getNewInstance = function (initialConfig) {
          return new DefaultPortModel_1.DefaultPortModel(true, 'unknown');
        };
        return DefaultPortFactory;
      })(AbstractPortFactory_1.AbstractPortFactory);
      exports.DefaultPortFactory = DefaultPortFactory;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseEntity_1 = __webpack_require__(13);
      var _ = require('lodash');
      var LinkModel_1 = __webpack_require__(21);
      var NodeModel_1 = __webpack_require__(9);
      var PortModel_1 = __webpack_require__(12);
      var PointModel_1 = __webpack_require__(5);
      var DiagramModel = (function (_super) {
        __extends(DiagramModel, _super);

        function DiagramModel() {
          var _this = _super.call(this) || this;
          _this.links = {};
          _this.nodes = {};
          _this.offsetX = 0;
          _this.offsetY = 0;
          _this.zoom = 100;
          _this.rendered = false;
          _this.gridSize = 0;
          return _this;
        }

        DiagramModel.prototype.setGridSize = function (size) {
          if (size === void 0) {
            size = 0;
          }
          this.gridSize = size;
          this.iterateListeners(function (listener, event) {
            if (listener.gridUpdated) {
              listener.gridUpdated(__assign({}, event, { size: size }));
            }
          });
        };
        DiagramModel.prototype.getGridPosition = function (pos) {
          if (this.gridSize === 0) {
            return pos;
          }
          return this.gridSize * Math.floor((pos + this.gridSize / 2) / this.gridSize);
        };
        DiagramModel.prototype.deSerializeDiagram = function (object, diagramEngine) {
          var _this = this;
          this.deSerialize(object, diagramEngine);
          this.offsetX = object.offsetX;
          this.offsetY = object.offsetY;
          this.zoom = object.zoom;
          this.gridSize = object.gridSize;
          _.forEach(object.nodes, function (node) {
            var nodeOb = diagramEngine.getNodeFactory(node.type).getNewInstance(node);
            nodeOb.setParent(_this);
            nodeOb.deSerialize(node, diagramEngine);
            _this.addNode(nodeOb);
          });
          _.forEach(object.links, function (link) {
            var linkOb = diagramEngine.getLinkFactory(link.type).getNewInstance();
            linkOb.setParent(_this);
            linkOb.deSerialize(link, diagramEngine);
            _this.addLink(linkOb);
          });
        };
        DiagramModel.prototype.serializeDiagram = function () {
          return _.merge(this.serialize(), {
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            zoom: this.zoom,
            gridSize: this.gridSize,
            links: _.map(this.links, function (link) {
              return link.serialize();
            }),
            nodes: _.map(this.nodes, function (node) {
              return node.serialize();
            }),
          });
        };
        DiagramModel.prototype.clearSelection = function (ignore) {
          if (ignore === void 0) {
            ignore = null;
          }
          _.forEach(this.getSelectedItems(), function (element) {
            if (ignore && ignore.getID() === element.getID()) {
              return;
            }
            element.setSelected(false);
          });
        };
        DiagramModel.prototype.getSelectedItems = function () {
          var filters = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            filters[_i] = arguments[_i];
          }
          if (!Array.isArray(filters)) {
            filters = [filters];
          }
          var items = [];
          items = items.concat(
            _.flatMap(this.nodes, function (node) {
              return node.getSelectedEntities();
            })
          );
          items = items.concat(
            _.flatMap(this.links, function (link) {
              return link.getSelectedEntities();
            })
          );
          items = items.concat(
            _.flatMap(this.links, function (link) {
              return _.flatMap(link.points, function (point) {
                return point.getSelectedEntities();
              });
            })
          );
          items = _.uniq(items);
          if (filters.length > 0) {
            items = _.filter(_.uniq(items), function (item) {
              if (_.includes(filters, 'node') && item instanceof NodeModel_1.NodeModel) {
                return true;
              }
              if (_.includes(filters, 'link') && item instanceof LinkModel_1.LinkModel) {
                return true;
              }
              if (_.includes(filters, 'port') && item instanceof PortModel_1.PortModel) {
                return true;
              }
              if (_.includes(filters, 'point') && item instanceof PointModel_1.PointModel) {
                return true;
              }
              return false;
            });
          }
          return items;
        };
        DiagramModel.prototype.setZoomLevel = function (zoom) {
          this.zoom = zoom;
          this.iterateListeners(function (listener, event) {
            if (listener.zoomUpdated) {
              listener.zoomUpdated(__assign({}, event, { zoom: zoom }));
            }
          });
        };
        DiagramModel.prototype.setOffset = function (offsetX, offsetY) {
          this.offsetX = offsetX;
          this.offsetY = offsetY;
          this.iterateListeners(function (listener, event) {
            if (listener.offsetUpdated) {
              listener.offsetUpdated(__assign({}, event, { offsetX: offsetX, offsetY: offsetY }));
            }
          });
        };
        DiagramModel.prototype.setOffsetX = function (offsetX) {
          var _this = this;
          this.offsetX = offsetX;
          this.iterateListeners(function (listener, event) {
            if (listener.offsetUpdated) {
              listener.offsetUpdated(__assign({}, event, { offsetX: offsetX, offsetY: _this.offsetY }));
            }
          });
        };
        DiagramModel.prototype.setOffsetY = function (offsetY) {
          var _this = this;
          this.offsetY = offsetY;
          this.iterateListeners(function (listener, event) {
            if (listener.offsetUpdated) {
              listener.offsetUpdated(__assign({}, event, { offsetX: _this.offsetX, offsetY: _this.offsetY }));
            }
          });
        };
        DiagramModel.prototype.getOffsetY = function () {
          return this.offsetY;
        };
        DiagramModel.prototype.getOffsetX = function () {
          return this.offsetX;
        };
        DiagramModel.prototype.getZoomLevel = function () {
          return this.zoom;
        };
        DiagramModel.prototype.getNode = function (node) {
          if (node instanceof NodeModel_1.NodeModel) {
            return node;
          }
          if (!this.nodes[node]) {
            return null;
          }
          return this.nodes[node];
        };
        DiagramModel.prototype.getLink = function (link) {
          if (link instanceof LinkModel_1.LinkModel) {
            return link;
          }
          if (!this.links[link]) {
            return null;
          }
          return this.links[link];
        };
        DiagramModel.prototype.addAll = function () {
          var _this = this;
          var models = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            models[_i] = arguments[_i];
          }
          _.forEach(models, function (model) {
            if (model instanceof LinkModel_1.LinkModel) {
              _this.addLink(model);
            } else if (model instanceof NodeModel_1.NodeModel) {
              _this.addNode(model);
            }
          });
          return models;
        };
        DiagramModel.prototype.addLink = function (link) {
          var _this = this;
          link.addListener({
            entityRemoved: function () {
              _this.removeLink(link);
            },
          });
          this.links[link.getID()] = link;
          this.iterateListeners(function (listener, event) {
            if (listener.linksUpdated) {
              listener.linksUpdated(__assign({}, event, { link: link, isCreated: true }));
            }
          });
          return link;
        };
        DiagramModel.prototype.addNode = function (node) {
          var _this = this;
          node.addListener({
            entityRemoved: function () {
              _this.removeNode(node);
            },
          });
          this.nodes[node.getID()] = node;
          this.iterateListeners(function (listener, event) {
            if (listener.nodesUpdated) {
              listener.nodesUpdated(__assign({}, event, { node: node, isCreated: true }));
            }
          });
          return node;
        };
        DiagramModel.prototype.removeLink = function (link) {
          link = this.getLink(link);
          delete this.links[link.getID()];
          this.iterateListeners(function (listener, event) {
            if (listener.linksUpdated) {
              listener.linksUpdated(__assign({}, event, { link: link, isCreated: false }));
            }
          });
        };
        DiagramModel.prototype.removeNode = function (node) {
          node = this.getNode(node);
          delete this.nodes[node.getID()];
          this.iterateListeners(function (listener, event) {
            if (listener.nodesUpdated) {
              listener.nodesUpdated(__assign({}, event, { node: node, isCreated: false }));
            }
          });
        };
        DiagramModel.prototype.getLinks = function () {
          return this.links;
        };
        DiagramModel.prototype.getNodes = function () {
          return this.nodes;
        };
        return DiagramModel;
      })(BaseEntity_1.BaseEntity);
      exports.DiagramModel = DiagramModel;
    },
    function (module, exports, __webpack_require__) {
      'use strict';

      function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
      }

      Object.defineProperty(exports, '__esModule', { value: true });
      __export(__webpack_require__(7));
      __export(__webpack_require__(13));
      __export(__webpack_require__(49));
      __export(__webpack_require__(38));
      __export(__webpack_require__(20));
      __export(__webpack_require__(19));
      __export(__webpack_require__(18));
      __export(__webpack_require__(48));
      __export(__webpack_require__(47));
      __export(__webpack_require__(43));
      __export(__webpack_require__(41));
      __export(__webpack_require__(37));
      __export(__webpack_require__(39));
      __export(__webpack_require__(35));
      __export(__webpack_require__(34));
      __export(__webpack_require__(8));
      __export(__webpack_require__(40));
      __export(__webpack_require__(36));
      __export(__webpack_require__(32));
      __export(__webpack_require__(42));
      __export(__webpack_require__(16));
      __export(__webpack_require__(11));
      __export(__webpack_require__(31));
      __export(__webpack_require__(30));
      __export(__webpack_require__(29));
      __export(__webpack_require__(6));
      __export(__webpack_require__(44));
      __export(__webpack_require__(21));
      __export(__webpack_require__(9));
      __export(__webpack_require__(5));
      __export(__webpack_require__(12));
      __export(__webpack_require__(17));
      __export(__webpack_require__(46));
      __export(__webpack_require__(27));
      __export(__webpack_require__(25));
      __export(__webpack_require__(33));
      __export(__webpack_require__(3));
      __export(__webpack_require__(28));
      __export(__webpack_require__(26));
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      var __assign =
        (this && this.__assign) ||
        Object.assign ||
        function (t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var _ = require('lodash');
      var LinkLayerWidget_1 = __webpack_require__(28);
      var NodeLayerWidget_1 = __webpack_require__(26);
      var Toolkit_1 = __webpack_require__(7);
      var MoveCanvasAction_1 = __webpack_require__(31);
      var MoveItemsAction_1 = __webpack_require__(30);
      var SelectingAction_1 = __webpack_require__(29);
      var NodeModel_1 = __webpack_require__(9);
      var PointModel_1 = __webpack_require__(5);
      var PortModel_1 = __webpack_require__(12);
      var BaseWidget_1 = __webpack_require__(3);
      var DiagramWidget = (function (_super) {
        __extends(DiagramWidget, _super);

        function DiagramWidget(props) {
          var _this = _super.call(this, 'srd-diagram', props) || this;
          _this.onKeyUpPointer = null;
          _this.onMouseMove = _this.onMouseMove.bind(_this);
          _this.onMouseUp = _this.onMouseUp.bind(_this);
          _this.state = {
            action: null,
            wasMoved: false,
            renderedNodes: false,
            windowListener: null,
            diagramEngineListener: null,
            document: null,
          };
          return _this;
        }

        DiagramWidget.prototype.componentWillUnmount = function () {
          this.props.diagramEngine.removeListener(this.state.diagramEngineListener);
          this.props.diagramEngine.setCanvas(null);
          window.removeEventListener('keyup', this.onKeyUpPointer);
          window.removeEventListener('mouseUp', this.onMouseUp);
          window.removeEventListener('mouseMove', this.onMouseMove);
        };
        DiagramWidget.prototype.componentWillReceiveProps = function (nextProps) {
          var _this = this;
          if (this.props.diagramEngine !== nextProps.diagramEngine) {
            this.props.diagramEngine.removeListener(this.state.diagramEngineListener);
            var diagramEngineListener = nextProps.diagramEngine.addListener({
              repaintCanvas: function () {
                return _this.forceUpdate();
              },
            });
            this.setState({ diagramEngineListener: diagramEngineListener });
          }
        };
        DiagramWidget.prototype.componentWillUpdate = function (nextProps) {
          if (this.props.diagramEngine.diagramModel.id !== nextProps.diagramEngine.diagramModel.id) {
            this.setState({ renderedNodes: false });
            nextProps.diagramEngine.diagramModel.rendered = true;
          }
          if (!nextProps.diagramEngine.diagramModel.rendered) {
            this.setState({ renderedNodes: false });
            nextProps.diagramEngine.diagramModel.rendered = true;
          }
        };
        DiagramWidget.prototype.componentDidUpdate = function () {
          if (!this.state.renderedNodes) {
            this.setState({ renderedNodes: true });
          }
        };
        DiagramWidget.prototype.componentDidMount = function () {
          var _this = this;
          this.onKeyUpPointer = this.onKeyUp.bind(this);
          this.setState({
            document: document,
            renderedNodes: true,
            diagramEngineListener: this.props.diagramEngine.addListener({
              repaintCanvas: function () {
                _this.forceUpdate();
              },
            }),
          });
          window.addEventListener('keyup', this.onKeyUpPointer, false);
          if (true) {
            window.focus();
          }
        };
        DiagramWidget.prototype.getMouseElement = function (event) {
          var target = event.target;
          var diagramModel = this.props.diagramEngine.diagramModel;
          var element = Toolkit_1.Toolkit.closest(target, '.port[data-name]');
          if (element) {
            var nodeElement = Toolkit_1.Toolkit.closest(target, '.node[data-nodeid]');
            return {
              model: diagramModel.getNode(nodeElement.getAttribute('data-nodeid')).getPort(element.getAttribute('data-name')),
              element: element,
            };
          }
          element = Toolkit_1.Toolkit.closest(target, '.point[data-id]');
          if (element) {
            return {
              model: diagramModel.getLink(element.getAttribute('data-linkid')).getPointModel(element.getAttribute('data-id')),
              element: element,
            };
          }
          element = Toolkit_1.Toolkit.closest(target, '[data-linkid]');
          if (element) {
            return { model: diagramModel.getLink(element.getAttribute('data-linkid')), element: element };
          }
          element = Toolkit_1.Toolkit.closest(target, '.node[data-nodeid]');
          if (element) {
            return { model: diagramModel.getNode(element.getAttribute('data-nodeid')), element: element };
          }
          return null;
        };
        DiagramWidget.prototype.fireAction = function () {
          if (this.state.action && this.props.actionStillFiring) {
            this.props.actionStillFiring(this.state.action);
          }
        };
        DiagramWidget.prototype.stopFiringAction = function (shouldSkipEvent) {
          if (this.props.actionStoppedFiring && !shouldSkipEvent) {
            this.props.actionStoppedFiring(this.state.action);
          }
          this.setState({ action: null });
        };
        DiagramWidget.prototype.startFiringAction = function (action) {
          var setState = true;
          if (this.props.actionStartedFiring) {
            setState = this.props.actionStartedFiring(action);
          }
          if (setState) {
            this.setState({ action: action });
          }
        };
        DiagramWidget.prototype.onMouseMove = function (event) {
          var _this = this;
          var diagramEngine = this.props.diagramEngine;
          var diagramModel = diagramEngine.getDiagramModel();
          if (this.state.action instanceof SelectingAction_1.SelectingAction) {
            var relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);
            _.forEach(diagramModel.getNodes(), function (node) {
              if (_this.state.action.containsElement(node.x, node.y, diagramModel)) {
                node.setSelected(true);
              }
            });
            _.forEach(diagramModel.getLinks(), function (link) {
              var allSelected = true;
              _.forEach(link.points, function (point) {
                if (_this.state.action.containsElement(point.x, point.y, diagramModel)) {
                  point.setSelected(true);
                } else {
                  allSelected = false;
                }
              });
              if (allSelected) {
                link.setSelected(true);
              }
            });
            this.state.action.mouseX2 = relative.x;
            this.state.action.mouseY2 = relative.y;
            this.fireAction();
            this.setState({ action: this.state.action });
            return;
          } else if (this.state.action instanceof MoveItemsAction_1.MoveItemsAction) {
            var amountX_1 = event.clientX - this.state.action.mouseX;
            var amountY_1 = event.clientY - this.state.action.mouseY;
            var amountZoom_1 = diagramModel.getZoomLevel() / 100;
            _.forEach(this.state.action.selectionModels, function (model) {
              if (model.model instanceof NodeModel_1.NodeModel || (model.model instanceof PointModel_1.PointModel && !model.model.isConnectedToPort())) {
                model.model.x = diagramModel.getGridPosition(model.initialX + amountX_1 / amountZoom_1);
                model.model.y = diagramModel.getGridPosition(model.initialY + amountY_1 / amountZoom_1);
                if (model.model instanceof NodeModel_1.NodeModel) {
                  _.forEach(model.model.getPorts(), function (port) {
                    var portCoords = _this.props.diagramEngine.getPortCoords(port);
                    port.updateCoords(portCoords);
                  });
                }
                if (diagramEngine.isSmartRoutingEnabled()) {
                  diagramEngine.calculateRoutingMatrix();
                }
              } else if (model.model instanceof PointModel_1.PointModel) {
                model.model.x = model.initialX + diagramModel.getGridPosition(amountX_1 / amountZoom_1);
                model.model.y = model.initialY + diagramModel.getGridPosition(amountY_1 / amountZoom_1);
              }
            });
            if (diagramEngine.isSmartRoutingEnabled()) {
              diagramEngine.calculateCanvasMatrix();
            }
            this.fireAction();
            if (!this.state.wasMoved) {
              this.setState({ wasMoved: true });
            } else {
              this.forceUpdate();
            }
          } else if (this.state.action instanceof MoveCanvasAction_1.MoveCanvasAction) {
            if (this.props.allowCanvasTranslation) {
              diagramModel.setOffset(
                this.state.action.initialOffsetX + (event.clientX - this.state.action.mouseX),
                this.state.action.initialOffsetY + (event.clientY - this.state.action.mouseY)
              );
              this.fireAction();
              this.forceUpdate();
            }
          }
        };
        DiagramWidget.prototype.onKeyUp = function (event) {
          var _this = this;
          if (this.props.deleteKeys.indexOf(event.keyCode) !== -1) {
            _.forEach(this.props.diagramEngine.getDiagramModel().getSelectedItems(), function (element) {
              if (!_this.props.diagramEngine.isModelLocked(element)) {
                element.remove();
              }
            });
            this.forceUpdate();
          }
        };
        DiagramWidget.prototype.onMouseUp = function (event) {
          var _this = this;
          var diagramEngine = this.props.diagramEngine;
          if (this.state.action instanceof MoveItemsAction_1.MoveItemsAction) {
            var element = this.getMouseElement(event);
            _.forEach(this.state.action.selectionModels, function (model) {
              if (!(model.model instanceof PointModel_1.PointModel)) {
                return;
              }
              if (element && element.model instanceof PortModel_1.PortModel && !diagramEngine.isModelLocked(element.model)) {
                var link = model.model.getLink();
                if (link.getTargetPort() !== null) {
                  if (link.getTargetPort() !== element.model && link.getSourcePort() !== element.model) {
                    var targetPort = link.getTargetPort();
                    var newLink = link.clone({});
                    newLink.setSourcePort(element.model);
                    newLink.setTargetPort(targetPort);
                    link.setTargetPort(element.model);
                    targetPort.removeLink(link);
                    newLink.removePointsBefore(newLink.getPoints()[link.getPointIndex(model.model)]);
                    link.removePointsAfter(model.model);
                    diagramEngine.getDiagramModel().addLink(newLink);
                  } else if (link.getTargetPort() === element.model) {
                    link.removePointsAfter(model.model);
                  } else if (link.getSourcePort() === element.model) {
                    link.removePointsBefore(model.model);
                  }
                } else {
                  link.setTargetPort(element.model);
                }
                delete _this.props.diagramEngine.linksThatHaveInitiallyRendered[link.getID()];
              }
            });
            if (!this.props.allowLooseLinks && this.state.wasMoved) {
              _.forEach(this.state.action.selectionModels, function (model) {
                if (!(model.model instanceof PointModel_1.PointModel)) {
                  return;
                }
                var selectedPoint = model.model;
                var link = selectedPoint.getLink();
                if (link.getSourcePort() === null || link.getTargetPort() === null) {
                  link.remove();
                }
              });
            }
            _.forEach(this.state.action.selectionModels, function (model) {
              if (!(model.model instanceof PointModel_1.PointModel)) {
                return;
              }
              var link = model.model.getLink();
              var sourcePort = link.getSourcePort();
              var targetPort = link.getTargetPort();
              if (sourcePort !== null && targetPort !== null) {
                if (!sourcePort.canLinkToPort(targetPort)) {
                  link.remove();
                } else if (
                  _.some(_.values(targetPort.getLinks()), function (l) {
                    return l !== link && (l.getSourcePort() === sourcePort || l.getTargetPort() === sourcePort);
                  })
                ) {
                  link.remove();
                }
              }
            });
            diagramEngine.clearRepaintEntities();
            this.stopFiringAction(!this.state.wasMoved);
          } else {
            diagramEngine.clearRepaintEntities();
            this.stopFiringAction();
          }
          this.state.document.removeEventListener('mousemove', this.onMouseMove);
          this.state.document.removeEventListener('mouseup', this.onMouseUp);
        };
        DiagramWidget.prototype.drawSelectionBox = function () {
          var dimensions = this.state.action.getBoxDimensions();
          return React.createElement('div', {
            className: this.bem('__selector'),
            style: { top: dimensions.top, left: dimensions.left, width: dimensions.width, height: dimensions.height },
          });
        };
        DiagramWidget.prototype.render = function () {
          var _this = this;
          var diagramEngine = this.props.diagramEngine;
          diagramEngine.setMaxNumberPointsPerLink(this.props.maxNumberPointsPerLink);
          diagramEngine.setSmartRoutingStatus(this.props.smartRouting);
          var diagramModel = diagramEngine.getDiagramModel();
          return React.createElement(
            'div',
            __assign({}, this.getProps(), {
              ref: function (ref) {
                if (ref) {
                  _this.props.diagramEngine.setCanvas(ref);
                }
              },
              onWheel: function (event) {
                if (_this.props.allowCanvasZoom) {
                  event.preventDefault();
                  event.stopPropagation();
                  var oldZoomFactor = diagramModel.getZoomLevel() / 100;
                  var scrollDelta = _this.props.inverseZoom ? -event.deltaY : event.deltaY;
                  if (event.ctrlKey && scrollDelta % 1 !== 0) {
                    scrollDelta /= 3;
                  } else {
                    scrollDelta /= 60;
                  }
                  if (diagramModel.getZoomLevel() + scrollDelta > 10) {
                    diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
                  }
                  var zoomFactor = diagramModel.getZoomLevel() / 100;
                  var boundingRect = event.currentTarget.getBoundingClientRect();
                  var clientWidth = boundingRect.width;
                  var clientHeight = boundingRect.height;
                  var widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
                  var heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
                  var clientX = event.clientX - boundingRect.left;
                  var clientY = event.clientY - boundingRect.top;
                  var xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
                  var yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;
                  diagramModel.setOffset(diagramModel.getOffsetX() - widthDiff * xFactor, diagramModel.getOffsetY() - heightDiff * yFactor);
                  diagramEngine.enableRepaintEntities([]);
                  _this.forceUpdate();
                }
              },
              onMouseDown: function (event) {
                _this.setState(__assign({}, _this.state, { wasMoved: false }));
                diagramEngine.clearRepaintEntities();
                var model = _this.getMouseElement(event);
                if (model === null) {
                  if (event.shiftKey) {
                    var relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);
                    _this.startFiringAction(new SelectingAction_1.SelectingAction(relative.x, relative.y));
                  } else {
                    diagramModel.clearSelection();
                    _this.startFiringAction(new MoveCanvasAction_1.MoveCanvasAction(event.clientX, event.clientY, diagramModel));
                  }
                } else if (model.model instanceof PortModel_1.PortModel) {
                  if (!_this.props.diagramEngine.isModelLocked(model.model)) {
                    var relative = diagramEngine.getRelativeMousePoint(event);
                    var sourcePort = model.model;
                    var link = sourcePort.createLinkModel();
                    link.setSourcePort(sourcePort);
                    if (link) {
                      link.removeMiddlePoints();
                      if (link.getSourcePort() !== sourcePort) {
                        link.setSourcePort(sourcePort);
                      }
                      link.setTargetPort(null);
                      link.getFirstPoint().updateLocation(relative);
                      link.getLastPoint().updateLocation(relative);
                      diagramModel.clearSelection();
                      link.getLastPoint().setSelected(true);
                      diagramModel.addLink(link);
                      _this.startFiringAction(new MoveItemsAction_1.MoveItemsAction(event.clientX, event.clientY, diagramEngine));
                    }
                  } else {
                    diagramModel.clearSelection();
                  }
                } else {
                  if (!event.shiftKey && !model.model.isSelected()) {
                    diagramModel.clearSelection();
                  }
                  model.model.setSelected(true);
                  _this.startFiringAction(new MoveItemsAction_1.MoveItemsAction(event.clientX, event.clientY, diagramEngine));
                }
                _this.state.document.addEventListener('mousemove', _this.onMouseMove);
                _this.state.document.addEventListener('mouseup', _this.onMouseUp);
              },
            }),
            this.state.renderedNodes &&
              React.createElement(LinkLayerWidget_1.LinkLayerWidget, {
                diagramEngine: diagramEngine,
                pointAdded: function (point, event) {
                  _this.state.document.addEventListener('mousemove', _this.onMouseMove);
                  _this.state.document.addEventListener('mouseup', _this.onMouseUp);
                  event.stopPropagation();
                  diagramModel.clearSelection(point);
                  _this.setState({ action: new MoveItemsAction_1.MoveItemsAction(event.clientX, event.clientY, diagramEngine) });
                },
              }),
            React.createElement(NodeLayerWidget_1.NodeLayerWidget, { diagramEngine: diagramEngine }),
            this.state.action instanceof SelectingAction_1.SelectingAction && this.drawSelectionBox()
          );
        };
        DiagramWidget.defaultProps = {
          diagramEngine: null,
          allowLooseLinks: true,
          allowCanvasTranslation: true,
          allowCanvasZoom: true,
          inverseZoom: false,
          maxNumberPointsPerLink: Infinity,
          smartRouting: false,
          deleteKeys: [46, 8],
        };
        return DiagramWidget;
      })(BaseWidget_1.BaseWidget);
      exports.DiagramWidget = DiagramWidget;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var DefaultNodeModel_1 = __webpack_require__(38);
      var React = __webpack_require__(1);
      var DefaultNodeWidget_1 = __webpack_require__(35);
      var AbstractNodeFactory_1 = __webpack_require__(32);
      var DefaultNodeFactory = (function (_super) {
        __extends(DefaultNodeFactory, _super);

        function DefaultNodeFactory() {
          return _super.call(this, 'default') || this;
        }

        DefaultNodeFactory.prototype.generateReactWidget = function (diagramEngine, node) {
          return React.createElement(DefaultNodeWidget_1.DefaultNodeWidget, { node: node, diagramEngine: diagramEngine });
        };
        DefaultNodeFactory.prototype.getNewInstance = function (initialConfig) {
          return new DefaultNodeModel_1.DefaultNodeModel();
        };
        return DefaultNodeFactory;
      })(AbstractNodeFactory_1.AbstractNodeFactory);
      exports.DefaultNodeFactory = DefaultNodeFactory;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var React = __webpack_require__(1);
      var DefaultLinkWidget_1 = __webpack_require__(37);
      var AbstractLinkFactory_1 = __webpack_require__(36);
      var DefaultLinkModel_1 = __webpack_require__(19);
      var DefaultLinkFactory = (function (_super) {
        __extends(DefaultLinkFactory, _super);

        function DefaultLinkFactory() {
          return _super.call(this, 'default') || this;
        }

        DefaultLinkFactory.prototype.generateReactWidget = function (diagramEngine, link) {
          return React.createElement(DefaultLinkWidget_1.DefaultLinkWidget, { link: link, diagramEngine: diagramEngine });
        };
        DefaultLinkFactory.prototype.getNewInstance = function (initialConfig) {
          return new DefaultLinkModel_1.DefaultLinkModel();
        };
        DefaultLinkFactory.prototype.generateLinkSegment = function (model, widget, selected, path) {
          return React.createElement('path', {
            className: selected ? widget.bem('--path-selected') : '',
            strokeWidth: model.width,
            stroke: model.color,
            d: path,
          });
        };
        return DefaultLinkFactory;
      })(AbstractLinkFactory_1.AbstractLinkFactory);
      exports.DefaultLinkFactory = DefaultLinkFactory;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      var __extends =
        (this && this.__extends) ||
        (function () {
          var extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
          };
        })();
      Object.defineProperty(exports, '__esModule', { value: true });
      var BaseEntity_1 = __webpack_require__(13);
      var DiagramModel_1 = __webpack_require__(44);
      var _ = require('lodash');
      var NodeModel_1 = __webpack_require__(9);
      var PointModel_1 = __webpack_require__(5);
      var main_1 = __webpack_require__(45);
      var PathFinding_1 = __webpack_require__(16);
      var DefaultPortFactory_1 = __webpack_require__(43);
      var DefaultLabelFactory_1 = __webpack_require__(41);
      var Toolkit_1 = __webpack_require__(7);
      var DiagramEngine = (function (_super) {
        __extends(DiagramEngine, _super);

        function DiagramEngine() {
          var _this = _super.call(this) || this;
          _this.canvasMatrix = [];
          _this.routingMatrix = [];
          _this.hAdjustmentFactor = 0;
          _this.vAdjustmentFactor = 0;
          _this.calculateMatrixDimensions = function () {
            var allNodesCoords = _.values(_this.diagramModel.nodes).map(function (item) {
              return { x: item.x, width: item.width, y: item.y, height: item.height };
            });
            var allLinks = _.values(_this.diagramModel.links);
            var allPortsCoords = _.flatMap(
              allLinks.map(function (link) {
                return [link.sourcePort, link.targetPort];
              })
            )
              .filter(function (port) {
                return port !== null;
              })
              .map(function (item) {
                return { x: item.x, width: item.width, y: item.y, height: item.height };
              });
            var allPointsCoords = _.flatMap(
              allLinks.map(function (link) {
                return link.points;
              })
            ).map(function (item) {
              return { x: item.x, width: 0, y: item.y, height: 0 };
            });
            var canvas = _this.canvas;
            var minX =
              Math.floor(
                Math.min(
                  _.minBy(_.concat(allNodesCoords, allPortsCoords, allPointsCoords), function (item) {
                    return item.x;
                  }).x,
                  0
                ) / PathFinding_1.ROUTING_SCALING_FACTOR
              ) * PathFinding_1.ROUTING_SCALING_FACTOR;
            var maxXElement = _.maxBy(_.concat(allNodesCoords, allPortsCoords, allPointsCoords), function (item) {
              return item.x + item.width;
            });
            var maxX = Math.max(maxXElement.x + maxXElement.width, canvas.offsetWidth);
            var minY =
              Math.floor(
                Math.min(
                  _.minBy(_.concat(allNodesCoords, allPortsCoords, allPointsCoords), function (item) {
                    return item.y;
                  }).y,
                  0
                ) / PathFinding_1.ROUTING_SCALING_FACTOR
              ) * PathFinding_1.ROUTING_SCALING_FACTOR;
            var maxYElement = _.maxBy(_.concat(allNodesCoords, allPortsCoords, allPointsCoords), function (item) {
              return item.y + item.height;
            });
            var maxY = Math.max(maxYElement.y + maxYElement.height, canvas.offsetHeight);
            return {
              width: Math.ceil(Math.abs(minX) + maxX),
              hAdjustmentFactor: Math.abs(minX) / PathFinding_1.ROUTING_SCALING_FACTOR + 1,
              height: Math.ceil(Math.abs(minY) + maxY),
              vAdjustmentFactor: Math.abs(minY) / PathFinding_1.ROUTING_SCALING_FACTOR + 1,
            };
          };
          _this.markNodes = function (matrix) {
            _.values(_this.diagramModel.nodes).forEach(function (node) {
              var startX = Math.floor(node.x / PathFinding_1.ROUTING_SCALING_FACTOR);
              var endX = Math.ceil((node.x + node.width) / PathFinding_1.ROUTING_SCALING_FACTOR);
              var startY = Math.floor(node.y / PathFinding_1.ROUTING_SCALING_FACTOR);
              var endY = Math.ceil((node.y + node.height) / PathFinding_1.ROUTING_SCALING_FACTOR);
              for (var x = startX - 1; x <= endX + 1; x++) {
                for (var y = startY - 1; y < endY + 1; y++) {
                  _this.markMatrixPoint(matrix, _this.translateRoutingX(x), _this.translateRoutingY(y));
                }
              }
            });
          };
          _this.markPorts = function (matrix) {
            var allElements = _.flatMap(
              _.values(_this.diagramModel.links).map(function (link) {
                return [].concat(link.sourcePort, link.targetPort);
              })
            );
            allElements
              .filter(function (port) {
                return port !== null;
              })
              .forEach(function (port) {
                var startX = Math.floor(port.x / PathFinding_1.ROUTING_SCALING_FACTOR);
                var endX = Math.ceil((port.x + port.width) / PathFinding_1.ROUTING_SCALING_FACTOR);
                var startY = Math.floor(port.y / PathFinding_1.ROUTING_SCALING_FACTOR);
                var endY = Math.ceil((port.y + port.height) / PathFinding_1.ROUTING_SCALING_FACTOR);
                for (var x = startX - 1; x <= endX + 1; x++) {
                  for (var y = startY - 1; y < endY + 1; y++) {
                    _this.markMatrixPoint(matrix, _this.translateRoutingX(x), _this.translateRoutingY(y));
                  }
                }
              });
          };
          _this.markMatrixPoint = function (matrix, x, y) {
            if (matrix[y] !== undefined && matrix[y][x] !== undefined) {
              matrix[y][x] = 1;
            }
          };
          _this.diagramModel = new DiagramModel_1.DiagramModel();
          _this.nodeFactories = {};
          _this.linkFactories = {};
          _this.portFactories = {};
          _this.labelFactories = {};
          _this.canvas = null;
          _this.paintableWidgets = null;
          _this.linksThatHaveInitiallyRendered = {};
          if (Toolkit_1.Toolkit.TESTING) {
            Toolkit_1.Toolkit.TESTING_UID = 0;
            if (window) {
              window['diagram_instance'] = _this;
            }
          }
          return _this;
        }

        DiagramEngine.prototype.installDefaultFactories = function () {
          this.registerNodeFactory(new main_1.DefaultNodeFactory());
          this.registerLinkFactory(new main_1.DefaultLinkFactory());
          this.registerPortFactory(new DefaultPortFactory_1.DefaultPortFactory());
          this.registerLabelFactory(new DefaultLabelFactory_1.DefaultLabelFactory());
        };
        DiagramEngine.prototype.repaintCanvas = function () {
          this.iterateListeners(function (listener) {
            if (listener.repaintCanvas) {
              listener.repaintCanvas();
            }
          });
        };
        DiagramEngine.prototype.clearRepaintEntities = function () {
          this.paintableWidgets = null;
        };
        DiagramEngine.prototype.enableRepaintEntities = function (entities) {
          var _this = this;
          this.paintableWidgets = {};
          entities.forEach(function (entity) {
            if (entity instanceof NodeModel_1.NodeModel) {
              _.forEach(entity.getPorts(), function (port) {
                _.forEach(port.getLinks(), function (link) {
                  _this.paintableWidgets[link.getID()] = true;
                });
              });
            }
            if (entity instanceof PointModel_1.PointModel) {
              _this.paintableWidgets[entity.getLink().getID()] = true;
            }
            _this.paintableWidgets[entity.getID()] = true;
          });
        };
        DiagramEngine.prototype.isModelLocked = function (model) {
          if (this.diagramModel.isLocked()) {
            return true;
          }
          return model.isLocked();
        };
        DiagramEngine.prototype.recalculatePortsVisually = function () {
          this.nodesRendered = false;
          this.linksThatHaveInitiallyRendered = {};
        };
        DiagramEngine.prototype.canEntityRepaint = function (baseModel) {
          if (this.paintableWidgets === null) {
            return true;
          }
          return this.paintableWidgets[baseModel.getID()] !== undefined;
        };
        DiagramEngine.prototype.setCanvas = function (canvas) {
          this.canvas = canvas;
        };
        DiagramEngine.prototype.setDiagramModel = function (model) {
          this.diagramModel = model;
          this.recalculatePortsVisually();
        };
        DiagramEngine.prototype.getDiagramModel = function () {
          return this.diagramModel;
        };
        //!-------------- FACTORIES ------------
        DiagramEngine.prototype.getNodeFactories = function () {
          return this.nodeFactories;
        };
        DiagramEngine.prototype.getLinkFactories = function () {
          return this.linkFactories;
        };
        DiagramEngine.prototype.getLabelFactories = function () {
          return this.labelFactories;
        };
        DiagramEngine.prototype.registerLabelFactory = function (factory) {
          this.labelFactories[factory.getType()] = factory;
          this.iterateListeners(function (listener) {
            if (listener.labelFactoriesUpdated) {
              listener.labelFactoriesUpdated();
            }
          });
        };
        DiagramEngine.prototype.registerPortFactory = function (factory) {
          this.portFactories[factory.getType()] = factory;
          this.iterateListeners(function (listener) {
            if (listener.portFactoriesUpdated) {
              listener.portFactoriesUpdated();
            }
          });
        };
        DiagramEngine.prototype.registerNodeFactory = function (factory) {
          this.nodeFactories[factory.getType()] = factory;
          this.iterateListeners(function (listener) {
            if (listener.nodeFactoriesUpdated) {
              listener.nodeFactoriesUpdated();
            }
          });
        };
        DiagramEngine.prototype.registerLinkFactory = function (factory) {
          this.linkFactories[factory.getType()] = factory;
          this.iterateListeners(function (listener) {
            if (listener.linkFactoriesUpdated) {
              listener.linkFactoriesUpdated();
            }
          });
        };
        DiagramEngine.prototype.getPortFactory = function (type) {
          if (this.portFactories[type]) {
            return this.portFactories[type];
          }
          throw new Error('cannot find factory for port of type: [' + type + ']');
        };
        DiagramEngine.prototype.getNodeFactory = function (type) {
          if (this.nodeFactories[type]) {
            return this.nodeFactories[type];
          }
          throw new Error('cannot find factory for node of type: [' + type + ']');
        };
        DiagramEngine.prototype.getLinkFactory = function (type) {
          if (this.linkFactories[type]) {
            return this.linkFactories[type];
          }
          throw new Error('cannot find factory for link of type: [' + type + ']');
        };
        DiagramEngine.prototype.getLabelFactory = function (type) {
          if (this.labelFactories[type]) {
            return this.labelFactories[type];
          }
          throw new Error('cannot find factory for label of type: [' + type + ']');
        };
        DiagramEngine.prototype.getFactoryForNode = function (node) {
          return this.getNodeFactory(node.getType());
        };
        DiagramEngine.prototype.getFactoryForLink = function (link) {
          return this.getLinkFactory(link.getType());
        };
        DiagramEngine.prototype.getFactoryForLabel = function (label) {
          return this.getLabelFactory(label.getType());
        };
        DiagramEngine.prototype.generateWidgetForLink = function (link) {
          var linkFactory = this.getFactoryForLink(link);
          if (!linkFactory) {
            throw new Error('Cannot find link factory for link: ' + link.getType());
          }
          return linkFactory.generateReactWidget(this, link);
        };
        DiagramEngine.prototype.generateWidgetForNode = function (node) {
          var nodeFactory = this.getFactoryForNode(node);
          if (!nodeFactory) {
            throw new Error('Cannot find widget factory for node: ' + node.getType());
          }
          return nodeFactory.generateReactWidget(this, node);
        };
        DiagramEngine.prototype.getRelativeMousePoint = function (event) {
          var point = this.getRelativePoint(event.clientX, event.clientY);
          return {
            x: (point.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100),
            y: (point.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100),
          };
        };
        DiagramEngine.prototype.getRelativePoint = function (x, y) {
          var canvasRect = this.canvas.getBoundingClientRect();
          return { x: x - canvasRect.left, y: y - canvasRect.top };
        };
        DiagramEngine.prototype.getNodeElement = function (node) {
          var selector = this.canvas.querySelector('.node[data-nodeid="' + node.getID() + '"]');
          if (selector === null) {
            throw new Error('Cannot find Node element with nodeID: [' + node.getID() + ']');
          }
          return selector;
        };
        DiagramEngine.prototype.getNodePortElement = function (port) {
          var selector = this.canvas.querySelector('.port[data-name="' + port.getName() + '"][data-nodeid="' + port.getParent().getID() + '"]');
          if (selector === null) {
            throw new Error('Cannot find Node Port element with nodeID: [' + port.getParent().getID() + '] and name: [' + port.getName() + ']');
          }
          return selector;
        };
        DiagramEngine.prototype.getPortCenter = function (port) {
          var sourceElement = this.getNodePortElement(port);
          var sourceRect = sourceElement.getBoundingClientRect();
          var rel = this.getRelativePoint(sourceRect.left, sourceRect.top);
          return {
            x: sourceElement.offsetWidth / 2 + (rel.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100),
            y: sourceElement.offsetHeight / 2 + (rel.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100),
          };
        };
        DiagramEngine.prototype.getPortCoords = function (port) {
          var sourceElement = this.getNodePortElement(port);
          var sourceRect = sourceElement.getBoundingClientRect();
          var canvasRect = this.canvas.getBoundingClientRect();
          return {
            x: (sourceRect.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100) - canvasRect.left,
            y: (sourceRect.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100) - canvasRect.top,
            width: sourceRect.width,
            height: sourceRect.height,
          };
        };
        DiagramEngine.prototype.getNodeDimensions = function (node) {
          if (!this.canvas) {
            return { width: 0, height: 0 };
          }
          var nodeElement = this.getNodeElement(node);
          var nodeRect = nodeElement.getBoundingClientRect();
          return { width: nodeRect.width, height: nodeRect.height };
        };
        DiagramEngine.prototype.getMaxNumberPointsPerLink = function () {
          return this.maxNumberPointsPerLink;
        };
        DiagramEngine.prototype.setMaxNumberPointsPerLink = function (max) {
          this.maxNumberPointsPerLink = max;
        };
        DiagramEngine.prototype.isSmartRoutingEnabled = function () {
          return !!this.smartRouting;
        };
        DiagramEngine.prototype.setSmartRoutingStatus = function (status) {
          this.smartRouting = status;
        };
        DiagramEngine.prototype.getCanvasMatrix = function () {
          if (this.canvasMatrix.length === 0) {
            this.calculateCanvasMatrix();
          }
          return this.canvasMatrix;
        };
        DiagramEngine.prototype.calculateCanvasMatrix = function () {
          var _a = this.calculateMatrixDimensions(),
            canvasWidth = _a.width,
            hAdjustmentFactor = _a.hAdjustmentFactor,
            canvasHeight = _a.height,
            vAdjustmentFactor = _a.vAdjustmentFactor;
          this.hAdjustmentFactor = hAdjustmentFactor;
          this.vAdjustmentFactor = vAdjustmentFactor;
          var matrixWidth = Math.ceil(canvasWidth / PathFinding_1.ROUTING_SCALING_FACTOR);
          var matrixHeight = Math.ceil(canvasHeight / PathFinding_1.ROUTING_SCALING_FACTOR);
          this.canvasMatrix = _.range(0, matrixHeight).map(function () {
            return new Array(matrixWidth).fill(0);
          });
        };
        DiagramEngine.prototype.getRoutingMatrix = function () {
          if (this.routingMatrix.length === 0) {
            this.calculateRoutingMatrix();
          }
          return this.routingMatrix;
        };
        DiagramEngine.prototype.calculateRoutingMatrix = function () {
          var matrix = _.cloneDeep(this.getCanvasMatrix());
          this.markNodes(matrix);
          this.markPorts(matrix);
          this.routingMatrix = matrix;
        };
        DiagramEngine.prototype.translateRoutingX = function (x, reverse) {
          if (reverse === void 0) {
            reverse = false;
          }
          return x + this.hAdjustmentFactor * (reverse ? -1 : 1);
        };
        DiagramEngine.prototype.translateRoutingY = function (y, reverse) {
          if (reverse === void 0) {
            reverse = false;
          }
          return y + this.vAdjustmentFactor * (reverse ? -1 : 1);
        };
        DiagramEngine.prototype.zoomToFit = function () {
          var xFactor = this.canvas.clientWidth / this.canvas.scrollWidth;
          var yFactor = this.canvas.clientHeight / this.canvas.scrollHeight;
          var zoomFactor = xFactor < yFactor ? xFactor : yFactor;
          this.diagramModel.setZoomLevel(this.diagramModel.getZoomLevel() * zoomFactor);
          this.diagramModel.setOffset(0, 0);
          this.repaintCanvas();
        };
        return DiagramEngine;
      })(BaseEntity_1.BaseEntity);
      exports.DiagramEngine = DiagramEngine;
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      Object.defineProperty(exports, '__esModule', { value: true });
      var _slicedToArray = (function () {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;
          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);
              if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i['return']) _i['return']();
            } finally {
              if (_d) throw _e;
            }
          }
          return _arr;
        }

        return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          }
        };
      })();
      var sq = function sq(x) {
        return x * x;
      };
      var distPointToPoint = function distPointToPoint(_ref, _ref3) {
        var _ref2 = _slicedToArray(_ref, 2);
        var ax = _ref2[0];
        var ay = _ref2[1];
        var _ref32 = _slicedToArray(_ref3, 2);
        var bx = _ref32[0];
        var by = _ref32[1];
        return Math.sqrt(sq(ax - bx) + sq(ay - by));
      };
      var distPointToParabol = function distPointToParabol(a, f) {
        var p = distPointToPoint(a, f);
        return p == 0 ? Infinity : sq(p) / (2 * Math.abs(a[1] - f[1]));
      };
      var circumCenter = function circumCenter(a, b, c) {
        var d = (a[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (a[1] - c[1]);
        if (d == 0) return [Infinity, Infinity];
        var xc =
          ((((a[0] - c[0]) * (a[0] + c[0]) + (a[1] - c[1]) * (a[1] + c[1])) / 2) * (b[1] - c[1]) -
            (((b[0] - c[0]) * (b[0] + c[0]) + (b[1] - c[1]) * (b[1] + c[1])) / 2) * (a[1] - c[1])) /
          d;
        var yc =
          ((((b[0] - c[0]) * (b[0] + c[0]) + (b[1] - c[1]) * (b[1] + c[1])) / 2) * (a[0] - c[0]) -
            (((a[0] - c[0]) * (a[0] + c[0]) + (a[1] - c[1]) * (a[1] + c[1])) / 2) * (b[0] - c[0])) /
          d;
        return [xc, yc];
      };
      var parabolsCrossX = function parabolsCrossX(fa, fb, q) {
        if (fa[1] === fb[1]) return [(fa[0] + fb[0]) / 2, (fa[0] + fb[0]) / 2];
        var s1 =
          (fa[1] * fb[0] -
            fa[0] * fb[1] +
            fa[0] * q -
            fb[0] * q +
            Math.sqrt(
              (fa[0] * fa[0] + fa[1] * fa[1] - 2 * fa[0] * fb[0] + fb[0] * fb[0] - 2 * fa[1] * fb[1] + fb[1] * fb[1]) *
                (fa[1] * fb[1] - fa[1] * q - fb[1] * q + q * q)
            )) /
          (fa[1] - fb[1]);
        var s2 =
          (fa[1] * fb[0] -
            fa[0] * fb[1] +
            fa[0] * q -
            fb[0] * q -
            Math.sqrt(
              (fa[0] * fa[0] + fa[1] * fa[1] - 2 * fa[0] * fb[0] + fb[0] * fb[0] - 2 * fa[1] * fb[1] + fb[1] * fb[1]) *
                (fa[1] * fb[1] - fa[1] * q - fb[1] * q + q * q)
            )) /
          (fa[1] - fb[1]);
        return s1 < s2 ? [s1, s2] : [s2, s1];
      };
      var doHalflinesCross = function doHalflinesCross(sa, sb) {
        var approx = arguments.length <= 2 || arguments[2] === undefined ? 1e-10 : arguments[2];
        var dx = sb.ps[0] - sa.ps[0];
        var dy = sb.ps[1] - sa.ps[1];
        if (sa.m == Infinity) return sa.hp * (sb.m * dx - dy) <= approx && sb.vec[0] * dx <= approx;
        if (sb.m == Infinity) return sb.hp * (sa.m * dx - dy) >= -approx && sa.vec[0] * dx >= -approx;
        var det = sb.vec[0] * sa.vec[1] - sb.vec[1] * sa.vec[0];
        if (det === 0) return false;
        var u = (dy * sb.vec[0] - dx * sb.vec[1]) / det;
        var v = (dy * sa.vec[0] - dx * sa.vec[1]) / det;
        return (u >= -approx && v >= approx) || (u >= approx && v >= -approx);
      };
      var matrixTransform = function matrixTransform(points, matrix) {
        return points.map(function (point) {
          return {
            x: point.x * matrix[0] + point.y * matrix[2] + matrix[4],
            y: point.x * matrix[1] + point.y * matrix[3] + matrix[5],
          };
        });
      };
      var transformEllipse = function transformEllipse(rx, ry, ax, m) {
        var torad = Math.PI / 180;
        var epsilon = 1e-10;
        var c = Math.cos(ax * torad),
          s = Math.sin(ax * torad);
        var ma = [rx * (m[0] * c + m[2] * s), rx * (m[1] * c + m[3] * s), ry * (-m[0] * s + m[2] * c), ry * (-m[1] * s + m[3] * c)];
        var J = ma[0] * ma[0] + ma[2] * ma[2],
          K = ma[1] * ma[1] + ma[3] * ma[3];
        var D =
          ((ma[0] - ma[3]) * (ma[0] - ma[3]) + (ma[2] + ma[1]) * (ma[2] + ma[1])) * ((ma[0] + ma[3]) * (ma[0] + ma[3]) + (ma[2] - ma[1]) * (ma[2] - ma[1]));
        var JK = (J + K) / 2;
        if (D < epsilon * JK) {
          return { rx: Math.sqrt(JK), ry: Math.sqrt(JK), ax: 0, isDegenerate: false };
        }
        var L = ma[0] * ma[1] + ma[2] * ma[3];
        D = Math.sqrt(D);
        var l1 = JK + D / 2,
          l2 = JK - D / 2;
        var newAx = undefined,
          newRx = undefined,
          newRy = undefined;
        newAx =
          Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon ? 90 : (Math.atan(Math.abs(L) > Math.abs(l1 - K) ? (l1 - J) / L : L / (l1 - K)) * 180) / Math.PI;
        if (newAx >= 0) {
          newRx = Math.sqrt(l1);
          newRy = Math.sqrt(l2);
        } else {
          newAx += 90;
          newRx = Math.sqrt(l2);
          newRy = Math.sqrt(l1);
        }
        return { rx: newRx, ry: newRy, ax: newAx, isDegenerate: newRx < epsilon * newRy || newRy < epsilon * newRx };
      };
      exports['default'] = {
        distPointToPoint: distPointToPoint,
        distPointToParabol: distPointToParabol,
        circumCenter: circumCenter,
        parabolsCrossX: parabolsCrossX,
        doHalflinesCross: doHalflinesCross,
        matrixTransform: matrixTransform,
        transformEllipse: transformEllipse,
      };
      module.exports = exports['default'];
    },
    function (module, exports, __webpack_require__) {
      'use strict';
      Object.defineProperty(exports, '__esModule', { value: true });
      var _slicedToArray = (function () {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;
          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);
              if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i['return']) _i['return']();
            } finally {
              if (_d) throw _e;
            }
          }
          return _arr;
        }

        return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          }
        };
      })();
      var _geom = __webpack_require__(50);
      var Path = function Path(init) {
        var _instructions = init || [];
        var push = function push(arr, el) {
          var copy = arr.slice(0, arr.length);
          copy.push(el);
          return copy;
        };
        var areEqualPoints = function areEqualPoints(_ref, _ref3) {
          var _ref2 = _slicedToArray(_ref, 2);
          var a1 = _ref2[0];
          var b1 = _ref2[1];
          var _ref32 = _slicedToArray(_ref3, 2);
          var a2 = _ref32[0];
          var b2 = _ref32[1];
          return a1 === a2 && b1 === b2;
        };
        var trimZeros = function trimZeros(string, char) {
          var l = string.length;
          while (string.charAt(l - 1) === '0') {
            l = l - 1;
          }
          if (string.charAt(l - 1) === '.') {
            l = l - 1;
          }
          return string.substr(0, l);
        };
        var round = function round(number, digits) {
          var str = number.toFixed(digits);
          return trimZeros(str);
        };
        var printInstrunction = function printInstrunction(_ref4) {
          var command = _ref4.command;
          var params = _ref4.params;
          var numbers = params.map(function (param) {
            return round(param, 6);
          });
          return command + ' ' + numbers.join(' ');
        };
        var point = function point(_ref5, prev) {
          var command = _ref5.command;
          var params = _ref5.params;
          switch (command) {
            case 'M':
              return [params[0], params[1]];
            case 'L':
              return [params[0], params[1]];
            case 'H':
              return [params[0], prev[1]];
            case 'V':
              return [prev[0], params[0]];
            case 'Z':
              return null;
            case 'C':
              return [params[4], params[5]];
            case 'S':
              return [params[2], params[3]];
            case 'Q':
              return [params[2], params[3]];
            case 'T':
              return [params[0], params[1]];
            case 'A':
              return [params[5], params[6]];
          }
        };
        var transformParams = function transformParams(instruction, matrix, prev) {
          var p = instruction.params;
          var transformer = {
            V: function V(instruction, matrix, prev) {
              var pts = [{ x: prev[0], y: p[1] }];
              var newPts = (0, _geom.matrixTransform)(pts, matrix);
              if (newPts[0].x === (0, _geom.matrixTransform)([{ x: prev[0], y: prev[1] }])[0].x) {
                return { command: 'V', params: [newPts[0].y] };
              } else {
                return { command: 'L', params: [newPts[0].x, newPts[0].y] };
              }
            },
            H: function H(instruction, matrix, prev) {
              var pts = [{ x: p[0], y: prev[1] }];
              var newPts = (0, _geom.matrixTransform)(pts, matrix);
              if (newPts[0].y === (0, _geom.matrixTransform)([{ x: prev[0], y: prev[1] }])[0].y) {
                return { command: 'H', params: [newPts[0].x] };
              } else {
                return { command: 'L', params: [newPts[0].x, newPts[0].y] };
              }
            },
            A: function A(instruction, matrix, prev) {
              var r = (0, _geom.transformEllipse)(p[0], p[1], p[2], matrix);
              var sweepFlag = p[4];
              if (matrix[0] * matrix[3] - matrix[1] * matrix[2] < 0) {
                sweepFlag = sweepFlag ? '0' : '1';
              }
              var pts = [{ x: p[5], y: p[6] }];
              var newPts = (0, _geom.matrixTransform)(pts, matrix);
              if (r.isDegenerate) {
                return { command: 'L', params: [newPts[0].x, newPts[0].y] };
              } else {
                return { command: 'A', params: [r.rx, r.ry, r.ax, p[3], sweepFlag, newPts[0].x, newPts[0].y] };
              }
            },
            C: function C(instruction, matrix, prev) {
              var pts = [
                { x: p[0], y: p[1] },
                { x: p[2], y: p[3] },
                { x: p[4], y: p[5] },
              ];
              var newPts = (0, _geom.matrixTransform)(pts, matrix);
              return {
                command: 'C',
                params: [newPts[0].x, newPts[0].y, newPts[1].x, newPts[1].y, newPts[2].x, newPts[2].y],
              };
            },
            Z: function Z(instruction, matrix, prev) {
              return { command: 'Z', params: [] };
            },
            default: function _default(instruction, matrix, prev) {
              var pts = [{ x: p[0], y: p[1] }];
              var newPts = (0, _geom.matrixTransform)(pts, matrix);
              var newParams = instruction.params.slice(0, instruction.params.length);
              newParams.splice(0, 2, newPts[0].x, newPts[0].y);
              return { command: instruction.command, params: newParams };
            },
          };
          if (transformer[instruction.command]) {
            return transformer[instruction.command](instruction, matrix, prev);
          } else {
            return transformer['default'](instruction, matrix, prev);
          }
        };
        var verbosify = function verbosify(keys, f) {
          return function (a) {
            var args =
              typeof a === 'object'
                ? keys.map(function (k) {
                    return a[k];
                  })
                : arguments;
            return f.apply(null, args);
          };
        };
        var plus = function plus(instruction) {
          return Path(push(_instructions, instruction));
        };
        return {
          moveto: verbosify(['x', 'y'], function (x, y) {
            return plus({ command: 'M', params: [x, y] });
          }),
          lineto: verbosify(['x', 'y'], function (x, y) {
            return plus({ command: 'L', params: [x, y] });
          }),
          hlineto: verbosify(['x'], function (x) {
            return plus({ command: 'H', params: [x] });
          }),
          vlineto: verbosify(['y'], function (y) {
            return plus({ command: 'V', params: [y] });
          }),
          closepath: function closepath() {
            return plus({ command: 'Z', params: [] });
          },
          curveto: verbosify(['x1', 'y1', 'x2', 'y2', 'x', 'y'], function (x1, y1, x2, y2, x, y) {
            return plus({ command: 'C', params: [x1, y1, x2, y2, x, y] });
          }),
          smoothcurveto: verbosify(['x2', 'y2', 'x', 'y'], function (x2, y2, x, y) {
            return plus({ command: 'S', params: [x2, y2, x, y] });
          }),
          qcurveto: verbosify(['x1', 'y1', 'x', 'y'], function (x1, y1, x, y) {
            return plus({ command: 'Q', params: [x1, y1, x, y] });
          }),
          smoothqcurveto: verbosify(['x', 'y'], function (x, y) {
            return plus({ command: 'T', params: [x, y] });
          }),
          arc: verbosify(['rx', 'ry', 'xrot', 'largeArcFlag', 'sweepFlag', 'x', 'y'], function (rx, ry, xrot, largeArcFlag, sweepFlag, x, y) {
            return plus({ command: 'A', params: [rx, ry, xrot, largeArcFlag, sweepFlag, x, y] });
          }),
          translate: verbosify(['dx', 'dy'], function () {
            var dx = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            var dy = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            if (dx !== 0 || dx !== 0) {
              var _ret = (function () {
                var prev = [0, 0];
                var matrix = [1, 0, 0, 1, dx, dy];
                var newInstructions = _instructions.map(function (instruction) {
                  var p = transformParams(instruction, matrix, prev);
                  prev = point(instruction, prev);
                  return p;
                });
                return { v: Path(newInstructions) };
              })();
              if (typeof _ret === 'object') return _ret.v;
            } else {
              return Path(_instructions);
            }
          }),
          rotate: verbosify(['angle', 'rx', 'ry'], function (angle) {
            var rx = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var ry = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
            if (angle !== 0) {
              var _ret2 = (function () {
                var prev = undefined;
                var matrix = undefined;
                var newInstructions = _instructions;
                if (rx !== 0 && ry !== 0) {
                  prev = [0, 0];
                  matrix = [1, 0, 0, 1, -rx, -ry];
                  newInstructions = newInstructions.map(function (instruction) {
                    var p = transformParams(instruction, matrix, prev);
                    prev = point(instruction, prev);
                    return p;
                  });
                }
                var rad = (angle * Math.PI) / 180;
                var cos = Math.cos(rad);
                var sin = Math.sin(rad);
                prev = [0, 0];
                matrix = [cos, sin, -sin, cos, 0, 0];
                newInstructions = newInstructions.map(function (instruction) {
                  var p = transformParams(instruction, matrix, prev);
                  prev = point(instruction, prev);
                  return p;
                });
                if (rx !== 0 && ry !== 0) {
                  prev = [0, 0];
                  matrix = [1, 0, 0, 1, rx, ry];
                  newInstructions = newInstructions.map(function (instruction) {
                    var p = transformParams(instruction, matrix, prev);
                    prev = point(instruction, prev);
                    return p;
                  });
                }
                return { v: Path(newInstructions) };
              })();
              if (typeof _ret2 === 'object') return _ret2.v;
            } else {
              return Path(_instructions);
            }
          }),
          scale: verbosify(['sx', 'sy'], function () {
            var sx = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
            var sy = arguments.length <= 1 || arguments[1] === undefined ? sx : arguments[1];
            return (function () {
              if (sx !== 1 || sy !== 1) {
                var _ret3 = (function () {
                  var prev = [0, 0];
                  var matrix = [sx, 0, 0, sy, 0, 0];
                  var newInstructions = _instructions.map(function (instruction) {
                    var p = transformParams(instruction, matrix, prev);
                    prev = point(instruction, prev);
                    return p;
                  });
                  return { v: Path(newInstructions) };
                })();
                if (typeof _ret3 === 'object') return _ret3.v;
              } else {
                return Path(_instructions);
              }
            })();
          }),
          shearX: verbosify(['angle'], function () {
            var angle = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            if (angle !== 0) {
              var _ret4 = (function () {
                var prev = [0, 0];
                var matrix = [1, 0, Math.tan((angle * Math.PI) / 180), 1, 0, 0];
                var newInstructions = _instructions.map(function (instruction) {
                  var p = transformParams(instruction, matrix, prev);
                  prev = point(instruction, prev);
                  return p;
                });
                return { v: Path(newInstructions) };
              })();
              if (typeof _ret4 === 'object') return _ret4.v;
            } else {
              return Path(_instructions);
            }
          }),
          shearY: verbosify(['angle'], function () {
            var angle = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            if (angle !== 0) {
              var _ret5 = (function () {
                var prev = [0, 0];
                var matrix = [1, Math.tan((angle * Math.PI) / 180), 0, 1, 0, 0];
                var newInstructions = _instructions.map(function (instruction) {
                  var p = transformParams(instruction, matrix, prev);
                  prev = point(instruction, prev);
                  return p;
                });
                return { v: Path(newInstructions) };
              })();
              if (typeof _ret5 === 'object') return _ret5.v;
            } else {
              return Path(_instructions);
            }
          }),
          print: function print() {
            return _instructions.map(printInstrunction).join(' ');
          },
          toString: function toString() {
            return undefined.print();
          },
          points: function points() {
            var ps = [];
            var prev = [0, 0];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;
            try {
              for (
                var _iterator = _instructions[Symbol.iterator](), _step;
                !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                _iteratorNormalCompletion = true
              ) {
                var instruction = _step.value;
                var p = point(instruction, prev);
                prev = p;
                if (p) {
                  ps.push(p);
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                  _iterator['return']();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
            return ps;
          },
          instructions: function instructions() {
            return _instructions.slice(0, _instructions.length);
          },
          connect: function connect(path) {
            var ps = this.points();
            var last = ps[ps.length - 1];
            var first = path.points()[0];
            var newInstructions = undefined;
            if (_instructions[_instructions.length - 1].command !== 'Z') {
              newInstructions = path.instructions().slice(1);
              if (!areEqualPoints(last, first)) {
                newInstructions.unshift({ command: 'L', params: first });
              }
            } else {
              newInstructions = path.instructions();
            }
            return Path(this.instructions().concat(newInstructions));
          },
        };
      };
      exports['default'] = function () {
        return Path();
      };
      module.exports = exports['default'];
    },
    function (module, exports, __webpack_require__) {
      var JumpPointFinderBase = __webpack_require__(14);
      var DiagonalMovement = __webpack_require__(2);

      function JPFMoveDiagonallyIfAtMostOneObstacle(opt) {
        JumpPointFinderBase.call(this, opt);
      }

      JPFMoveDiagonallyIfAtMostOneObstacle.prototype = new JumpPointFinderBase();
      JPFMoveDiagonallyIfAtMostOneObstacle.prototype.constructor = JPFMoveDiagonallyIfAtMostOneObstacle;
      JPFMoveDiagonallyIfAtMostOneObstacle.prototype._jump = function (x, y, px, py) {
        var grid = this.grid,
          dx = x - px,
          dy = y - py;
        if (!grid.isWalkableAt(x, y)) {
          return null;
        }
        if (this.trackJumpRecursion === true) {
          grid.getNodeAt(x, y).tested = true;
        }
        if (grid.getNodeAt(x, y) === this.endNode) {
          return [x, y];
        }
        if (dx !== 0 && dy !== 0) {
          if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) || (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
            return [x, y];
          }
          if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
            return [x, y];
          }
        } else {
          if (dx !== 0) {
            if ((grid.isWalkableAt(x + dx, y + 1) && !grid.isWalkableAt(x, y + 1)) || (grid.isWalkableAt(x + dx, y - 1) && !grid.isWalkableAt(x, y - 1))) {
              return [x, y];
            }
          } else {
            if ((grid.isWalkableAt(x + 1, y + dy) && !grid.isWalkableAt(x + 1, y)) || (grid.isWalkableAt(x - 1, y + dy) && !grid.isWalkableAt(x - 1, y))) {
              return [x, y];
            }
          }
        }
        if (grid.isWalkableAt(x + dx, y) || grid.isWalkableAt(x, y + dy)) {
          return this._jump(x + dx, y + dy, x, y);
        } else {
          return null;
        }
      };
      JPFMoveDiagonallyIfAtMostOneObstacle.prototype._findNeighbors = function (node) {
        var parent = node.parent,
          x = node.x,
          y = node.y,
          grid = this.grid,
          px,
          py,
          nx,
          ny,
          dx,
          dy,
          neighbors = [],
          neighborNodes,
          neighborNode,
          i,
          l;
        if (parent) {
          px = parent.x;
          py = parent.y;
          dx = (x - px) / Math.max(Math.abs(x - px), 1);
          dy = (y - py) / Math.max(Math.abs(y - py), 1);
          if (dx !== 0 && dy !== 0) {
            if (grid.isWalkableAt(x, y + dy)) {
              neighbors.push([x, y + dy]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
              neighbors.push([x + dx, y]);
            }
            if (grid.isWalkableAt(x, y + dy) || grid.isWalkableAt(x + dx, y)) {
              neighbors.push([x + dx, y + dy]);
            }
            if (!grid.isWalkableAt(x - dx, y) && grid.isWalkableAt(x, y + dy)) {
              neighbors.push([x - dx, y + dy]);
            }
            if (!grid.isWalkableAt(x, y - dy) && grid.isWalkableAt(x + dx, y)) {
              neighbors.push([x + dx, y - dy]);
            }
          } else {
            if (dx === 0) {
              if (grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x, y + dy]);
                if (!grid.isWalkableAt(x + 1, y)) {
                  neighbors.push([x + 1, y + dy]);
                }
                if (!grid.isWalkableAt(x - 1, y)) {
                  neighbors.push([x - 1, y + dy]);
                }
              }
            } else {
              if (grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y]);
                if (!grid.isWalkableAt(x, y + 1)) {
                  neighbors.push([x + dx, y + 1]);
                }
                if (!grid.isWalkableAt(x, y - 1)) {
                  neighbors.push([x + dx, y - 1]);
                }
              }
            }
          }
        } else {
          neighborNodes = grid.getNeighbors(node, DiagonalMovement.IfAtMostOneObstacle);
          for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
          }
        }
        return neighbors;
      };
      module.exports = JPFMoveDiagonallyIfAtMostOneObstacle;
    },
    function (module, exports, __webpack_require__) {
      var JumpPointFinderBase = __webpack_require__(14);
      var DiagonalMovement = __webpack_require__(2);

      function JPFMoveDiagonallyIfNoObstacles(opt) {
        JumpPointFinderBase.call(this, opt);
      }

      JPFMoveDiagonallyIfNoObstacles.prototype = new JumpPointFinderBase();
      JPFMoveDiagonallyIfNoObstacles.prototype.constructor = JPFMoveDiagonallyIfNoObstacles;
      JPFMoveDiagonallyIfNoObstacles.prototype._jump = function (x, y, px, py) {
        var grid = this.grid,
          dx = x - px,
          dy = y - py;
        if (!grid.isWalkableAt(x, y)) {
          return null;
        }
        if (this.trackJumpRecursion === true) {
          grid.getNodeAt(x, y).tested = true;
        }
        if (grid.getNodeAt(x, y) === this.endNode) {
          return [x, y];
        }
        if (dx !== 0 && dy !== 0) {
          if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
            return [x, y];
          }
        } else {
          if (dx !== 0) {
            if ((grid.isWalkableAt(x, y - 1) && !grid.isWalkableAt(x - dx, y - 1)) || (grid.isWalkableAt(x, y + 1) && !grid.isWalkableAt(x - dx, y + 1))) {
              return [x, y];
            }
          } else if (dy !== 0) {
            if ((grid.isWalkableAt(x - 1, y) && !grid.isWalkableAt(x - 1, y - dy)) || (grid.isWalkableAt(x + 1, y) && !grid.isWalkableAt(x + 1, y - dy))) {
              return [x, y];
            }
          }
        }
        if (grid.isWalkableAt(x + dx, y) && grid.isWalkableAt(x, y + dy)) {
          return this._jump(x + dx, y + dy, x, y);
        } else {
          return null;
        }
      };
      JPFMoveDiagonallyIfNoObstacles.prototype._findNeighbors = function (node) {
        var parent = node.parent,
          x = node.x,
          y = node.y,
          grid = this.grid,
          px,
          py,
          nx,
          ny,
          dx,
          dy,
          neighbors = [],
          neighborNodes,
          neighborNode,
          i,
          l;
        if (parent) {
          px = parent.x;
          py = parent.y;
          dx = (x - px) / Math.max(Math.abs(x - px), 1);
          dy = (y - py) / Math.max(Math.abs(y - py), 1);
          if (dx !== 0 && dy !== 0) {
            if (grid.isWalkableAt(x, y + dy)) {
              neighbors.push([x, y + dy]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
              neighbors.push([x + dx, y]);
            }
            if (grid.isWalkableAt(x, y + dy) && grid.isWalkableAt(x + dx, y)) {
              neighbors.push([x + dx, y + dy]);
            }
          } else {
            var isNextWalkable;
            if (dx !== 0) {
              isNextWalkable = grid.isWalkableAt(x + dx, y);
              var isTopWalkable = grid.isWalkableAt(x, y + 1);
              var isBottomWalkable = grid.isWalkableAt(x, y - 1);
              if (isNextWalkable) {
                neighbors.push([x + dx, y]);
                if (isTopWalkable) {
                  neighbors.push([x + dx, y + 1]);
                }
                if (isBottomWalkable) {
                  neighbors.push([x + dx, y - 1]);
                }
              }
              if (isTopWalkable) {
                neighbors.push([x, y + 1]);
              }
              if (isBottomWalkable) {
                neighbors.push([x, y - 1]);
              }
            } else if (dy !== 0) {
              isNextWalkable = grid.isWalkableAt(x, y + dy);
              var isRightWalkable = grid.isWalkableAt(x + 1, y);
              var isLeftWalkable = grid.isWalkableAt(x - 1, y);
              if (isNextWalkable) {
                neighbors.push([x, y + dy]);
                if (isRightWalkable) {
                  neighbors.push([x + 1, y + dy]);
                }
                if (isLeftWalkable) {
                  neighbors.push([x - 1, y + dy]);
                }
              }
              if (isRightWalkable) {
                neighbors.push([x + 1, y]);
              }
              if (isLeftWalkable) {
                neighbors.push([x - 1, y]);
              }
            }
          }
        } else {
          neighborNodes = grid.getNeighbors(node, DiagonalMovement.OnlyWhenNoObstacles);
          for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
          }
        }
        return neighbors;
      };
      module.exports = JPFMoveDiagonallyIfNoObstacles;
    },
    function (module, exports, __webpack_require__) {
      var JumpPointFinderBase = __webpack_require__(14);
      var DiagonalMovement = __webpack_require__(2);

      function JPFAlwaysMoveDiagonally(opt) {
        JumpPointFinderBase.call(this, opt);
      }

      JPFAlwaysMoveDiagonally.prototype = new JumpPointFinderBase();
      JPFAlwaysMoveDiagonally.prototype.constructor = JPFAlwaysMoveDiagonally;
      JPFAlwaysMoveDiagonally.prototype._jump = function (x, y, px, py) {
        var grid = this.grid,
          dx = x - px,
          dy = y - py;
        if (!grid.isWalkableAt(x, y)) {
          return null;
        }
        if (this.trackJumpRecursion === true) {
          grid.getNodeAt(x, y).tested = true;
        }
        if (grid.getNodeAt(x, y) === this.endNode) {
          return [x, y];
        }
        if (dx !== 0 && dy !== 0) {
          if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) || (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
            return [x, y];
          }
          if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
            return [x, y];
          }
        } else {
          if (dx !== 0) {
            if ((grid.isWalkableAt(x + dx, y + 1) && !grid.isWalkableAt(x, y + 1)) || (grid.isWalkableAt(x + dx, y - 1) && !grid.isWalkableAt(x, y - 1))) {
              return [x, y];
            }
          } else {
            if ((grid.isWalkableAt(x + 1, y + dy) && !grid.isWalkableAt(x + 1, y)) || (grid.isWalkableAt(x - 1, y + dy) && !grid.isWalkableAt(x - 1, y))) {
              return [x, y];
            }
          }
        }
        return this._jump(x + dx, y + dy, x, y);
      };
      JPFAlwaysMoveDiagonally.prototype._findNeighbors = function (node) {
        var parent = node.parent,
          x = node.x,
          y = node.y,
          grid = this.grid,
          px,
          py,
          nx,
          ny,
          dx,
          dy,
          neighbors = [],
          neighborNodes,
          neighborNode,
          i,
          l;
        if (parent) {
          px = parent.x;
          py = parent.y;
          dx = (x - px) / Math.max(Math.abs(x - px), 1);
          dy = (y - py) / Math.max(Math.abs(y - py), 1);
          if (dx !== 0 && dy !== 0) {
            if (grid.isWalkableAt(x, y + dy)) {
              neighbors.push([x, y + dy]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
              neighbors.push([x + dx, y]);
            }
            if (grid.isWalkableAt(x + dx, y + dy)) {
              neighbors.push([x + dx, y + dy]);
            }
            if (!grid.isWalkableAt(x - dx, y)) {
              neighbors.push([x - dx, y + dy]);
            }
            if (!grid.isWalkableAt(x, y - dy)) {
              neighbors.push([x + dx, y - dy]);
            }
          } else {
            if (dx === 0) {
              if (grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x, y + dy]);
              }
              if (!grid.isWalkableAt(x + 1, y)) {
                neighbors.push([x + 1, y + dy]);
              }
              if (!grid.isWalkableAt(x - 1, y)) {
                neighbors.push([x - 1, y + dy]);
              }
            } else {
              if (grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y]);
              }
              if (!grid.isWalkableAt(x, y + 1)) {
                neighbors.push([x + dx, y + 1]);
              }
              if (!grid.isWalkableAt(x, y - 1)) {
                neighbors.push([x + dx, y - 1]);
              }
            }
          }
        } else {
          neighborNodes = grid.getNeighbors(node, DiagonalMovement.Always);
          for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
          }
        }
        return neighbors;
      };
      module.exports = JPFAlwaysMoveDiagonally;
    },
    function (module, exports, __webpack_require__) {
      var JumpPointFinderBase = __webpack_require__(14);
      var DiagonalMovement = __webpack_require__(2);

      function JPFNeverMoveDiagonally(opt) {
        JumpPointFinderBase.call(this, opt);
      }

      JPFNeverMoveDiagonally.prototype = new JumpPointFinderBase();
      JPFNeverMoveDiagonally.prototype.constructor = JPFNeverMoveDiagonally;
      JPFNeverMoveDiagonally.prototype._jump = function (x, y, px, py) {
        var grid = this.grid,
          dx = x - px,
          dy = y - py;
        if (!grid.isWalkableAt(x, y)) {
          return null;
        }
        if (this.trackJumpRecursion === true) {
          grid.getNodeAt(x, y).tested = true;
        }
        if (grid.getNodeAt(x, y) === this.endNode) {
          return [x, y];
        }
        if (dx !== 0) {
          if ((grid.isWalkableAt(x, y - 1) && !grid.isWalkableAt(x - dx, y - 1)) || (grid.isWalkableAt(x, y + 1) && !grid.isWalkableAt(x - dx, y + 1))) {
            return [x, y];
          }
        } else if (dy !== 0) {
          if ((grid.isWalkableAt(x - 1, y) && !grid.isWalkableAt(x - 1, y - dy)) || (grid.isWalkableAt(x + 1, y) && !grid.isWalkableAt(x + 1, y - dy))) {
            return [x, y];
          }
          if (this._jump(x + 1, y, x, y) || this._jump(x - 1, y, x, y)) {
            return [x, y];
          }
        } else {
          throw new Error('Only horizontal and vertical movements are allowed');
        }
        return this._jump(x + dx, y + dy, x, y);
      };
      JPFNeverMoveDiagonally.prototype._findNeighbors = function (node) {
        var parent = node.parent,
          x = node.x,
          y = node.y,
          grid = this.grid,
          px,
          py,
          nx,
          ny,
          dx,
          dy,
          neighbors = [],
          neighborNodes,
          neighborNode,
          i,
          l;
        if (parent) {
          px = parent.x;
          py = parent.y;
          dx = (x - px) / Math.max(Math.abs(x - px), 1);
          dy = (y - py) / Math.max(Math.abs(y - py), 1);
          if (dx !== 0) {
            if (grid.isWalkableAt(x, y - 1)) {
              neighbors.push([x, y - 1]);
            }
            if (grid.isWalkableAt(x, y + 1)) {
              neighbors.push([x, y + 1]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
              neighbors.push([x + dx, y]);
            }
          } else if (dy !== 0) {
            if (grid.isWalkableAt(x - 1, y)) {
              neighbors.push([x - 1, y]);
            }
            if (grid.isWalkableAt(x + 1, y)) {
              neighbors.push([x + 1, y]);
            }
            if (grid.isWalkableAt(x, y + dy)) {
              neighbors.push([x, y + dy]);
            }
          }
        } else {
          neighborNodes = grid.getNeighbors(node, DiagonalMovement.Never);
          for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
          }
        }
        return neighbors;
      };
      module.exports = JPFNeverMoveDiagonally;
    },
    function (module, exports, __webpack_require__) {
      var DiagonalMovement = __webpack_require__(2);
      var JPFNeverMoveDiagonally = __webpack_require__(55);
      var JPFAlwaysMoveDiagonally = __webpack_require__(54);
      var JPFMoveDiagonallyIfNoObstacles = __webpack_require__(53);
      var JPFMoveDiagonallyIfAtMostOneObstacle = __webpack_require__(52);

      function JumpPointFinder(opt) {
        opt = opt || {};
        if (opt.diagonalMovement === DiagonalMovement.Never) {
          return new JPFNeverMoveDiagonally(opt);
        } else if (opt.diagonalMovement === DiagonalMovement.Always) {
          return new JPFAlwaysMoveDiagonally(opt);
        } else if (opt.diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
          return new JPFMoveDiagonallyIfNoObstacles(opt);
        } else {
          return new JPFMoveDiagonallyIfAtMostOneObstacle(opt);
        }
      }

      module.exports = JumpPointFinder;
    },
    function (module, exports, __webpack_require__) {
      var Util = __webpack_require__(4);
      var Heuristic = __webpack_require__(10);
      var Node = __webpack_require__(24);
      var DiagonalMovement = __webpack_require__(2);

      function IDAStarFinder(opt) {
        opt = opt || {};
        this.allowDiagonal = opt.allowDiagonal;
        this.dontCrossCorners = opt.dontCrossCorners;
        this.diagonalMovement = opt.diagonalMovement;
        this.heuristic = opt.heuristic || Heuristic.manhattan;
        this.weight = opt.weight || 1;
        this.trackRecursion = opt.trackRecursion || false;
        this.timeLimit = opt.timeLimit || Infinity;
        if (!this.diagonalMovement) {
          if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
          } else {
            if (this.dontCrossCorners) {
              this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
              this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
          }
        }
        if (this.diagonalMovement === DiagonalMovement.Never) {
          this.heuristic = opt.heuristic || Heuristic.manhattan;
        } else {
          this.heuristic = opt.heuristic || Heuristic.octile;
        }
      }

      IDAStarFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
        var nodesVisited = 0;
        var startTime = new Date().getTime();
        var h = function (a, b) {
          return this.heuristic(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
        }.bind(this);
        var cost = function (a, b) {
          return a.x === b.x || a.y === b.y ? 1 : Math.SQRT2;
        };
        var search = function (node, g, cutoff, route, depth) {
          nodesVisited++;
          if (this.timeLimit > 0 && new Date().getTime() - startTime > this.timeLimit * 1e3) {
            return Infinity;
          }
          var f = g + h(node, end) * this.weight;
          if (f > cutoff) {
            return f;
          }
          if (node == end) {
            route[depth] = [node.x, node.y];
            return node;
          }
          var min, t, k, neighbour;
          var neighbours = grid.getNeighbors(node, this.diagonalMovement);
          for (k = 0, min = Infinity; (neighbour = neighbours[k]); ++k) {
            if (this.trackRecursion) {
              neighbour.retainCount = neighbour.retainCount + 1 || 1;
              if (neighbour.tested !== true) {
                neighbour.tested = true;
              }
            }
            t = search(neighbour, g + cost(node, neighbour), cutoff, route, depth + 1);
            if (t instanceof Node) {
              route[depth] = [node.x, node.y];
              return t;
            }
            if (this.trackRecursion && --neighbour.retainCount === 0) {
              neighbour.tested = false;
            }
            if (t < min) {
              min = t;
            }
          }
          return min;
        }.bind(this);
        var start = grid.getNodeAt(startX, startY);
        var end = grid.getNodeAt(endX, endY);
        var cutOff = h(start, end);
        var j, route, t;
        for (j = 0; true; ++j) {
          route = [];
          t = search(start, 0, cutOff, route, 0);
          if (t === Infinity) {
            return [];
          }
          if (t instanceof Node) {
            return route;
          }
          cutOff = t;
        }
        return [];
      };
      module.exports = IDAStarFinder;
    },
    function (module, exports, __webpack_require__) {
      var BiAStarFinder = __webpack_require__(22);

      function BiDijkstraFinder(opt) {
        BiAStarFinder.call(this, opt);
        this.heuristic = function (dx, dy) {
          return 0;
        };
      }

      BiDijkstraFinder.prototype = new BiAStarFinder();
      BiDijkstraFinder.prototype.constructor = BiDijkstraFinder;
      module.exports = BiDijkstraFinder;
    },
    function (module, exports, __webpack_require__) {
      var Util = __webpack_require__(4);
      var DiagonalMovement = __webpack_require__(2);

      function BiBreadthFirstFinder(opt) {
        opt = opt || {};
        this.allowDiagonal = opt.allowDiagonal;
        this.dontCrossCorners = opt.dontCrossCorners;
        this.diagonalMovement = opt.diagonalMovement;
        if (!this.diagonalMovement) {
          if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
          } else {
            if (this.dontCrossCorners) {
              this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
              this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
          }
        }
      }

      BiBreadthFirstFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
        var startNode = grid.getNodeAt(startX, startY),
          endNode = grid.getNodeAt(endX, endY),
          startOpenList = [],
          endOpenList = [],
          neighbors,
          neighbor,
          node,
          diagonalMovement = this.diagonalMovement,
          BY_START = 0,
          BY_END = 1,
          i,
          l;
        startOpenList.push(startNode);
        startNode.opened = true;
        startNode.by = BY_START;
        endOpenList.push(endNode);
        endNode.opened = true;
        endNode.by = BY_END;
        while (startOpenList.length && endOpenList.length) {
          node = startOpenList.shift();
          node.closed = true;
          neighbors = grid.getNeighbors(node, diagonalMovement);
          for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];
            if (neighbor.closed) {
              continue;
            }
            if (neighbor.opened) {
              if (neighbor.by === BY_END) {
                return Util.biBacktrace(node, neighbor);
              }
              continue;
            }
            startOpenList.push(neighbor);
            neighbor.parent = node;
            neighbor.opened = true;
            neighbor.by = BY_START;
          }
          node = endOpenList.shift();
          node.closed = true;
          neighbors = grid.getNeighbors(node, diagonalMovement);
          for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];
            if (neighbor.closed) {
              continue;
            }
            if (neighbor.opened) {
              if (neighbor.by === BY_START) {
                return Util.biBacktrace(neighbor, node);
              }
              continue;
            }
            endOpenList.push(neighbor);
            neighbor.parent = node;
            neighbor.opened = true;
            neighbor.by = BY_END;
          }
        }
        return [];
      };
      module.exports = BiBreadthFirstFinder;
    },
    function (module, exports, __webpack_require__) {
      var BiAStarFinder = __webpack_require__(22);

      function BiBestFirstFinder(opt) {
        BiAStarFinder.call(this, opt);
        var orig = this.heuristic;
        this.heuristic = function (dx, dy) {
          return orig(dx, dy) * 1e6;
        };
      }

      BiBestFirstFinder.prototype = new BiAStarFinder();
      BiBestFirstFinder.prototype.constructor = BiBestFirstFinder;
      module.exports = BiBestFirstFinder;
    },
    function (module, exports, __webpack_require__) {
      var AStarFinder = __webpack_require__(23);

      function DijkstraFinder(opt) {
        AStarFinder.call(this, opt);
        this.heuristic = function (dx, dy) {
          return 0;
        };
      }

      DijkstraFinder.prototype = new AStarFinder();
      DijkstraFinder.prototype.constructor = DijkstraFinder;
      module.exports = DijkstraFinder;
    },
    function (module, exports, __webpack_require__) {
      var Util = __webpack_require__(4);
      var DiagonalMovement = __webpack_require__(2);

      function BreadthFirstFinder(opt) {
        opt = opt || {};
        this.allowDiagonal = opt.allowDiagonal;
        this.dontCrossCorners = opt.dontCrossCorners;
        this.diagonalMovement = opt.diagonalMovement;
        if (!this.diagonalMovement) {
          if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
          } else {
            if (this.dontCrossCorners) {
              this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
              this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
          }
        }
      }

      BreadthFirstFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
        var openList = [],
          diagonalMovement = this.diagonalMovement,
          startNode = grid.getNodeAt(startX, startY),
          endNode = grid.getNodeAt(endX, endY),
          neighbors,
          neighbor,
          node,
          i,
          l;
        openList.push(startNode);
        startNode.opened = true;
        while (openList.length) {
          node = openList.shift();
          node.closed = true;
          if (node === endNode) {
            return Util.backtrace(endNode);
          }
          neighbors = grid.getNeighbors(node, diagonalMovement);
          for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];
            if (neighbor.closed || neighbor.opened) {
              continue;
            }
            openList.push(neighbor);
            neighbor.opened = true;
            neighbor.parent = node;
          }
        }
        return [];
      };
      module.exports = BreadthFirstFinder;
    },
    function (module, exports, __webpack_require__) {
      var AStarFinder = __webpack_require__(23);

      function BestFirstFinder(opt) {
        AStarFinder.call(this, opt);
        var orig = this.heuristic;
        this.heuristic = function (dx, dy) {
          return orig(dx, dy) * 1e6;
        };
      }

      BestFirstFinder.prototype = new AStarFinder();
      BestFirstFinder.prototype.constructor = BestFirstFinder;
      module.exports = BestFirstFinder;
    },
    function (module, exports, __webpack_require__) {
      var Node = __webpack_require__(24);
      var DiagonalMovement = __webpack_require__(2);

      function Grid(width_or_matrix, height, matrix) {
        var width;
        if (typeof width_or_matrix !== 'object') {
          width = width_or_matrix;
        } else {
          height = width_or_matrix.length;
          width = width_or_matrix[0].length;
          matrix = width_or_matrix;
        }
        this.width = width;
        this.height = height;
        this.nodes = this._buildNodes(width, height, matrix);
      }

      Grid.prototype._buildNodes = function (width, height, matrix) {
        var i,
          j,
          nodes = new Array(height);
        for (i = 0; i < height; ++i) {
          nodes[i] = new Array(width);
          for (j = 0; j < width; ++j) {
            nodes[i][j] = new Node(j, i);
          }
        }
        if (matrix === undefined) {
          return nodes;
        }
        if (matrix.length !== height || matrix[0].length !== width) {
          throw new Error('Matrix size does not fit');
        }
        for (i = 0; i < height; ++i) {
          for (j = 0; j < width; ++j) {
            if (matrix[i][j]) {
              nodes[i][j].walkable = false;
            }
          }
        }
        return nodes;
      };
      Grid.prototype.getNodeAt = function (x, y) {
        return this.nodes[y][x];
      };
      Grid.prototype.isWalkableAt = function (x, y) {
        return this.isInside(x, y) && this.nodes[y][x].walkable;
      };
      Grid.prototype.isInside = function (x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
      };
      Grid.prototype.setWalkableAt = function (x, y, walkable) {
        this.nodes[y][x].walkable = walkable;
      };
      Grid.prototype.getNeighbors = function (node, diagonalMovement) {
        var x = node.x,
          y = node.y,
          neighbors = [],
          s0 = false,
          d0 = false,
          s1 = false,
          d1 = false,
          s2 = false,
          d2 = false,
          s3 = false,
          d3 = false,
          nodes = this.nodes;
        if (this.isWalkableAt(x, y - 1)) {
          neighbors.push(nodes[y - 1][x]);
          s0 = true;
        }
        if (this.isWalkableAt(x + 1, y)) {
          neighbors.push(nodes[y][x + 1]);
          s1 = true;
        }
        if (this.isWalkableAt(x, y + 1)) {
          neighbors.push(nodes[y + 1][x]);
          s2 = true;
        }
        if (this.isWalkableAt(x - 1, y)) {
          neighbors.push(nodes[y][x - 1]);
          s3 = true;
        }
        if (diagonalMovement === DiagonalMovement.Never) {
          return neighbors;
        }
        if (diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
          d0 = s3 && s0;
          d1 = s0 && s1;
          d2 = s1 && s2;
          d3 = s2 && s3;
        } else if (diagonalMovement === DiagonalMovement.IfAtMostOneObstacle) {
          d0 = s3 || s0;
          d1 = s0 || s1;
          d2 = s1 || s2;
          d3 = s2 || s3;
        } else if (diagonalMovement === DiagonalMovement.Always) {
          d0 = true;
          d1 = true;
          d2 = true;
          d3 = true;
        } else {
          throw new Error('Incorrect value of diagonalMovement');
        }
        if (d0 && this.isWalkableAt(x - 1, y - 1)) {
          neighbors.push(nodes[y - 1][x - 1]);
        }
        if (d1 && this.isWalkableAt(x + 1, y - 1)) {
          neighbors.push(nodes[y - 1][x + 1]);
        }
        if (d2 && this.isWalkableAt(x + 1, y + 1)) {
          neighbors.push(nodes[y + 1][x + 1]);
        }
        if (d3 && this.isWalkableAt(x - 1, y + 1)) {
          neighbors.push(nodes[y + 1][x - 1]);
        }
        return neighbors;
      };
      Grid.prototype.clone = function () {
        var i,
          j,
          width = this.width,
          height = this.height,
          thisNodes = this.nodes,
          newGrid = new Grid(width, height),
          newNodes = new Array(height);
        for (i = 0; i < height; ++i) {
          newNodes[i] = new Array(width);
          for (j = 0; j < width; ++j) {
            newNodes[i][j] = new Node(j, i, thisNodes[i][j].walkable);
          }
        }
        newGrid.nodes = newNodes;
        return newGrid;
      };
      module.exports = Grid;
    },
    function (module, exports) {
      module.exports = function (module) {
        if (!module.webpackPolyfill) {
          module.deprecate = function () {};
          module.paths = [];
          if (!module.children) module.children = [];
          Object.defineProperty(module, 'loaded', {
            enumerable: true,
            get: function () {
              return module.l;
            },
          });
          Object.defineProperty(module, 'id', {
            enumerable: true,
            get: function () {
              return module.i;
            },
          });
          module.webpackPolyfill = 1;
        }
        return module;
      };
    },
    function (module, exports, __webpack_require__) {
      (function (module) {
        (function () {
          var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;
          (floor = Math.floor), (min = Math.min);
          defaultCmp = function (x, y) {
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          };
          insort = function (a, x, lo, hi, cmp) {
            var mid;
            if (lo == null) {
              lo = 0;
            }
            if (cmp == null) {
              cmp = defaultCmp;
            }
            if (lo < 0) {
              throw new Error('lo must be non-negative');
            }
            if (hi == null) {
              hi = a.length;
            }
            while (lo < hi) {
              mid = floor((lo + hi) / 2);
              if (cmp(x, a[mid]) < 0) {
                hi = mid;
              } else {
                lo = mid + 1;
              }
            }
            return [].splice.apply(a, [lo, lo - lo].concat(x)), x;
          };
          heappush = function (array, item, cmp) {
            if (cmp == null) {
              cmp = defaultCmp;
            }
            array.push(item);
            return _siftdown(array, 0, array.length - 1, cmp);
          };
          heappop = function (array, cmp) {
            var lastelt, returnitem;
            if (cmp == null) {
              cmp = defaultCmp;
            }
            lastelt = array.pop();
            if (array.length) {
              returnitem = array[0];
              array[0] = lastelt;
              _siftup(array, 0, cmp);
            } else {
              returnitem = lastelt;
            }
            return returnitem;
          };
          heapreplace = function (array, item, cmp) {
            var returnitem;
            if (cmp == null) {
              cmp = defaultCmp;
            }
            returnitem = array[0];
            array[0] = item;
            _siftup(array, 0, cmp);
            return returnitem;
          };
          heappushpop = function (array, item, cmp) {
            var _ref;
            if (cmp == null) {
              cmp = defaultCmp;
            }
            if (array.length && cmp(array[0], item) < 0) {
              (_ref = [array[0], item]), (item = _ref[0]), (array[0] = _ref[1]);
              _siftup(array, 0, cmp);
            }
            return item;
          };
          heapify = function (array, cmp) {
            var i, _i, _j, _len, _ref, _ref1, _results, _results1;
            if (cmp == null) {
              cmp = defaultCmp;
            }
            _ref1 = function () {
              _results1 = [];
              for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--) {
                _results1.push(_j);
              }
              return _results1;
            }
              .apply(this)
              .reverse();
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              i = _ref1[_i];
              _results.push(_siftup(array, i, cmp));
            }
            return _results;
          };
          updateItem = function (array, item, cmp) {
            var pos;
            if (cmp == null) {
              cmp = defaultCmp;
            }
            pos = array.indexOf(item);
            if (pos === -1) {
              return;
            }
            _siftdown(array, 0, pos, cmp);
            return _siftup(array, pos, cmp);
          };
          nlargest = function (array, n, cmp) {
            var elem, result, _i, _len, _ref;
            if (cmp == null) {
              cmp = defaultCmp;
            }
            result = array.slice(0, n);
            if (!result.length) {
              return result;
            }
            heapify(result, cmp);
            _ref = array.slice(n);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              elem = _ref[_i];
              heappushpop(result, elem, cmp);
            }
            return result.sort(cmp).reverse();
          };
          nsmallest = function (array, n, cmp) {
            var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
            if (cmp == null) {
              cmp = defaultCmp;
            }
            if (n * 10 <= array.length) {
              result = array.slice(0, n).sort(cmp);
              if (!result.length) {
                return result;
              }
              los = result[result.length - 1];
              _ref = array.slice(n);
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                elem = _ref[_i];
                if (cmp(elem, los) < 0) {
                  insort(result, elem, 0, null, cmp);
                  result.pop();
                  los = result[result.length - 1];
                }
              }
              return result;
            }
            heapify(array, cmp);
            _results = [];
            for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
              _results.push(heappop(array, cmp));
            }
            return _results;
          };
          _siftdown = function (array, startpos, pos, cmp) {
            var newitem, parent, parentpos;
            if (cmp == null) {
              cmp = defaultCmp;
            }
            newitem = array[pos];
            while (pos > startpos) {
              parentpos = (pos - 1) >> 1;
              parent = array[parentpos];
              if (cmp(newitem, parent) < 0) {
                array[pos] = parent;
                pos = parentpos;
                continue;
              }
              break;
            }
            return (array[pos] = newitem);
          };
          _siftup = function (array, pos, cmp) {
            var childpos, endpos, newitem, rightpos, startpos;
            if (cmp == null) {
              cmp = defaultCmp;
            }
            endpos = array.length;
            startpos = pos;
            newitem = array[pos];
            childpos = 2 * pos + 1;
            while (childpos < endpos) {
              rightpos = childpos + 1;
              if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
                childpos = rightpos;
              }
              array[pos] = array[childpos];
              pos = childpos;
              childpos = 2 * pos + 1;
            }
            array[pos] = newitem;
            return _siftdown(array, startpos, pos, cmp);
          };
          Heap = (function () {
            Heap.push = heappush;
            Heap.pop = heappop;
            Heap.replace = heapreplace;
            Heap.pushpop = heappushpop;
            Heap.heapify = heapify;
            Heap.updateItem = updateItem;
            Heap.nlargest = nlargest;
            Heap.nsmallest = nsmallest;

            function Heap(cmp) {
              this.cmp = cmp != null ? cmp : defaultCmp;
              this.nodes = [];
            }

            Heap.prototype.push = function (x) {
              return heappush(this.nodes, x, this.cmp);
            };
            Heap.prototype.pop = function () {
              return heappop(this.nodes, this.cmp);
            };
            Heap.prototype.peek = function () {
              return this.nodes[0];
            };
            Heap.prototype.contains = function (x) {
              return this.nodes.indexOf(x) !== -1;
            };
            Heap.prototype.replace = function (x) {
              return heapreplace(this.nodes, x, this.cmp);
            };
            Heap.prototype.pushpop = function (x) {
              return heappushpop(this.nodes, x, this.cmp);
            };
            Heap.prototype.heapify = function () {
              return heapify(this.nodes, this.cmp);
            };
            Heap.prototype.updateItem = function (x) {
              return updateItem(this.nodes, x, this.cmp);
            };
            Heap.prototype.clear = function () {
              return (this.nodes = []);
            };
            Heap.prototype.empty = function () {
              return this.nodes.length === 0;
            };
            Heap.prototype.size = function () {
              return this.nodes.length;
            };
            Heap.prototype.clone = function () {
              var heap;
              heap = new Heap();
              heap.nodes = this.nodes.slice(0);
              return heap;
            };
            Heap.prototype.toArray = function () {
              return this.nodes.slice(0);
            };
            Heap.prototype.insert = Heap.prototype.push;
            Heap.prototype.top = Heap.prototype.peek;
            Heap.prototype.front = Heap.prototype.peek;
            Heap.prototype.has = Heap.prototype.contains;
            Heap.prototype.copy = Heap.prototype.clone;
            return Heap;
          })();
          if (typeof module !== 'undefined' && module !== null ? module.exports : void 0) {
            module.exports = Heap;
          } else {
            window.Heap = Heap;
          }
        }.call(this));
      }.call(this, __webpack_require__(65)(module)));
    },
    function (module, exports, __webpack_require__) {
      module.exports = {
        Heap: __webpack_require__(15),
        Node: __webpack_require__(24),
        Grid: __webpack_require__(64),
        Util: __webpack_require__(4),
        DiagonalMovement: __webpack_require__(2),
        Heuristic: __webpack_require__(10),
        AStarFinder: __webpack_require__(23),
        BestFirstFinder: __webpack_require__(63),
        BreadthFirstFinder: __webpack_require__(62),
        DijkstraFinder: __webpack_require__(61),
        BiAStarFinder: __webpack_require__(22),
        BiBestFirstFinder: __webpack_require__(60),
        BiBreadthFirstFinder: __webpack_require__(59),
        BiDijkstraFinder: __webpack_require__(58),
        IDAStarFinder: __webpack_require__(57),
        JumpPointFinder: __webpack_require__(56),
      };
    },
    function (module, exports, __webpack_require__) {
      module.exports = __webpack_require__(67);
    },
    function (module, exports) {
      var proto = Element.prototype;
      var vendor = proto.matchesSelector || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector;
      module.exports = match;

      function match(el, selector) {
        if (vendor) return vendor.call(el, selector);
        var nodes = el.parentNode.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; ++i) {
          if (nodes[i] == el) return true;
        }
        return false;
      }
    },
    function (module, exports, __webpack_require__) {
      var matches = __webpack_require__(69);
      module.exports = function (element, selector, checkYoSelf) {
        var parent = checkYoSelf ? element : element.parentNode;
        while (parent && parent !== document) {
          if (matches(parent, selector)) return parent;
          parent = parent.parentNode;
        }
      };
    },
  ]);
});
//# sourceMappingURL=storm-react-diagrams.js.map
