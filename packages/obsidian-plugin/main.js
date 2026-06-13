"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => GanttPlugin,
  destroyLogStore: () => destroyLogStore,
  getSettings: () => getSettings,
  initLogStore: () => initLogStore
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// ../../node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var a;
var s;
var h;
var p;
var v;
var y;
var d = {};
var w = [];
var _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var g = Array.isArray;
function m(n3, l5) {
  for (var u5 in l5)
    n3[u5] = l5[u5];
  return n3;
}
function b(n3) {
  n3 && n3.parentNode && n3.parentNode.removeChild(n3);
}
function k(l5, u5, t4) {
  var i5, r4, o4, e4 = {};
  for (o4 in u5)
    "key" == o4 ? i5 = u5[o4] : "ref" == o4 ? r4 = u5[o4] : e4[o4] = u5[o4];
  if (arguments.length > 2 && (e4.children = arguments.length > 3 ? n.call(arguments, 2) : t4), "function" == typeof l5 && null != l5.defaultProps)
    for (o4 in l5.defaultProps)
      void 0 === e4[o4] && (e4[o4] = l5.defaultProps[o4]);
  return x(l5, e4, i5, r4, null);
}
function x(n3, t4, i5, r4, o4) {
  var e4 = { type: n3, props: t4, key: i5, ref: r4, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o4 ? ++u : o4, __i: -1, __u: 0 };
  return null == o4 && null != l.vnode && l.vnode(e4), e4;
}
function S(n3) {
  return n3.children;
}
function C(n3, l5) {
  this.props = n3, this.context = l5;
}
function $(n3, l5) {
  if (null == l5)
    return n3.__ ? $(n3.__, n3.__i + 1) : null;
  for (var u5; l5 < n3.__k.length; l5++)
    if (null != (u5 = n3.__k[l5]) && null != u5.__e)
      return u5.__e;
  return "function" == typeof n3.type ? $(n3) : null;
}
function I(n3) {
  if (n3.__P && n3.__d) {
    var u5 = n3.__v, t4 = u5.__e, i5 = [], r4 = [], o4 = m({}, u5);
    o4.__v = u5.__v + 1, l.vnode && l.vnode(o4), q(n3.__P, o4, u5, n3.__n, n3.__P.namespaceURI, 32 & u5.__u ? [t4] : null, i5, null == t4 ? $(u5) : t4, !!(32 & u5.__u), r4), o4.__v = u5.__v, o4.__.__k[o4.__i] = o4, D(i5, o4, r4), u5.__e = u5.__ = null, o4.__e != t4 && P(o4);
  }
}
function P(n3) {
  if (null != (n3 = n3.__) && null != n3.__c)
    return n3.__e = n3.__c.base = null, n3.__k.some(function(l5) {
      if (null != l5 && null != l5.__e)
        return n3.__e = n3.__c.base = l5.__e;
    }), P(n3);
}
function A(n3) {
  (!n3.__d && (n3.__d = true) && i.push(n3) && !H.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(H);
}
function H() {
  try {
    for (var n3, l5 = 1; i.length; )
      i.length > l5 && i.sort(e), n3 = i.shift(), l5 = i.length, I(n3);
  } finally {
    i.length = H.__r = 0;
  }
}
function L(n3, l5, u5, t4, i5, r4, o4, e4, f5, c4, a4) {
  var s5, h4, p5, v5, y4, _3, g3, m4 = t4 && t4.__k || w, b3 = l5.length;
  for (f5 = T(u5, l5, m4, f5, b3), s5 = 0; s5 < b3; s5++)
    null != (p5 = u5.__k[s5]) && (h4 = -1 != p5.__i && m4[p5.__i] || d, p5.__i = s5, _3 = q(n3, p5, h4, i5, r4, o4, e4, f5, c4, a4), v5 = p5.__e, p5.ref && h4.ref != p5.ref && (h4.ref && J(h4.ref, null, p5), a4.push(p5.ref, p5.__c || v5, p5)), null == y4 && null != v5 && (y4 = v5), (g3 = !!(4 & p5.__u)) || h4.__k === p5.__k ? (f5 = j(p5, f5, n3, g3), g3 && h4.__e && (h4.__e = null)) : "function" == typeof p5.type && void 0 !== _3 ? f5 = _3 : v5 && (f5 = v5.nextSibling), p5.__u &= -7);
  return u5.__e = y4, f5;
}
function T(n3, l5, u5, t4, i5) {
  var r4, o4, e4, f5, c4, a4 = u5.length, s5 = a4, h4 = 0;
  for (n3.__k = new Array(i5), r4 = 0; r4 < i5; r4++)
    null != (o4 = l5[r4]) && "boolean" != typeof o4 && "function" != typeof o4 ? ("string" == typeof o4 || "number" == typeof o4 || "bigint" == typeof o4 || o4.constructor == String ? o4 = n3.__k[r4] = x(null, o4, null, null, null) : g(o4) ? o4 = n3.__k[r4] = x(S, { children: o4 }, null, null, null) : void 0 === o4.constructor && o4.__b > 0 ? o4 = n3.__k[r4] = x(o4.type, o4.props, o4.key, o4.ref ? o4.ref : null, o4.__v) : n3.__k[r4] = o4, f5 = r4 + h4, o4.__ = n3, o4.__b = n3.__b + 1, e4 = null, -1 != (c4 = o4.__i = O(o4, u5, f5, s5)) && (s5--, (e4 = u5[c4]) && (e4.__u |= 2)), null == e4 || null == e4.__v ? (-1 == c4 && (i5 > a4 ? h4-- : i5 < a4 && h4++), "function" != typeof o4.type && (o4.__u |= 4)) : c4 != f5 && (c4 == f5 - 1 ? h4-- : c4 == f5 + 1 ? h4++ : (c4 > f5 ? h4-- : h4++, o4.__u |= 4))) : n3.__k[r4] = null;
  if (s5)
    for (r4 = 0; r4 < a4; r4++)
      null != (e4 = u5[r4]) && 0 == (2 & e4.__u) && (e4.__e == t4 && (t4 = $(e4)), K(e4, e4));
  return t4;
}
function j(n3, l5, u5, t4) {
  var i5, r4;
  if ("function" == typeof n3.type) {
    for (i5 = n3.__k, r4 = 0; i5 && r4 < i5.length; r4++)
      i5[r4] && (i5[r4].__ = n3, l5 = j(i5[r4], l5, u5, t4));
    return l5;
  }
  n3.__e != l5 && (t4 && (l5 && n3.type && !l5.parentNode && (l5 = $(n3)), u5.insertBefore(n3.__e, l5 || null)), l5 = n3.__e);
  do {
    l5 = l5 && l5.nextSibling;
  } while (null != l5 && 8 == l5.nodeType);
  return l5;
}
function O(n3, l5, u5, t4) {
  var i5, r4, o4, e4 = n3.key, f5 = n3.type, c4 = l5[u5], a4 = null != c4 && 0 == (2 & c4.__u);
  if (null === c4 && null == e4 || a4 && e4 == c4.key && f5 == c4.type)
    return u5;
  if (t4 > (a4 ? 1 : 0)) {
    for (i5 = u5 - 1, r4 = u5 + 1; i5 >= 0 || r4 < l5.length; )
      if (null != (c4 = l5[o4 = i5 >= 0 ? i5-- : r4++]) && 0 == (2 & c4.__u) && e4 == c4.key && f5 == c4.type)
        return o4;
  }
  return -1;
}
function z(n3, l5, u5) {
  "-" == l5[0] ? n3.setProperty(l5, null == u5 ? "" : u5) : n3[l5] = null == u5 ? "" : "number" != typeof u5 || _.test(l5) ? u5 : u5 + "px";
}
function N(n3, l5, u5, t4, i5) {
  var r4, o4;
  n:
    if ("style" == l5)
      if ("string" == typeof u5)
        n3.style.cssText = u5;
      else {
        if ("string" == typeof t4 && (n3.style.cssText = t4 = ""), t4)
          for (l5 in t4)
            u5 && l5 in u5 || z(n3.style, l5, "");
        if (u5)
          for (l5 in u5)
            t4 && u5[l5] == t4[l5] || z(n3.style, l5, u5[l5]);
      }
    else if ("o" == l5[0] && "n" == l5[1])
      r4 = l5 != (l5 = l5.replace(s, "$1")), o4 = l5.toLowerCase(), l5 = o4 in n3 || "onFocusOut" == l5 || "onFocusIn" == l5 ? o4.slice(2) : l5.slice(2), n3.l || (n3.l = {}), n3.l[l5 + r4] = u5, u5 ? t4 ? u5[a] = t4[a] : (u5[a] = h, n3.addEventListener(l5, r4 ? v : p, r4)) : n3.removeEventListener(l5, r4 ? v : p, r4);
    else {
      if ("http://www.w3.org/2000/svg" == i5)
        l5 = l5.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l5 && "height" != l5 && "href" != l5 && "list" != l5 && "form" != l5 && "tabIndex" != l5 && "download" != l5 && "rowSpan" != l5 && "colSpan" != l5 && "role" != l5 && "popover" != l5 && l5 in n3)
        try {
          n3[l5] = null == u5 ? "" : u5;
          break n;
        } catch (n4) {
        }
      "function" == typeof u5 || (null == u5 || false === u5 && "-" != l5[4] ? n3.removeAttribute(l5) : n3.setAttribute(l5, "popover" == l5 && 1 == u5 ? "" : u5));
    }
}
function V(n3) {
  return function(u5) {
    if (this.l) {
      var t4 = this.l[u5.type + n3];
      if (null == u5[c])
        u5[c] = h++;
      else if (u5[c] < t4[a])
        return;
      return t4(l.event ? l.event(u5) : u5);
    }
  };
}
function q(n3, u5, t4, i5, r4, o4, e4, f5, c4, a4) {
  var s5, h4, p5, v5, y4, d4, _3, k3, x3, M, $2, I2, P2, A3, H2, T3 = u5.type;
  if (void 0 !== u5.constructor)
    return null;
  128 & t4.__u && (c4 = !!(32 & t4.__u), o4 = [f5 = u5.__e = t4.__e]), (s5 = l.__b) && s5(u5);
  n:
    if ("function" == typeof T3)
      try {
        if (k3 = u5.props, x3 = T3.prototype && T3.prototype.render, M = (s5 = T3.contextType) && i5[s5.__c], $2 = s5 ? M ? M.props.value : s5.__ : i5, t4.__c ? _3 = (h4 = u5.__c = t4.__c).__ = h4.__E : (x3 ? u5.__c = h4 = new T3(k3, $2) : (u5.__c = h4 = new C(k3, $2), h4.constructor = T3, h4.render = Q), M && M.sub(h4), h4.state || (h4.state = {}), h4.__n = i5, p5 = h4.__d = true, h4.__h = [], h4._sb = []), x3 && null == h4.__s && (h4.__s = h4.state), x3 && null != T3.getDerivedStateFromProps && (h4.__s == h4.state && (h4.__s = m({}, h4.__s)), m(h4.__s, T3.getDerivedStateFromProps(k3, h4.__s))), v5 = h4.props, y4 = h4.state, h4.__v = u5, p5)
          x3 && null == T3.getDerivedStateFromProps && null != h4.componentWillMount && h4.componentWillMount(), x3 && null != h4.componentDidMount && h4.__h.push(h4.componentDidMount);
        else {
          if (x3 && null == T3.getDerivedStateFromProps && k3 !== v5 && null != h4.componentWillReceiveProps && h4.componentWillReceiveProps(k3, $2), u5.__v == t4.__v || !h4.__e && null != h4.shouldComponentUpdate && false === h4.shouldComponentUpdate(k3, h4.__s, $2)) {
            u5.__v != t4.__v && (h4.props = k3, h4.state = h4.__s, h4.__d = false), u5.__e = t4.__e, u5.__k = t4.__k, u5.__k.some(function(n4) {
              n4 && (n4.__ = u5);
            }), w.push.apply(h4.__h, h4._sb), h4._sb = [], h4.__h.length && e4.push(h4);
            break n;
          }
          null != h4.componentWillUpdate && h4.componentWillUpdate(k3, h4.__s, $2), x3 && null != h4.componentDidUpdate && h4.__h.push(function() {
            h4.componentDidUpdate(v5, y4, d4);
          });
        }
        if (h4.context = $2, h4.props = k3, h4.__P = n3, h4.__e = false, I2 = l.__r, P2 = 0, x3)
          h4.state = h4.__s, h4.__d = false, I2 && I2(u5), s5 = h4.render(h4.props, h4.state, h4.context), w.push.apply(h4.__h, h4._sb), h4._sb = [];
        else
          do {
            h4.__d = false, I2 && I2(u5), s5 = h4.render(h4.props, h4.state, h4.context), h4.state = h4.__s;
          } while (h4.__d && ++P2 < 25);
        h4.state = h4.__s, null != h4.getChildContext && (i5 = m(m({}, i5), h4.getChildContext())), x3 && !p5 && null != h4.getSnapshotBeforeUpdate && (d4 = h4.getSnapshotBeforeUpdate(v5, y4)), A3 = null != s5 && s5.type === S && null == s5.key ? E(s5.props.children) : s5, f5 = L(n3, g(A3) ? A3 : [A3], u5, t4, i5, r4, o4, e4, f5, c4, a4), h4.base = u5.__e, u5.__u &= -161, h4.__h.length && e4.push(h4), _3 && (h4.__E = h4.__ = null);
      } catch (n4) {
        if (u5.__v = null, c4 || null != o4)
          if (n4.then) {
            for (u5.__u |= c4 ? 160 : 128; f5 && 8 == f5.nodeType && f5.nextSibling; )
              f5 = f5.nextSibling;
            o4[o4.indexOf(f5)] = null, u5.__e = f5;
          } else {
            for (H2 = o4.length; H2--; )
              b(o4[H2]);
            B(u5);
          }
        else
          u5.__e = t4.__e, u5.__k = t4.__k, n4.then || B(u5);
        l.__e(n4, u5, t4);
      }
    else
      null == o4 && u5.__v == t4.__v ? (u5.__k = t4.__k, u5.__e = t4.__e) : f5 = u5.__e = G(t4.__e, u5, t4, i5, r4, o4, e4, c4, a4);
  return (s5 = l.diffed) && s5(u5), 128 & u5.__u ? void 0 : f5;
}
function B(n3) {
  n3 && (n3.__c && (n3.__c.__e = true), n3.__k && n3.__k.some(B));
}
function D(n3, u5, t4) {
  for (var i5 = 0; i5 < t4.length; i5++)
    J(t4[i5], t4[++i5], t4[++i5]);
  l.__c && l.__c(u5, n3), n3.some(function(u6) {
    try {
      n3 = u6.__h, u6.__h = [], n3.some(function(n4) {
        n4.call(u6);
      });
    } catch (n4) {
      l.__e(n4, u6.__v);
    }
  });
}
function E(n3) {
  return "object" != typeof n3 || null == n3 || n3.__b > 0 ? n3 : g(n3) ? n3.map(E) : void 0 !== n3.constructor ? null : m({}, n3);
}
function G(u5, t4, i5, r4, o4, e4, f5, c4, a4) {
  var s5, h4, p5, v5, y4, w4, _3, m4 = i5.props || d, k3 = t4.props, x3 = t4.type;
  if ("svg" == x3 ? o4 = "http://www.w3.org/2000/svg" : "math" == x3 ? o4 = "http://www.w3.org/1998/Math/MathML" : o4 || (o4 = "http://www.w3.org/1999/xhtml"), null != e4) {
    for (s5 = 0; s5 < e4.length; s5++)
      if ((y4 = e4[s5]) && "setAttribute" in y4 == !!x3 && (x3 ? y4.localName == x3 : 3 == y4.nodeType)) {
        u5 = y4, e4[s5] = null;
        break;
      }
  }
  if (null == u5) {
    if (null == x3)
      return document.createTextNode(k3);
    u5 = document.createElementNS(o4, x3, k3.is && k3), c4 && (l.__m && l.__m(t4, e4), c4 = false), e4 = null;
  }
  if (null == x3)
    m4 === k3 || c4 && u5.data == k3 || (u5.data = k3);
  else {
    if (e4 = "textarea" == x3 && null != k3.defaultValue ? null : e4 && n.call(u5.childNodes), !c4 && null != e4)
      for (m4 = {}, s5 = 0; s5 < u5.attributes.length; s5++)
        m4[(y4 = u5.attributes[s5]).name] = y4.value;
    for (s5 in m4)
      y4 = m4[s5], "dangerouslySetInnerHTML" == s5 ? p5 = y4 : "children" == s5 || s5 in k3 || "value" == s5 && "defaultValue" in k3 || "checked" == s5 && "defaultChecked" in k3 || N(u5, s5, null, y4, o4);
    for (s5 in k3)
      y4 = k3[s5], "children" == s5 ? v5 = y4 : "dangerouslySetInnerHTML" == s5 ? h4 = y4 : "value" == s5 ? w4 = y4 : "checked" == s5 ? _3 = y4 : c4 && "function" != typeof y4 || m4[s5] === y4 || N(u5, s5, y4, m4[s5], o4);
    if (h4)
      c4 || p5 && (h4.__html == p5.__html || h4.__html == u5.innerHTML) || (u5.innerHTML = h4.__html), t4.__k = [];
    else if (p5 && (u5.innerHTML = ""), L("template" == t4.type ? u5.content : u5, g(v5) ? v5 : [v5], t4, i5, r4, "foreignObject" == x3 ? "http://www.w3.org/1999/xhtml" : o4, e4, f5, e4 ? e4[0] : i5.__k && $(i5, 0), c4, a4), null != e4)
      for (s5 = e4.length; s5--; )
        b(e4[s5]);
    c4 && "textarea" != x3 || (s5 = "value", "progress" == x3 && null == w4 ? u5.removeAttribute("value") : null != w4 && (w4 !== u5[s5] || "progress" == x3 && !w4 || "option" == x3 && w4 != m4[s5]) && N(u5, s5, w4, m4[s5], o4), s5 = "checked", null != _3 && _3 != u5[s5] && N(u5, s5, _3, m4[s5], o4));
  }
  return u5;
}
function J(n3, u5, t4) {
  try {
    if ("function" == typeof n3) {
      var i5 = "function" == typeof n3.__u;
      i5 && n3.__u(), i5 && null == u5 || (n3.__u = n3(u5));
    } else
      n3.current = u5;
  } catch (n4) {
    l.__e(n4, t4);
  }
}
function K(n3, u5, t4) {
  var i5, r4;
  if (l.unmount && l.unmount(n3), (i5 = n3.ref) && (i5.current && i5.current != n3.__e || J(i5, null, u5)), null != (i5 = n3.__c)) {
    if (i5.componentWillUnmount)
      try {
        i5.componentWillUnmount();
      } catch (n4) {
        l.__e(n4, u5);
      }
    i5.base = i5.__P = null;
  }
  if (i5 = n3.__k)
    for (r4 = 0; r4 < i5.length; r4++)
      i5[r4] && K(i5[r4], u5, t4 || "function" != typeof n3.type);
  t4 || b(n3.__e), n3.__c = n3.__ = n3.__e = void 0;
}
function Q(n3, l5, u5) {
  return this.constructor(n3, u5);
}
function R(u5, t4, i5) {
  var r4, o4, e4, f5;
  t4 == document && (t4 = document.documentElement), l.__ && l.__(u5, t4), o4 = (r4 = "function" == typeof i5) ? null : i5 && i5.__k || t4.__k, e4 = [], f5 = [], q(t4, u5 = (!r4 && i5 || t4).__k = k(S, null, [u5]), o4 || d, d, t4.namespaceURI, !r4 && i5 ? [i5] : o4 ? null : t4.firstChild ? n.call(t4.childNodes) : null, e4, !r4 && i5 ? i5 : o4 ? o4.__e : t4.firstChild, r4, f5), D(e4, u5, f5);
}
n = w.slice, l = { __e: function(n3, l5, u5, t4) {
  for (var i5, r4, o4; l5 = l5.__; )
    if ((i5 = l5.__c) && !i5.__)
      try {
        if ((r4 = i5.constructor) && null != r4.getDerivedStateFromError && (i5.setState(r4.getDerivedStateFromError(n3)), o4 = i5.__d), null != i5.componentDidCatch && (i5.componentDidCatch(n3, t4 || {}), o4 = i5.__d), o4)
          return i5.__E = i5;
      } catch (l6) {
        n3 = l6;
      }
  throw n3;
} }, u = 0, t = function(n3) {
  return null != n3 && void 0 === n3.constructor;
}, C.prototype.setState = function(n3, l5) {
  var u5;
  u5 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m({}, this.state), "function" == typeof n3 && (n3 = n3(m({}, u5), this.props)), n3 && m(u5, n3), null != n3 && this.__v && (l5 && this._sb.push(l5), A(this));
}, C.prototype.forceUpdate = function(n3) {
  this.__v && (this.__e = true, n3 && this.__h.push(n3), A(this));
}, C.prototype.render = S, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n3, l5) {
  return n3.__v.__b - l5.__v.__b;
}, H.__r = 0, f = Math.random().toString(8), c = "__d" + f, a = "__a" + f, s = /(PointerCapture)$|Capture$/i, h = 0, p = V(false), v = V(true), y = 0;

// ../../node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var s2 = c2.__;
function p2(n3, t4) {
  c2.__h && c2.__h(r2, n3, o2 || t4), o2 = 0;
  var u5 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n3 >= u5.__.length && u5.__.push({}), u5.__[n3];
}
function y2(n3, u5) {
  var i5 = p2(t2++, 3);
  !c2.__s && C2(i5.__H, u5) && (i5.__ = n3, i5.u = u5, r2.__H.__h.push(i5));
}
function A2(n3) {
  return o2 = 5, T2(function() {
    return { current: n3 };
  }, []);
}
function T2(n3, r4) {
  var u5 = p2(t2++, 7);
  return C2(u5.__H, r4) && (u5.__ = n3(), u5.__H = r4, u5.__h = n3), u5.__;
}
function j2() {
  for (var n3; n3 = f2.shift(); ) {
    var t4 = n3.__H;
    if (n3.__P && t4)
      try {
        t4.__h.some(z2), t4.__h.some(B2), t4.__h = [];
      } catch (r4) {
        t4.__h = [], c2.__e(r4, n3.__v);
      }
  }
}
c2.__b = function(n3) {
  r2 = null, e2 && e2(n3);
}, c2.__ = function(n3, t4) {
  n3 && t4.__k && t4.__k.__m && (n3.__m = t4.__k.__m), s2 && s2(n3, t4);
}, c2.__r = function(n3) {
  a2 && a2(n3), t2 = 0;
  var i5 = (r2 = n3.__c).__H;
  i5 && (u2 === r2 ? (i5.__h = [], r2.__h = [], i5.__.some(function(n4) {
    n4.__N && (n4.__ = n4.__N), n4.u = n4.__N = void 0;
  })) : (i5.__h.some(z2), i5.__h.some(B2), i5.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n3) {
  v2 && v2(n3);
  var t4 = n3.__c;
  t4 && t4.__H && (t4.__H.__h.length && (1 !== f2.push(t4) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t4.__H.__.some(function(n4) {
    n4.u && (n4.__H = n4.u), n4.u = void 0;
  })), u2 = r2 = null;
}, c2.__c = function(n3, t4) {
  t4.some(function(n4) {
    try {
      n4.__h.some(z2), n4.__h = n4.__h.filter(function(n5) {
        return !n5.__ || B2(n5);
      });
    } catch (r4) {
      t4.some(function(n5) {
        n5.__h && (n5.__h = []);
      }), t4 = [], c2.__e(r4, n4.__v);
    }
  }), l2 && l2(n3, t4);
}, c2.unmount = function(n3) {
  m2 && m2(n3);
  var t4, r4 = n3.__c;
  r4 && r4.__H && (r4.__H.__.some(function(n4) {
    try {
      z2(n4);
    } catch (n5) {
      t4 = n5;
    }
  }), r4.__H = void 0, t4 && c2.__e(t4, r4.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w2(n3) {
  var t4, r4 = function() {
    clearTimeout(u5), k2 && cancelAnimationFrame(t4), setTimeout(n3);
  }, u5 = setTimeout(r4, 35);
  k2 && (t4 = requestAnimationFrame(r4));
}
function z2(n3) {
  var t4 = r2, u5 = n3.__c;
  "function" == typeof u5 && (n3.__c = void 0, u5()), r2 = t4;
}
function B2(n3) {
  var t4 = r2;
  n3.__c = n3.__(), r2 = t4;
}
function C2(n3, t4) {
  return !n3 || n3.length !== t4.length || t4.some(function(t5, r4) {
    return t5 !== n3[r4];
  });
}

// ../../node_modules/@preact/signals-core/dist/signals-core.module.js
var i3 = Symbol.for("preact-signals");
function t3() {
  if (!(s3 > 1)) {
    var i5, t4 = false;
    !function() {
      var i6 = c3;
      c3 = void 0;
      while (void 0 !== i6) {
        if (i6.S.v === i6.v)
          i6.S.i = i6.i;
        i6 = i6.o;
      }
    }();
    while (void 0 !== h2) {
      var n3 = h2;
      h2 = void 0;
      v3++;
      while (void 0 !== n3) {
        var r4 = n3.u;
        n3.u = void 0;
        n3.f &= -3;
        if (!(8 & n3.f) && w3(n3))
          try {
            n3.c();
          } catch (n4) {
            if (!t4) {
              i5 = n4;
              t4 = true;
            }
          }
        n3 = r4;
      }
    }
    v3 = 0;
    s3--;
    if (t4)
      throw i5;
  } else
    s3--;
}
function n2(i5) {
  if (s3 > 0)
    return i5();
  e3 = ++u3;
  s3++;
  try {
    return i5();
  } finally {
    t3();
  }
}
var r3 = void 0;
function o3(i5) {
  var t4 = r3;
  r3 = void 0;
  try {
    return i5();
  } finally {
    r3 = t4;
  }
}
var f3;
var h2 = void 0;
var s3 = 0;
var v3 = 0;
var u3 = 0;
var e3 = 0;
var c3 = void 0;
var d2 = 0;
function a3(i5) {
  if (void 0 !== r3) {
    var t4 = i5.n;
    if (void 0 === t4 || t4.t !== r3) {
      t4 = { i: 0, S: i5, p: r3.s, n: void 0, t: r3, e: void 0, x: void 0, r: t4 };
      if (void 0 !== r3.s)
        r3.s.n = t4;
      r3.s = t4;
      i5.n = t4;
      if (32 & r3.f)
        i5.S(t4);
      return t4;
    } else if (-1 === t4.i) {
      t4.i = 0;
      if (void 0 !== t4.n) {
        t4.n.p = t4.p;
        if (void 0 !== t4.p)
          t4.p.n = t4.n;
        t4.p = r3.s;
        t4.n = void 0;
        r3.s.n = t4;
        r3.s = t4;
      }
      return t4;
    }
  }
}
function l3(i5, t4) {
  this.v = i5;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
  this.l = 0;
  this.W = null == t4 ? void 0 : t4.watched;
  this.Z = null == t4 ? void 0 : t4.unwatched;
  this.name = null == t4 ? void 0 : t4.name;
}
l3.prototype.brand = i3;
l3.prototype.h = function() {
  return true;
};
l3.prototype.S = function(i5) {
  var t4 = this, n3 = this.t;
  if (n3 !== i5 && void 0 === i5.e) {
    i5.x = n3;
    this.t = i5;
    if (void 0 !== n3)
      n3.e = i5;
    else
      o3(function() {
        var i6;
        null == (i6 = t4.W) || i6.call(t4);
      });
  }
};
l3.prototype.U = function(i5) {
  var t4 = this;
  if (void 0 !== this.t) {
    var n3 = i5.e, r4 = i5.x;
    if (void 0 !== n3) {
      n3.x = r4;
      i5.e = void 0;
    }
    if (void 0 !== r4) {
      r4.e = n3;
      i5.x = void 0;
    }
    if (i5 === this.t) {
      this.t = r4;
      if (void 0 === r4)
        o3(function() {
          var i6;
          null == (i6 = t4.Z) || i6.call(t4);
        });
    }
  }
};
l3.prototype.subscribe = function(i5) {
  var t4 = this;
  return j3(function() {
    var n3 = t4.value, o4 = r3;
    r3 = void 0;
    try {
      i5(n3);
    } finally {
      r3 = o4;
    }
  }, { name: "sub" });
};
l3.prototype.valueOf = function() {
  return this.value;
};
l3.prototype.toString = function() {
  return this.value + "";
};
l3.prototype.toJSON = function() {
  return this.value;
};
l3.prototype.peek = function() {
  var i5 = this;
  return o3(function() {
    return i5.value;
  });
};
Object.defineProperty(l3.prototype, "value", { get: function() {
  var i5 = a3(this);
  if (void 0 !== i5)
    i5.i = this.i;
  return this.v;
}, set: function(i5) {
  if (i5 !== this.v) {
    if (v3 > 100)
      throw new Error("Cycle detected");
    !function(i6) {
      if (0 !== s3 && 0 === v3) {
        if (i6.l !== e3) {
          i6.l = e3;
          c3 = { S: i6, v: i6.v, i: i6.i, o: c3 };
        }
      }
    }(this);
    this.v = i5;
    this.i++;
    d2++;
    s3++;
    try {
      for (var n3 = this.t; void 0 !== n3; n3 = n3.x)
        n3.t.N();
    } finally {
      t3();
    }
  }
} });
function y3(i5, t4) {
  return new l3(i5, t4);
}
function w3(i5) {
  for (var t4 = i5.s; void 0 !== t4; t4 = t4.n)
    if (t4.S.i !== t4.i || !t4.S.h() || t4.S.i !== t4.i)
      return true;
  return false;
}
function _2(i5) {
  for (var t4 = i5.s; void 0 !== t4; t4 = t4.n) {
    var n3 = t4.S.n;
    if (void 0 !== n3)
      t4.r = n3;
    t4.S.n = t4;
    t4.i = -1;
    if (void 0 === t4.n) {
      i5.s = t4;
      break;
    }
  }
}
function b2(i5) {
  var t4 = i5.s, n3 = void 0;
  while (void 0 !== t4) {
    var r4 = t4.p;
    if (-1 === t4.i) {
      t4.S.U(t4);
      if (void 0 !== r4)
        r4.n = t4.n;
      if (void 0 !== t4.n)
        t4.n.p = r4;
    } else
      n3 = t4;
    t4.S.n = t4.r;
    if (void 0 !== t4.r)
      t4.r = void 0;
    t4 = r4;
  }
  i5.s = n3;
}
function p3(i5, t4) {
  l3.call(this, void 0);
  this.x = i5;
  this.s = void 0;
  this.g = d2 - 1;
  this.f = 4;
  this.W = null == t4 ? void 0 : t4.watched;
  this.Z = null == t4 ? void 0 : t4.unwatched;
  this.name = null == t4 ? void 0 : t4.name;
}
p3.prototype = new l3();
p3.prototype.h = function() {
  this.f &= -3;
  if (1 & this.f)
    return false;
  if (32 == (36 & this.f))
    return true;
  this.f &= -5;
  if (this.g === d2)
    return true;
  this.g = d2;
  this.f |= 1;
  if (this.i > 0 && !w3(this)) {
    this.f &= -2;
    return true;
  }
  var i5 = r3;
  try {
    _2(this);
    r3 = this;
    var t4 = this.x();
    if (16 & this.f || this.v !== t4 || 0 === this.i) {
      this.v = t4;
      this.f &= -17;
      this.i++;
    }
  } catch (i6) {
    this.v = i6;
    this.f |= 16;
    this.i++;
  }
  r3 = i5;
  b2(this);
  this.f &= -2;
  return true;
};
p3.prototype.S = function(i5) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (var t4 = this.s; void 0 !== t4; t4 = t4.n)
      t4.S.S(t4);
  }
  l3.prototype.S.call(this, i5);
};
p3.prototype.U = function(i5) {
  if (void 0 !== this.t) {
    l3.prototype.U.call(this, i5);
    if (void 0 === this.t) {
      this.f &= -33;
      for (var t4 = this.s; void 0 !== t4; t4 = t4.n)
        t4.S.U(t4);
    }
  }
};
p3.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i5 = this.t; void 0 !== i5; i5 = i5.x)
      i5.t.N();
  }
};
Object.defineProperty(p3.prototype, "value", { get: function() {
  if (1 & this.f)
    throw new Error("Cycle detected");
  var i5 = a3(this);
  this.h();
  if (void 0 !== i5)
    i5.i = this.i;
  if (16 & this.f)
    throw this.v;
  return this.v;
} });
function g2(i5, t4) {
  return new p3(i5, t4);
}
function S2(i5) {
  var n3 = i5.m;
  i5.m = void 0;
  if ("function" == typeof n3) {
    s3++;
    var o4 = r3;
    r3 = void 0;
    try {
      n3();
    } catch (t4) {
      i5.f &= -2;
      i5.f |= 8;
      m3(i5);
      throw t4;
    } finally {
      r3 = o4;
      t3();
    }
  }
}
function m3(i5) {
  for (var t4 = i5.s; void 0 !== t4; t4 = t4.n)
    t4.S.U(t4);
  i5.x = void 0;
  i5.s = void 0;
  S2(i5);
}
function x2(i5) {
  if (r3 !== this)
    throw new Error("Out-of-order effect");
  b2(this);
  r3 = i5;
  this.f &= -2;
  if (8 & this.f)
    m3(this);
  t3();
}
function E2(i5, t4) {
  this.x = i5;
  this.m = void 0;
  this.s = void 0;
  this.u = void 0;
  this.f = 32;
  this.name = null == t4 ? void 0 : t4.name;
  if (f3)
    f3.push(this);
}
E2.prototype.c = function() {
  var i5 = this.S();
  try {
    if (8 & this.f)
      return;
    if (void 0 === this.x)
      return;
    var t4 = this.x();
    if ("function" == typeof t4)
      this.m = t4;
  } finally {
    i5();
  }
};
E2.prototype.S = function() {
  if (1 & this.f)
    throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  S2(this);
  _2(this);
  s3++;
  var i5 = r3;
  r3 = this;
  return x2.bind(this, i5);
};
E2.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.u = h2;
    h2 = this;
  }
};
E2.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f))
    m3(this);
};
E2.prototype.dispose = function() {
  this.d();
};
function j3(i5, t4) {
  var n3 = new E2(i5, t4);
  try {
    n3.c();
  } catch (i6) {
    n3.d();
    throw i6;
  }
  var r4 = n3.d.bind(n3);
  r4[Symbol.dispose] = r4;
  return r4;
}

// ../../node_modules/@preact/signals/dist/signals.module.js
var v4;
var s4;
function l4(i5, n3) {
  l[i5] = n3.bind(null, l[i5] || function() {
  });
}
function d3(i5) {
  if (s4) {
    var r4 = s4;
    s4 = void 0;
    r4();
  }
  s4 = i5 && i5.S();
}
function h3(i5) {
  var r4 = this, f5 = i5.data, o4 = useSignal(f5);
  o4.value = f5;
  var e4 = T2(function() {
    var i6 = r4.__v;
    while (i6 = i6.__)
      if (i6.__c) {
        i6.__c.__$f |= 4;
        break;
      }
    r4.__$u.c = function() {
      var i7, t4 = r4.__$u.S(), f6 = e4.value;
      t4();
      if (t(f6) || 3 !== (null == (i7 = r4.base) ? void 0 : i7.nodeType)) {
        r4.__$f |= 1;
        r4.setState({});
      } else
        r4.base.data = f6;
    };
    return g2(function() {
      var i7 = o4.value.value;
      return 0 === i7 ? 0 : true === i7 ? "" : i7 || "";
    });
  }, []);
  return e4.value;
}
h3.displayName = "_st";
Object.defineProperties(l3.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: h3 }, props: { configurable: true, get: function() {
  return { data: this };
} }, __b: { configurable: true, value: 1 } });
l4("__b", function(i5, r4) {
  if ("string" == typeof r4.type) {
    var n3, t4 = r4.props;
    for (var f5 in t4)
      if ("children" !== f5) {
        var o4 = t4[f5];
        if (o4 instanceof l3) {
          if (!n3)
            r4.__np = n3 = {};
          n3[f5] = o4;
          t4[f5] = o4.peek();
        }
      }
  }
  i5(r4);
});
l4("__r", function(i5, r4) {
  i5(r4);
  d3();
  var n3, t4 = r4.__c;
  if (t4) {
    t4.__$f &= -2;
    if (void 0 === (n3 = t4.__$u))
      t4.__$u = n3 = function(i6) {
        var r5;
        j3(function() {
          r5 = this;
        });
        r5.c = function() {
          t4.__$f |= 1;
          t4.setState({});
        };
        return r5;
      }();
  }
  v4 = t4;
  d3(n3);
});
l4("__e", function(i5, r4, n3, t4) {
  d3();
  v4 = void 0;
  i5(r4, n3, t4);
});
l4("diffed", function(i5, r4) {
  d3();
  v4 = void 0;
  var n3;
  if ("string" == typeof r4.type && (n3 = r4.__e)) {
    var t4 = r4.__np, f5 = r4.props;
    if (t4) {
      var o4 = n3.U;
      if (o4)
        for (var e4 in o4) {
          var u5 = o4[e4];
          if (void 0 !== u5 && !(e4 in t4)) {
            u5.d();
            o4[e4] = void 0;
          }
        }
      else
        n3.U = o4 = {};
      for (var a4 in t4) {
        var c4 = o4[a4], s5 = t4[a4];
        if (void 0 === c4) {
          c4 = p4(n3, a4, s5, f5);
          o4[a4] = c4;
        } else
          c4.o(s5, f5);
      }
    }
  }
  i5(r4);
});
function p4(i5, r4, n3, t4) {
  var f5 = r4 in i5 && void 0 === i5.ownerSVGElement, o4 = y3(n3);
  return { o: function(i6, r5) {
    o4.value = i6;
    t4 = r5;
  }, d: j3(function() {
    var n4 = o4.value.value;
    if (t4[r4] !== n4) {
      t4[r4] = n4;
      if (f5)
        i5[r4] = n4;
      else if (n4)
        i5.setAttribute(r4, n4);
      else
        i5.removeAttribute(r4);
    }
  }) };
}
l4("unmount", function(i5, r4) {
  if ("string" == typeof r4.type) {
    var n3 = r4.__e;
    if (n3) {
      var t4 = n3.U;
      if (t4) {
        n3.U = void 0;
        for (var f5 in t4) {
          var o4 = t4[f5];
          if (o4)
            o4.d();
        }
      }
    }
  } else {
    var e4 = r4.__c;
    if (e4) {
      var u5 = e4.__$u;
      if (u5) {
        e4.__$u = void 0;
        u5.d();
      }
    }
  }
  i5(r4);
});
l4("__h", function(i5, r4, n3, t4) {
  if (t4 < 3 || 9 === t4)
    r4.__$f |= 2;
  i5(r4, n3, t4);
});
C.prototype.shouldComponentUpdate = function(i5, r4) {
  if (this.__R)
    return true;
  var n3 = this.__$u, t4 = n3 && void 0 !== n3.s;
  for (var f5 in r4)
    return true;
  if (this.__f || "boolean" == typeof this.u && true === this.u) {
    if (!(t4 || 2 & this.__$f || 4 & this.__$f))
      return true;
    if (1 & this.__$f)
      return true;
  } else {
    if (!(t4 || 4 & this.__$f))
      return true;
    if (3 & this.__$f)
      return true;
  }
  for (var o4 in i5)
    if ("__source" !== o4 && i5[o4] !== this.props[o4])
      return true;
  for (var e4 in this.props)
    if (!(e4 in i5))
      return true;
  return false;
};
function useSignal(i5) {
  return T2(function() {
    return y3(i5);
  }, []);
}

// ../gantt-core/dist/index.js
function applyStatusCascade(tasks, caches, edits) {
  const projectStatuses = /* @__PURE__ */ new Map();
  for (const cache of caches) {
    for (const project of cache.projects) {
      const projectOverride = edits.projectOverrides?.[project.id];
      const effectiveStatus = projectOverride?.status ?? project.status ?? "pending";
      projectStatuses.set(project.id, effectiveStatus);
    }
  }
  for (const task of tasks) {
    const projectId = task.projectId.value;
    if (!projectId)
      continue;
    const projectStatus = projectStatuses.get(projectId);
    if (projectStatus === "completed" && task.status.value !== "cancelled") {
      task.status = { value: "completed", source: "upstream" };
    }
  }
  const projectTaskCounts = /* @__PURE__ */ new Map();
  for (const task of tasks) {
    const projectId = task.projectId.value;
    if (!projectId)
      continue;
    if (!projectTaskCounts.has(projectId)) {
      projectTaskCounts.set(projectId, { total: 0, completed: 0, cancelled: 0 });
    }
    const counts = projectTaskCounts.get(projectId);
    counts.total++;
    if (task.status.value === "completed")
      counts.completed++;
    if (task.status.value === "cancelled")
      counts.cancelled++;
  }
  for (const [projectId, counts] of projectTaskCounts) {
    const nonCancelled = counts.total - counts.cancelled;
    if (nonCancelled > 0 && counts.completed >= nonCancelled) {
      const hasManualOverride = edits.projectOverrides?.[projectId]?.status !== void 0;
      if (!hasManualOverride) {
        projectStatuses.set(projectId, "completed");
      }
    }
  }
  return tasks;
}
var EDITABLE_FIELDS = [
  "title",
  "startDate",
  "endDate",
  "progress",
  "status",
  "personId",
  "projectId",
  "parentId",
  "dependencies",
  "tags",
  "url",
  "description"
];
function fieldWithSource(value, source) {
  return { value, source };
}
function mergeFields(task, overrides, connectorId) {
  const ov = overrides ?? {};
  function get(field, upstreamVal) {
    if (field in ov) {
      return fieldWithSource(ov[field], "manual");
    }
    return fieldWithSource(upstreamVal, "upstream");
  }
  const taskId = task.id != null ? String(task.id) : "";
  return {
    id: taskId,
    title: get("title", task.title ?? "Untitled"),
    startDate: get("startDate", task.startDate ?? null),
    endDate: get("endDate", task.endDate ?? null),
    progress: get("progress", task.progress ?? 0),
    status: get("status", task.status ?? "pending"),
    personId: get("personId", task.personId ?? null),
    projectId: get("projectId", task.projectId ?? null),
    parentId: get("parentId", task.parentId ?? null),
    dependencies: get("dependencies", task.dependencies ?? []),
    tags: get("tags", task.tags ?? []),
    url: get("url", task.url ?? null),
    metadata: task.metadata ?? {},
    connectorId,
    upstreamId: task.id,
    upstreamDeleted: false
  };
}
function localToLocalTask(task) {
  return {
    id: task.id != null ? String(task.id) : "",
    title: fieldWithSource(task.title ?? "Untitled", "manual"),
    startDate: fieldWithSource(task.startDate ?? null, "manual"),
    endDate: fieldWithSource(task.endDate ?? null, "manual"),
    progress: fieldWithSource(task.progress ?? 0, "manual"),
    status: fieldWithSource(task.status ?? "pending", "manual"),
    personId: fieldWithSource(task.personId ?? null, "manual"),
    projectId: fieldWithSource(task.projectId ?? null, "manual"),
    parentId: fieldWithSource(task.parentId ?? null, "manual"),
    dependencies: fieldWithSource(task.dependencies ?? [], "manual"),
    tags: fieldWithSource(task.tags ?? [], "manual"),
    url: fieldWithSource(task.url ?? null, "manual"),
    metadata: task.metadata ?? {},
    connectorId: null,
    upstreamId: null,
    upstreamDeleted: false
  };
}
function mergeTasks(cachedTasks, edits, connectorId) {
  const overrideMap = edits.overrides ?? {};
  const hidden = new Set(edits.hidden ?? []);
  const deleted = new Set(edits.deletedTasks ?? []);
  const result = [];
  for (const task of cachedTasks) {
    if (!task.id)
      continue;
    if (hidden.has(task.id))
      continue;
    if (deleted.has(task.id))
      continue;
    const overrides = overrideMap[task.id];
    result.push(mergeFields(task, overrides, connectorId));
  }
  for (const [taskId, overrides] of Object.entries(overrideMap)) {
    const stillExists = cachedTasks.some((t4) => t4.id === taskId);
    if (!stillExists) {
      const synthetic = {
        id: taskId,
        title: overrides.title ?? taskId,
        ...overrides
      };
      const local = mergeFields(synthetic, overrides, connectorId);
      local.upstreamDeleted = true;
      result.push(local);
    }
  }
  for (const localTask of edits.localTasks ?? []) {
    if (!localTask.id)
      continue;
    if (hidden.has(localTask.id))
      continue;
    result.push(localToLocalTask(localTask));
  }
  return result;
}
function detectConflicts(cachedTasks, edits) {
  const conflicts = [];
  const overrideMap = edits.overrides ?? {};
  for (const task of cachedTasks) {
    const overrides = overrideMap[task.id];
    if (!overrides)
      continue;
    for (const field of EDITABLE_FIELDS) {
      if (!(field in overrides))
        continue;
      const upstreamVal = task[field];
      const manualVal = overrides[field];
      if (upstreamVal !== manualVal) {
        conflicts.push({
          taskId: task.id,
          field,
          upstreamValue: upstreamVal,
          manualValue: manualVal
        });
      }
    }
  }
  return conflicts;
}
function applyFieldReset(edits, taskId, fieldName) {
  const overrides = edits.overrides[taskId];
  if (!overrides || !(fieldName in overrides)) {
    return null;
  }
  const newOverrides = { ...overrides };
  delete newOverrides[fieldName];
  const newOverrideMap = { ...edits.overrides };
  if (Object.keys(newOverrides).length === 0) {
    delete newOverrideMap[taskId];
  } else {
    newOverrideMap[taskId] = newOverrides;
  }
  return {
    ...edits,
    overrides: newOverrideMap
  };
}
function mergeAll(caches, edits) {
  const allTasks = [];
  for (const cache of caches) {
    const merged = mergeTasks(cache.tasks, edits, cache.connectorId);
    allTasks.push(...merged);
  }
  return applyStatusCascade(allTasks, caches, edits);
}
function parseDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string")
    return /* @__PURE__ */ new Date(NaN);
  const parts = dateStr.split("-");
  if (parts.length !== 3)
    return /* @__PURE__ */ new Date(NaN);
  const [y4, m4, d4] = parts.map(Number);
  if (isNaN(y4) || isNaN(m4) || isNaN(d4))
    return /* @__PURE__ */ new Date(NaN);
  if (m4 < 1 || m4 > 12 || d4 < 1 || d4 > 31)
    return /* @__PURE__ */ new Date(NaN);
  return new Date(Date.UTC(y4, m4 - 1, d4, 12, 0, 0));
}
function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string")
    return false;
  const parts = dateStr.split("-");
  if (parts.length !== 3)
    return false;
  const [y4, m4, d4] = parts.map(Number);
  if (isNaN(y4) || isNaN(m4) || isNaN(d4))
    return false;
  if (m4 < 1 || m4 > 12 || d4 < 1 || d4 > 31)
    return false;
  if (y4 < 1900 || y4 > 2200)
    return false;
  const date = new Date(Date.UTC(y4, m4 - 1, d4, 12, 0, 0));
  if (date.getUTCFullYear() !== y4 || date.getUTCMonth() !== m4 - 1 || date.getUTCDate() !== d4)
    return false;
  return !isNaN(date.getTime());
}
function formatDate(d4) {
  const y4 = d4.getUTCFullYear();
  const m4 = String(d4.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d4.getUTCDate()).padStart(2, "0");
  return `${y4}-${m4}-${day}`;
}
function daysBetween(a4, b3) {
  const da = parseDate(a4);
  const db = parseDate(b3);
  if (isNaN(da.getTime()) || isNaN(db.getTime()))
    return 0;
  return Math.round((db.getTime() - da.getTime()) / 864e5);
}
function getDayOfWeek(date) {
  const d4 = parseDate(date);
  if (isNaN(d4.getTime()))
    return -1;
  return d4.getUTCDay();
}
function isWeekend(date) {
  const dow = getDayOfWeek(date);
  return dow === 0 || dow === 6;
}
function getDateLabelType(date, config) {
  if (config.holidaysEnabled && config.holidayDates?.includes(date))
    return "holiday";
  if (config.weekendsEnabled && isWeekend(date)) {
    if (config.holidaysEnabled && config.makeupWorkdays?.includes(date))
      return "makeup";
    return "weekend";
  }
  return "normal";
}
function isNonWorkingDay(date, config) {
  const type = getDateLabelType(date, config);
  return type === "weekend" || type === "holiday";
}
function getNonWorkingBlocks(startDate, endDate, config) {
  if (!config.weekendsEnabled && !config.holidaysEnabled)
    return [];
  if (!isValidDate(startDate) || !isValidDate(endDate))
    return [];
  if (endDate < startDate)
    return [];
  const blocks = [];
  let blockStart = null;
  const totalDays = daysBetween(startDate, endDate) + 1;
  for (let i5 = 0; i5 < totalDays; i5++) {
    const date = addDays(startDate, i5);
    if (isNonWorkingDay(date, config)) {
      if (blockStart === null) {
        blockStart = date;
      }
    } else {
      if (blockStart !== null) {
        blocks.push({ start: blockStart, end: addDays(date, -1) });
        blockStart = null;
      }
    }
  }
  if (blockStart !== null) {
    blocks.push({ start: blockStart, end: endDate });
  }
  return blocks;
}
function addDays(date, days) {
  const d4 = parseDate(date);
  if (isNaN(d4.getTime()))
    return "";
  const result = new Date(d4.getTime() + days * 864e5);
  return formatDate(result);
}
function todayString() {
  return formatDate(/* @__PURE__ */ new Date());
}
function computeTimelineRange(dates, paddingDays = 7) {
  const validDates = dates.filter((d4) => isValidDate(d4));
  if (validDates.length === 0) {
    const today = todayString();
    return { startDate: today, endDate: today };
  }
  let minDate = validDates[0];
  let maxDate = validDates[0];
  for (const d4 of validDates) {
    const parsed = parseDate(d4);
    if (parsed < parseDate(minDate))
      minDate = d4;
    if (parsed > parseDate(maxDate))
      maxDate = d4;
  }
  return {
    startDate: addDays(minDate, -paddingDays) || todayString(),
    endDate: addDays(maxDate, paddingDays) || todayString()
  };
}
function parseCSV(text, options = {}) {
  const delimiter = options.delimiter ?? ",";
  if (!text)
    return [];
  if (text.charCodeAt(0) === 65279) {
    text = text.slice(1);
  }
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows = splitRows(text);
  if (rows.length === 0)
    return [];
  const headers = parseRow(rows[0], delimiter);
  const results = [];
  for (let i5 = 1; i5 < rows.length; i5++) {
    const fields = parseRow(rows[i5], delimiter);
    const record = {};
    for (let j4 = 0; j4 < headers.length; j4++) {
      record[headers[j4]] = fields[j4] ?? "";
    }
    results.push(record);
  }
  return results;
}
function splitRows(text) {
  const rows = [];
  let current = "";
  let inQuotes = false;
  for (let i5 = 0; i5 < text.length; i5++) {
    const ch = text[i5];
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (ch === "\n" && !inQuotes) {
      rows.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.length > 0) {
    rows.push(current);
  }
  return rows;
}
function parseRow(row, delimiter) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i5 = 0; i5 < row.length; i5++) {
    const ch = row[i5];
    if (ch === '"') {
      if (inQuotes && i5 + 1 < row.length && row[i5 + 1] === '"') {
        current += '"';
        i5++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}
function parseDateStr(raw) {
  const y4 = raw.slice(0, 4);
  const m4 = raw.slice(4, 6);
  const d4 = raw.slice(6, 8);
  return `${y4}-${m4}-${d4}`;
}
function matchDateProp(line) {
  const m4 = line.match(/^(?:DTSTART|DTEND)(?:;[^:]*)?:(\d{8})(?:T\d{6}Z?)?$/i);
  return m4 ? parseDateStr(m4[1]) : null;
}
function parseICS(text) {
  const eventMap = /* @__PURE__ */ new Map();
  const normalized = text.replace(/\r\n?/g, "\n").replace(/\n[ \t]/g, "");
  const lines = normalized.split("\n");
  let inEvent = false;
  let dtStart = null;
  let dtEnd = null;
  let summary = "";
  function flushEvent() {
    if (!dtStart)
      return;
    const endDate = dtEnd ?? addDays(dtStart, 1);
    const totalDays = daysBetween(dtStart, endDate);
    for (let i5 = 0; i5 < totalDays; i5++) {
      const date = addDays(dtStart, i5);
      const existing = eventMap.get(date);
      if (!existing || summary.length > existing.length) {
        eventMap.set(date, summary);
      }
    }
  }
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "BEGIN:VEVENT") {
      inEvent = true;
      dtStart = null;
      dtEnd = null;
      summary = "";
      continue;
    }
    if (trimmed === "END:VEVENT") {
      flushEvent();
      inEvent = false;
      continue;
    }
    if (!inEvent)
      continue;
    if (trimmed.toUpperCase().startsWith("DTSTART")) {
      dtStart = matchDateProp(trimmed);
      continue;
    }
    if (trimmed.toUpperCase().startsWith("DTEND")) {
      dtEnd = matchDateProp(trimmed);
      continue;
    }
    const summaryMatch = trimmed.match(/^SUMMARY(?:;[^:]*)?:(.+)$/i);
    if (summaryMatch) {
      summary = summaryMatch[1].trim();
    }
  }
  const events = [];
  for (const [date, s5] of eventMap) {
    events.push({ date, summary: s5 });
  }
  events.sort((a4, b3) => a4.date.localeCompare(b3.date));
  return events;
}
function classifyICSEvents(events) {
  const holidayDates = [];
  const makeupWorkdays = [];
  const makeupPattern = /补班|(?<![调休])班|调休上班|makeup|workday|working/i;
  for (const ev of events) {
    if (makeupPattern.test(ev.summary)) {
      makeupWorkdays.push(ev.date);
    } else {
      holidayDates.push(ev.date);
    }
  }
  return { holidayDates, makeupWorkdays };
}
var DEFAULT_LOG_SETTINGS = {
  enabled: true,
  level: "info",
  retentionDays: 30
};
var LEVEL_ORDER = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};
function meetsLevel(entryLevel, minLevel) {
  return LEVEL_ORDER[entryLevel] >= LEVEL_ORDER[minLevel];
}
function createLogEntry(level, source, message, data) {
  return {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    level,
    source,
    message,
    data
  };
}
var PlatformError = class extends Error {
  constructor(message, code, cause) {
    super(message);
    this.code = code;
    this.cause = cause;
    this.name = "PlatformError";
  }
};

// ../../node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f4 = 0;
var i4 = Array.isArray;
function u4(e4, t4, n3, o4, i5, u5) {
  t4 || (t4 = {});
  var a4, c4, p5 = t4;
  if ("ref" in p5)
    for (c4 in p5 = {}, t4)
      "ref" == c4 ? a4 = t4[c4] : p5[c4] = t4[c4];
  var l5 = { type: e4, props: p5, key: n3, ref: a4, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f4, __i: -1, __u: 0, __source: i5, __self: u5 };
  if ("function" == typeof e4 && (a4 = e4.defaultProps))
    for (c4 in a4)
      void 0 === p5[c4] && (p5[c4] = a4[c4]);
  return l.vnode && l.vnode(l5), l5;
}

// ../gantt-ui/dist/index.js
var _setIcon = null;
function configureIconRenderer(fn) {
  _setIcon = fn;
}
var CURATED_ICONS = [
  "check",
  "triangle",
  "diamond",
  "target",
  "circle",
  "play",
  "star",
  "flag",
  "clock",
  "calendar",
  "alert-triangle",
  "zap",
  "pin",
  "bookmark",
  "heart",
  "thumbs-up"
];
function isLucideIcon(name) {
  return CURATED_ICONS.includes(name);
}
function Icon(props) {
  const ref = A2(null);
  const { name, size = 16 } = props;
  y2(() => {
    if (ref.current) {
      if (_setIcon) {
        _setIcon(ref.current, name);
      } else {
        ref.current.textContent = name;
      }
    }
  }, [name]);
  return /* @__PURE__ */ u4(
    "span",
    {
      ref,
      class: props.class ?? "gantt-icon",
      title: props.title,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        ...props.style
      }
    }
  );
}
var SCROLL_GUARD_DURATION = 100;
function safeName(name) {
  return name.replace(/[\\/:*?"<>|]/g, "_");
}
function createGanttStore(platform) {
  configureIconRenderer((el, name) => platform.setIcon(el, name));
  const logger = platform.createLogger("ui");
  const caches = y3([]);
  const edits = y3(null);
  const views = y3([]);
  const currentViewId = y3(null);
  const selectedEntity = y3(null);
  const hoveredTaskId = y3(null);
  const sharedScrollLeft = y3(0);
  const personScrollTop = y3(0);
  const projectScrollTop = y3(0);
  const personSortMode = y3("name");
  const projectSortMode = y3("name");
  const projectSortKeyDates = y3(["\u4E0A\u7EBF\u65F6\u95F4"]);
  const positionOrder = y3([]);
  const detailPanelWidth = y3(220);
  const leftPanelWidth = y3(180);
  const filterTimeStart = y3("");
  const filterTimeEnd = y3("");
  const filterStatuses = y3(/* @__PURE__ */ new Set());
  const filterTags = y3(/* @__PURE__ */ new Set());
  const tagDefinitions = y3([]);
  const holidayConfig = y3({
    weekendsEnabled: true,
    holidaysEnabled: true,
    holidayDates: [],
    makeupWorkdays: []
  });
  const isLoading = y3(false);
  const error = y3(null);
  const pushProgress = y3(null);
  const fieldMemory = y3({
    requesters: [],
    keyDateNames: [],
    keyLinkNames: []
  });
  const detailCache = y3(/* @__PURE__ */ new Map());
  const detailLoading = y3(/* @__PURE__ */ new Set());
  let scrollGuardActive = false;
  let scrollGuardTimer = null;
  function syncScrollTo(value) {
    if (!scrollGuardActive) {
      scrollGuardActive = true;
      sharedScrollLeft.value = value;
      if (scrollGuardTimer)
        clearTimeout(scrollGuardTimer);
      scrollGuardTimer = setTimeout(() => {
        scrollGuardActive = false;
      }, SCROLL_GUARD_DURATION);
    }
  }
  let personScrollGuardActive = false;
  let personScrollGuardTimer = null;
  let projectScrollGuardActive = false;
  let projectScrollGuardTimer = null;
  function syncPersonScrollTop(value) {
    if (!personScrollGuardActive) {
      personScrollGuardActive = true;
      personScrollTop.value = value;
      if (personScrollGuardTimer)
        clearTimeout(personScrollGuardTimer);
      personScrollGuardTimer = setTimeout(() => {
        personScrollGuardActive = false;
      }, SCROLL_GUARD_DURATION);
    }
  }
  function syncProjectScrollTop(value) {
    if (!projectScrollGuardActive) {
      projectScrollGuardActive = true;
      projectScrollTop.value = value;
      if (projectScrollGuardTimer)
        clearTimeout(projectScrollGuardTimer);
      projectScrollGuardTimer = setTimeout(() => {
        projectScrollGuardActive = false;
      }, SCROLL_GUARD_DURATION);
    }
  }
  const mergedTasks = g2(() => {
    const currentEdits = edits.value;
    const currentCaches = caches.value;
    if (!currentEdits || currentCaches.length === 0)
      return [];
    return mergeAll(currentCaches, currentEdits);
  });
  const persons = g2(() => {
    const personMap = /* @__PURE__ */ new Map();
    for (const cache of caches.value) {
      for (const p5 of cache.persons) {
        if (p5.id)
          personMap.set(p5.id, p5);
      }
    }
    return [...personMap.values()];
  });
  const projects = g2(() => {
    const projectMap = /* @__PURE__ */ new Map();
    for (const cache of caches.value) {
      for (const p5 of cache.projects) {
        if (p5.id)
          projectMap.set(p5.id, p5);
      }
    }
    return [...projectMap.values()];
  });
  const mergedProjects = g2(() => {
    const overrides = edits.value?.projectOverrides ?? {};
    const deletedProjects = new Set(edits.value?.deletedProjects ?? []);
    const cache = detailCache.value;
    return projects.value.filter((p5) => p5.id && !deletedProjects.has(p5.id)).map((p5) => {
      let base = p5;
      for (const c4 of caches.value) {
        const detail = cache.get(`${c4.connectorId}:project:${p5.id}`);
        if (detail) {
          base = {
            ...base,
            description: detail.description ?? base.description,
            requester: detail.requester ?? base.requester,
            keyDates: detail.keyDates ?? base.keyDates,
            keyLinks: detail.keyLinks ?? base.keyLinks,
            tags: detail.tags ?? base.tags,
            status: detail.status ?? base.status,
            color: detail.color ?? base.color
          };
          break;
        }
      }
      const override = overrides[p5.id];
      if (!override)
        return base;
      return { ...base, ...override };
    });
  });
  const personGroups = g2(() => {
    const map = /* @__PURE__ */ new Map();
    const personMap = new Map(persons.value.filter((p5) => p5.id).map((p5) => [p5.id, p5]));
    for (const t4 of mergedTasks.value) {
      const key = t4.personId.value || "__unassigned__";
      if (!map.has(key))
        map.set(key, []);
      map.get(key).push(t4);
    }
    for (const p5 of persons.value) {
      if (p5.id && !map.has(p5.id)) {
        map.set(p5.id, []);
      }
    }
    const groups = [];
    for (const [personId, tasks] of map) {
      const person = personMap.get(personId);
      groups.push({
        personId,
        personName: person?.name ?? "Unassigned",
        position: person?.position,
        tasks
      });
    }
    const mode = personSortMode.value;
    const orderList = positionOrder.value;
    const rankMap = /* @__PURE__ */ new Map();
    if (orderList.length > 0) {
      for (let i5 = 0; i5 < orderList.length; i5++) {
        rankMap.set(orderList[i5].trim(), i5);
      }
    }
    groups.sort((a4, b3) => {
      if (a4.personId === "__unassigned__")
        return 1;
      if (b3.personId === "__unassigned__")
        return -1;
      if (mode === "position") {
        const pa = a4.position;
        const pb = b3.position;
        if (pa && pb) {
          const ra = rankMap.get(pa);
          const rb = rankMap.get(pb);
          if (ra !== void 0 && rb !== void 0)
            return ra - rb;
          if (ra !== void 0)
            return -1;
          if (rb !== void 0)
            return 1;
          return pa.localeCompare(pb);
        }
        if (pa && !pb)
          return -1;
        if (!pa && pb)
          return 1;
      }
      return a4.personName.localeCompare(b3.personName);
    });
    return groups;
  });
  const projectGroups = g2(() => {
    const map = /* @__PURE__ */ new Map();
    const projectInfoMap = new Map(mergedProjects.value.filter((p5) => p5.id).map((p5) => [p5.id, p5]));
    for (const t4 of mergedTasks.value) {
      const key = t4.projectId.value || "__no_project__";
      if (!map.has(key))
        map.set(key, []);
      map.get(key).push(t4);
    }
    const groups = [];
    for (const [projectId, tasks] of map) {
      const info = projectInfoMap.get(projectId);
      groups.push({
        projectId,
        projectName: info?.name || projectId,
        color: info?.color || void 0,
        tasks
      });
    }
    const sortMode = projectSortMode.value;
    if (sortMode === "time") {
      const sortKeyDates = projectSortKeyDates.value;
      const projectTimeInfo = /* @__PURE__ */ new Map();
      for (const [projectId, projectTasks] of map) {
        const info = projectInfoMap.get(projectId);
        let sortDate = null;
        for (const kdName of sortKeyDates) {
          const kd = info?.keyDates?.find((k3) => k3.name === kdName);
          if (kd?.date) {
            sortDate = kd.date;
            break;
          }
        }
        let lastEnd = null;
        for (const t4 of projectTasks) {
          const e4 = t4.endDate.value;
          if (e4 && (!lastEnd || e4 > lastEnd))
            lastEnd = e4;
        }
        projectTimeInfo.set(projectId, { sortDate, lastEnd });
      }
      groups.sort((a4, b3) => {
        const infoA = projectTimeInfo.get(a4.projectId);
        const infoB = projectTimeInfo.get(b3.projectId);
        const dateA = infoA?.sortDate ?? null;
        const dateB = infoB?.sortDate ?? null;
        const effA = dateA ?? infoA?.lastEnd ?? null;
        const effB = dateB ?? infoB?.lastEnd ?? null;
        if (effA && effB)
          return effA.localeCompare(effB);
        if (effA)
          return -1;
        if (effB)
          return 1;
        return a4.projectName.localeCompare(b3.projectName);
      });
    } else {
      groups.sort((a4, b3) => a4.projectName.localeCompare(b3.projectName));
    }
    return groups;
  });
  const unassignedProjects = g2(() => {
    const taskProjectIds = new Set(
      mergedTasks.value.map((t4) => t4.projectId.value).filter(Boolean)
    );
    const localTaskProjectIds = /* @__PURE__ */ new Set();
    if (edits.value) {
      for (const lt of edits.value.localTasks) {
        if (lt.projectId)
          localTaskProjectIds.add(lt.projectId);
      }
    }
    return projects.value.filter(
      (p5) => !taskProjectIds.has(p5.id) && !localTaskProjectIds.has(p5.id)
    );
  });
  const highlightedTaskIds = g2(() => {
    const sel = selectedEntity.value;
    if (!sel)
      return /* @__PURE__ */ new Set();
    if (sel.type === "project") {
      return new Set(
        mergedTasks.value.filter((t4) => t4.projectId.value === sel.id).map((t4) => t4.id)
      );
    }
    if (sel.type === "task") {
      const task = mergedTasks.value.find((t4) => t4.id === sel.id);
      if (!task)
        return /* @__PURE__ */ new Set();
      const projectId = task.projectId.value;
      return new Set(
        mergedTasks.value.filter((t4) => t4.projectId.value === projectId).map((t4) => t4.id)
      );
    }
    if (sel.type === "person") {
      return new Set(
        mergedTasks.value.filter((t4) => t4.personId.value === sel.id).map((t4) => t4.id)
      );
    }
    return /* @__PURE__ */ new Set();
  });
  const selectedTaskId = g2(() => {
    const sel = selectedEntity.value;
    return sel?.type === "task" ? sel.id : null;
  });
  const selectedProjectId = g2(() => {
    const sel = selectedEntity.value;
    return sel?.type === "project" ? sel.id : null;
  });
  const locateTarget = y3(null);
  const timelineRange = g2(() => {
    const allDates = [];
    for (const t4 of mergedTasks.value) {
      if (t4.startDate.value)
        allDates.push(t4.startDate.value);
      if (t4.endDate.value)
        allDates.push(t4.endDate.value);
    }
    return computeTimelineRange(allDates, 7);
  });
  const filteredProjectGroupKeys = g2(() => {
    const timeStart = filterTimeStart.value;
    const timeEnd = filterTimeEnd.value;
    const statuses = filterStatuses.value;
    const tags = filterTags.value;
    if (!timeStart && !timeEnd && statuses.size === 0 && tags.size === 0) {
      return null;
    }
    const matchingIds = /* @__PURE__ */ new Set();
    for (const group of projectGroups.value) {
      const projectId = group.projectId;
      if (projectId === "__no_project__") {
        matchingIds.add(projectId);
        continue;
      }
      const project = mergedProjects.value.find((p5) => p5.id === projectId);
      if (!project)
        continue;
      let match = true;
      if (match && (timeStart || timeEnd)) {
        let timeMatch = false;
        if (project.keyDates) {
          for (const kd of project.keyDates) {
            if ((!timeStart || kd.date >= timeStart) && (!timeEnd || kd.date <= timeEnd)) {
              timeMatch = true;
              break;
            }
          }
        }
        if (!timeMatch) {
          for (const task of group.tasks) {
            const s5 = task.startDate.value;
            const e4 = task.endDate.value ?? s5;
            if (s5 && e4) {
              const taskEndBeforeStart = timeStart && e4 < timeStart;
              const taskStartAfterEnd = timeEnd && s5 > timeEnd;
              if (!taskEndBeforeStart && !taskStartAfterEnd) {
                timeMatch = true;
                break;
              }
            }
          }
        }
        match = timeMatch;
      }
      if (match && statuses.size > 0) {
        const projStatus = project.status ?? "pending";
        match = statuses.has(projStatus);
      }
      if (match && tags.size > 0) {
        const projTags = project.tags ?? [];
        match = projTags.some((t4) => tags.has(t4));
      }
      if (match)
        matchingIds.add(projectId);
    }
    return matchingIds;
  });
  const filterDimmedTaskIds = g2(() => {
    const matchingKeys = filteredProjectGroupKeys.value;
    if (matchingKeys === null)
      return /* @__PURE__ */ new Set();
    const dimmed = /* @__PURE__ */ new Set();
    for (const group of projectGroups.value) {
      if (!matchingKeys.has(group.projectId)) {
        for (const task of group.tasks) {
          dimmed.add(task.id);
        }
      }
    }
    return dimmed;
  });
  const availableFilterTags = g2(() => {
    const nameSet = /* @__PURE__ */ new Set();
    for (const td of tagDefinitions.value)
      nameSet.add(td.name);
    for (const p5 of projects.value) {
      for (const t4 of p5.tags ?? [])
        nameSet.add(t4);
    }
    const projOverrides = edits.value?.projectOverrides ?? {};
    for (const [, overrides] of Object.entries(projOverrides)) {
      if (overrides.tags) {
        for (const t4 of overrides.tags)
          nameSet.add(t4);
      }
    }
    return [...nameSet].sort().map((n3) => ({ value: n3, label: n3 }));
  });
  const conflicts = g2(() => {
    const currentEdits = edits.value;
    if (!currentEdits)
      return [];
    const allConflicts = [];
    for (const cache of caches.value) {
      allConflicts.push(...detectConflicts(cache.tasks, currentEdits));
    }
    return allConflicts;
  });
  async function loadFieldMemory() {
    const viewId = currentViewId.value;
    if (!viewId)
      return;
    try {
      const raw = await platform.storage.read(`memory/${safeName(viewId)}.json`);
      if (raw) {
        const data = JSON.parse(raw);
        fieldMemory.value = {
          requesters: data.requesters ?? [],
          keyDateNames: data.keyDateNames ?? [],
          keyLinkNames: data.keyLinkNames ?? []
        };
      } else {
        fieldMemory.value = { requesters: [], keyDateNames: [], keyLinkNames: [] };
      }
    } catch {
      fieldMemory.value = { requesters: [], keyDateNames: [], keyLinkNames: [] };
    }
  }
  async function saveFieldMemory(field, value) {
    const viewId = currentViewId.value;
    if (!viewId || !value)
      return;
    const mem = fieldMemory.value;
    const list = [...mem[field]];
    const idx = list.indexOf(value);
    if (idx !== -1)
      list.splice(idx, 1);
    list.unshift(value);
    if (list.length > 50)
      list.length = 50;
    const updated = { ...mem, [field]: list };
    fieldMemory.value = updated;
    try {
      await platform.storage.write(`memory/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    } catch {
    }
  }
  async function loadView(viewId) {
    isLoading.value = true;
    error.value = null;
    try {
      const viewRaw = await platform.storage.read(`views/${safeName(viewId)}.json`);
      if (!viewRaw)
        throw new Error(`View not found: ${viewId}`);
      const view = JSON.parse(viewRaw);
      const editsRaw = await platform.storage.read(`edits/${safeName(viewId)}.json`);
      const viewEdits = editsRaw ? JSON.parse(editsRaw) : { viewId, overrides: {}, order: [], hidden: [], localTasks: [] };
      const loadedCaches = [];
      for (const connectorId of view.connectors) {
        const cacheRaw = await platform.storage.read(`cache/${safeName(connectorId)}.json`);
        if (cacheRaw) {
          loadedCaches.push(JSON.parse(cacheRaw));
        }
      }
      n2(() => {
        views.value = [...views.value.filter((v5) => v5.id !== viewId), view];
        currentViewId.value = viewId;
        caches.value = loadedCaches;
        edits.value = viewEdits;
      });
      await loadTags();
      await loadSettings();
      await loadFieldMemory();
    } catch (e4) {
      error.value = e4 instanceof Error ? e4.message : String(e4);
    } finally {
      isLoading.value = false;
    }
  }
  function buildViewState() {
    return {
      filterTimeStart: filterTimeStart.value || void 0,
      filterTimeEnd: filterTimeEnd.value || void 0,
      filterStatuses: filterStatuses.value.size > 0 ? [...filterStatuses.value] : void 0,
      filterTags: filterTags.value.size > 0 ? [...filterTags.value] : void 0,
      personSortMode: personSortMode.value,
      projectSortMode: projectSortMode.value,
      projectSortKeyDates: projectSortKeyDates.value,
      positionOrder: positionOrder.value.length > 0 ? positionOrder.value : void 0
    };
  }
  async function refreshConnector(connectorId) {
    isLoading.value = true;
    error.value = null;
    try {
      const configPath = `connectors/${safeName(connectorId)}.json`;
      let configRaw = await platform.storage.read(configPath);
      let connConfig;
      if (configRaw) {
        connConfig = JSON.parse(configRaw);
      } else {
        connConfig = { script: `connectors/${connectorId}.js` };
        await platform.storage.write(configPath, JSON.stringify(connConfig, null, 2));
        logger.info(`Auto-created connector config: ${configPath}`);
      }
      const scriptPath = connConfig.script || `connectors/${safeName(connectorId)}.js`;
      const mod = await platform.connectorLoader.load(scriptPath);
      const viewState = buildViewState();
      const ctx = platform.createConnectorContext(connConfig, viewState, connectorId);
      const rawData = await mod.fetch(ctx);
      const canonical = mod.transform(rawData, ctx);
      const cache = {
        connectorId,
        lastFetch: (/* @__PURE__ */ new Date()).toISOString(),
        lastError: null,
        tasks: canonical.tasks ?? [],
        persons: canonical.persons ?? [],
        projects: canonical.projects ?? []
      };
      await platform.storage.write(`cache/${safeName(connectorId)}.json`, JSON.stringify(cache, null, 2));
      caches.value = [
        ...caches.value.filter((c4) => c4.connectorId !== connectorId),
        cache
      ];
      const prefix = `${connectorId}:`;
      const newDetailCache = new Map(detailCache.value);
      for (const key of newDetailCache.keys()) {
        if (key.startsWith(prefix))
          newDetailCache.delete(key);
      }
      detailCache.value = newDetailCache;
    } catch (e4) {
      const msg = e4 instanceof Error ? e4.message : String(e4);
      logger.error(`Failed to refresh connector "${connectorId}": ${msg}`);
      error.value = msg;
    } finally {
      isLoading.value = false;
    }
  }
  const DETAIL_FETCH_TIMEOUT_MS = 1e4;
  async function fetchEntityDetail(id, type, connectorId) {
    const cacheKey = `${connectorId}:${type}:${id}`;
    const cached = detailCache.value.get(cacheKey);
    if (cached) {
      logger.info(`[detail] cache hit for ${cacheKey}`);
      return cached;
    }
    if (detailLoading.value.has(cacheKey)) {
      logger.info(`[detail] already loading ${cacheKey}`);
      return null;
    }
    const configPath = `connectors/${safeName(connectorId)}.json`;
    const configRaw = await platform.storage.read(configPath);
    if (!configRaw) {
      logger.info(`[detail] no connector config at ${configPath}`);
      return null;
    }
    const connConfig = JSON.parse(configRaw);
    const scriptPath = connConfig.script || `connectors/${safeName(connectorId)}.js`;
    logger.info(`[detail] loading ${type} detail for ${id} from ${scriptPath}`);
    let mod;
    try {
      mod = await platform.connectorLoader.load(scriptPath);
    } catch (e4) {
      logger.info(`[detail] failed to load connector: ${e4.message}`);
      return null;
    }
    if (!mod.fetchDetail || !mod.transformDetail) {
      logger.info(`[detail] connector has no fetchDetail/transformDetail, using fallback`);
      return buildFallbackDetail(id, type, connectorId);
    }
    detailLoading.value = /* @__PURE__ */ new Set([...detailLoading.value, cacheKey]);
    try {
      const viewState = buildViewState();
      const ctx = platform.createConnectorContext(connConfig, viewState, connectorId);
      logger.info(`[detail] calling fetchDetail for ${type}/${id}`);
      const rawData = await Promise.race([
        mod.fetchDetail(id, type, ctx),
        new Promise(
          (_3, reject) => setTimeout(() => reject(new Error("Detail fetch timeout")), DETAIL_FETCH_TIMEOUT_MS)
        )
      ]);
      const detail = mod.transformDetail(rawData, ctx);
      const newCache = new Map(detailCache.value);
      newCache.set(cacheKey, detail);
      detailCache.value = newCache;
      logger.info(`[detail] fetchDetail succeeded for ${type}/${id}`);
      return detail;
    } catch (e4) {
      logger.info(`[detail] fetchDetail failed: ${e4.message}, using fallback`);
      return buildFallbackDetail(id, type, connectorId);
    } finally {
      const loading = new Set(detailLoading.value);
      loading.delete(cacheKey);
      detailLoading.value = loading;
    }
  }
  function buildFallbackDetail(id, type, connectorId) {
    const cache = caches.value.find((c4) => c4.connectorId === connectorId);
    if (!cache)
      return null;
    if (type === "project") {
      const project = cache.projects.find((p5) => p5.id === id);
      if (!project)
        return null;
      return {
        id: project.id,
        name: project.name,
        status: project.status,
        color: project.color,
        description: project.description,
        requester: project.requester,
        keyDates: project.keyDates,
        keyLinks: project.keyLinks,
        tags: project.tags,
        metadata: project.metadata
      };
    }
    const task = cache.tasks.find((t4) => t4.id === id);
    if (!task)
      return null;
    return {
      id: task.id,
      title: task.title,
      startDate: task.startDate,
      endDate: task.endDate,
      progress: task.progress,
      status: task.status,
      personId: task.personId,
      projectId: task.projectId,
      parentId: task.parentId,
      dependencies: task.dependencies,
      tags: task.tags,
      url: task.url,
      metadata: task.metadata
    };
  }
  async function persistEdit(taskId, fieldName, value) {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId)
      return;
    const isLocal = currentEdits.localTasks.some((t4) => t4.id === taskId);
    if (isLocal) {
      const updated2 = {
        ...currentEdits,
        localTasks: currentEdits.localTasks.map(
          (t4) => t4.id === taskId ? { ...t4, [fieldName]: value } : t4
        )
      };
      await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated2, null, 2));
      edits.value = updated2;
      return;
    }
    const overrides = { ...currentEdits.overrides };
    const taskOverrides = { ...overrides[taskId] ?? {} };
    taskOverrides[fieldName] = value;
    overrides[taskId] = taskOverrides;
    const updated = {
      ...currentEdits,
      overrides
    };
    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
  }
  async function resetField(taskId, fieldName) {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId)
      return;
    const updated = applyFieldReset(currentEdits, taskId, fieldName);
    if (!updated)
      return;
    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
  }
  async function createLocalTask(task) {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId)
      return;
    const updated = {
      ...currentEdits,
      localTasks: [...currentEdits.localTasks, task]
    };
    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
  }
  async function persistProjectEdit(projectId, fieldName, value) {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId)
      return;
    const projectOverrides = { ...currentEdits.projectOverrides ?? {} };
    const projectFields = { ...projectOverrides[projectId] ?? {} };
    projectFields[fieldName] = value;
    projectOverrides[projectId] = projectFields;
    const updated = {
      ...currentEdits,
      projectOverrides
    };
    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
  }
  async function persistPersonEdit(personId, fieldName, value) {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId)
      return;
    const personOverrides = { ...currentEdits.personOverrides ?? {} };
    const personFields = { ...personOverrides[personId] ?? {} };
    personFields[fieldName] = value;
    personOverrides[personId] = personFields;
    const updated = {
      ...currentEdits,
      personOverrides
    };
    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
  }
  function selectEntity(entity) {
    selectedEntity.value = entity;
  }
  async function deleteTask(taskId) {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId)
      return;
    const isLocal = currentEdits.localTasks.some((t4) => t4.id === taskId);
    let updated;
    if (isLocal) {
      const newOverrides = { ...currentEdits.overrides };
      delete newOverrides[taskId];
      updated = {
        ...currentEdits,
        localTasks: currentEdits.localTasks.filter((t4) => t4.id !== taskId),
        overrides: newOverrides
      };
    } else {
      const deletedTasks = [...currentEdits.deletedTasks ?? []];
      if (!deletedTasks.includes(taskId)) {
        deletedTasks.push(taskId);
      }
      updated = {
        ...currentEdits,
        deletedTasks
      };
    }
    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
    selectEntity(null);
  }
  async function deleteProject(projectId) {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId)
      return;
    const deletedProjects = [...currentEdits.deletedProjects ?? []];
    if (!deletedProjects.includes(projectId)) {
      deletedProjects.push(projectId);
    }
    const deletedTasks = [...currentEdits.deletedTasks ?? []];
    const allTasks = mergeAll(caches.value, currentEdits);
    const cascadeTaskIds = [];
    for (const task of allTasks) {
      if (task.projectId.value === projectId && !deletedTasks.includes(task.id)) {
        deletedTasks.push(task.id);
        cascadeTaskIds.push(task.id);
      }
    }
    const newProjectOverrides = { ...currentEdits.projectOverrides ?? {} };
    delete newProjectOverrides[projectId];
    const newOverrides = { ...currentEdits.overrides };
    for (const taskId of cascadeTaskIds) {
      delete newOverrides[taskId];
    }
    const cascadeTaskIdSet = new Set(cascadeTaskIds);
    const updated = {
      ...currentEdits,
      deletedProjects,
      deletedTasks,
      projectOverrides: Object.keys(newProjectOverrides).length > 0 ? newProjectOverrides : void 0,
      overrides: newOverrides,
      localTasks: currentEdits.localTasks.filter((t4) => !cascadeTaskIdSet.has(t4.id))
    };
    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
    selectEntity(null);
  }
  async function setTaskStatus(taskId, status) {
    await persistEdit(taskId, "status", status);
    await cascadeTaskToProject(taskId, status);
  }
  async function cascadeTaskToProject(taskId, newStatus) {
    const allTasks = mergedTasks.value;
    const task = allTasks.find((t4) => t4.id === taskId);
    if (!task)
      return;
    const projectId = task.projectId.value;
    if (!projectId)
      return;
    const projectTasks = allTasks.filter((t4) => t4.projectId.value === projectId);
    if (projectTasks.length === 0)
      return;
    const nonCancelled = projectTasks.filter((t4) => t4.status.value !== "cancelled");
    if (nonCancelled.length === 0)
      return;
    const completed = nonCancelled.filter((t4) => t4.status.value === "completed");
    const projectOverride = edits.value?.projectOverrides?.[projectId]?.status;
    let upstreamStatus = "pending";
    for (const cache of caches.value) {
      const p5 = cache.projects.find((pr) => pr.id === projectId);
      if (p5) {
        upstreamStatus = p5.status ?? "pending";
        break;
      }
    }
    if (completed.length >= nonCancelled.length) {
      if (projectOverride !== "completed" && upstreamStatus !== "completed") {
        await persistProjectEdit(projectId, "status", "completed");
      }
    } else if (newStatus !== "completed") {
      if (projectOverride === "completed") {
        await persistProjectEdit(projectId, "status", "pending");
      }
    }
  }
  async function setProjectStatus(projectId, status) {
    await persistProjectEdit(projectId, "status", status);
  }
  async function pushChanges(selectedIds) {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId)
      return [];
    const results = [];
    const hasSelection = selectedIds !== void 0 && selectedIds.size > 0;
    const payload = {
      tasks: [],
      projects: [],
      deletedTaskIds: hasSelection ? (currentEdits.deletedTasks ?? []).filter((id) => selectedIds.has(id)) : currentEdits.deletedTasks ?? [],
      deletedProjectIds: hasSelection ? (currentEdits.deletedProjects ?? []).filter((id) => selectedIds.has(id)) : currentEdits.deletedProjects ?? []
    };
    const pushedTaskIds = /* @__PURE__ */ new Set();
    const pushedProjectIds = /* @__PURE__ */ new Set();
    for (const [taskId, overrides] of Object.entries(currentEdits.overrides)) {
      if (hasSelection && !selectedIds.has(taskId))
        continue;
      payload.tasks.push({ id: taskId, ...overrides });
      pushedTaskIds.add(taskId);
    }
    for (const lt of currentEdits.localTasks) {
      if (hasSelection && !selectedIds.has(lt.id))
        continue;
      payload.tasks.push(lt);
      pushedTaskIds.add(lt.id);
    }
    if (currentEdits.projectOverrides) {
      for (const [projectId, overrides] of Object.entries(currentEdits.projectOverrides)) {
        if (hasSelection && !selectedIds.has(projectId))
          continue;
        payload.projects.push({ id: projectId, ...overrides });
        pushedProjectIds.add(projectId);
      }
    }
    for (const id of payload.deletedTaskIds)
      pushedTaskIds.add(id);
    for (const id of payload.deletedProjectIds)
      pushedProjectIds.add(id);
    const totalItems = payload.tasks.length + payload.projects.length + payload.deletedTaskIds.length + payload.deletedProjectIds.length;
    const connectorFailedItems = [];
    for (const cache of caches.value) {
      try {
        const configPath = `connectors/${safeName(cache.connectorId)}.json`;
        const configRaw = await platform.storage.read(configPath);
        if (!configRaw)
          continue;
        const connConfig = JSON.parse(configRaw);
        const scriptPath = connConfig.script || `connectors/${safeName(cache.connectorId)}.js`;
        const mod = await platform.connectorLoader.load(scriptPath);
        if (!mod.push) {
          results.push({ connectorId: cache.connectorId, success: false, error: "Connector does not support push" });
          continue;
        }
        const ctx = platform.createConnectorContext(connConfig, buildViewState(), cache.connectorId);
        const onProgress = (progress) => {
          pushProgress.value = progress;
        };
        const result = await mod.push(payload, ctx, onProgress);
        results.push({ connectorId: cache.connectorId, success: result.success, error: result.error });
        if (result.failedItems && result.failedItems.length > 0) {
          for (const fi of result.failedItems) {
            connectorFailedItems.push(fi);
          }
        }
      } catch (e4) {
        results.push({ connectorId: cache.connectorId, success: false, error: e4 instanceof Error ? e4.message : String(e4) });
      }
    }
    pushProgress.value = null;
    const failedTaskIds = /* @__PURE__ */ new Set();
    const failedProjectIds = /* @__PURE__ */ new Set();
    for (const fi of connectorFailedItems) {
      if (fi.type === "task")
        failedTaskIds.add(fi.id);
      else
        failedProjectIds.add(fi.id);
    }
    const succeededTaskIds = /* @__PURE__ */ new Set();
    const succeededProjectIds = /* @__PURE__ */ new Set();
    for (const id of pushedTaskIds) {
      if (!failedTaskIds.has(id))
        succeededTaskIds.add(id);
    }
    for (const id of pushedProjectIds) {
      if (!failedProjectIds.has(id))
        succeededProjectIds.add(id);
    }
    const anySuccess = results.some((r4) => r4.success) || connectorFailedItems.length > 0;
    if (anySuccess && (succeededTaskIds.size > 0 || succeededProjectIds.size > 0)) {
      const newOverrides = { ...currentEdits.overrides };
      for (const id of succeededTaskIds)
        delete newOverrides[id];
      const newProjectOverrides = { ...currentEdits.projectOverrides ?? {} };
      for (const id of succeededProjectIds)
        delete newProjectOverrides[id];
      const cleared = {
        ...currentEdits,
        overrides: newOverrides,
        localTasks: currentEdits.localTasks.filter((lt) => !succeededTaskIds.has(lt.id)),
        projectOverrides: Object.keys(newProjectOverrides).length > 0 ? newProjectOverrides : void 0,
        deletedTasks: (currentEdits.deletedTasks ?? []).filter((id) => !succeededTaskIds.has(id)),
        deletedProjects: (currentEdits.deletedProjects ?? []).filter((id) => !succeededProjectIds.has(id))
      };
      await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(cleared, null, 2));
      edits.value = cleared;
      for (const result of results) {
        if (result.success) {
          try {
            await refreshConnector(result.connectorId);
          } catch {
          }
        }
      }
    }
    return results;
  }
  async function dismissChanges(selectedIds) {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId || selectedIds.size === 0)
      return;
    const newOverrides = { ...currentEdits.overrides };
    const newProjectOverrides = { ...currentEdits.projectOverrides ?? {} };
    let localTasks = [...currentEdits.localTasks];
    let deletedTasks = [...currentEdits.deletedTasks ?? []];
    let deletedProjects = [...currentEdits.deletedProjects ?? []];
    for (const id of selectedIds) {
      delete newOverrides[id];
      localTasks = localTasks.filter((lt) => lt.id !== id);
      deletedTasks = deletedTasks.filter((did) => did !== id);
      delete newProjectOverrides[id];
      deletedProjects = deletedProjects.filter((did) => did !== id);
    }
    const cleared = {
      ...currentEdits,
      overrides: newOverrides,
      localTasks,
      projectOverrides: Object.keys(newProjectOverrides).length > 0 ? newProjectOverrides : void 0,
      deletedTasks: deletedTasks.length > 0 ? deletedTasks : void 0,
      deletedProjects: deletedProjects.length > 0 ? deletedProjects : void 0
    };
    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(cleared, null, 2));
    edits.value = cleared;
  }
  async function loadTags() {
    const viewId = currentViewId.value;
    if (!viewId)
      return;
    const raw = await platform.storage.read(`tags/${safeName(viewId)}.json`);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        tagDefinitions.value = data.tags ?? [];
      } catch {
      }
    }
  }
  async function createTag(name, color) {
    const viewId = currentViewId.value;
    if (!viewId)
      return;
    if (tagDefinitions.value.some((t4) => t4.name === name))
      return;
    const updated = [...tagDefinitions.value, { name, color }];
    await platform.storage.write(`tags/${safeName(viewId)}.json`, JSON.stringify({ tags: updated }, null, 2));
    tagDefinitions.value = updated;
  }
  async function updateTag(oldName, newName, color) {
    const viewId = currentViewId.value;
    if (!viewId)
      return;
    const updated = tagDefinitions.value.map(
      (t4) => t4.name === oldName ? { name: newName, color: color ?? t4.color } : t4
    );
    await platform.storage.write(`tags/${safeName(viewId)}.json`, JSON.stringify({ tags: updated }, null, 2));
    tagDefinitions.value = updated;
    if (oldName !== newName) {
      const currentEdits = edits.value;
      if (currentEdits) {
        let changed = false;
        const newProjectOverrides = { ...currentEdits.projectOverrides ?? {} };
        for (const [projectId, overrides] of Object.entries(newProjectOverrides)) {
          if (overrides.tags?.includes(oldName)) {
            newProjectOverrides[projectId] = {
              ...overrides,
              tags: overrides.tags.map((t4) => t4 === oldName ? newName : t4)
            };
            changed = true;
          }
        }
        for (const p5 of projects.value) {
          if (p5.tags?.includes(oldName) && !newProjectOverrides[p5.id]) {
            newProjectOverrides[p5.id] = {
              ...newProjectOverrides[p5.id] ?? {},
              tags: (p5.tags ?? []).map((t4) => t4 === oldName ? newName : t4)
            };
            changed = true;
          }
        }
        if (changed) {
          const updatedEdits = {
            ...currentEdits,
            projectOverrides: Object.keys(newProjectOverrides).length > 0 ? newProjectOverrides : void 0
          };
          await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updatedEdits, null, 2));
          edits.value = updatedEdits;
        }
      }
    }
  }
  async function deleteTag(name) {
    const viewId = currentViewId.value;
    if (!viewId)
      return;
    const updated = tagDefinitions.value.filter((t4) => t4.name !== name);
    await platform.storage.write(`tags/${safeName(viewId)}.json`, JSON.stringify({ tags: updated }, null, 2));
    tagDefinitions.value = updated;
    const currentEdits = edits.value;
    if (currentEdits) {
      let changed = false;
      const newProjectOverrides = { ...currentEdits.projectOverrides ?? {} };
      for (const [projectId, overrides] of Object.entries(newProjectOverrides)) {
        if (overrides.tags?.includes(name)) {
          const newTags = overrides.tags.filter((t4) => t4 !== name);
          newProjectOverrides[projectId] = {
            ...overrides,
            tags: newTags.length > 0 ? newTags : []
          };
          changed = true;
        }
      }
      for (const p5 of projects.value) {
        if (p5.tags?.includes(name) && !newProjectOverrides[p5.id]) {
          newProjectOverrides[p5.id] = {
            ...newProjectOverrides[p5.id] ?? {},
            tags: (p5.tags ?? []).filter((t4) => t4 !== name)
          };
          changed = true;
        }
      }
      if (changed) {
        const updatedEdits = {
          ...currentEdits,
          projectOverrides: Object.keys(newProjectOverrides).length > 0 ? newProjectOverrides : void 0
        };
        await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updatedEdits, null, 2));
        edits.value = updatedEdits;
      }
    }
  }
  async function loadSettings() {
    const viewId = currentViewId.value;
    if (!viewId)
      return;
    const raw = await platform.storage.read(`settings/${safeName(viewId)}.json`);
    if (!raw)
      return;
    try {
      const data = JSON.parse(raw);
      if (data.filterTimeStart !== void 0)
        filterTimeStart.value = data.filterTimeStart ?? "";
      if (data.filterTimeEnd !== void 0)
        filterTimeEnd.value = data.filterTimeEnd ?? "";
      if (data.filterStatuses)
        filterStatuses.value = new Set(data.filterStatuses);
      if (data.filterTags)
        filterTags.value = new Set(data.filterTags);
      if (data.personSortMode)
        personSortMode.value = data.personSortMode;
      if (data.projectSortMode)
        projectSortMode.value = data.projectSortMode;
      if (data.projectSortKeyDates)
        projectSortKeyDates.value = data.projectSortKeyDates;
      if (data.positionOrder)
        positionOrder.value = data.positionOrder;
      if (data.detailPanelWidth !== void 0)
        detailPanelWidth.value = data.detailPanelWidth;
      if (data.leftPanelWidth !== void 0)
        leftPanelWidth.value = data.leftPanelWidth;
      if (data.holidayConfig) {
        holidayConfig.value = {
          weekendsEnabled: data.holidayConfig.weekendsEnabled ?? true,
          holidaysEnabled: data.holidayConfig.holidaysEnabled ?? true,
          holidayDates: data.holidayConfig.holidayDates ?? [],
          makeupWorkdays: data.holidayConfig.makeupWorkdays ?? []
        };
      }
    } catch {
    }
  }
  async function saveSettings2() {
    const viewId = currentViewId.value;
    if (!viewId)
      return;
    const data = {
      filterTimeStart: filterTimeStart.value,
      filterTimeEnd: filterTimeEnd.value,
      filterStatuses: [...filterStatuses.value],
      filterTags: [...filterTags.value],
      personSortMode: personSortMode.value,
      projectSortMode: projectSortMode.value,
      projectSortKeyDates: projectSortKeyDates.value,
      positionOrder: positionOrder.value,
      detailPanelWidth: detailPanelWidth.value,
      leftPanelWidth: leftPanelWidth.value
    };
    await platform.storage.write(`settings/${safeName(viewId)}.json`, JSON.stringify(data, null, 2));
  }
  async function saveHolidayConfig(config) {
    holidayConfig.value = config;
  }
  function setHolidayConfig(config) {
    holidayConfig.value = config;
  }
  const pendingChanges = g2(() => {
    const currentEdits = edits.value;
    if (!currentEdits)
      return [];
    const result = [];
    const allMerged = mergedTasks.value;
    const allPersons = persons.value;
    const allProjects = projects.value;
    const FIELD_LABELS = {
      title: "Title",
      startDate: "Start Date",
      endDate: "End Date",
      progress: "Progress",
      status: "Status",
      personId: "Person",
      projectId: "Project",
      dependencies: "Dependencies",
      tags: "Tags",
      description: "Description",
      requester: "Requester",
      keyDates: "Key Dates",
      keyLinks: "Key Links",
      name: "Name"
    };
    const taskFieldMap = /* @__PURE__ */ new Map();
    for (const [taskId, overrides] of Object.entries(currentEdits.overrides)) {
      const fields = [];
      for (const [field, value] of Object.entries(overrides)) {
        fields.push({
          field,
          label: FIELD_LABELS[field] ?? field,
          newValue: value
        });
      }
      if (fields.length > 0) {
        taskFieldMap.set(taskId, fields);
      }
    }
    for (const [taskId, fields] of taskFieldMap) {
      const task = allMerged.find((t4) => t4.id === taskId);
      const person = allPersons.find((p5) => p5.id === task?.personId.value);
      const project = allProjects.find((p5) => p5.id === task?.projectId.value);
      const entityName = task?.title.value ?? taskId;
      result.push({
        entityId: taskId,
        entityType: "task",
        entityName,
        changeType: "modified",
        fields: fields.map((f5) => {
          let displayValue = f5.newValue;
          if (f5.field === "personId" && person)
            displayValue = person.name;
          if (f5.field === "projectId" && project)
            displayValue = project.name;
          if (f5.field === "status") {
            const opt = ["pending", "in-progress", "cancelled", "pending-online", "online", "completed"];
            const idx = opt.indexOf(String(f5.newValue));
            displayValue = ["Pending", "In Progress", "Cancelled", "Pending Online", "Online", "Completed"][idx] ?? f5.newValue;
          }
          if (f5.field === "progress")
            displayValue = `${Math.round(Number(f5.newValue) * 100)}%`;
          return { ...f5, newValue: displayValue };
        })
      });
    }
    for (const lt of currentEdits.localTasks) {
      const person = allPersons.find((p5) => p5.id === lt.personId);
      const project = allProjects.find((p5) => p5.id === lt.projectId);
      const summary = {};
      if (lt.startDate)
        summary["Start"] = lt.startDate;
      if (lt.endDate)
        summary["End"] = lt.endDate;
      if (lt.status) {
        const idx = ["pending", "in-progress", "cancelled", "pending-online", "online", "completed"].indexOf(lt.status);
        summary["Status"] = ["Pending", "In Progress", "Cancelled", "Pending Online", "Online", "Completed"][idx] ?? lt.status;
      } else {
        summary["Status"] = "Pending";
      }
      if (person)
        summary["Person"] = person.name;
      if (project)
        summary["Project"] = project.name;
      if (lt.tags?.length)
        summary["Tags"] = lt.tags.join(", ");
      if (lt.url)
        summary["Link"] = lt.url;
      result.push({
        entityId: lt.id,
        entityType: "task",
        entityName: lt.title,
        changeType: "added",
        addedSummary: summary
      });
    }
    const projFieldMap = /* @__PURE__ */ new Map();
    if (currentEdits.projectOverrides) {
      for (const [projectId, overrides] of Object.entries(currentEdits.projectOverrides)) {
        const fields = [];
        for (const [field, value] of Object.entries(overrides)) {
          fields.push({
            field,
            label: FIELD_LABELS[field] ?? field,
            newValue: value
          });
        }
        if (fields.length > 0) {
          projFieldMap.set(projectId, fields);
        }
      }
    }
    for (const [projectId, fields] of projFieldMap) {
      const project = allProjects.find((p5) => p5.id === projectId);
      const entityName = project?.name ?? projectId;
      result.push({
        entityId: projectId,
        entityType: "project",
        entityName,
        changeType: "modified",
        fields
      });
    }
    for (const taskId of currentEdits.deletedTasks ?? []) {
      const task = allMerged.find((t4) => t4.id === taskId);
      const project = allProjects.find((p5) => p5.id === task?.projectId.value);
      result.push({
        entityId: taskId,
        entityType: "task",
        entityName: task?.title.value ?? taskId,
        changeType: "deleted",
        relatedInfo: project ? `Project: ${project.name}` : void 0
      });
    }
    for (const projectId of currentEdits.deletedProjects ?? []) {
      const project = allProjects.find((p5) => p5.id === projectId);
      result.push({
        entityId: projectId,
        entityType: "project",
        entityName: project?.name ?? projectId,
        changeType: "deleted"
      });
    }
    const deletedTaskIds = new Set(currentEdits.deletedTasks ?? []);
    const deletedProjectIds = new Set(currentEdits.deletedProjects ?? []);
    const localTaskIds = new Set(currentEdits.localTasks.map((t4) => t4.id));
    const allMergedTaskIds = new Set(allMerged.map((t4) => t4.id));
    const allProjectIds = new Set(allProjects.map((p5) => p5.id));
    const consumedModified = /* @__PURE__ */ new Set();
    const filtered = [];
    for (const entry of result) {
      if (entry.entityType === "task") {
        if (entry.changeType === "modified" && !allMergedTaskIds.has(entry.entityId) && !localTaskIds.has(entry.entityId)) {
          continue;
        }
        if (entry.changeType === "modified" && deletedTaskIds.has(entry.entityId)) {
          continue;
        }
        if (entry.changeType === "added" && deletedTaskIds.has(entry.entityId)) {
          continue;
        }
        if (entry.changeType === "added" && localTaskIds.has(entry.entityId)) {
          const modEntry = result.find(
            (e4) => e4.entityId === entry.entityId && e4.entityType === "task" && e4.changeType === "modified"
          );
          if (modEntry && modEntry.fields && entry.addedSummary) {
            for (const f5 of modEntry.fields) {
              entry.addedSummary[f5.label] = f5.newValue;
            }
            consumedModified.add(entry.entityId);
          }
          filtered.push(entry);
          continue;
        }
        if (entry.changeType === "modified" && consumedModified.has(entry.entityId)) {
          continue;
        }
      }
      if (entry.entityType === "project") {
        if (entry.changeType === "modified" && !allProjectIds.has(entry.entityId)) {
          continue;
        }
        if (entry.changeType === "modified" && deletedProjectIds.has(entry.entityId)) {
          continue;
        }
      }
      filtered.push(entry);
    }
    const order = { added: 0, modified: 1, deleted: 2 };
    filtered.sort((a4, b3) => {
      const d4 = (order[a4.changeType] ?? 1) - (order[b3.changeType] ?? 1);
      if (d4 !== 0)
        return d4;
      return a4.entityName.localeCompare(b3.entityName);
    });
    return filtered;
  });
  return {
    caches,
    edits,
    views,
    currentViewId,
    mergedTasks,
    persons,
    projects,
    mergedProjects,
    personGroups,
    projectGroups,
    unassignedProjects,
    selectedEntity,
    highlightedTaskIds,
    selectedTaskId,
    selectedProjectId,
    locateTarget,
    hoveredTaskId,
    sharedScrollLeft,
    personScrollTop,
    projectScrollTop,
    personSortMode,
    projectSortMode,
    projectSortKeyDates,
    positionOrder,
    detailPanelWidth,
    leftPanelWidth,
    filterTimeStart,
    filterTimeEnd,
    filterStatuses,
    filterTags,
    filteredProjectGroupKeys,
    filterDimmedTaskIds,
    availableFilterTags,
    timelineRange,
    conflicts,
    pendingChanges,
    tagDefinitions,
    holidayConfig,
    isLoading,
    error,
    pushProgress,
    detailCache,
    detailLoading,
    fetchEntityDetail,
    loadView,
    refreshConnector,
    persistEdit,
    resetField,
    createLocalTask,
    persistProjectEdit,
    persistPersonEdit,
    selectEntity,
    deleteTask,
    deleteProject,
    setTaskStatus,
    setProjectStatus,
    pushChanges,
    dismissChanges,
    loadTags,
    createTag,
    updateTag,
    deleteTag,
    saveSettings: saveSettings2,
    saveHolidayConfig,
    setHolidayConfig,
    loadSettings,
    fieldMemory,
    loadFieldMemory,
    saveFieldMemory,
    _platform: platform
  };
}
function TimelineGrid(props) {
  const { dayWidth, scrollLeft, viewportWidth, bufferPx, bodyOriginPx, holidayConfig } = props;
  const dayPx = dayWidth;
  const weekPx = dayWidth * 7;
  const absLeft = bodyOriginPx + scrollLeft;
  const absAlignedLeft = Math.floor((absLeft - bufferPx) / dayPx) * dayPx;
  const left = absAlignedLeft - bodyOriginPx;
  const width = viewportWidth + 2 * bufferPx;
  const layers = [
    // Day lines
    `repeating-linear-gradient(
      to right,
      transparent 0,
      transparent ${dayPx - 1}px,
      var(--gantt-grid-line-day, #e0e0e0) ${dayPx - 1}px,
      var(--gantt-grid-line-day, #e0e0e0) ${dayPx}px
    )`,
    // Week lines
    `repeating-linear-gradient(
      to right,
      transparent 0,
      transparent ${weekPx - 1}px,
      var(--gantt-grid-line-week, #c0c0c0) ${weekPx - 1}px,
      var(--gantt-grid-line-week, #c0c0c0) ${weekPx}px
    )`
  ];
  if (holidayConfig && (holidayConfig.weekendsEnabled || holidayConfig.holidaysEnabled)) {
    const gridStartDate = absolutePixelToDate(absAlignedLeft, dayWidth);
    const totalDays = Math.ceil(width / dayPx) + 2;
    const stops = [];
    let inNWD = false;
    for (let i5 = 0; i5 <= totalDays; i5++) {
      const date = addDaysToDate(gridStartDate, i5);
      const isNWD = isNonWorkingDay(date, holidayConfig);
      const px = i5 * dayPx;
      if (isNWD && !inNWD) {
        stops.push(`transparent ${px}px`);
        stops.push(`var(--gantt-weekend-bg, rgba(0,0,0,0.06)) ${px}px`);
        inNWD = true;
      } else if (!isNWD && inNWD) {
        stops.push(`var(--gantt-weekend-bg, rgba(0,0,0,0.06)) ${px}px`);
        stops.push(`transparent ${px}px`);
        inNWD = false;
      }
    }
    if (inNWD) {
      const endPx = (totalDays + 1) * dayPx;
      stops.push(`var(--gantt-weekend-bg, rgba(0,0,0,0.06)) ${endPx}px`);
      stops.push(`transparent ${endPx}px`);
    }
    if (stops.length > 0) {
      layers.push(`linear-gradient(to right, ${stops.join(", ")})`);
    }
  }
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-timeline-grid",
      style: {
        position: "absolute",
        top: 0,
        left: `${left}px`,
        width: `${width}px`,
        height: "100%",
        background: layers.join(", "),
        pointerEvents: "none"
      }
    }
  );
}
var TIMELINE_ORIGIN = "2000-01-01";
function dateToAbsolutePixel(date, dayWidth) {
  const days = daysBetweenDates(TIMELINE_ORIGIN, date);
  return days * dayWidth;
}
function absolutePixelToDate(absPx, dayWidth) {
  const days = Math.floor(absPx / dayWidth);
  return addDaysToDate(TIMELINE_ORIGIN, days);
}
function TimeHeader(props) {
  const { dayWidth, scrollLeft, viewportWidth, bufferPx, bodyOriginPx, holidayConfig } = props;
  const visibleStartAbsPx = bodyOriginPx + scrollLeft;
  const absAlignedLeft = Math.floor((visibleStartAbsPx - bufferPx) / dayWidth) * dayWidth;
  const rangeStart = absolutePixelToDate(absAlignedLeft, dayWidth);
  const rangeEndAbsPx = absAlignedLeft + viewportWidth + 2 * bufferPx;
  const rangeEnd = absolutePixelToDate(rangeEndAbsPx + dayWidth, dayWidth);
  const rangeTotalDays = daysBetweenDates(rangeStart, rangeEnd) + 1;
  const rangeWidth = rangeTotalDays * dayWidth;
  const monthColumns = buildMonthColumns(rangeStart, rangeEnd, dayWidth);
  const rangeStartBodyPx = absAlignedLeft - bodyOriginPx;
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-time-header",
      style: {
        height: "44px",
        background: "var(--background-primary, #fff)",
        borderBottom: "1px solid var(--gantt-grid-line-day, #e0e0e0)"
      },
      children: /* @__PURE__ */ u4("div", { style: { transform: `translateX(${rangeStartBodyPx - scrollLeft}px)` }, children: [
        /* @__PURE__ */ u4(
          "div",
          {
            class: "gantt-header-months",
            style: {
              position: "relative",
              height: "24px",
              borderBottom: "1px solid var(--gantt-grid-line-week, #c0c0c0)",
              width: `${rangeWidth}px`
            },
            children: monthColumns.map((mc) => /* @__PURE__ */ u4(
              "div",
              {
                style: {
                  position: "absolute",
                  left: `${mc.leftPx}px`,
                  width: `${mc.widthPx}px`,
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  lineHeight: "24px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  borderLeft: "1px solid var(--gantt-grid-line-week, #c0c0c0)"
                },
                children: mc.displayText
              },
              mc.displayText
            ))
          }
        ),
        /* @__PURE__ */ u4(
          "div",
          {
            class: "gantt-header-days",
            style: {
              position: "relative",
              height: "20px",
              borderBottom: "1px solid var(--gantt-grid-line-day, #e0e0e0)",
              width: `${rangeWidth}px`
            },
            children: Array.from({ length: rangeTotalDays }, (_3, i5) => {
              const date = addDaysToDate(rangeStart, i5);
              let labelColor = "var(--text-muted, #999)";
              let indicator = "";
              let indicatorColor = "";
              if (holidayConfig) {
                const labelType = getDateLabelType(date, holidayConfig);
                if (labelType === "holiday") {
                  labelColor = "var(--gantt-holiday-text, #c62828)";
                  indicator = "\u4F11";
                  indicatorColor = "var(--gantt-holiday-text, #c62828)";
                } else if (labelType === "makeup") {
                  labelColor = "var(--text-normal, #333)";
                  indicator = "\u73ED";
                  indicatorColor = "var(--gantt-makeup-text, #1565c0)";
                } else if (labelType === "weekend") {
                  labelColor = "var(--gantt-weekend-text, var(--text-faint))";
                }
              }
              return /* @__PURE__ */ u4(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: `${i5 * dayWidth}px`,
                    width: `${dayWidth}px`,
                    textAlign: "center",
                    fontSize: "10px",
                    lineHeight: "20px",
                    color: labelColor
                  },
                  children: [
                    getDayLabel(date),
                    indicator && /* @__PURE__ */ u4("span", { style: {
                      fontSize: "7px",
                      color: indicatorColor,
                      marginLeft: "1px",
                      verticalAlign: "super",
                      lineHeight: 1
                    }, children: indicator })
                  ]
                },
                i5
              );
            })
          }
        )
      ] })
    }
  );
}
function TodayLine(props) {
  if (!props.visible)
    return null;
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-today-line",
      style: {
        position: "absolute",
        top: 0,
        left: `${props.leftPx}px`,
        width: "2px",
        height: "100%",
        background: "var(--gantt-today-color, #ff4444)",
        zIndex: 5,
        pointerEvents: "none"
      }
    }
  );
}
var STATUS_DEFS = {
  pending: { color: "#888888", icon: "circle" },
  "in-progress": { color: "#2196f3", icon: "loader" },
  cancelled: { color: "#e53935", icon: "x-circle" },
  "pending-online": { color: "#fb8c00", icon: "arrow-up-circle" },
  online: { color: "#00897b", icon: "globe" },
  completed: { color: "#4caf50", icon: "check-circle" }
};
function getStatusDef(status) {
  return STATUS_DEFS[status] ?? { color: "#888888", icon: "circle" };
}
function TaskBar(props) {
  const {
    data,
    groupStartY,
    laneIndex,
    rowHeight,
    laneOffset,
    paneType,
    startDate,
    endDate,
    bodyOriginPx,
    dayWidth,
    holidayConfig
  } = props;
  const barHeight = rowHeight * 0.6;
  const barTop = groupStartY + (rowHeight - barHeight) / 2 + laneIndex * laneOffset;
  const barWidth = Math.max(data.width, 4);
  const showHandles = barWidth >= 12;
  const injectedRef = A2(false);
  y2(() => {
    if (injectedRef.current)
      return;
    injectedRef.current = true;
    const style = document.createElement("style");
    style.textContent = `
      @keyframes gantt-selected-pulse {
        0%, 100% { box-shadow: 0 0 0 3px var(--gantt-selected-border, #FF6B35), 0 0 10px rgba(255, 107, 53, 0.3); }
        50% { box-shadow: 0 0 0 4px var(--gantt-selected-border, #FF6B35), 0 0 24px rgba(255, 107, 53, 0.6); }
      }
    `;
    document.head.appendChild(style);
  }, []);
  let overlays = [];
  if (startDate && endDate && bodyOriginPx !== void 0 && dayWidth && holidayConfig) {
    const blocks = getNonWorkingBlocks(startDate, endDate, holidayConfig);
    overlays = blocks.map((block) => {
      const blockLeft = dateToAbsolutePixel(block.start, dayWidth) - bodyOriginPx;
      const blockRight = dateToAbsolutePixel(block.end, dayWidth) - bodyOriginPx + dayWidth;
      return {
        left: blockLeft - data.left,
        width: blockRight - blockLeft
      };
    });
  }
  const statusDef = getStatusDef(data.status);
  const showTitle = barWidth > 60;
  return /* @__PURE__ */ u4(
    "div",
    {
      class: `gantt-task-bar ${data.isSelected ? "selected" : ""} ${data.isHighlighted ? "highlighted" : ""} ${data.isDimmed ? "dimmed" : ""} ${data.isHovered ? "hovered" : ""}`,
      style: {
        position: "absolute",
        left: `${data.left}px`,
        top: `${barTop}px`,
        width: `${barWidth}px`,
        height: `${barHeight}px`,
        background: data.color,
        borderRadius: "4px",
        opacity: data.isDragging ? 0 : data.isDimmed ? 0.3 : 1,
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        paddingLeft: "24px",
        fontSize: "11px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "var(--text-on-accent, #fff)",
        boxSizing: "border-box",
        zIndex: data.isSelected ? 1e3 : data.isHovered ? 999 : 2 + props.laneIndex,
        animation: data.isSelected ? "gantt-selected-pulse 1.4s ease-in-out infinite" : "none",
        transform: data.isHovered && !data.isSelected ? "scaleY(1.25)" : "none",
        filter: data.isHovered && !data.isSelected ? "brightness(1.15)" : "none",
        boxShadow: data.isSelected ? "none" : data.isHovered ? "0 0 0 1px var(--gantt-hover-border, #FFB347), 0 0 8px rgba(255, 179, 71, 0.45)" : data.isHighlighted ? "0 0 0 2px var(--gantt-highlight-border, #4A90D9)" : "none",
        transition: data.isSelected ? "none" : data.isHovered ? "transform 0.1s, box-shadow 0.1s, filter 0.1s" : "opacity 0.15s, box-shadow 0.15s"
      },
      onPointerDown: (e4) => {
        const rect = e4.currentTarget.getBoundingClientRect();
        const relX = e4.clientX - rect.left;
        const edge = relX < 8 ? "left" : relX > rect.width - 8 ? "right" : "body";
        props.onPointerDown(e4, data.id, edge, paneType, props.laneIndex);
      },
      onPointerMove: (e4) => {
        if (showHandles) {
          const rect = e4.currentTarget.getBoundingClientRect();
          const relX = e4.clientX - rect.left;
          const isNearEdge = relX < 8 || relX > rect.width - 8;
          e4.currentTarget.style.cursor = isNearEdge ? "ew-resize" : "grab";
        }
      },
      onPointerLeave: (e4) => {
        e4.currentTarget.style.cursor = "";
      },
      onClick: (e4) => {
        e4.stopPropagation();
        props.onClick(data.id);
      },
      title: `${data.title}`,
      children: [
        /* @__PURE__ */ u4(
          "div",
          {
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              width: "18px",
              height: "100%",
              background: statusDef.color,
              clipPath: "polygon(0 0, 15px 0, 18px 5px, 15px 100%, 0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 3
            },
            children: /* @__PURE__ */ u4(
              Icon,
              {
                name: statusDef.icon,
                size: 10,
                style: {
                  opacity: 0.95,
                  filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))"
                }
              }
            )
          }
        ),
        data.progress > 0 && data.progress <= 1 && /* @__PURE__ */ u4(
          "div",
          {
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              width: `${data.progress * 100}%`,
              height: "100%",
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "1px 0 0 1px",
              pointerEvents: "none",
              zIndex: 0
            }
          }
        ),
        overlays.map((ol, i5) => /* @__PURE__ */ u4(
          "div",
          {
            style: {
              position: "absolute",
              left: `${ol.left}px`,
              top: 0,
              width: `${Math.max(ol.width, 0)}px`,
              height: "100%",
              background: `repeating-linear-gradient(
              -45deg,
              transparent 0,
              transparent 3px,
              var(--gantt-bar-holiday-stripe, rgba(255,255,255,0.35)) 3px,
              var(--gantt-bar-holiday-stripe, rgba(255,255,255,0.35)) 6px
            )`,
              pointerEvents: "none",
              zIndex: 1,
              borderRadius: "inherit"
            }
          },
          `nw-${i5}`
        )),
        showHandles && /* @__PURE__ */ u4("span", { class: "gantt-bar-handle gantt-bar-handle-left" }),
        showTitle ? data.title : "",
        showHandles && /* @__PURE__ */ u4("span", { class: "gantt-bar-handle gantt-bar-handle-right" })
      ]
    }
  );
}
var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function buildMonthColumns(startDate, endDate, dayWidth) {
  const results = [];
  const startD = parseDate2(startDate);
  const endD = parseDate2(endDate);
  let cursor = new Date(Date.UTC(startD.getUTCFullYear(), startD.getUTCMonth(), 1));
  while (cursor <= endD) {
    const y4 = cursor.getUTCFullYear();
    const m4 = cursor.getUTCMonth();
    const monthStart = formatDateStr(new Date(Date.UTC(y4, m4, 1)));
    const monthEnd = formatDateStr(new Date(Date.UTC(y4, m4 + 1, 0)));
    const offsetDays = daysBetweenDates(startDate, monthStart);
    const visibleStart = offsetDays < 0 ? startDate : monthStart;
    const visibleStartDays = daysBetweenDates(startDate, visibleStart);
    const dayCount = daysBetweenDates(monthStart, monthEnd) + 1;
    const firstDay = Math.max(0, visibleStartDays);
    const lastDay = Math.min(daysBetweenDates(startDate, endDate), offsetDays + dayCount - 1);
    const actualDayCount = lastDay - firstDay + 1;
    if (actualDayCount > 0) {
      results.push({
        displayText: `${MONTH_NAMES[m4]} ${y4}`,
        leftPx: firstDay * dayWidth,
        widthPx: actualDayCount * dayWidth
      });
    }
    cursor = new Date(Date.UTC(y4, m4 + 1, 1));
  }
  return results;
}
function parseDate2(s5) {
  if (!s5 || typeof s5 !== "string")
    return /* @__PURE__ */ new Date(NaN);
  const parts = s5.split("-");
  if (parts.length !== 3)
    return /* @__PURE__ */ new Date(NaN);
  const [y4, m4, d4] = parts.map(Number);
  if (isNaN(y4) || isNaN(m4) || isNaN(d4))
    return /* @__PURE__ */ new Date(NaN);
  if (m4 < 1 || m4 > 12 || d4 < 1 || d4 > 31)
    return /* @__PURE__ */ new Date(NaN);
  return new Date(Date.UTC(y4, m4 - 1, d4, 12, 0, 0));
}
function formatDateStr(d4) {
  if (isNaN(d4.getTime()))
    return "";
  const y4 = d4.getUTCFullYear();
  const m4 = String(d4.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d4.getUTCDate()).padStart(2, "0");
  return `${y4}-${m4}-${day}`;
}
function daysBetweenDates(a4, b3) {
  return daysBetween(a4, b3);
}
function addDaysToDate(date, days) {
  return addDays(date, days);
}
function getDayLabel(date) {
  const d4 = parseDate2(date);
  if (isNaN(d4.getTime()))
    return "";
  return String(d4.getUTCDate());
}
function KeyDateMarker(props) {
  const size = 16;
  const bg = props.color ?? "var(--gantt-key-date-color, #E5C07B)";
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-key-date-marker",
      title: `${props.name}: ${props.date}`,
      onPointerDown: props.onPointerDown,
      style: {
        position: "absolute",
        left: `${props.leftPx - size / 2}px`,
        top: `${props.groupTopY + (props.groupHeight - size) / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: bg,
        transform: "rotate(45deg)",
        zIndex: 1001,
        pointerEvents: "auto",
        cursor: props.onPointerDown ? "ew-resize" : "help",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      children: props.icon && isLucideIcon(props.icon) ? /* @__PURE__ */ u4("span", { style: {
        transform: "rotate(-45deg)",
        color: "#fff",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: /* @__PURE__ */ u4(Icon, { name: props.icon, size: 10 }) }) : props.icon ? /* @__PURE__ */ u4("span", { style: {
        transform: "rotate(-45deg)",
        fontSize: "10px",
        color: "#fff",
        lineHeight: 1,
        fontWeight: "bold",
        pointerEvents: "none"
      }, children: props.icon }) : null
    }
  );
}
var DAY_WIDTH = 30;
var ROW_HEIGHT = 40;
var LANE_OFFSET = 12;
function computeGroupHeight(tasks) {
  const ranges = [];
  for (const t4 of tasks) {
    const s5 = t4.startDate.value;
    if (!s5)
      continue;
    ranges.push({ start: s5, end: t4.endDate.value ?? s5 });
  }
  ranges.sort((a4, b3) => a4.start.localeCompare(b3.start));
  const lanes = [];
  for (const dr of ranges) {
    let assigned = false;
    for (let li = 0; li < lanes.length; li++) {
      if (dr.start >= lanes[li]) {
        lanes[li] = dr.end;
        assigned = true;
        break;
      }
    }
    if (!assigned)
      lanes.push(dr.end);
  }
  return ROW_HEIGHT + (Math.max(1, lanes.length) - 1) * LANE_OFFSET;
}
function findRowIndex(groups, contentY) {
  let accumulatedY = 0;
  for (let i5 = 0; i5 < groups.length; i5++) {
    const h4 = computeGroupHeight(groups[i5].tasks);
    if (contentY < accumulatedY + h4)
      return i5;
    accumulatedY += h4;
  }
  return groups.length - 1;
}
function dateToPx(date) {
  if (!isValidDate(date))
    return 0;
  return dateToAbsolutePixel(date, DAY_WIDTH);
}
function pxToDate(px) {
  return absolutePixelToDate(px, DAY_WIDTH);
}
var dragState = y3(null);
function createDragHandler(store2) {
  let undoStack = [];
  function onTaskPointerDown(e4, taskId, edge, paneType, laneIndex) {
    const task = store2.mergedTasks.value.find((t4) => t4.id === taskId);
    if (!task)
      return;
    const startDate = task.startDate.value;
    const endDate = task.endDate.value;
    if (!startDate)
      return;
    const effectiveEnd = endDate ?? startDate;
    const originStartPx = dateToPx(startDate);
    const originEndPx = dateToPx(effectiveEnd);
    const baseLeft = originStartPx;
    const baseRight = originEndPx;
    const groups = paneType === "person" ? store2.personGroups.value : store2.projectGroups.value;
    let rowIndex = 0;
    for (let i5 = 0; i5 < groups.length; i5++) {
      if (groups[i5].tasks.some((t4) => t4.id === taskId)) {
        rowIndex = i5;
        break;
      }
    }
    const personId = paneType === "person" ? task.personId.value ?? null : null;
    const target = e4.currentTarget;
    const timelineBody = target.closest(".gantt-timeline")?.querySelector('[style*="position: relative"]');
    const bodyRect = timelineBody?.getBoundingClientRect();
    const scrollEl = target.closest(".gantt-timeline");
    const ds = {
      dragMode: "task",
      taskId,
      edge,
      paneType,
      originalStartDate: startDate,
      originalEndDate: effectiveEnd,
      currentStartDate: startDate,
      currentEndDate: effectiveEnd,
      ghostLeft: baseLeft,
      ghostWidth: Math.max(baseRight - baseLeft, 4),
      pointerStartX: e4.clientX,
      pointerStartY: e4.clientY,
      originalPersonId: personId,
      currentPersonId: personId,
      rowIndex,
      laneIndex,
      scrollTopStart: scrollEl?.scrollTop ?? 0,
      bodyTopStart: bodyRect?.top ?? 0
    };
    dragState.value = ds;
    document.body.style.userSelect = "none";
    e4.target.setPointerCapture?.(e4.pointerId);
    e4.preventDefault();
    e4.stopPropagation();
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  }
  function onKeyDatePointerDown(e4, projectId, keyDateIndex, currentDate) {
    const originPx = dateToPx(currentDate);
    const groups = store2.projectGroups.value;
    let rowIndex = 0;
    for (let i5 = 0; i5 < groups.length; i5++) {
      if (groups[i5].projectId === projectId) {
        rowIndex = i5;
        break;
      }
    }
    const ds = {
      dragMode: "keyDate",
      taskId: "",
      edge: "body",
      paneType: "project",
      originalStartDate: currentDate,
      originalEndDate: currentDate,
      currentStartDate: currentDate,
      currentEndDate: currentDate,
      ghostLeft: originPx,
      ghostWidth: 8,
      pointerStartX: e4.clientX,
      pointerStartY: e4.clientY,
      originalPersonId: null,
      currentPersonId: null,
      rowIndex,
      laneIndex: 0,
      scrollTopStart: 0,
      bodyTopStart: 0,
      keyDateIndex,
      projectId,
      originalKeyDate: currentDate,
      currentKeyDate: currentDate
    };
    dragState.value = ds;
    document.body.style.userSelect = "none";
    e4.target.setPointerCapture?.(e4.pointerId);
    e4.preventDefault();
    e4.stopPropagation();
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  }
  function onPointerMove(e4) {
    const ds = dragState.value;
    if (!ds)
      return;
    const dx = e4.clientX - ds.pointerStartX;
    const dayDelta = Math.round(dx / DAY_WIDTH);
    if (ds.dragMode === "keyDate") {
      const newDate = addDays(ds.originalKeyDate, dayDelta);
      ds.currentKeyDate = newDate;
      ds.ghostLeft = dateToPx(newDate);
      dragState.value = { ...ds };
      return;
    }
    if (ds.edge === "body") {
      const newStart = addDays(ds.originalStartDate, dayDelta);
      const duration = daysBetween(ds.originalStartDate, ds.originalEndDate);
      const newEnd = addDays(newStart, duration);
      ds.currentStartDate = newStart;
      ds.currentEndDate = newEnd;
      ds.ghostLeft = dateToPx(newStart);
      ds.ghostWidth = Math.max(duration * DAY_WIDTH, 4);
      if (ds.paneType === "person") {
        const pg = store2.personGroups.value;
        const scrollEl = document.querySelector(".gantt-timeline");
        const timelineBody = scrollEl?.querySelector('[style*="position: relative"]');
        const currentBodyTop = timelineBody?.getBoundingClientRect().top ?? ds.bodyTopStart;
        const contentY = e4.clientY - currentBodyTop;
        const newRowIndex = findRowIndex(pg, contentY);
        ds.rowIndex = newRowIndex;
        const targetPersonId = pg[newRowIndex]?.personId;
        ds.currentPersonId = targetPersonId === "__unassigned__" || targetPersonId == null ? null : targetPersonId;
      }
    } else if (ds.edge === "left") {
      const newStart = addDays(ds.originalStartDate, dayDelta);
      if (daysBetween(newStart, ds.originalEndDate) >= 1) {
        ds.currentStartDate = newStart;
        ds.ghostLeft = dateToPx(newStart);
        ds.ghostWidth = Math.max(daysBetween(newStart, ds.originalEndDate) * DAY_WIDTH, 4);
      }
    } else if (ds.edge === "right") {
      const newEnd = addDays(ds.originalEndDate, dayDelta);
      if (daysBetween(ds.originalStartDate, newEnd) >= 1) {
        ds.currentEndDate = newEnd;
        ds.ghostWidth = Math.max(daysBetween(ds.originalStartDate, newEnd) * DAY_WIDTH, 4);
      }
    }
    dragState.value = { ...ds };
  }
  async function onPointerUp(_e) {
    const ds = dragState.value;
    if (!ds)
      return;
    document.body.style.userSelect = "";
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    if (ds.dragMode === "keyDate") {
      const projectId = ds.projectId;
      const keyDateIndex = ds.keyDateIndex;
      const newDate = ds.currentKeyDate;
      const origDate = ds.originalKeyDate;
      dragState.value = null;
      if (newDate === origDate)
        return;
      const project = store2.mergedProjects.value.find((p5) => p5.id === projectId);
      if (!project)
        return;
      const keyDates = [...project.keyDates ?? []];
      keyDates[keyDateIndex] = { ...keyDates[keyDateIndex], date: newDate };
      const undo3 = async () => {
        await store2.persistProjectEdit(projectId, "keyDates", keyDates.map(
          (kd, i5) => i5 === keyDateIndex ? { ...kd, date: origDate } : kd
        ));
      };
      await store2.persistProjectEdit(projectId, "keyDates", keyDates);
      undoStack.push(undo3);
      return;
    }
    const taskId = ds.taskId;
    const newStart = ds.currentStartDate;
    const newEnd = ds.currentEndDate;
    const origStart = ds.originalStartDate;
    const origEnd = ds.originalEndDate;
    const newPersonId = ds.currentPersonId;
    const origPersonId = ds.originalPersonId;
    dragState.value = null;
    if (newStart === origStart && newEnd === origEnd && newPersonId === origPersonId)
      return;
    const undo2 = async () => {
      if (origStart !== newStart) {
        await store2.persistEdit(taskId, "startDate", origStart);
      }
      if (origEnd !== newEnd) {
        await store2.persistEdit(taskId, "endDate", origEnd);
      }
      if (origPersonId !== newPersonId) {
        await store2.persistEdit(taskId, "personId", origPersonId ?? null);
      }
    };
    if (newStart !== origStart) {
      await store2.persistEdit(taskId, "startDate", newStart);
    }
    if (newEnd !== origEnd) {
      await store2.persistEdit(taskId, "endDate", newEnd);
    }
    if (newPersonId !== origPersonId) {
      await store2.persistEdit(taskId, "personId", newPersonId ?? null);
    }
    undoStack.push(undo2);
  }
  async function undo() {
    const fn = undoStack.pop();
    if (fn)
      await fn();
  }
  function handleTimelineDrop(e4, bodyOriginPx) {
    e4.preventDefault();
    const data = e4.dataTransfer?.getData("text/plain");
    if (!data)
      return;
    let projectInfo;
    try {
      projectInfo = JSON.parse(data);
    } catch {
      return;
    }
    const timelineEl = e4.currentTarget;
    const rect = timelineEl.getBoundingClientRect();
    const relX = e4.clientX - rect.left;
    const relY = e4.clientY - rect.top;
    const totalScrollLeft = timelineEl.scrollLeft || 0;
    const totalScrollTop = timelineEl.scrollTop || 0;
    const contentX = relX + totalScrollLeft;
    const contentY = relY + totalScrollTop;
    const absX = contentX + (bodyOriginPx ?? 0);
    const dropDate = pxToDate(absX);
    const personGroups = store2.personGroups.value;
    const rowIndex = findRowIndex(personGroups, contentY);
    const targetPerson = rowIndex >= 0 && rowIndex < personGroups.length ? personGroups[rowIndex].personId : null;
    const personId = targetPerson === "__unassigned__" ? null : targetPerson;
    const newTask = {
      id: `local-${Date.now()}`,
      title: projectInfo.projectName,
      projectId: projectInfo.projectId,
      startDate: dropDate,
      endDate: addDays(dropDate, 5),
      personId: personId ?? void 0
    };
    store2.createLocalTask(newTask);
  }
  function handleTimelineDragOver(e4) {
    e4.preventDefault();
    if (e4.dataTransfer) {
      e4.dataTransfer.dropEffect = "copy";
    }
  }
  return {
    onTaskPointerDown,
    onKeyDatePointerDown,
    undo,
    handleTimelineDrop,
    handleTimelineDragOver
  };
}
var buttonStyle = {
  padding: "2px 4px",
  border: "none",
  borderRadius: "3px",
  background: "transparent",
  cursor: "pointer",
  lineHeight: 1
};
function DetailHeader(props) {
  function handleNameKeyDown(e4) {
    if (e4.key === "Enter") {
      e4.preventDefault();
      e4.stopPropagation();
      props.onSaveTitle();
    }
    if (e4.key === "Escape") {
      e4.preventDefault();
      e4.stopPropagation();
      props.onCancelTitle();
    }
  }
  return /* @__PURE__ */ u4("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }, children: [
    /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "6px", flex: 1 }, children: [
      props.children,
      props.editTitleEnabled.value ? /* @__PURE__ */ u4(
        "input",
        {
          ref: props.titleInputRef,
          type: "text",
          value: props.editTitleValue.value,
          onInput: (e4) => {
            props.editTitleValue.value = e4.target.value;
          },
          onBlur: props.onSaveTitle,
          onKeyDown: handleNameKeyDown,
          onKeyUp: (e4) => {
            e4.stopPropagation();
          },
          class: "gantt-inline-edit-input",
          style: {
            flex: 1,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "2px 6px",
            border: "1px solid var(--interactive-accent, #4A90D9)",
            borderRadius: "4px",
            background: "var(--background-primary, #fff)",
            color: "var(--text-normal, #333)"
          }
        }
      ) : /* @__PURE__ */ u4(
        "span",
        {
          style: { fontWeight: "bold", fontSize: "14px", wordBreak: "break-word", cursor: "text" },
          onClick: props.onStartEditTitle,
          title: "Click to edit",
          children: props.title
        }
      )
    ] }),
    /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "2px", flexShrink: 0, marginLeft: "4px" }, children: props.editing.value ? /* @__PURE__ */ u4(S, { children: [
      /* @__PURE__ */ u4(
        "button",
        {
          onClick: props.onSave,
          title: "Save changes",
          style: {
            padding: "3px 8px",
            border: "1px solid var(--interactive-accent, #4A90D9)",
            borderRadius: "4px",
            background: "var(--interactive-accent, #4A90D9)",
            color: "#fff",
            cursor: "pointer",
            fontSize: "11px"
          },
          children: "Save"
        }
      ),
      /* @__PURE__ */ u4(
        "button",
        {
          onClick: props.onCancel,
          title: "Cancel editing",
          style: {
            padding: "3px 8px",
            border: "1px solid var(--background-modifier-border, #ccc)",
            borderRadius: "4px",
            background: "var(--background-secondary, #f5f5f5)",
            cursor: "pointer",
            fontSize: "11px"
          },
          children: "Cancel"
        }
      )
    ] }) : /* @__PURE__ */ u4(S, { children: [
      /* @__PURE__ */ u4("button", { onClick: props.onEdit, title: "Edit details", style: { ...buttonStyle, fontSize: "13px", color: "var(--text-muted, #999)" }, children: /* @__PURE__ */ u4(Icon, { name: "pencil", size: 13 }) }),
      props.onDelete && /* @__PURE__ */ u4("button", { onClick: props.onDelete, title: "Delete", style: { ...buttonStyle, fontSize: "13px", color: "var(--text-error, #e00)" }, children: /* @__PURE__ */ u4(Icon, { name: "trash-2", size: 13 }) }),
      props.onLocate && /* @__PURE__ */ u4("button", { onClick: props.onLocate, title: "Scroll to entity", style: { ...buttonStyle, fontSize: "13px", color: "var(--text-muted, #999)" }, children: /* @__PURE__ */ u4(Icon, { name: "target", size: 13 }) }),
      /* @__PURE__ */ u4("button", { onClick: props.onClose, title: "Close detail panel", style: { ...buttonStyle, fontSize: "14px", color: "var(--text-muted, #999)" }, children: /* @__PURE__ */ u4(Icon, { name: "x", size: 14 }) })
    ] }) })
  ] });
}
function TagsEditor(props) {
  const editTagInput = useSignal("");
  const editTagInputRef = A2(null);
  function addTag() {
    const tag = editTagInput.value.trim();
    if (!tag || props.tags.includes(tag))
      return;
    props.onChange([...props.tags, tag]);
    editTagInput.value = "";
    editTagInputRef.current?.focus();
  }
  function removeTag(tag) {
    props.onChange(props.tags.filter((t4) => t4 !== tag));
  }
  function handleTagInputKeyDown(e4) {
    if (e4.key === "Enter") {
      e4.preventDefault();
      e4.stopPropagation();
      addTag();
    }
  }
  return /* @__PURE__ */ u4("div", { children: props.editing ? /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
    /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "4px" }, children: [
      /* @__PURE__ */ u4(
        "input",
        {
          ref: editTagInputRef,
          type: "text",
          value: editTagInput.value,
          onInput: (e4) => {
            editTagInput.value = e4.target.value;
          },
          onKeyDown: handleTagInputKeyDown,
          onKeyUp: (e4) => {
            e4.stopPropagation();
          },
          placeholder: "Add tag...",
          list: "tag-suggestions",
          style: {
            flex: 1,
            fontSize: "11px",
            padding: "3px 6px",
            borderRadius: "3px",
            border: "1px solid var(--background-modifier-border, #ccc)",
            background: "var(--background-primary, #fff)",
            color: "var(--text-normal, #333)"
          }
        }
      ),
      /* @__PURE__ */ u4("datalist", { id: "tag-suggestions", children: props.knownTags.filter((t4) => !props.tags.includes(t4)).map((t4) => /* @__PURE__ */ u4("option", { value: t4 }, t4)) }),
      /* @__PURE__ */ u4(
        "button",
        {
          onClick: addTag,
          style: {
            padding: "3px 10px",
            border: "1px solid var(--interactive-accent, #4A90D9)",
            borderRadius: "3px",
            background: "var(--interactive-accent, #4A90D9)",
            color: "#fff",
            cursor: "pointer",
            fontSize: "11px",
            whiteSpace: "nowrap"
          },
          children: "+"
        }
      )
    ] }),
    props.tags.length > 0 ? /* @__PURE__ */ u4("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: props.tags.map((tag) => /* @__PURE__ */ u4(
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "3px",
          padding: "1px 6px",
          borderRadius: "10px",
          fontSize: "11px",
          background: "var(--interactive-accent, #4A90D9)",
          color: "#fff"
        },
        children: [
          tag,
          /* @__PURE__ */ u4(
            "span",
            {
              onClick: () => removeTag(tag),
              style: { cursor: "pointer", fontSize: "13px", lineHeight: 1, opacity: 0.7 },
              title: `Remove tag "${tag}"`,
              children: "x"
            }
          )
        ]
      },
      tag
    )) }) : /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)" }, children: "No tags" })
  ] }) : /* @__PURE__ */ u4("div", { children: props.tags.length > 0 ? /* @__PURE__ */ u4("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: props.tags.map((tag) => /* @__PURE__ */ u4(
    "span",
    {
      style: {
        display: "inline-block",
        padding: "1px 6px",
        borderRadius: "10px",
        fontSize: "11px",
        background: "var(--background-modifier-border, #e0e0e0)",
        color: "var(--text-normal, #333)"
      },
      children: tag
    },
    tag
  )) }) : /* @__PURE__ */ u4("div", { style: { fontSize: "13px" }, children: "\u2014" }) }) });
}
function LinkField(props) {
  const copied = useSignal(false);
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(props.url);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = props.url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }
  function openLink(e4) {
    e4.preventDefault();
    const platform = props.store._platform;
    if (platform?.openExternal) {
      platform.openExternal(props.url);
    } else {
      window.open(props.url, "_blank");
    }
  }
  return /* @__PURE__ */ u4("div", { style: { fontSize: "12px", padding: "2px 0", display: "flex", alignItems: "center", gap: "6px" }, children: [
    /* @__PURE__ */ u4(
      "a",
      {
        href: props.url,
        target: "_blank",
        rel: "noopener noreferrer",
        onClick: openLink,
        style: {
          color: "var(--interactive-accent, #4A90D9)",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        },
        title: props.url,
        children: [
          /* @__PURE__ */ u4("span", { style: { fontSize: "10px", flexShrink: 0 }, children: "\u2197" }),
          /* @__PURE__ */ u4("span", { style: { overflow: "hidden", textOverflow: "ellipsis" }, children: props.label || props.url })
        ]
      }
    ),
    /* @__PURE__ */ u4(
      "button",
      {
        onClick: async (e4) => {
          e4.preventDefault();
          e4.stopPropagation();
          await copyToClipboard();
        },
        title: "Copy link",
        style: {
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "12px",
          padding: "0 2px",
          color: "var(--text-muted, #999)",
          flexShrink: 0
        },
        children: copied.value ? /* @__PURE__ */ u4(Icon, { name: "check", size: 14, title: "Copied!" }) : /* @__PURE__ */ u4(Icon, { name: "copy", size: 14, title: "Copy link" })
      }
    )
  ] });
}
function MarkdownView(props) {
  const ref = A2(null);
  const platform = props.store._platform;
  y2(() => {
    if (ref.current) {
      ref.current.innerHTML = "";
      if (platform?.renderMarkdown) {
        platform.renderMarkdown(ref.current, props.markdown);
      } else {
        ref.current.textContent = props.markdown;
      }
    }
  }, [props.markdown]);
  return /* @__PURE__ */ u4(
    "div",
    {
      ref,
      class: "gantt-markdown-view",
      style: { fontSize: "12px", lineHeight: 1.5, wordBreak: "break-word" }
    }
  );
}
var DAY_WIDTH2 = 30;
var ROW_HEIGHT2 = 40;
var LANE_OFFSET2 = 12;
var GRID_BUFFER_PX = 600;
var DEFAULT_COLORS = ["#4A90D9", "#7B61F8", "#E06C75", "#61AFEF", "#98C379", "#E5C07B", "#C678DD", "#56B6C2"];
function getDefaultColor(id) {
  let hash = 0;
  for (let i5 = 0; i5 < id.length; i5++)
    hash = (hash << 5) - hash + id.charCodeAt(i5);
  return DEFAULT_COLORS[Math.abs(hash) % DEFAULT_COLORS.length];
}
var STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "#888" },
  { value: "in-progress", label: "In Progress", color: "#2196f3" },
  { value: "cancelled", label: "Cancelled", color: "#e53935" },
  { value: "pending-online", label: "Pending Online", color: "#fb8c00" },
  { value: "online", label: "Online", color: "#00897b" },
  { value: "completed", label: "Completed", color: "#4caf50" }
];
var PRESET_COLORS = [
  ["#C0392B", "#D35400", "#D4AC0D", "#1E8449", "#148F77", "#2471A3", "#7D3C98"],
  ["#E74C3C", "#E67E22", "#F1C40F", "#2ECC71", "#1ABC9C", "#3498DB", "#9B59B6"],
  ["#F1948A", "#F0B27A", "#F7DC6F", "#82E0AA", "#76D7C4", "#85C1E9", "#C39BD3"],
  ["#FADBD8", "#FDEBD0", "#FEF9E7", "#D5F5E3", "#D1F2EB", "#D6EAF8", "#E8DAEF"]
];
var KEY_DATE_PRESETS = [
  { name: "\u9A8C\u6536\u65F6\u95F4", color: "#98C379", icon: "check" },
  { name: "\u4E0A\u7EBF\u65F6\u95F4", color: "#61AFEF", icon: "triangle" },
  { name: "\u63D0\u6D4B\u65F6\u95F4", color: "#C678DD", icon: "diamond" },
  { name: "\u8BC4\u5BA1\u65F6\u95F4", color: "#E5C07B", icon: "target" },
  { name: "\u4EA4\u4ED8\u65F6\u95F4", color: "#56B6C2", icon: "circle" },
  { name: "\u542F\u52A8\u65F6\u95F4", color: "#4A90D9", icon: "play" }
];
function collapseNewlines(text) {
  return text.replace(/\n{3,}/g, "\n\n");
}
function hashColor(str) {
  let hash = 0;
  for (let i5 = 0; i5 < str.length; i5++) {
    hash = str.charCodeAt(i5) + ((hash << 5) - hash);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 35%)`;
}
function DescriptionModal(props) {
  const editMode = useSignal(props.startEdit ?? false);
  const editText = useSignal(props.description);
  function handleKeyDown(e4) {
    if (e4.key === "Escape") {
      if (editMode.value) {
        editText.value = props.description;
        editMode.value = false;
      } else {
        props.onClose();
      }
    }
  }
  y2(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  function handleSave() {
    const newValue = editText.value;
    if (props.onSave) {
      props.onSave(newValue);
    } else if (props.taskId) {
      props.store.persistEdit(props.taskId, "description", newValue || null);
    }
    editMode.value = false;
    props.onClose();
  }
  function handleCancel() {
    editText.value = props.description;
    editMode.value = false;
  }
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-description-backdrop",
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1e4
      },
      onClick: (e4) => {
        if (e4.target === e4.currentTarget) {
          if (editMode.value)
            handleCancel();
          else
            props.onClose();
        }
      },
      children: /* @__PURE__ */ u4(
        "div",
        {
          class: "gantt-description-modal",
          style: {
            background: "var(--background-primary, #fff)",
            borderRadius: "8px",
            padding: "24px",
            maxWidth: "700px",
            width: "90%",
            maxHeight: "50vh",
            boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
            color: "var(--text-normal, #333)",
            display: "flex",
            flexDirection: "column"
          },
          children: [
            /* @__PURE__ */ u4("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexShrink: 0 }, children: [
              /* @__PURE__ */ u4("span", { style: { fontWeight: "bold", fontSize: "14px" }, children: "Description" }),
              /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "6px", alignItems: "center" }, children: [
                editMode.value ? /* @__PURE__ */ u4(S, { children: [
                  /* @__PURE__ */ u4(
                    "button",
                    {
                      onClick: handleSave,
                      title: "Save",
                      style: {
                        padding: "3px 10px",
                        border: "1px solid var(--interactive-accent, #4A90D9)",
                        borderRadius: "4px",
                        background: "var(--interactive-accent, #4A90D9)",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "11px"
                      },
                      children: "Save"
                    }
                  ),
                  /* @__PURE__ */ u4(
                    "button",
                    {
                      onClick: handleCancel,
                      title: "Cancel",
                      style: {
                        padding: "3px 8px",
                        border: "1px solid var(--background-modifier-border, #ccc)",
                        borderRadius: "4px",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "11px",
                        color: "var(--text-muted, #999)"
                      },
                      children: "Cancel"
                    }
                  )
                ] }) : (props.taskId || props.onSave) && /* @__PURE__ */ u4(
                  "button",
                  {
                    onClick: () => {
                      editText.value = props.description;
                      editMode.value = true;
                    },
                    title: "Edit description",
                    style: {
                      padding: "3px 8px",
                      border: "1px solid var(--background-modifier-border, #ccc)",
                      borderRadius: "4px",
                      background: "var(--background-secondary, #f5f5f5)",
                      cursor: "pointer",
                      fontSize: "11px",
                      color: "var(--text-normal, #333)"
                    },
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ u4(
                  "button",
                  {
                    onClick: props.onClose,
                    title: "Close",
                    style: {
                      padding: "2px 6px",
                      border: "none",
                      borderRadius: "3px",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "var(--text-muted, #999)",
                      lineHeight: 1
                    },
                    children: "x"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u4("div", { style: { overflowY: "auto", flex: 1, minHeight: 0 }, children: editMode.value ? /* @__PURE__ */ u4(
              "textarea",
              {
                value: editText.value,
                onInput: (e4) => {
                  editText.value = e4.target.value;
                },
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "vertical",
                  minHeight: "200px",
                  fontSize: "13px",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid var(--background-modifier-border, #ccc)",
                  background: "var(--background-primary, #fff)",
                  color: "var(--text-normal, #333)",
                  fontFamily: "var(--font-monospace, monospace)",
                  lineHeight: 1.5
                }
              }
            ) : /* @__PURE__ */ u4(MarkdownView, { markdown: collapseNewlines(props.description), store: props.store }) })
          ]
        }
      )
    }
  );
}
function DescriptionViewer(props) {
  const showModal = useSignal(false);
  const startEdit = useSignal(false);
  return /* @__PURE__ */ u4("div", { children: [
    /* @__PURE__ */ u4(
      "div",
      {
        class: "gantt-description-preview",
        style: {
          maxHeight: "200px",
          overflowY: "auto",
          border: "1px solid var(--background-modifier-border, #e0e0e0)",
          borderRadius: "4px",
          padding: "6px 8px",
          background: "var(--background-primary, #fff)"
        },
        children: props.description ? /* @__PURE__ */ u4(MarkdownView, { markdown: collapseNewlines(props.description), store: props.store }) : /* @__PURE__ */ u4("div", { style: { fontSize: "12px", color: "var(--text-muted, #999)", fontStyle: "italic" }, children: "No description" })
      }
    ),
    /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "6px", marginTop: "6px" }, children: [
      props.description && /* @__PURE__ */ u4(
        "button",
        {
          onClick: () => {
            showModal.value = true;
            startEdit.value = false;
          },
          style: {
            padding: "3px 12px",
            border: "1px solid var(--background-modifier-border, #ccc)",
            borderRadius: "4px",
            background: "var(--background-secondary, #f5f5f5)",
            cursor: "pointer",
            fontSize: "11px",
            color: "var(--text-muted, #666)"
          },
          children: "View full description"
        }
      ),
      props.taskId && /* @__PURE__ */ u4(
        "button",
        {
          onClick: () => {
            showModal.value = true;
            startEdit.value = true;
          },
          style: {
            padding: "3px 12px",
            border: "1px solid var(--background-modifier-border, #ccc)",
            borderRadius: "4px",
            background: "var(--background-secondary, #f5f5f5)",
            cursor: "pointer",
            fontSize: "11px",
            color: "var(--interactive-accent, #4A90D9)"
          },
          children: "Edit description"
        }
      ),
      props.onSave && /* @__PURE__ */ u4(
        "button",
        {
          onClick: () => {
            showModal.value = true;
            startEdit.value = true;
          },
          style: {
            padding: "3px 12px",
            border: "1px solid var(--background-modifier-border, #ccc)",
            borderRadius: "4px",
            background: "var(--background-secondary, #f5f5f5)",
            cursor: "pointer",
            fontSize: "11px",
            color: "var(--interactive-accent, #4A90D9)"
          },
          children: "Edit description"
        }
      )
    ] }),
    showModal.value && /* @__PURE__ */ u4(
      DescriptionModal,
      {
        description: props.description,
        store: props.store,
        taskId: props.taskId,
        onSave: props.onSave,
        startEdit: startEdit.value,
        onClose: () => {
          showModal.value = false;
        }
      }
    )
  ] });
}
function TaskDetail(props) {
  const { store: store2 } = props;
  const sel = store2.selectedEntity.value;
  if (!sel || sel.type !== "task")
    return null;
  const task = store2.mergedTasks.value.find((t4) => t4.id === sel.id);
  if (!task)
    return null;
  const personName = task.personId.value ? store2.persons.value.find((p5) => p5.id === task.personId.value)?.name ?? task.personId.value : null;
  const project = task.projectId.value ? store2.projects.value.find((p5) => p5.id === task.projectId.value) : null;
  const editTitle = useSignal(false);
  const editTitleValue = useSignal(task.title.value);
  let titleInputRef = null;
  const taskDetail = useSignal(null);
  const taskDetailLoading = useSignal(false);
  y2(() => {
    const connectorId = task.connectorId;
    if (!connectorId)
      return;
    let cancelled = false;
    taskDetailLoading.value = true;
    store2.fetchEntityDetail(task.upstreamId ?? task.id, "task", connectorId).then((data) => {
      if (!cancelled && data)
        taskDetail.value = data;
    }).finally(() => {
      if (!cancelled)
        taskDetailLoading.value = false;
    });
    return () => {
      cancelled = true;
    };
  }, [task.id, task.connectorId]);
  const editing = useSignal(false);
  const editStartDate = useSignal(task.startDate.value ?? "");
  const editEndDate = useSignal(task.endDate.value ?? "");
  const editProgress = useSignal(task.progress.value ?? 0);
  const editPersonId = useSignal(task.personId.value ?? "");
  const editProjectId = useSignal(task.projectId.value ?? "");
  const editUrl = useSignal(task.url.value ?? "");
  const editDeps = useSignal([...task.dependencies.value]);
  const editTags = useSignal([...task.tags.value]);
  const editDepInput = useSignal("");
  const editDescription = useSignal("");
  const knownTags = T2(() => {
    const set = /* @__PURE__ */ new Set();
    for (const p5 of store2.mergedProjects.value) {
      for (const t4 of p5.tags ?? [])
        set.add(t4);
    }
    for (const t4 of store2.mergedTasks.value) {
      for (const tag of t4.tags.value)
        set.add(tag);
    }
    const defs = store2.tagDefinitions.value;
    if (defs) {
      for (const d4 of defs)
        set.add(d4.name);
    }
    return [...set].sort();
  }, [store2.mergedProjects.value, store2.mergedTasks.value, store2.tagDefinitions.value]);
  function startEditTitle() {
    editTitleValue.value = task.title.value;
    editTitle.value = true;
    requestAnimationFrame(() => titleInputRef?.focus());
  }
  function saveTitle() {
    const newTitle = editTitleValue.value.trim();
    if (newTitle && newTitle !== task.title.value) {
      store2.persistEdit(task.id, "title", newTitle);
    }
    editTitle.value = false;
  }
  function cancelTitle() {
    editTitleValue.value = task.title.value;
    editTitle.value = false;
  }
  function startEditing() {
    const manualDesc = store2.edits.value?.overrides?.[task.id]?.description;
    const detailDesc = taskDetail.value?.description;
    editDescription.value = manualDesc !== void 0 ? manualDesc : detailDesc ?? "";
    editStartDate.value = task.startDate.value ?? "";
    editEndDate.value = task.endDate.value ?? "";
    editProgress.value = task.progress.value ?? 0;
    editPersonId.value = task.personId.value ?? "";
    editProjectId.value = task.projectId.value ?? "";
    editUrl.value = task.url.value ?? "";
    editDeps.value = [...task.dependencies.value];
    editTags.value = [...task.tags.value];
    editing.value = true;
  }
  function cancelEditing() {
    editing.value = false;
  }
  async function saveEditing() {
    const t4 = task;
    const pid = t4.id;
    if (editStartDate.value !== (t4.startDate.value ?? ""))
      store2.persistEdit(pid, "startDate", editStartDate.value || null);
    if (editEndDate.value !== (t4.endDate.value ?? ""))
      store2.persistEdit(pid, "endDate", editEndDate.value || null);
    if (editProgress.value !== (t4.progress.value ?? 0))
      store2.persistEdit(pid, "progress", editProgress.value);
    if (editPersonId.value !== (t4.personId.value ?? ""))
      store2.persistEdit(pid, "personId", editPersonId.value || null);
    if (editProjectId.value !== (t4.projectId.value ?? ""))
      store2.persistEdit(pid, "projectId", editProjectId.value || null);
    if (editUrl.value !== (t4.url.value ?? ""))
      store2.persistEdit(pid, "url", editUrl.value || null);
    if (JSON.stringify(editDeps.value) !== JSON.stringify(t4.dependencies.value))
      store2.persistEdit(pid, "dependencies", editDeps.value);
    if (JSON.stringify(editTags.value) !== JSON.stringify(t4.tags.value))
      store2.persistEdit(pid, "tags", editTags.value);
    const manualDesc = store2.edits.value?.overrides?.[pid]?.description;
    const detailDesc = taskDetail.value?.description;
    const currentDesc = manualDesc !== void 0 ? manualDesc : detailDesc;
    if (editDescription.value !== (currentDesc ?? ""))
      store2.persistEdit(pid, "description", editDescription.value || null);
    const existingNames = new Set(store2.tagDefinitions.value.map((t22) => t22.name));
    const flatColors = ["#4A90D9", "#7B61F8", "#E06C75", "#61AFEF", "#98C379", "#E5C07B", "#C678DD", "#56B6C2"];
    for (const tag of editTags.value) {
      if (!existingNames.has(tag)) {
        await store2.createTag(tag, flatColors[Math.floor(Math.random() * flatColors.length)]);
        existingNames.add(tag);
      }
    }
    editing.value = false;
  }
  function addDep() {
    const val = editDepInput.value.trim();
    if (!val || editDeps.value.includes(val))
      return;
    editDeps.value = [...editDeps.value, val];
    editDepInput.value = "";
  }
  function removeDep(id) {
    editDeps.value = editDeps.value.filter((d4) => d4 !== id);
  }
  const sourceLabel = task.connectorId ? `Connector: ${task.connectorId}` : task.upstreamId ? "Local override" : "Manual entry";
  const sourceStyle = task.upstreamDeleted ? "line-through" : "normal";
  const labelStyle = { fontSize: "11px", color: "var(--text-muted, #999)", marginBottom: "2px" };
  const inputStyle = {
    width: "100%",
    fontSize: "12px",
    padding: "3px 6px",
    borderRadius: "4px",
    border: "1px solid var(--background-modifier-border, #ccc)",
    background: "var(--background-primary, #fff)",
    color: "var(--text-normal, #333)",
    boxSizing: "border-box"
  };
  const fieldStyle = { marginBottom: "10px" };
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-detail-panel",
      style: {
        width: `${store2.detailPanelWidth.value}px`,
        minWidth: "180px",
        maxHeight: "100%",
        borderLeft: "1px solid var(--gantt-grid-line-week, #c0c0c0)",
        padding: "12px",
        fontSize: "13px",
        color: "var(--text-normal, #333)",
        overflowY: "auto",
        background: "var(--background-secondary, #f5f5f5)"
      },
      children: [
        /* @__PURE__ */ u4(
          DetailHeader,
          {
            store: store2,
            editing,
            title: task.title.value,
            editTitleEnabled: editTitle,
            editTitleValue,
            titleInputRef: (el) => {
              titleInputRef = el;
            },
            onStartEditTitle: startEditTitle,
            onSaveTitle: saveTitle,
            onCancelTitle: cancelTitle,
            onEdit: startEditing,
            onSave: saveEditing,
            onCancel: cancelEditing,
            onDelete: () => props.onDelete?.(task.id, task.title.value),
            onLocate: () => {
              store2.locateTarget.value = { type: "task", id: task.id };
            },
            onClose: () => store2.selectEntity(null)
          }
        ),
        /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column" }, children: [
          /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
            /* @__PURE__ */ u4("div", { style: labelStyle, children: "Project" }),
            editing.value ? /* @__PURE__ */ u4(
              "select",
              {
                value: editProjectId.value,
                onChange: (e4) => {
                  editProjectId.value = e4.target.value;
                },
                style: inputStyle,
                children: [
                  /* @__PURE__ */ u4("option", { value: "", children: "No project" }),
                  store2.projects.value.map((p5) => /* @__PURE__ */ u4("option", { value: p5.id, children: p5.name }, p5.id))
                ]
              }
            ) : project ? /* @__PURE__ */ u4(
              "div",
              {
                style: { display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px" },
                onClick: () => store2.selectEntity({ type: "project", id: project.id }),
                title: "Go to project",
                children: [
                  /* @__PURE__ */ u4("span", { style: {
                    width: "10px",
                    height: "10px",
                    borderRadius: "2px",
                    background: project.color ?? "#888",
                    flexShrink: 0
                  } }),
                  /* @__PURE__ */ u4("span", { style: { color: "var(--interactive-accent, #4A90D9)", textDecoration: "underline" }, children: project.name })
                ]
              }
            ) : /* @__PURE__ */ u4("div", { style: { fontSize: "13px" }, children: "\u2014" })
          ] }),
          /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
            /* @__PURE__ */ u4("div", { style: labelStyle, children: "Status" }),
            /* @__PURE__ */ u4(
              "select",
              {
                value: task.status.value,
                onChange: (e4) => store2.setTaskStatus(task.id, e4.target.value),
                style: inputStyle,
                children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ u4("option", { value: opt.value, children: opt.label }, opt.value))
              }
            )
          ] }),
          /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
            /* @__PURE__ */ u4("div", { style: labelStyle, children: "Tags" }),
            /* @__PURE__ */ u4(
              TagsEditor,
              {
                store: store2,
                tags: editing.value ? editTags.value : task.tags.value,
                knownTags,
                editing: editing.value,
                onChange: (tags) => {
                  editTags.value = tags;
                },
                onSave: (tags) => {
                  editTags.value = tags;
                }
              }
            )
          ] }),
          /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
            /* @__PURE__ */ u4("div", { style: labelStyle, children: "Start" }),
            editing.value ? /* @__PURE__ */ u4(
              "input",
              {
                type: "date",
                value: editStartDate.value,
                onInput: (e4) => {
                  editStartDate.value = e4.target.value;
                },
                style: inputStyle
              }
            ) : task.startDate.value ? /* @__PURE__ */ u4("div", { style: { fontSize: "13px" }, children: task.startDate.value }) : /* @__PURE__ */ u4("div", { style: { fontSize: "12px" }, children: "\u2014" })
          ] }),
          /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
            /* @__PURE__ */ u4("div", { style: labelStyle, children: "End" }),
            editing.value ? /* @__PURE__ */ u4(
              "input",
              {
                type: "date",
                value: editEndDate.value,
                onInput: (e4) => {
                  editEndDate.value = e4.target.value;
                },
                style: inputStyle
              }
            ) : task.endDate.value ? /* @__PURE__ */ u4("div", { style: { fontSize: "13px" }, children: task.endDate.value }) : /* @__PURE__ */ u4("div", { style: { fontSize: "12px" }, children: "\u2014" })
          ] }),
          /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
            /* @__PURE__ */ u4("div", { style: labelStyle, children: "Progress" }),
            editing.value ? /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
              /* @__PURE__ */ u4(
                "input",
                {
                  type: "range",
                  min: 0,
                  max: 1,
                  step: 0.05,
                  value: editProgress.value,
                  onInput: (e4) => {
                    editProgress.value = parseFloat(e4.target.value);
                  },
                  style: { flex: 1 }
                }
              ),
              /* @__PURE__ */ u4("span", { style: { fontSize: "12px", minWidth: "36px", textAlign: "right" }, children: [
                Math.round(editProgress.value * 100),
                "%"
              ] })
            ] }) : /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
              /* @__PURE__ */ u4("div", { style: { flex: 1, height: "6px", borderRadius: "3px", background: "var(--background-modifier-border, #e0e0e0)" }, children: /* @__PURE__ */ u4("div", { style: {
                width: `${(task.progress.value ?? 0) * 100}%`,
                height: "100%",
                borderRadius: "3px",
                background: "var(--interactive-accent, #4A90D9)"
              } }) }),
              /* @__PURE__ */ u4("span", { style: { fontSize: "12px", minWidth: "36px", textAlign: "right" }, children: [
                Math.round((task.progress.value ?? 0) * 100),
                "%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
            /* @__PURE__ */ u4("div", { style: labelStyle, children: "Person" }),
            editing.value ? /* @__PURE__ */ u4(
              "select",
              {
                value: editPersonId.value,
                onChange: (e4) => {
                  editPersonId.value = e4.target.value;
                },
                style: inputStyle,
                children: [
                  /* @__PURE__ */ u4("option", { value: "", children: "Unassigned" }),
                  store2.persons.value.map((p5) => /* @__PURE__ */ u4("option", { value: p5.id, children: p5.name }, p5.id))
                ]
              }
            ) : /* @__PURE__ */ u4("div", { style: { fontSize: "13px" }, children: personName || "\u2014" })
          ] }),
          /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
            /* @__PURE__ */ u4("div", { style: labelStyle, children: "Dependencies" }),
            editing.value ? /* @__PURE__ */ u4("div", { children: [
              /* @__PURE__ */ u4("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }, children: editDeps.value.map((d4) => /* @__PURE__ */ u4("span", { style: {
                padding: "1px 6px",
                borderRadius: "10px",
                fontSize: "11px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "var(--background-modifier-border, #e0e0e0)"
              }, children: [
                d4,
                /* @__PURE__ */ u4("button", { onClick: () => removeDep(d4), style: {
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "var(--text-error, #e00)",
                  lineHeight: 1,
                  padding: 0
                }, children: "\xD7" })
              ] }, d4)) }),
              /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "4px" }, children: [
                /* @__PURE__ */ u4(
                  "input",
                  {
                    type: "text",
                    value: editDepInput.value,
                    onInput: (e4) => {
                      editDepInput.value = e4.target.value;
                    },
                    onKeyDown: (e4) => {
                      if (e4.key === "Enter") {
                        e4.preventDefault();
                        addDep();
                      }
                    },
                    placeholder: "Task ID...",
                    style: { ...inputStyle, flex: 1 }
                  }
                ),
                /* @__PURE__ */ u4("button", { onClick: addDep, style: {
                  padding: "3px 8px",
                  border: "1px solid var(--background-modifier-border, #ccc)",
                  borderRadius: "4px",
                  background: "var(--background-secondary, #f5f5f5)",
                  cursor: "pointer",
                  fontSize: "11px",
                  whiteSpace: "nowrap"
                }, children: "Add" })
              ] })
            ] }) : /* @__PURE__ */ u4("div", { style: { fontSize: "12px" }, children: task.dependencies.value.length > 0 ? task.dependencies.value.map((d4) => /* @__PURE__ */ u4("div", { style: { padding: "1px 0" }, children: d4 }, d4)) : "\u2014" })
          ] }),
          /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
            /* @__PURE__ */ u4("div", { style: labelStyle, children: "Link" }),
            editing.value ? /* @__PURE__ */ u4(
              "input",
              {
                type: "text",
                value: editUrl.value,
                onInput: (e4) => {
                  editUrl.value = e4.target.value;
                },
                placeholder: "https://...",
                style: inputStyle
              }
            ) : task.url.value ? /* @__PURE__ */ u4(LinkField, { url: task.url.value, store: store2 }) : /* @__PURE__ */ u4("div", { style: { fontSize: "12px" }, children: "\u2014" })
          ] }),
          editing.value ? /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
            /* @__PURE__ */ u4("div", { style: labelStyle, children: "Description" }),
            /* @__PURE__ */ u4(
              "textarea",
              {
                value: editDescription.value,
                onInput: (e4) => {
                  editDescription.value = e4.target.value;
                },
                rows: 4,
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontSize: "12px",
                  padding: "4px",
                  borderRadius: "4px",
                  border: "1px solid var(--background-modifier-border, #ccc)",
                  background: "var(--background-primary, #fff)",
                  color: "var(--text-normal, #333)"
                },
                placeholder: "Task description..."
              }
            )
          ] }) : (() => {
            const manualDesc = store2.edits.value?.overrides?.[task.id]?.description;
            const detailDesc = taskDetail.value?.description;
            const effectiveDesc = manualDesc !== void 0 ? manualDesc : detailDesc;
            if (taskDetailLoading.value) {
              return /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
                /* @__PURE__ */ u4("div", { style: labelStyle, children: "Description" }),
                /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", fontStyle: "italic" }, children: "Loading..." })
              ] });
            }
            return /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
              /* @__PURE__ */ u4("div", { style: labelStyle, children: "Description" }),
              /* @__PURE__ */ u4(DescriptionViewer, { description: effectiveDesc ?? "", store: store2, taskId: task.id })
            ] });
          })(),
          /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", marginTop: "4px" }, children: [
            /* @__PURE__ */ u4("div", { style: { textDecoration: sourceStyle }, children: sourceLabel }),
            task.upstreamDeleted && /* @__PURE__ */ u4("div", { style: { color: "var(--text-error, #e00)", marginTop: "2px" }, children: "Deleted upstream" })
          ] })
        ] })
      ]
    }
  );
}
function ColorSwatchPicker(props) {
  const palette = props.colors ?? PRESET_COLORS;
  const showCustom = useSignal(false);
  return /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
    /* @__PURE__ */ u4("div", { style: {
      display: "grid",
      gridTemplateColumns: `repeat(${palette[0]?.length ?? 7}, 14px)`,
      gap: "3px"
    }, children: palette.flat().map((c4) => /* @__PURE__ */ u4(
      "button",
      {
        onClick: () => props.onChange(c4),
        title: c4,
        style: {
          width: "14px",
          height: "14px",
          borderRadius: "2px",
          background: c4,
          border: props.value === c4 ? "2px solid var(--text-normal, #333)" : "1px solid var(--background-modifier-border, #ccc)",
          cursor: "pointer",
          padding: 0,
          outline: props.value === c4 ? `2px solid ${c4}` : "none",
          outlineOffset: "1px"
        }
      },
      c4
    )) }),
    /* @__PURE__ */ u4(
      "button",
      {
        onClick: () => {
          showCustom.value = !showCustom.value;
        },
        style: {
          padding: "2px 6px",
          border: "1px solid var(--background-modifier-border, #ccc)",
          borderRadius: "3px",
          background: "transparent",
          cursor: "pointer",
          fontSize: "10px",
          color: "var(--text-muted, #999)",
          alignSelf: "flex-start"
        },
        children: showCustom.value ? "Hide custom" : "Custom..."
      }
    ),
    showCustom.value && /* @__PURE__ */ u4(
      "input",
      {
        type: "color",
        value: props.value,
        onInput: (e4) => props.onChange(e4.target.value),
        style: { width: "100%", height: "28px", padding: 0, border: "none", cursor: "pointer" }
      }
    )
  ] });
}
function KeyDateEditor(props) {
  const colorPickerOpen = useSignal(null);
  const iconPickerOpen = useSignal(null);
  const editKeyDates = useSignal(
    props.keyDates.map((kd) => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon }))
  );
  y2(() => {
    if (props.editing) {
      editKeyDates.value = props.keyDates.map((kd) => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon }));
    }
  }, [props.editing]);
  return /* @__PURE__ */ u4("div", { style: props.fieldStyle, children: [
    /* @__PURE__ */ u4("div", { style: props.labelStyle, children: "Key Dates" }),
    props.editing ? /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
      /* @__PURE__ */ u4("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "4px" }, children: KEY_DATE_PRESETS.map((preset) => /* @__PURE__ */ u4(
        "button",
        {
          onClick: () => {
            const next = [...editKeyDates.value, {
              name: preset.name,
              date: todayString(),
              color: preset.color,
              icon: preset.icon
            }];
            editKeyDates.value = next;
            props.onChange(next);
          },
          title: preset.name,
          style: {
            padding: "2px 6px",
            fontSize: "10px",
            borderRadius: "3px",
            cursor: "pointer",
            border: `1px solid ${preset.color}`,
            background: "var(--background-primary, #fff)",
            color: preset.color,
            whiteSpace: "nowrap"
          },
          children: [
            /* @__PURE__ */ u4("span", { style: {
              display: "inline-block",
              width: "12px",
              height: "12px",
              textAlign: "center",
              borderRadius: "2px",
              background: preset.color,
              color: "#fff",
              marginRight: "3px"
            }, children: /* @__PURE__ */ u4(Icon, { name: preset.icon, size: 9 }) }),
            preset.name
          ]
        },
        preset.name
      )) }),
      editKeyDates.value.map((kd, i5) => /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "3px", alignItems: "center", width: "100%" }, children: [
        /* @__PURE__ */ u4("div", { style: { position: "relative", flexShrink: 0, width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }, children: [
          /* @__PURE__ */ u4(
            "button",
            {
              onClick: () => {
                colorPickerOpen.value = colorPickerOpen.value === i5 ? null : i5;
              },
              title: kd.color ?? "#E5C07B",
              style: {
                width: "16px",
                height: "16px",
                padding: 0,
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
                background: kd.color ?? "#E5C07B",
                transform: "rotate(45deg)"
              }
            }
          ),
          colorPickerOpen.value === i5 && /* @__PURE__ */ u4("div", { style: {
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 100,
            background: "var(--background-primary, #fff)",
            border: "1px solid var(--background-modifier-border, #ccc)",
            borderRadius: "4px",
            padding: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            marginTop: "2px"
          }, children: /* @__PURE__ */ u4(
            ColorSwatchPicker,
            {
              value: kd.color ?? "#E5C07B",
              onChange: (c4) => {
                const next = [...editKeyDates.value];
                next[i5] = { ...next[i5], color: c4 };
                editKeyDates.value = next;
                props.onChange(next);
              }
            }
          ) })
        ] }),
        /* @__PURE__ */ u4("div", { style: { position: "relative", flexShrink: 0 }, children: [
          /* @__PURE__ */ u4(
            "button",
            {
              onClick: () => {
                iconPickerOpen.value = iconPickerOpen.value === i5 ? null : i5;
              },
              title: kd.icon || "Select icon",
              style: {
                width: "24px",
                height: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--background-modifier-border, #ccc)",
                borderRadius: "3px",
                background: "var(--background-primary, #fff)",
                cursor: "pointer",
                padding: 0
              },
              children: kd.icon ? /* @__PURE__ */ u4(Icon, { name: kd.icon, size: 12 }) : /* @__PURE__ */ u4("span", { style: { fontSize: "8px", color: "var(--text-muted, #999)" }, children: "\u25C6" })
            }
          ),
          iconPickerOpen.value === i5 && /* @__PURE__ */ u4("div", { style: {
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 100,
            background: "var(--background-primary, #fff)",
            border: "1px solid var(--background-modifier-border, #ccc)",
            borderRadius: "4px",
            padding: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            minWidth: "140px"
          }, children: [
            /* @__PURE__ */ u4("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }, children: CURATED_ICONS.map((iconName) => /* @__PURE__ */ u4(
              "button",
              {
                onClick: () => {
                  const next = [...editKeyDates.value];
                  next[i5] = { ...next[i5], icon: iconName };
                  editKeyDates.value = next;
                  props.onChange(next);
                  iconPickerOpen.value = null;
                },
                title: iconName,
                style: {
                  width: "28px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: kd.icon === iconName ? "1px solid var(--interactive-accent, #7B61F8)" : "1px solid transparent",
                  borderRadius: "3px",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0
                },
                children: /* @__PURE__ */ u4(Icon, { name: iconName, size: 14 })
              },
              iconName
            )) }),
            kd.icon && /* @__PURE__ */ u4(
              "button",
              {
                onClick: () => {
                  const next = [...editKeyDates.value];
                  next[i5] = { ...next[i5], icon: void 0 };
                  editKeyDates.value = next;
                  props.onChange(next);
                  iconPickerOpen.value = null;
                },
                style: {
                  width: "100%",
                  marginTop: "4px",
                  padding: "2px",
                  fontSize: "10px",
                  border: "1px solid var(--background-modifier-border, #ccc)",
                  borderRadius: "3px",
                  background: "var(--background-primary, #fff)",
                  cursor: "pointer",
                  color: "var(--text-muted, #999)"
                },
                children: "Clear icon"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u4(
          "input",
          {
            type: "text",
            value: kd.name,
            list: "keydate-name-memory-list",
            onInput: (e4) => {
              const next = [...editKeyDates.value];
              next[i5] = { ...next[i5], name: e4.target.value };
              editKeyDates.value = next;
              props.onChange(next);
            },
            placeholder: "Name",
            style: {
              flex: "1 1 0",
              minWidth: "30px",
              fontSize: "11px",
              padding: "3px 2px",
              borderRadius: "3px",
              border: "1px solid var(--background-modifier-border, #ccc)",
              background: "var(--background-primary, #fff)",
              color: "var(--text-normal, #333)"
            }
          }
        ),
        /* @__PURE__ */ u4(
          "input",
          {
            type: "date",
            value: kd.date,
            onInput: (e4) => {
              const next = [...editKeyDates.value];
              next[i5] = { ...next[i5], date: e4.target.value };
              editKeyDates.value = next;
              props.onChange(next);
            },
            style: {
              width: "120px",
              fontSize: "11px",
              padding: "3px 6px 3px 18px",
              borderRadius: "3px",
              flexShrink: 0,
              border: "1px solid var(--background-modifier-border, #ccc)",
              background: "var(--background-primary, #fff)",
              color: "var(--text-normal, #333)"
            }
          }
        ),
        /* @__PURE__ */ u4(
          "button",
          {
            onClick: () => {
              const next = editKeyDates.value.filter((_3, idx) => idx !== i5);
              editKeyDates.value = next;
              props.onChange(next);
            },
            style: {
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              color: "var(--text-error, #e00)",
              padding: "0 2px",
              lineHeight: 1,
              flexShrink: 0
            },
            title: "Remove key date",
            children: "x"
          }
        )
      ] }, i5)),
      /* @__PURE__ */ u4(
        "button",
        {
          onClick: () => {
            const next = [...editKeyDates.value, { name: "", date: "", color: "#E5C07B", icon: "" }];
            editKeyDates.value = next;
            props.onChange(next);
          },
          style: {
            padding: "2px 8px",
            border: "1px dashed var(--background-modifier-border, #ccc)",
            borderRadius: "4px",
            background: "transparent",
            cursor: "pointer",
            fontSize: "11px",
            marginTop: "2px"
          },
          children: "+ Custom Key Date"
        }
      )
    ] }) : /* @__PURE__ */ u4("div", { children: props.keyDates.length > 0 ? [...props.keyDates].sort((a4, b3) => a4.date.localeCompare(b3.date)).map((kd, i5) => /* @__PURE__ */ u4("div", { style: { fontSize: "12px", padding: "2px 0", display: "flex", gap: "6px", alignItems: "center" }, children: [
      /* @__PURE__ */ u4("span", { style: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "16px",
        height: "16px",
        flexShrink: 0
      }, children: [
        /* @__PURE__ */ u4("span", { style: {
          width: "12px",
          height: "12px",
          borderRadius: "2px",
          background: kd.color ?? "var(--gantt-key-date-color, #E5C07B)",
          transform: "rotate(45deg)"
        } }),
        kd.icon && /* @__PURE__ */ u4("span", { style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff"
        }, children: /* @__PURE__ */ u4(Icon, { name: kd.icon, size: 9 }) })
      ] }),
      /* @__PURE__ */ u4("span", { style: { color: "var(--text-muted, #999)", minWidth: "80px" }, children: kd.date }),
      /* @__PURE__ */ u4("span", { children: kd.name })
    ] }, i5)) : /* @__PURE__ */ u4("div", { style: props.valueStyle, children: "\u2014" }) })
  ] });
}
function KeyLinkEditor(props) {
  const copiedKey = useSignal(null);
  const editKeyLinks = useSignal(props.keyLinks.map((kl) => ({ ...kl })));
  y2(() => {
    if (props.editing) {
      editKeyLinks.value = props.keyLinks.map((kl) => ({ ...kl }));
    }
  }, [props.editing]);
  async function copyToClipboard(url) {
    try {
      await navigator.clipboard.writeText(url);
      copiedKey.value = url;
      setTimeout(() => {
        copiedKey.value = null;
      }, 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }
  return /* @__PURE__ */ u4("div", { style: props.fieldStyle, children: [
    /* @__PURE__ */ u4("div", { style: props.labelStyle, children: "Key Links" }),
    props.editing ? /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
      editKeyLinks.value.map((kl, i5) => /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "4px", alignItems: "center" }, children: [
        /* @__PURE__ */ u4(
          "input",
          {
            type: "text",
            value: kl.name,
            list: "keylink-name-memory-list",
            onInput: (e4) => {
              const next = [...editKeyLinks.value];
              next[i5] = { ...next[i5], name: e4.target.value };
              editKeyLinks.value = next;
              props.onChange(next);
            },
            placeholder: "Link name",
            style: {
              width: "80px",
              fontSize: "11px",
              padding: "3px",
              borderRadius: "3px",
              flexShrink: 0,
              border: "1px solid var(--background-modifier-border, #ccc)",
              background: "var(--background-primary, #fff)",
              color: "var(--text-normal, #333)"
            }
          }
        ),
        /* @__PURE__ */ u4(
          "input",
          {
            type: "url",
            value: kl.url,
            onInput: (e4) => {
              const next = [...editKeyLinks.value];
              next[i5] = { ...next[i5], url: e4.target.value };
              editKeyLinks.value = next;
              props.onChange(next);
            },
            placeholder: "https://...",
            style: {
              flex: 1,
              fontSize: "11px",
              padding: "3px",
              borderRadius: "3px",
              border: "1px solid var(--background-modifier-border, #ccc)",
              background: "var(--background-primary, #fff)",
              color: "var(--text-normal, #333)"
            }
          }
        ),
        /* @__PURE__ */ u4(
          "button",
          {
            onClick: () => {
              const next = editKeyLinks.value.filter((_3, idx) => idx !== i5);
              editKeyLinks.value = next;
              props.onChange(next);
            },
            style: {
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              color: "var(--text-error, #e00)",
              padding: "0 2px",
              lineHeight: 1,
              flexShrink: 0
            },
            title: "Remove link",
            children: "x"
          }
        )
      ] }, i5)),
      /* @__PURE__ */ u4(
        "button",
        {
          onClick: () => {
            const next = [...editKeyLinks.value, { name: "", url: "" }];
            editKeyLinks.value = next;
            props.onChange(next);
          },
          style: {
            padding: "2px 8px",
            border: "1px dashed var(--background-modifier-border, #ccc)",
            borderRadius: "4px",
            background: "transparent",
            cursor: "pointer",
            fontSize: "11px",
            marginTop: "2px"
          },
          children: "+ Add Link"
        }
      )
    ] }) : /* @__PURE__ */ u4("div", { children: props.keyLinks.length > 0 ? props.keyLinks.map((kl, i5) => /* @__PURE__ */ u4("div", { style: { fontSize: "12px", padding: "2px 0", display: "flex", alignItems: "center", gap: "4px" }, children: [
      /* @__PURE__ */ u4(
        "a",
        {
          href: kl.url,
          target: "_blank",
          rel: "noopener noreferrer",
          onClick: (e4) => {
            e4.preventDefault();
            const platform = props.store._platform;
            if (platform?.openExternal) {
              platform.openExternal(kl.url);
            } else {
              window.open(kl.url, "_blank");
            }
          },
          style: {
            color: "var(--interactive-accent, #4A90D9)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          },
          title: kl.url,
          children: [
            /* @__PURE__ */ u4("span", { style: { fontSize: "10px", flexShrink: 0 }, children: "\u2197" }),
            /* @__PURE__ */ u4("span", { style: { overflow: "hidden", textOverflow: "ellipsis" }, children: kl.name || kl.url })
          ]
        }
      ),
      /* @__PURE__ */ u4(
        "button",
        {
          onClick: async (e4) => {
            e4.preventDefault();
            e4.stopPropagation();
            await copyToClipboard(kl.url);
          },
          title: "Copy link",
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            padding: "0 2px",
            color: "var(--text-muted, #999)",
            flexShrink: 0
          },
          children: copiedKey.value === kl.url ? /* @__PURE__ */ u4(Icon, { name: "check", size: 14, title: "Copied!" }) : /* @__PURE__ */ u4(Icon, { name: "copy", size: 14, title: "Copy link" })
        }
      )
    ] }, i5)) : /* @__PURE__ */ u4("div", { style: props.valueStyle, children: "\u2014" }) })
  ] });
}
function StatusBadge(props) {
  const opt = STATUS_OPTIONS.find((o4) => o4.value === props.status);
  const color = opt?.color ?? "#888";
  const label = opt?.label ?? props.status;
  return /* @__PURE__ */ u4("span", { style: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#fff",
    background: color,
    whiteSpace: "nowrap"
  }, children: label });
}
function ProjectDetail(props) {
  const { store: store2 } = props;
  const sel = store2.selectedEntity.value;
  const editing = useSignal(false);
  if (!sel || sel.type !== "project")
    return null;
  const project = store2.mergedProjects.value.find((p5) => p5.id === sel.id);
  if (!project)
    return null;
  const projectOverrides = store2.edits.value?.projectOverrides?.[project.id];
  const description = projectOverrides?.description ?? project.description ?? "";
  const requester = projectOverrides?.requester ?? project.requester ?? "";
  const keyDates = projectOverrides?.keyDates ?? project.keyDates ?? [];
  const keyLinks = projectOverrides?.keyLinks ?? project.keyLinks ?? [];
  const projectDetail = useSignal(null);
  const projectDetailLoading = useSignal(false);
  y2(() => {
    let connectorId = null;
    for (const cache of store2.caches.value) {
      if (cache.projects.some((p5) => p5.id === project.id)) {
        connectorId = cache.connectorId;
        break;
      }
    }
    if (!connectorId)
      return;
    let cancelled = false;
    projectDetailLoading.value = true;
    store2.fetchEntityDetail(project.id, "project", connectorId).then((data) => {
      if (!cancelled && data)
        projectDetail.value = data;
    }).finally(() => {
      if (!cancelled)
        projectDetailLoading.value = false;
    });
    return () => {
      cancelled = true;
    };
  }, [project.id]);
  const displayDescription = projectOverrides?.description ?? projectDetail.value?.description ?? project.description ?? "";
  const displayRequester = projectOverrides?.requester ?? projectDetail.value?.requester ?? project.requester ?? "";
  const displayKeyDates = projectOverrides?.keyDates ?? projectDetail.value?.keyDates ?? project.keyDates ?? [];
  const displayKeyLinks = projectOverrides?.keyLinks ?? projectDetail.value?.keyLinks ?? project.keyLinks ?? [];
  const editName = useSignal(false);
  const editNameValue = useSignal(project.name);
  let nameInputRef = null;
  function startEditName() {
    editNameValue.value = project.name;
    editName.value = true;
    requestAnimationFrame(() => nameInputRef?.focus());
  }
  function saveName() {
    const newName = editNameValue.value.trim();
    if (newName && newName !== project.name) {
      store2.persistProjectEdit(project.id, "name", newName);
    }
    editName.value = false;
  }
  function cancelName() {
    editNameValue.value = project.name;
    editName.value = false;
  }
  const associatedTasks = store2.mergedTasks.value.filter((t4) => t4.projectId.value === project.id);
  const editDescription = useSignal(displayDescription);
  const editRequester = useSignal(displayRequester);
  const editKeyDates = useSignal(
    displayKeyDates.map((kd) => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon }))
  );
  const editKeyLinks = useSignal(
    displayKeyLinks.map((kl) => ({ ...kl }))
  );
  const projectTags = projectOverrides?.tags ?? project.tags ?? [];
  const editTags = useSignal([...projectTags]);
  const showProjectColorPicker = useSignal(false);
  const knownTags = T2(() => {
    const set = /* @__PURE__ */ new Set();
    for (const p5 of store2.mergedProjects.value) {
      for (const t4 of p5.tags ?? [])
        set.add(t4);
    }
    const defs = store2.tagDefinitions.value;
    if (defs) {
      for (const d4 of defs)
        set.add(d4.name);
    }
    return [...set].sort();
  }, [store2.mergedProjects.value]);
  function handleEdit() {
    editDescription.value = displayDescription;
    editRequester.value = displayRequester;
    editKeyDates.value = displayKeyDates.map((kd) => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon }));
    editKeyLinks.value = displayKeyLinks.map((kl) => ({ ...kl }));
    editTags.value = [...projectTags];
    editing.value = true;
  }
  async function handleSave() {
    await store2.persistProjectEdit(project.id, "description", editDescription.value || void 0);
    await store2.persistProjectEdit(project.id, "requester", editRequester.value || void 0);
    if (editRequester.value)
      store2.saveFieldMemory("requesters", editRequester.value);
    await store2.persistProjectEdit(project.id, "keyDates", editKeyDates.value.length > 0 ? editKeyDates.value.map((kd) => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon })) : void 0);
    for (const kd of editKeyDates.value) {
      if (kd.name)
        store2.saveFieldMemory("keyDateNames", kd.name);
    }
    await store2.persistProjectEdit(project.id, "keyLinks", editKeyLinks.value.length > 0 ? editKeyLinks.value : void 0);
    for (const kl of editKeyLinks.value) {
      if (kl.name)
        store2.saveFieldMemory("keyLinkNames", kl.name);
    }
    await store2.persistProjectEdit(project.id, "tags", editTags.value.length > 0 ? editTags.value : void 0);
    const existingNames = new Set(store2.tagDefinitions.value.map((t4) => t4.name));
    const flatColors = PRESET_COLORS.flat();
    for (const tag of editTags.value) {
      if (!existingNames.has(tag)) {
        await store2.createTag(tag, flatColors[Math.floor(Math.random() * flatColors.length)]);
        existingNames.add(tag);
      }
    }
    editing.value = false;
  }
  function handleCancel() {
    editing.value = false;
  }
  const fieldStyle = { marginBottom: "12px" };
  const labelStyle = { fontSize: "11px", color: "var(--text-muted, #999)", marginBottom: "2px" };
  const valueStyle = { fontSize: "13px", wordBreak: "break-word" };
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-detail-panel",
      style: {
        width: `${store2.detailPanelWidth.value}px`,
        minWidth: "180px",
        maxHeight: "100%",
        borderLeft: "1px solid var(--gantt-grid-line-week, #c0c0c0)",
        padding: "12px",
        fontSize: "13px",
        color: "var(--text-normal, #333)",
        overflowY: "auto",
        background: "var(--background-secondary, #f5f5f5)"
      },
      children: [
        /* @__PURE__ */ u4(
          DetailHeader,
          {
            store: store2,
            editing,
            title: project.name,
            editTitleEnabled: editName,
            editTitleValue: editNameValue,
            titleInputRef: (el) => {
              nameInputRef = el;
            },
            onStartEditTitle: startEditName,
            onSaveTitle: saveName,
            onCancelTitle: cancelName,
            onEdit: handleEdit,
            onSave: handleSave,
            onCancel: handleCancel,
            onDelete: () => props.onDelete?.(project.id, project.name),
            onLocate: () => {
              store2.locateTarget.value = { type: "project", id: project.id };
            },
            onClose: () => store2.selectEntity(null),
            children: /* @__PURE__ */ u4("div", { style: { position: "relative", flexShrink: 0 }, children: [
              /* @__PURE__ */ u4(
                "button",
                {
                  onClick: () => {
                    showProjectColorPicker.value = !showProjectColorPicker.value;
                  },
                  title: "Change project color",
                  style: {
                    width: "12px",
                    height: "12px",
                    borderRadius: "3px",
                    background: project.color ?? getDefaultColor(project.id),
                    border: "1px solid var(--background-modifier-border, #ccc)",
                    cursor: "pointer",
                    padding: 0
                  }
                }
              ),
              showProjectColorPicker.value && /* @__PURE__ */ u4("div", { style: {
                position: "absolute",
                top: "100%",
                left: 0,
                zIndex: 100,
                background: "var(--background-primary, #fff)",
                border: "1px solid var(--background-modifier-border, #ccc)",
                borderRadius: "4px",
                padding: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                marginTop: "4px"
              }, children: /* @__PURE__ */ u4(
                ColorSwatchPicker,
                {
                  value: project.color ?? getDefaultColor(project.id),
                  onChange: (c4) => {
                    store2.persistProjectEdit(project.id, "color", c4);
                    showProjectColorPicker.value = false;
                  }
                }
              ) })
            ] })
          }
        ),
        /* @__PURE__ */ u4(
          "div",
          {
            style: {
              border: "2px dashed var(--interactive-accent, #7B61F8)",
              borderRadius: "4px",
              padding: "6px 8px",
              marginBottom: "12px",
              textAlign: "center",
              cursor: "grab",
              fontSize: "11px",
              color: "var(--interactive-accent, #7B61F8)",
              background: "var(--interactive-accent-bg, rgba(123, 97, 248, 0.04))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px"
            },
            class: "gantt-drag-create-area",
            draggable: true,
            onDragStart: (e4) => {
              e4.dataTransfer?.setData("text/plain", JSON.stringify({ projectId: project.id, projectName: project.name }));
            },
            children: [
              /* @__PURE__ */ u4(Icon, { name: "grip-vertical", size: 12 }),
              " Drag to person timeline to create task"
            ]
          }
        ),
        /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
          /* @__PURE__ */ u4("div", { style: labelStyle, children: "Status" }),
          /* @__PURE__ */ u4(
            "select",
            {
              value: project.status ?? "pending",
              onChange: (e4) => store2.setProjectStatus(project.id, e4.target.value),
              style: {
                width: "100%",
                fontSize: "12px",
                padding: "3px 6px",
                borderRadius: "4px",
                border: "1px solid var(--background-modifier-border, #ccc)",
                background: "var(--background-primary, #fff)",
                color: "var(--text-normal, #333)"
              },
              children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ u4("option", { value: opt.value, children: opt.label }, opt.value))
            }
          )
        ] }),
        /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
          /* @__PURE__ */ u4("div", { style: labelStyle, children: "Tags" }),
          /* @__PURE__ */ u4(
            TagsEditor,
            {
              store: store2,
              tags: editing.value ? editTags.value : projectTags,
              knownTags,
              editing: editing.value,
              onChange: (tags) => {
                editTags.value = tags;
              },
              onSave: (tags) => {
                editTags.value = tags;
              }
            }
          )
        ] }),
        /* @__PURE__ */ u4(
          KeyDateEditor,
          {
            store: store2,
            keyDates: editing.value ? editKeyDates.value : displayKeyDates,
            editing: editing.value,
            onChange: (kds) => {
              editKeyDates.value = kds;
            },
            fieldStyle,
            labelStyle,
            valueStyle
          }
        ),
        /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
          /* @__PURE__ */ u4("div", { style: labelStyle, children: "Requester" }),
          editing.value ? /* @__PURE__ */ u4(
            "input",
            {
              type: "text",
              value: editRequester.value,
              onInput: (e4) => {
                editRequester.value = e4.target.value;
              },
              list: "requester-memory-list",
              style: {
                width: "100%",
                boxSizing: "border-box",
                fontSize: "12px",
                padding: "4px",
                borderRadius: "4px",
                border: "1px solid var(--background-modifier-border, #ccc)",
                background: "var(--background-primary, #fff)",
                color: "var(--text-normal, #333)"
              },
              placeholder: "Stakeholder or department..."
            }
          ) : /* @__PURE__ */ u4("div", { style: valueStyle, children: displayRequester || "\u2014" })
        ] }),
        /* @__PURE__ */ u4(
          KeyLinkEditor,
          {
            store: store2,
            keyLinks: editing.value ? editKeyLinks.value : displayKeyLinks,
            editing: editing.value,
            onChange: (kls) => {
              editKeyLinks.value = kls;
            },
            fieldStyle,
            labelStyle,
            valueStyle
          }
        ),
        /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
          /* @__PURE__ */ u4("div", { style: labelStyle, children: "Description" }),
          editing.value ? /* @__PURE__ */ u4(
            "textarea",
            {
              value: editDescription.value,
              onInput: (e4) => {
                editDescription.value = e4.target.value;
              },
              rows: 4,
              style: {
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical",
                fontSize: "12px",
                padding: "4px",
                borderRadius: "4px",
                border: "1px solid var(--background-modifier-border, #ccc)",
                background: "var(--background-primary, #fff)",
                color: "var(--text-normal, #333)"
              },
              placeholder: "Project description..."
            }
          ) : displayDescription ? /* @__PURE__ */ u4(
            DescriptionViewer,
            {
              description: displayDescription,
              store: store2,
              onSave: (newValue) => {
                store2.persistProjectEdit(project.id, "description", newValue || void 0);
              }
            }
          ) : /* @__PURE__ */ u4("div", { style: valueStyle, children: "\u2014" })
        ] }),
        /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
          /* @__PURE__ */ u4("div", { style: labelStyle, children: [
            "Tasks (",
            associatedTasks.length,
            ")"
          ] }),
          associatedTasks.length === 0 ? /* @__PURE__ */ u4("div", { style: { fontSize: "12px", color: "var(--text-muted, #999)", fontStyle: "italic" }, children: "No tasks" }) : /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: associatedTasks.map((t4) => {
            const assignee = t4.personId.value ? store2.persons.value.find((p5) => p5.id === t4.personId.value) : null;
            return /* @__PURE__ */ u4(
              "div",
              {
                onClick: () => store2.selectEntity({ type: "task", id: t4.id }),
                style: {
                  padding: "6px 8px",
                  border: "1px solid var(--background-modifier-border, #e0e0e0)",
                  borderRadius: "4px",
                  background: "var(--background-primary, #fff)",
                  cursor: "pointer",
                  fontSize: "12px",
                  transition: "background 0.12s, border-color 0.12s, box-shadow 0.12s"
                },
                onMouseEnter: (e4) => {
                  store2.hoveredTaskId.value = t4.id;
                  const el = e4.currentTarget;
                  el.style.background = "var(--background-secondary, #f8f8f8)";
                  el.style.borderColor = "var(--gantt-hover-border, #FFB347)";
                  el.style.boxShadow = "0 0 0 1px var(--gantt-hover-border, #FFB347)";
                },
                onMouseLeave: (e4) => {
                  store2.hoveredTaskId.value = null;
                  const el = e4.currentTarget;
                  el.style.background = "var(--background-primary, #fff)";
                  el.style.borderColor = "var(--background-modifier-border, #e0e0e0)";
                  el.style.boxShadow = "none";
                },
                children: [
                  /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }, children: [
                    /* @__PURE__ */ u4(StatusBadge, { status: t4.status.value }),
                    /* @__PURE__ */ u4("span", { style: { fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: t4.title.value }),
                    /* @__PURE__ */ u4(
                      "button",
                      {
                        onClick: (e4) => {
                          e4.stopPropagation();
                          store2.locateTarget.value = { type: "task", id: t4.id };
                        },
                        title: "Locate task",
                        style: {
                          padding: "1px 3px",
                          border: "none",
                          borderRadius: "3px",
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--text-muted, #999)",
                          lineHeight: 1,
                          flexShrink: 0
                        },
                        children: /* @__PURE__ */ u4(Icon, { name: "target", size: 12 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "12px", fontSize: "11px", color: "var(--text-muted, #999)" }, children: [
                    t4.startDate.value && t4.endDate.value ? /* @__PURE__ */ u4("span", { children: [
                      t4.startDate.value,
                      " \u2192 ",
                      t4.endDate.value
                    ] }) : t4.startDate.value ? /* @__PURE__ */ u4("span", { children: t4.startDate.value }) : null,
                    assignee && /* @__PURE__ */ u4("span", { style: { color: assignee.color }, children: assignee.name })
                  ] })
                ]
              },
              t4.id
            );
          }) })
        ] }),
        /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", marginTop: "4px" }, children: (() => {
          let connectorId = null;
          for (const cache of store2.caches.value) {
            if (cache.projects.some((p5) => p5.id === project.id)) {
              connectorId = cache.connectorId;
              break;
            }
          }
          return connectorId ? `Connector: ${connectorId}` : "Manual entry";
        })() }),
        /* @__PURE__ */ u4("datalist", { id: "requester-memory-list", children: store2.fieldMemory.value.requesters.map((r4) => /* @__PURE__ */ u4("option", { value: r4 }, r4)) }),
        /* @__PURE__ */ u4("datalist", { id: "keydate-name-memory-list", children: store2.fieldMemory.value.keyDateNames.map((n3) => /* @__PURE__ */ u4("option", { value: n3 }, n3)) }),
        /* @__PURE__ */ u4("datalist", { id: "keylink-name-memory-list", children: store2.fieldMemory.value.keyLinkNames.map((n3) => /* @__PURE__ */ u4("option", { value: n3 }, n3)) })
      ]
    }
  );
}
function PersonDetail(props) {
  const { store: store2 } = props;
  const sel = store2.selectedEntity.value;
  if (!sel || sel.type !== "person")
    return null;
  const person = store2.persons.value.find((p5) => p5.id === sel.id);
  const personOverrides = store2.edits.value?.personOverrides?.[sel.id];
  const displayName = personOverrides?.name ?? person?.name ?? (sel.id === "__unassigned__" ? "Unassigned" : sel.id);
  const displayPosition = personOverrides?.position ?? person?.position;
  const personTasks = store2.mergedTasks.value.filter(
    (t4) => sel.id === "__unassigned__" ? !t4.personId.value : t4.personId.value === sel.id
  );
  const editName = useSignal(false);
  const editNameValue = useSignal(displayName);
  const editPosition = useSignal(false);
  const editPositionValue = useSignal(displayPosition ?? "");
  let nameInputRef = null;
  let positionInputRef = null;
  function startEditName() {
    editNameValue.value = displayName;
    editName.value = true;
    requestAnimationFrame(() => nameInputRef?.focus());
  }
  function saveName() {
    const newName = editNameValue.value.trim();
    if (newName && newName !== displayName && sel) {
      store2.persistPersonEdit(sel.id, "name", newName);
    }
    editName.value = false;
  }
  function cancelName() {
    editNameValue.value = displayName;
    editName.value = false;
  }
  function handleNameKeyDown(e4) {
    if (e4.key === "Enter") {
      e4.preventDefault();
      e4.stopPropagation();
      saveName();
    }
    if (e4.key === "Escape") {
      e4.preventDefault();
      e4.stopPropagation();
      cancelName();
    }
  }
  function startEditPosition() {
    editPositionValue.value = displayPosition ?? "";
    editPosition.value = true;
    requestAnimationFrame(() => positionInputRef?.focus());
  }
  function savePosition() {
    const newPos = editPositionValue.value.trim();
    if (newPos !== (displayPosition ?? "") && sel) {
      store2.persistPersonEdit(sel.id, "position", newPos || void 0);
    }
    editPosition.value = false;
  }
  function cancelPosition() {
    editPositionValue.value = displayPosition ?? "";
    editPosition.value = false;
  }
  function handlePositionKeyDown(e4) {
    if (e4.key === "Enter") {
      e4.preventDefault();
      e4.stopPropagation();
      savePosition();
    }
    if (e4.key === "Escape") {
      e4.preventDefault();
      e4.stopPropagation();
      cancelPosition();
    }
  }
  const fieldStyle = { marginBottom: "12px" };
  const labelStyle = { fontSize: "11px", color: "var(--text-muted, #999)", marginBottom: "2px" };
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-detail-panel",
      style: {
        width: `${store2.detailPanelWidth.value}px`,
        minWidth: "180px",
        maxHeight: "100%",
        borderLeft: "1px solid var(--gantt-grid-line-week, #c0c0c0)",
        padding: "12px",
        fontSize: "13px",
        color: "var(--text-normal, #333)",
        overflowY: "auto",
        background: "var(--background-secondary, #f5f5f5)"
      },
      children: [
        /* @__PURE__ */ u4("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }, children: [
          /* @__PURE__ */ u4("div", { style: { flex: 1 }, children: sel.id !== "__unassigned__" ? /* @__PURE__ */ u4(S, { children: [
            editName.value ? /* @__PURE__ */ u4(
              "input",
              {
                ref: (el) => {
                  nameInputRef = el;
                },
                type: "text",
                value: editNameValue.value,
                onInput: (e4) => {
                  editNameValue.value = e4.target.value;
                },
                onBlur: saveName,
                onKeyDown: handleNameKeyDown,
                onKeyUp: (e4) => {
                  e4.stopPropagation();
                },
                class: "gantt-inline-edit-input",
                style: {
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  border: "1px solid var(--interactive-accent, #4A90D9)",
                  borderRadius: "4px",
                  background: "var(--background-primary, #fff)",
                  color: "var(--text-normal, #333)",
                  width: "100%",
                  boxSizing: "border-box"
                }
              }
            ) : /* @__PURE__ */ u4(
              "div",
              {
                style: { fontWeight: "bold", fontSize: "14px", wordBreak: "break-word", cursor: "text" },
                onClick: startEditName,
                title: "Click to edit name",
                children: displayName
              }
            ),
            /* @__PURE__ */ u4("div", { style: { marginTop: "4px" }, children: editPosition.value ? /* @__PURE__ */ u4(
              "input",
              {
                ref: (el) => {
                  positionInputRef = el;
                },
                type: "text",
                value: editPositionValue.value,
                onInput: (e4) => {
                  editPositionValue.value = e4.target.value;
                },
                onBlur: savePosition,
                onKeyDown: handlePositionKeyDown,
                onKeyUp: (e4) => {
                  e4.stopPropagation();
                },
                class: "gantt-inline-edit-input",
                placeholder: "Position...",
                style: {
                  fontSize: "12px",
                  padding: "2px 6px",
                  border: "1px solid var(--interactive-accent, #4A90D9)",
                  borderRadius: "4px",
                  background: "var(--background-primary, #fff)",
                  color: "var(--text-normal, #333)",
                  width: "100%",
                  boxSizing: "border-box"
                }
              }
            ) : /* @__PURE__ */ u4(
              "span",
              {
                style: { fontSize: "12px", color: "var(--text-muted, #999)", cursor: "text" },
                onClick: startEditPosition,
                title: "Click to edit position",
                children: displayPosition || "No position"
              }
            ) })
          ] }) : /* @__PURE__ */ u4("div", { style: { fontWeight: "bold", fontSize: "14px" }, children: "Unassigned" }) }),
          /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "2px", flexShrink: 0 }, children: [
            sel.id !== "__unassigned__" && person && /* @__PURE__ */ u4(
              "button",
              {
                onClick: () => {
                  store2.locateTarget.value = { type: "task", id: personTasks[0]?.id ?? "" };
                },
                title: "Locate person row",
                style: {
                  padding: "2px 4px",
                  border: "none",
                  borderRadius: "3px",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--text-muted, #999)",
                  lineHeight: 1
                },
                children: /* @__PURE__ */ u4(Icon, { name: "target", size: 13 })
              }
            ),
            /* @__PURE__ */ u4(
              "button",
              {
                onClick: () => store2.selectEntity(null),
                title: "Close detail panel",
                style: {
                  padding: "2px 4px",
                  border: "none",
                  borderRadius: "3px",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "var(--text-muted, #999)",
                  lineHeight: 1
                },
                children: /* @__PURE__ */ u4(Icon, { name: "x", size: 14 })
              }
            )
          ] })
        ] }),
        person?.avatar && /* @__PURE__ */ u4("div", { style: fieldStyle, children: /* @__PURE__ */ u4("img", { src: person.avatar, alt: displayName, style: { width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" } }) }),
        /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
          /* @__PURE__ */ u4("div", { style: labelStyle, children: "Tasks" }),
          /* @__PURE__ */ u4("div", { style: { fontSize: "13px", fontWeight: 500 }, children: personTasks.length })
        ] }),
        /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
          /* @__PURE__ */ u4("div", { style: labelStyle, children: "Assigned Tasks" }),
          personTasks.length === 0 ? /* @__PURE__ */ u4("div", { style: { fontSize: "12px", color: "var(--text-muted, #999)", fontStyle: "italic" }, children: "No tasks assigned" }) : /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: personTasks.map((task) => {
            const project = task.projectId.value ? store2.projects.value.find((p5) => p5.id === task.projectId.value) : null;
            return /* @__PURE__ */ u4(
              "div",
              {
                onClick: () => store2.selectEntity({ type: "task", id: task.id }),
                style: {
                  padding: "6px 8px",
                  border: "1px solid var(--background-modifier-border, #e0e0e0)",
                  borderRadius: "4px",
                  background: "var(--background-primary, #fff)",
                  cursor: "pointer",
                  fontSize: "12px",
                  transition: "background 0.12s, border-color 0.12s, box-shadow 0.12s"
                },
                onMouseEnter: (e4) => {
                  store2.hoveredTaskId.value = task.id;
                  const el = e4.currentTarget;
                  el.style.background = "var(--background-secondary, #f8f8f8)";
                  el.style.borderColor = "var(--gantt-hover-border, #FFB347)";
                  el.style.boxShadow = "0 0 0 1px var(--gantt-hover-border, #FFB347)";
                },
                onMouseLeave: (e4) => {
                  store2.hoveredTaskId.value = null;
                  const el = e4.currentTarget;
                  el.style.background = "var(--background-primary, #fff)";
                  el.style.borderColor = "var(--background-modifier-border, #e0e0e0)";
                  el.style.boxShadow = "none";
                },
                children: [
                  /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }, children: [
                    /* @__PURE__ */ u4(StatusBadge, { status: task.status.value }),
                    /* @__PURE__ */ u4("span", { style: { fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: task.title.value }),
                    /* @__PURE__ */ u4(
                      "button",
                      {
                        onClick: (e4) => {
                          e4.stopPropagation();
                          store2.locateTarget.value = { type: "task", id: task.id };
                        },
                        title: "Locate task",
                        style: {
                          padding: "1px 3px",
                          border: "none",
                          borderRadius: "3px",
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--text-muted, #999)",
                          lineHeight: 1,
                          flexShrink: 0
                        },
                        children: /* @__PURE__ */ u4(Icon, { name: "target", size: 12 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "12px", fontSize: "11px", color: "var(--text-muted, #999)" }, children: [
                    task.startDate.value && task.endDate.value ? /* @__PURE__ */ u4("span", { children: [
                      task.startDate.value,
                      " \u2192 ",
                      task.endDate.value
                    ] }) : task.startDate.value ? /* @__PURE__ */ u4("span", { children: task.startDate.value }) : null,
                    project && /* @__PURE__ */ u4("span", { style: { color: project.color }, children: project.name })
                  ] })
                ]
              },
              task.id
            );
          }) })
        ] })
      ]
    }
  );
}
function FilterMultiSelect(props) {
  const open = useSignal(false);
  const containerRef = A2(null);
  y2(() => {
    function handleClick(e4) {
      if (containerRef.current && !containerRef.current.contains(e4.target)) {
        open.value = false;
      }
    }
    if (open.value) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [open.value]);
  function toggle(val) {
    const next = new Set(props.selected);
    if (next.has(val))
      next.delete(val);
    else
      next.add(val);
    props.onChange(next);
  }
  return /* @__PURE__ */ u4("div", { ref: containerRef, style: { position: "relative" }, children: [
    /* @__PURE__ */ u4(
      "button",
      {
        onClick: () => {
          open.value = !open.value;
        },
        title: `Filter by ${props.label}`,
        style: {
          padding: "2px 8px",
          fontSize: "11px",
          borderRadius: "3px",
          whiteSpace: "nowrap",
          border: `1px solid ${props.selected.size > 0 ? "var(--interactive-accent, #4A90D9)" : "var(--background-modifier-border, #ccc)"}`,
          background: props.selected.size > 0 ? "var(--interactive-accent, #4A90D9)" : "var(--background-secondary, #f5f5f5)",
          color: props.selected.size > 0 ? "#fff" : "var(--text-normal, #333)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "3px"
        },
        children: [
          props.label,
          props.selected.size > 0 ? ` (${props.selected.size})` : "",
          /* @__PURE__ */ u4("span", { style: { fontSize: "9px" }, children: open.value ? "\u25B2" : "\u25BC" })
        ]
      }
    ),
    open.value && /* @__PURE__ */ u4("div", { style: {
      position: "absolute",
      top: "100%",
      right: 0,
      zIndex: 100,
      background: "var(--background-primary, #fff)",
      borderRadius: "4px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      minWidth: "140px",
      maxHeight: "200px",
      overflowY: "auto",
      marginTop: "2px",
      border: "1px solid var(--background-modifier-border, #ccc)"
    }, children: props.options.length === 0 ? /* @__PURE__ */ u4("div", { style: { padding: "8px 12px", fontSize: "11px", color: "var(--text-muted, #999)" }, children: "No options" }) : props.options.map((opt) => /* @__PURE__ */ u4("label", { style: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 10px",
      cursor: "pointer",
      fontSize: "12px",
      whiteSpace: "nowrap"
    }, children: [
      /* @__PURE__ */ u4(
        "input",
        {
          type: "checkbox",
          checked: props.selected.has(opt.value),
          onChange: () => toggle(opt.value),
          style: { margin: 0 }
        }
      ),
      opt.label
    ] }, opt.value)) })
  ] });
}
function UnassignedPanel(props) {
  const projects = props.store.unassignedProjects.value;
  if (projects.length === 0) {
    return /* @__PURE__ */ u4(
      "div",
      {
        class: "gantt-unassigned-panel",
        style: {
          width: `${props.store.detailPanelWidth.value}px`,
          minWidth: "180px",
          borderLeft: "1px solid var(--gantt-grid-line-week, #c0c0c0)",
          padding: "12px",
          fontSize: "13px",
          color: "var(--text-muted, #999)",
          overflowY: "auto"
        },
        children: [
          /* @__PURE__ */ u4("div", { style: { fontWeight: "bold", marginBottom: "8px", color: "var(--text-normal, #333)" }, children: "Unassigned Projects" }),
          /* @__PURE__ */ u4("div", { style: { fontStyle: "italic", fontSize: "12px" }, children: "All projects have tasks assigned." })
        ]
      }
    );
  }
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-unassigned-panel",
      style: {
        width: `${props.store.detailPanelWidth.value}px`,
        minWidth: "180px",
        borderLeft: "1px solid var(--gantt-grid-line-week, #c0c0c0)",
        padding: "12px",
        overflowY: "auto"
      },
      children: [
        /* @__PURE__ */ u4(
          "div",
          {
            style: {
              fontWeight: "bold",
              marginBottom: "8px",
              color: "var(--text-normal, #333)",
              fontSize: "13px"
            },
            children: [
              "Unassigned (",
              projects.length,
              ")"
            ]
          }
        ),
        projects.map((p5) => /* @__PURE__ */ u4(
          "div",
          {
            class: "gantt-unassigned-card",
            draggable: true,
            onDragStart: (e4) => {
              e4.dataTransfer?.setData("text/plain", JSON.stringify({ projectId: p5.id, projectName: p5.name }));
            },
            onClick: () => props.store.selectEntity({ type: "project", id: p5.id }),
            style: {
              padding: "8px 10px",
              marginBottom: "6px",
              border: "1px solid var(--gantt-grid-line-day, #e0e0e0)",
              borderRadius: "6px",
              background: "var(--background-secondary, #f5f5f5)",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            },
            children: [
              p5.color && /* @__PURE__ */ u4(
                "span",
                {
                  style: {
                    width: "10px",
                    height: "10px",
                    borderRadius: "2px",
                    background: p5.color,
                    flexShrink: 0
                  }
                }
              ),
              /* @__PURE__ */ u4("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p5.name })
            ]
          },
          p5.id
        ))
      ]
    }
  );
}
function dateToPx2(date) {
  if (!isValidDate(date))
    return 0;
  return dateToAbsolutePixel(date, DAY_WIDTH2);
}
function TaskList(props) {
  const panelWidth = props.width ?? 180;
  const totalRowsHeight = props.rowHeights.reduce((a4, b3) => a4 + b3, 0);
  const scrollRef = A2(null);
  const scrollGuard = A2(false);
  y2(() => {
    if (scrollRef.current && props.scrollTop !== void 0) {
      scrollGuard.current = true;
      scrollRef.current.scrollTop = props.scrollTop;
      requestAnimationFrame(() => {
        scrollGuard.current = false;
      });
    }
  }, [props.scrollTop]);
  function handleScroll(e4) {
    if (scrollGuard.current)
      return;
    const el = e4.currentTarget;
    props.onScroll?.(el.scrollTop);
  }
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-task-list",
      style: {
        width: `${panelWidth}px`,
        minWidth: `${panelWidth}px`,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid var(--gantt-grid-line-week, #c0c0c0)"
      },
      children: [
        /* @__PURE__ */ u4("div", { style: { height: "44px", borderBottom: "1px solid var(--gantt-grid-line-day, #e0e0e0)", display: "flex", alignItems: "center", paddingLeft: "8px", paddingRight: "8px", background: "var(--background-primary, #ffffff)", flexShrink: 0 }, children: props.headerContent }),
        /* @__PURE__ */ u4(
          "div",
          {
            ref: scrollRef,
            style: {
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden"
            },
            onScroll: handleScroll,
            children: /* @__PURE__ */ u4("div", { style: { height: `${totalRowsHeight}px` }, children: props.labels.map((label, i5) => {
              const isHighlighted = props.highlightedRowKeys?.has(label.key) ?? false;
              const isDimmed = props.dimmedRowKeys?.has(label.key) ?? false;
              const isSelected = props.selectedRowKey === label.key;
              const h4 = props.rowHeights[i5] ?? ROW_HEIGHT2;
              return /* @__PURE__ */ u4(
                "div",
                {
                  class: `gantt-task-list-row ${isSelected ? "selected" : ""} ${isHighlighted ? "highlighted" : ""} ${isDimmed ? "dimmed" : ""}`,
                  style: {
                    height: `${h4}px`,
                    borderBottom: "1px solid var(--gantt-grid-line-day, #e0e0e0)",
                    opacity: isDimmed ? 0.4 : 1,
                    background: isSelected ? "var(--gantt-selected-row-bg, rgba(255, 107, 53, 0.12))" : isHighlighted ? "var(--gantt-row-highlight-bg, rgba(74, 144, 217, 0.08))" : "transparent",
                    outline: isSelected ? "2px solid var(--gantt-selected-border, #FF6B35)" : "none",
                    outlineOffset: "-2px",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "opacity 0.15s"
                  },
                  onClick: () => props.onRowClick?.(label.key),
                  children: [
                    label.color && /* @__PURE__ */ u4(
                      "span",
                      {
                        style: {
                          width: "10px",
                          height: "10px",
                          borderRadius: "2px",
                          background: label.color,
                          flexShrink: 0
                        }
                      }
                    ),
                    label.position && /* @__PURE__ */ u4(
                      "span",
                      {
                        class: "gantt-position-badge",
                        style: { background: label.positionColor || "var(--background-modifier-border)" },
                        children: label.position
                      }
                    ),
                    /* @__PURE__ */ u4("span", { style: { overflow: "hidden", textOverflow: "ellipsis" }, title: label.tooltip, children: label.name }),
                    label.tags && label.tags.length > 0 && /* @__PURE__ */ u4("span", { style: { display: "flex", gap: "3px", marginLeft: "auto", flexShrink: 0 }, children: label.tags.map((tag) => /* @__PURE__ */ u4(
                      "span",
                      {
                        style: {
                          padding: "0 4px",
                          borderRadius: "3px",
                          fontSize: "9px",
                          lineHeight: "16px",
                          background: label.tagColors?.get(tag) ?? "var(--background-modifier-border, #e0e0e0)",
                          color: "#fff",
                          whiteSpace: "nowrap"
                        },
                        children: tag
                      },
                      tag
                    )) })
                  ]
                },
                label.key
              );
            }) })
          }
        )
      ]
    }
  );
}
function Timeline(props) {
  const containerRef = A2(null);
  const { store: store2, groups, scrollLeft, scrollTop } = props;
  const paneType = props.groupKeyField === "personId" ? "person" : "project";
  const viewportWidth = useSignal(800);
  y2(() => {
    const el = containerRef.current;
    if (!el)
      return;
    viewportWidth.value = el.clientWidth;
    const ro = new ResizeObserver(() => {
      viewportWidth.value = el.clientWidth;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const TWO_YEARS_PX = 730 * DAY_WIDTH2;
  const bodyOriginPx = T2(() => {
    let minAbsPx = dateToPx2(todayString());
    for (const group of groups) {
      for (const task of group.tasks) {
        const startVal = task.startDate.value;
        const endVal = task.endDate.value;
        if (startVal && isValidDate(startVal)) {
          const px = dateToPx2(startVal);
          if (px < minAbsPx)
            minAbsPx = px;
        }
        if (endVal && isValidDate(endVal)) {
          const px = dateToPx2(endVal);
          if (px < minAbsPx)
            minAbsPx = px;
        }
      }
    }
    return Math.floor(minAbsPx - TWO_YEARS_PX);
  }, [groups]);
  const bodyTotalWidth = T2(() => {
    let maxAbsPx = dateToPx2(todayString());
    for (const group of groups) {
      for (const task of group.tasks) {
        const startVal = task.startDate.value;
        const endVal = task.endDate.value;
        if (startVal && isValidDate(startVal)) {
          const px = dateToPx2(startVal);
          if (px > maxAbsPx)
            maxAbsPx = px;
        }
        if (endVal && isValidDate(endVal)) {
          const px = dateToPx2(endVal);
          if (px > maxAbsPx)
            maxAbsPx = px;
        }
      }
    }
    return Math.ceil(maxAbsPx - bodyOriginPx + TWO_YEARS_PX);
  }, [groups, bodyOriginPx]);
  const originToBody = (absPx) => absPx - bodyOriginPx;
  function handleScroll(e4) {
    const el = e4.currentTarget;
    props.onScroll(el.scrollLeft, el.scrollTop);
  }
  function handleWheel(e4) {
    if (!containerRef.current)
      return;
    if (e4.shiftKey) {
      e4.preventDefault();
      containerRef.current.scrollLeft += e4.deltaY;
    }
  }
  y2(() => {
    const el = containerRef.current;
    if (!el)
      return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);
  y2(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollLeft]);
  y2(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);
  const taskBars = [];
  const groupLayout = [];
  const projectColorMap = /* @__PURE__ */ new Map();
  for (const p5 of store2.projects.value) {
    if (p5.id) {
      projectColorMap.set(p5.id, p5.color || getDefaultColor(p5.id));
    }
  }
  for (const group of groups) {
    const groupTasks = [];
    for (const task of group.tasks) {
      const startVal = task.startDate.value;
      if (!startVal || !isValidDate(startVal))
        continue;
      let endVal = task.endDate.value;
      if (!endVal || !isValidDate(endVal))
        endVal = startVal;
      const effectiveStart = startVal <= endVal ? startVal : endVal;
      const effectiveEnd = startVal <= endVal ? endVal : startVal;
      const left = originToBody(dateToPx2(effectiveStart));
      const right = originToBody(dateToPx2(effectiveEnd));
      const width = Math.max(right - left, 12);
      const projectColor = task.projectId.value ? projectColorMap.get(task.projectId.value) ?? getDefaultColor(task.projectId.value) : getDefaultColor(task.id);
      groupTasks.push({ task, left, width, color: projectColor });
    }
    groupTasks.sort((a4, b3) => a4.left - b3.left);
    const lanes = [];
    for (const gt of groupTasks) {
      let assigned = false;
      for (let li = 0; li < lanes.length; li++) {
        if (gt.left >= lanes[li]) {
          lanes[li] = gt.left + gt.width;
          taskBars.push({
            ...gt,
            groupIndex: groupLayout.length,
            groupStartY: 0,
            // filled in below
            laneIndex: li
          });
          assigned = true;
          break;
        }
      }
      if (!assigned) {
        lanes.push(gt.left + gt.width);
        taskBars.push({
          ...gt,
          groupIndex: groupLayout.length,
          groupStartY: 0,
          laneIndex: lanes.length - 1
        });
      }
    }
    const laneCount = Math.max(1, lanes.length);
    const height = ROW_HEIGHT2 + (laneCount - 1) * LANE_OFFSET2;
    const startY = groupLayout.length === 0 ? 0 : groupLayout[groupLayout.length - 1].startY + groupLayout[groupLayout.length - 1].height;
    groupLayout.push({ startY, height, laneCount });
    for (let i5 = taskBars.length - 1; i5 >= 0; i5--) {
      if (taskBars[i5].groupIndex === groupLayout.length - 1) {
        taskBars[i5] = { ...taskBars[i5], groupStartY: startY };
      } else {
        break;
      }
    }
  }
  const totalHeight = groupLayout.length > 0 ? groupLayout[groupLayout.length - 1].startY + groupLayout[groupLayout.length - 1].height : 0;
  const highlightedIds = store2.highlightedTaskIds.value;
  const hasSelection = store2.selectedEntity.value !== null;
  const gridAbsAligned = Math.floor((bodyOriginPx + scrollLeft - GRID_BUFFER_PX) / DAY_WIDTH2) * DAY_WIDTH2;
  const gridLeft = gridAbsAligned - bodyOriginPx;
  const headerTranslateX = gridLeft - scrollLeft;
  return /* @__PURE__ */ u4("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }, children: [
    /* @__PURE__ */ u4("div", { style: { overflow: "hidden", flexShrink: 0 }, children: /* @__PURE__ */ u4(
      TimeHeader,
      {
        dayWidth: DAY_WIDTH2,
        scrollLeft,
        viewportWidth: viewportWidth.value,
        bufferPx: GRID_BUFFER_PX,
        bodyOriginPx,
        holidayConfig: store2.holidayConfig.value
      }
    ) }),
    /* @__PURE__ */ u4(
      "div",
      {
        ref: containerRef,
        class: "gantt-timeline",
        style: {
          flex: 1,
          overflow: "scroll",
          position: "relative"
        },
        onScroll: handleScroll,
        onDrop: (e4) => props.onDrop(e4, bodyOriginPx),
        onDragOver: (e4) => {
          props.onDragOver(e4);
          const el = containerRef.current;
          if (!el)
            return;
          const r4 = el.getBoundingClientRect();
          const edge = 40;
          const speed = 8;
          if (e4.clientX - r4.left < edge)
            el.scrollLeft -= speed;
          else if (r4.right - e4.clientX < edge)
            el.scrollLeft += speed;
          if (e4.clientY - r4.top < edge)
            el.scrollTop -= speed;
          else if (r4.bottom - e4.clientY < edge)
            el.scrollTop += speed;
        },
        children: /* @__PURE__ */ u4(
          "div",
          {
            style: {
              position: "relative",
              width: `${bodyTotalWidth}px`,
              height: `${totalHeight}px`
            },
            children: [
              /* @__PURE__ */ u4(TimelineGrid, { dayWidth: DAY_WIDTH2, scrollLeft, viewportWidth: viewportWidth.value, bufferPx: GRID_BUFFER_PX, bodyOriginPx, holidayConfig: store2.holidayConfig.value }),
              /* @__PURE__ */ u4(
                TodayLine,
                {
                  leftPx: originToBody(dateToPx2(todayString())),
                  visible: true
                }
              ),
              groups.map((group, gi) => {
                const layout = groupLayout[gi];
                if (!layout)
                  return null;
                const isHighlighted = props.highlightedRowKeys.has(group.key);
                const isDimmed = props.dimmedRowKeys.has(group.key);
                const isSelectedRow = paneType === "project" && group.key === store2.selectedProjectId.value;
                const dragHovering = dragState.value?.currentPersonId != null && (dragState.value.currentPersonId === group.key || dragState.value.currentPersonId === null && group.key === "__unassigned__");
                return /* @__PURE__ */ u4(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      top: `${layout.startY}px`,
                      left: 0,
                      width: "100%",
                      height: `${layout.height}px`,
                      borderBottom: "1px solid var(--gantt-grid-line-day, #e0e0e0)",
                      opacity: isDimmed ? 0.4 : 1,
                      background: dragHovering ? "var(--gantt-drag-hover-bg, rgba(74, 144, 217, 0.2))" : isSelectedRow ? "var(--gantt-selected-row-bg, rgba(255, 107, 53, 0.12))" : isHighlighted ? "var(--gantt-row-highlight-bg, rgba(74, 144, 217, 0.08))" : "transparent",
                      outline: isSelectedRow ? "2px solid var(--gantt-selected-border, #FF6B35)" : dragHovering ? "2px dashed var(--gantt-drag-hover-border, #4A90D9)" : "none",
                      outlineOffset: "-2px",
                      transition: "opacity 0.15s, background 0.15s",
                      pointerEvents: "none"
                    }
                  },
                  group.key
                );
              }),
              taskBars.map(({ task, left, width, groupStartY, laneIndex, color }) => /* @__PURE__ */ u4(
                TaskBar,
                {
                  rowIndex: 0,
                  groupStartY,
                  laneIndex,
                  paneType,
                  data: {
                    id: task.id,
                    title: task.title.value,
                    left,
                    width,
                    color,
                    isHighlighted: highlightedIds.has(task.id),
                    isSelected: task.id === store2.selectedTaskId.value,
                    isDimmed: hasSelection && !highlightedIds.has(task.id) || paneType === "person" && props.filterDimmedTaskIds.has(task.id),
                    isHovered: task.id === store2.hoveredTaskId.value,
                    isDragging: dragState.value?.taskId === task.id && dragState.value?.dragMode === "task",
                    progress: task.progress.value,
                    status: task.status.value
                  },
                  rowHeight: ROW_HEIGHT2,
                  laneOffset: LANE_OFFSET2,
                  onPointerDown: props.onTaskPointerDown,
                  onClick: props.onTaskClick,
                  startDate: task.startDate.value,
                  endDate: task.endDate.value,
                  bodyOriginPx,
                  dayWidth: DAY_WIDTH2,
                  holidayConfig: store2.holidayConfig.value
                },
                task.id
              )),
              paneType === "project" && groups.map((group, gi) => {
                const layout = groupLayout[gi];
                if (!layout)
                  return null;
                const projectId = group.projectId;
                if (!projectId || projectId === "__no_project__")
                  return null;
                const project = store2.mergedProjects.value.find((p5) => p5.id === projectId);
                if (!project?.keyDates?.length)
                  return null;
                return [...project.keyDates].sort((a4, b3) => a4.date.localeCompare(b3.date)).map((kd, ki) => /* @__PURE__ */ u4(
                  KeyDateMarker,
                  {
                    leftPx: originToBody(dateToPx2(kd.date)),
                    groupTopY: layout.startY,
                    groupHeight: layout.height,
                    name: kd.name,
                    date: kd.date,
                    color: kd.color,
                    icon: kd.icon,
                    onPointerDown: props.onKeyDatePointerDown ? (e4) => props.onKeyDatePointerDown(e4, projectId, ki, kd.date) : void 0
                  },
                  `${projectId}-kd-${ki}`
                ));
              }),
              dragState.value && (() => {
                const ds = dragState.value;
                if (ds.paneType !== paneType)
                  return null;
                if (ds.dragMode === "keyDate") {
                  const ghostLayout2 = groupLayout[ds.rowIndex];
                  const ghostTop = ghostLayout2 ? ghostLayout2.startY + 3 : ds.rowIndex * ROW_HEIGHT2 + 3;
                  return /* @__PURE__ */ u4(
                    "div",
                    {
                      class: "gantt-key-date-ghost",
                      style: {
                        position: "absolute",
                        left: `${ds.ghostLeft - bodyOriginPx - 8}px`,
                        top: `${ghostTop}px`,
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "#4A90D9",
                        opacity: 0.5,
                        zIndex: 10,
                        pointerEvents: "none",
                        border: "2px solid #4A90D9"
                      }
                    }
                  );
                }
                const barHeight = ROW_HEIGHT2 * 0.6;
                const ghostLayout = groupLayout[ds.rowIndex];
                const barTop = ghostLayout ? ghostLayout.startY + (ROW_HEIGHT2 - barHeight) / 2 + (ds.laneIndex ?? 0) * LANE_OFFSET2 : ds.rowIndex * ROW_HEIGHT2 + (ROW_HEIGHT2 - barHeight) / 2 + (ds.laneIndex ?? 0) * LANE_OFFSET2;
                const ghostTask = store2.mergedTasks.value.find((t4) => t4.id === ds.taskId);
                const ghostTitle = ghostTask?.title.value ?? "";
                return /* @__PURE__ */ u4(
                  "div",
                  {
                    class: "gantt-task-bar gantt-ghost-bar",
                    style: {
                      position: "absolute",
                      left: `${ds.ghostLeft - bodyOriginPx}px`,
                      top: `${barTop}px`,
                      width: `${Math.max(ds.ghostWidth, 4)}px`,
                      height: `${barHeight}px`,
                      background: "#4A90D9",
                      borderRadius: "4px",
                      opacity: 0.5,
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "4px",
                      fontSize: "11px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#fff",
                      pointerEvents: "none"
                    },
                    children: ds.ghostWidth > 40 ? ghostTitle : ""
                  }
                );
              })()
            ]
          }
        )
      }
    )
  ] });
}
function GanttPane(props) {
  const { store: store2, type } = props;
  const rawGroups = type === "person" ? store2.personGroups.value : store2.projectGroups.value;
  const showPosEditor = useSignal(false);
  const posEditorItems = useSignal([]);
  const posEditorButtonRef = A2(null);
  const posDragIndex = useSignal(null);
  const posDragOverIndex = useSignal(null);
  const isResizingSidebar = useSignal(false);
  let taskListVGuardActive = false;
  let taskListVGuardTimer = null;
  const filterMatches = store2.filteredProjectGroupKeys.value;
  const filterActive = filterMatches !== null;
  const filterDimmedIds = store2.filterDimmedTaskIds.value;
  const groups = filterActive && type === "project" ? rawGroups.filter((g3) => filterMatches.has(g3.projectId)) : rawGroups;
  const paneType = type;
  const labels = T2(
    () => groups.map((g3) => {
      const key = type === "person" ? g3.personId : g3.projectId;
      if (type === "person") {
        const pg = g3;
        return {
          key,
          name: pg.personName,
          color: void 0,
          position: pg.position || void 0,
          positionColor: pg.position ? hashColor(pg.position) : void 0,
          tooltip: pg.personId === "__unassigned__" ? void 0 : `ID: ${pg.personId}`
        };
      }
      return {
        key,
        name: g3.projectName,
        color: g3.color,
        tooltip: void 0,
        tags: store2.mergedProjects.value.find((p5) => p5.id === key)?.tags,
        tagColors: new Map(store2.tagDefinitions.value.map((t4) => [t4.name, t4.color]))
      };
    }),
    [groups]
  );
  const groupHeights = T2(() => {
    return groups.map((group) => {
      const ranges = [];
      for (const task of group.tasks) {
        const startVal = task.startDate.value;
        if (!startVal || !isValidDate(startVal))
          continue;
        let endVal = task.endDate.value;
        if (!endVal || !isValidDate(endVal))
          endVal = startVal;
        const effectiveStart = startVal <= endVal ? startVal : endVal;
        const effectiveEnd = startVal <= endVal ? endVal : startVal;
        const left = dateToPx2(effectiveStart);
        const right = dateToPx2(effectiveEnd);
        const width = Math.max(right - left, 12);
        ranges.push({ left, right: left + width });
      }
      ranges.sort((a4, b3) => a4.left - b3.left);
      const lanes = [];
      for (const dr of ranges) {
        let assigned = false;
        for (let li = 0; li < lanes.length; li++) {
          if (dr.left >= lanes[li]) {
            lanes[li] = dr.right;
            assigned = true;
            break;
          }
        }
        if (!assigned)
          lanes.push(dr.right);
      }
      return ROW_HEIGHT2 + (Math.max(1, lanes.length) - 1) * LANE_OFFSET2;
    });
  }, [groups]);
  const highlightedIds = store2.highlightedTaskIds.value;
  const hasSelection = store2.selectedEntity.value !== null;
  const highlightedRowKeys = T2(() => {
    if (!hasSelection)
      return /* @__PURE__ */ new Set();
    const keys = /* @__PURE__ */ new Set();
    for (const group of groups) {
      if (group.tasks.some((t4) => highlightedIds.has(t4.id))) {
        keys.add(type === "person" ? group.personId : group.projectId);
      }
    }
    return keys;
  }, [groups, highlightedIds, hasSelection]);
  const dimmedRowKeys = T2(() => {
    if (!hasSelection)
      return /* @__PURE__ */ new Set();
    const keys = /* @__PURE__ */ new Set();
    for (const group of groups) {
      const key = type === "person" ? group.personId : group.projectId;
      if (!highlightedRowKeys.has(key)) {
        keys.add(key);
      }
    }
    return keys;
  }, [groups, highlightedRowKeys, hasSelection]);
  function handleRowClick(key) {
    if (type === "person") {
      store2.selectEntity({ type: "person", id: key });
    } else {
      store2.selectEntity({ type: "project", id: key });
    }
  }
  function handleTaskClick(taskId) {
    store2.selectEntity({ type: "task", id: taskId });
  }
  function handleSidebarResizePointerDown(e4) {
    e4.preventDefault();
    isResizingSidebar.value = true;
    const startX = e4.clientX;
    const startWidth = store2.leftPanelWidth.value;
    function onMove(ev) {
      const dx = ev.clientX - startX;
      const newWidth = Math.min(400, Math.max(120, startWidth + dx));
      store2.leftPanelWidth.value = newWidth;
    }
    function onUp() {
      isResizingSidebar.value = false;
      store2.saveSettings();
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }
  return /* @__PURE__ */ u4("div", { class: "gantt-pane", style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
    /* @__PURE__ */ u4(
      TaskList,
      {
        labels,
        rowHeights: groupHeights,
        scrollTop: props.scrollTop,
        highlightedRowKeys,
        dimmedRowKeys,
        selectedRowKey: type === "project" ? store2.selectedProjectId.value : store2.selectedEntity.value?.type === "person" ? store2.selectedEntity.value.id : null,
        onRowClick: handleRowClick,
        width: store2.leftPanelWidth.value,
        onScroll: (st) => {
          if (taskListVGuardActive)
            return;
          taskListVGuardActive = true;
          if (type === "person") {
            store2.personScrollTop.value = st;
          } else {
            store2.projectScrollTop.value = st;
          }
          if (taskListVGuardTimer)
            clearTimeout(taskListVGuardTimer);
          taskListVGuardTimer = setTimeout(() => {
            taskListVGuardActive = false;
          }, 100);
        },
        headerContent: type === "person" ? /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ u4(
            "button",
            {
              class: "gantt-sort-toggle",
              onClick: () => {
                store2.personSortMode.value = store2.personSortMode.value === "name" ? "position" : "name";
                store2.saveSettings();
              },
              title: `Sort: ${store2.personSortMode.value === "name" ? "by name" : "by position"}`,
              style: {
                padding: "2px 8px",
                border: "1px solid var(--background-modifier-border, #ccc)",
                borderRadius: "4px",
                background: "var(--background-secondary, #f5f5f5)",
                cursor: "pointer",
                fontSize: "11px",
                whiteSpace: "nowrap"
              },
              children: [
                "Sort: ",
                store2.personSortMode.value === "name" ? "Name" : "Position"
              ]
            }
          ),
          store2.personSortMode.value === "position" && /* @__PURE__ */ u4("div", { style: { position: "relative" }, children: /* @__PURE__ */ u4(
            "button",
            {
              ref: posEditorButtonRef,
              onClick: () => {
                if (showPosEditor.value) {
                  showPosEditor.value = false;
                  return;
                }
                const existing = new Set(store2.positionOrder.value);
                for (const g3 of rawGroups) {
                  const pg = g3;
                  if (pg.position)
                    existing.add(pg.position);
                }
                posEditorItems.value = [...existing];
                showPosEditor.value = true;
              },
              title: "Edit position order",
              style: {
                padding: "2px 6px",
                border: "1px solid var(--background-modifier-border, #ccc)",
                borderRadius: "4px",
                background: showPosEditor.value ? "var(--interactive-accent, #4A90D9)" : "var(--background-secondary, #f5f5f5)",
                color: showPosEditor.value ? "#fff" : "var(--text-normal, #333)",
                cursor: "pointer",
                fontSize: "11px"
              },
              children: /* @__PURE__ */ u4(Icon, { name: "settings", size: 13 })
            }
          ) })
        ] }) : /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ u4(
            "button",
            {
              class: "gantt-sort-toggle",
              onClick: () => {
                store2.projectSortMode.value = store2.projectSortMode.value === "name" ? "time" : "name";
                store2.saveSettings();
              },
              title: `Sort: ${store2.projectSortMode.value === "name" ? "by name" : "by time"}`,
              style: {
                padding: "2px 8px",
                border: "1px solid var(--background-modifier-border, #ccc)",
                borderRadius: "4px",
                background: "var(--background-secondary, #f5f5f5)",
                cursor: "pointer",
                fontSize: "11px",
                whiteSpace: "nowrap"
              },
              children: [
                "Sort: ",
                store2.projectSortMode.value === "name" ? "Name" : "Time"
              ]
            }
          ),
          store2.projectSortMode.value === "time" && /* @__PURE__ */ u4(
            "input",
            {
              type: "text",
              value: store2.projectSortKeyDates.value.join(", "),
              onInput: (e4) => {
                const raw = e4.target.value;
                const names = raw.split(/[,，]/).map((s5) => s5.trim()).filter(Boolean);
                store2.projectSortKeyDates.value = names.length > 0 ? names : ["\u4E0A\u7EBF\u65F6\u95F4"];
                store2.saveSettings();
              },
              title: "Key date names for sort priority (comma-separated)",
              placeholder: "\u4E0A\u7EBF\u65F6\u95F4",
              style: {
                padding: "2px 4px",
                border: "1px solid var(--background-modifier-border, #ccc)",
                borderRadius: "3px",
                background: "var(--background-primary, #fff)",
                color: "var(--text-normal, #333)",
                fontSize: "10px",
                width: "80px"
              }
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ u4(
      "div",
      {
        class: "gantt-sidebar-resize-handle",
        style: {
          width: "4px",
          cursor: "col-resize",
          background: isResizingSidebar.value ? "var(--interactive-accent, #4A90D9)" : "var(--background-modifier-border, #ccc)",
          flexShrink: 0,
          transition: isResizingSidebar.value ? "none" : "background 0.15s"
        },
        onPointerDown: handleSidebarResizePointerDown
      }
    ),
    /* @__PURE__ */ u4(
      Timeline,
      {
        store: store2,
        groups,
        groupKeyField: type === "person" ? "personId" : "projectId",
        scrollLeft: props.scrollLeft,
        scrollTop: props.scrollTop,
        onScroll: props.onScroll,
        highlightedRowKeys,
        dimmedRowKeys,
        filterDimmedTaskIds: type === "person" ? store2.filterDimmedTaskIds.value : /* @__PURE__ */ new Set(),
        onRowClick: handleRowClick,
        onTaskClick: handleTaskClick,
        onTaskPointerDown: props.onTaskPointerDown,
        onKeyDatePointerDown: props.onKeyDatePointerDown,
        onDrop: props.onDrop,
        onDragOver: props.onDragOver
      }
    ),
    showPosEditor.value && /* @__PURE__ */ u4(
      "div",
      {
        ref: (el) => {
          if (el && el.parentElement !== document.body) {
            document.body.appendChild(el);
          }
        },
        children: [
          /* @__PURE__ */ u4(
            "div",
            {
              style: { position: "fixed", inset: 0, zIndex: 9998 },
              onClick: () => {
                showPosEditor.value = false;
              }
            }
          ),
          /* @__PURE__ */ u4(
            "div",
            {
              class: "gantt-pos-editor-overlay",
              style: {
                position: "fixed",
                top: (posEditorButtonRef.current?.getBoundingClientRect().bottom ?? 100) + 4 + "px",
                left: (posEditorButtonRef.current?.getBoundingClientRect().left ?? 200) + "px",
                zIndex: 9999,
                background: "var(--background-primary, #fff)",
                border: "1px solid var(--background-modifier-border, #ccc)",
                borderRadius: "6px",
                padding: "8px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                minWidth: "180px",
                maxWidth: "260px",
                maxHeight: "320px",
                display: "flex",
                flexDirection: "column"
              },
              onClick: (e4) => e4.stopPropagation(),
              children: [
                /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", marginBottom: "6px", flexShrink: 0 }, children: "Drag to reorder positions:" }),
                /* @__PURE__ */ u4("div", { style: { overflowY: "auto", flex: 1, minHeight: 0 }, children: [
                  posEditorItems.value.map((item, i5) => /* @__PURE__ */ u4(
                    "div",
                    {
                      draggable: true,
                      onDragStart: () => {
                        posDragIndex.value = i5;
                      },
                      onDragOver: (e4) => {
                        e4.preventDefault();
                        posDragOverIndex.value = i5;
                      },
                      onDragEnd: () => {
                        if (posDragIndex.value !== null && posDragOverIndex.value !== null && posDragIndex.value !== posDragOverIndex.value) {
                          const next = [...posEditorItems.value];
                          const [removed] = next.splice(posDragIndex.value, 1);
                          next.splice(posDragOverIndex.value, 0, removed);
                          posEditorItems.value = next;
                        }
                        posDragIndex.value = null;
                        posDragOverIndex.value = null;
                      },
                      onDrop: (e4) => e4.preventDefault(),
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        marginBottom: "2px",
                        fontSize: "12px",
                        cursor: "grab",
                        background: posDragOverIndex.value === i5 ? "var(--interactive-accent, #4A90D9)" : posDragIndex.value === i5 ? "var(--background-modifier-border, #e0e0e0)" : "transparent",
                        color: posDragOverIndex.value === i5 ? "#fff" : "var(--text-normal, #333)",
                        transition: "background 0.1s",
                        border: "1px solid transparent",
                        borderColor: posDragOverIndex.value === i5 ? "var(--interactive-accent, #4A90D9)" : "transparent"
                      },
                      children: [
                        /* @__PURE__ */ u4(Icon, { name: "grip-vertical", size: 12 }),
                        /* @__PURE__ */ u4("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: item })
                      ]
                    },
                    item
                  )),
                  posEditorItems.value.length === 0 && /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", padding: "8px", textAlign: "center" }, children: "No positions found" })
                ] }),
                /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "4px", marginTop: "6px", flexShrink: 0 }, children: [
                  /* @__PURE__ */ u4(
                    "button",
                    {
                      onClick: () => {
                        store2.positionOrder.value = posEditorItems.value;
                        store2.saveSettings();
                        showPosEditor.value = false;
                      },
                      style: {
                        padding: "2px 10px",
                        border: "none",
                        borderRadius: "4px",
                        background: "var(--interactive-accent, #4A90D9)",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "11px"
                      },
                      children: "Save"
                    }
                  ),
                  /* @__PURE__ */ u4(
                    "button",
                    {
                      onClick: () => {
                        showPosEditor.value = false;
                      },
                      style: {
                        padding: "2px 10px",
                        border: "1px solid var(--background-modifier-border, #ccc)",
                        borderRadius: "4px",
                        background: "transparent",
                        color: "var(--text-muted, #999)",
                        cursor: "pointer",
                        fontSize: "11px"
                      },
                      children: "Cancel"
                    }
                  ),
                  posEditorItems.value.length > 0 && /* @__PURE__ */ u4(
                    "button",
                    {
                      onClick: () => {
                        posEditorItems.value = [];
                      },
                      style: {
                        padding: "2px 10px",
                        border: "1px solid #E06C75",
                        borderRadius: "4px",
                        background: "transparent",
                        color: "#E06C75",
                        cursor: "pointer",
                        fontSize: "11px",
                        marginLeft: "auto"
                      },
                      children: "Clear"
                    }
                  )
                ] })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function ConfirmDialog(props) {
  function handleKeyDown(e4) {
    if (e4.key === "Escape")
      props.onCancel();
  }
  y2(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-confirm-backdrop",
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1e3
      },
      onClick: (e4) => {
        if (e4.target === e4.currentTarget)
          props.onCancel();
      },
      children: /* @__PURE__ */ u4(
        "div",
        {
          class: "gantt-confirm-dialog",
          style: {
            background: "var(--background-primary, #fff)",
            borderRadius: "8px",
            padding: "24px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            color: "var(--text-normal, #333)"
          },
          children: [
            /* @__PURE__ */ u4("div", { style: { marginBottom: "20px", fontSize: "14px", lineHeight: 1.5 }, children: props.message }),
            /* @__PURE__ */ u4("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px" }, children: [
              /* @__PURE__ */ u4(
                "button",
                {
                  onClick: props.onCancel,
                  class: "gantt-btn",
                  style: {
                    padding: "6px 16px",
                    border: "1px solid var(--background-modifier-border, #ccc)",
                    borderRadius: "4px",
                    background: "var(--background-secondary, #f5f5f5)",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "var(--text-normal, #333)"
                  },
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ u4(
                "button",
                {
                  onClick: props.onConfirm,
                  class: "gantt-btn gantt-btn-danger",
                  style: {
                    padding: "6px 16px",
                    border: "none",
                    borderRadius: "4px",
                    background: "var(--text-error, #e53935)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500
                  },
                  children: "Delete"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function TagManagementPanel(props) {
  const { store: store2 } = props;
  const newName = useSignal("");
  const newColor = useSignal(PRESET_COLORS[1][0]);
  const editingTag = useSignal(null);
  const editName = useSignal("");
  const editColor = useSignal("");
  const deleteConfirmName = useSignal(null);
  const creating = useSignal(false);
  const errorMsg = useSignal("");
  const usageCounts = T2(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const p5 of store2.mergedProjects.value) {
      for (const t4 of p5.tags ?? []) {
        counts.set(t4, (counts.get(t4) ?? 0) + 1);
      }
    }
    const overrides = store2.edits.value?.projectOverrides ?? {};
    for (const [, o4] of Object.entries(overrides)) {
      if (o4.tags) {
        for (const t4 of o4.tags) {
          if (!counts.has(t4))
            counts.set(t4, 0);
        }
      }
    }
    return counts;
  }, [store2.mergedProjects.value, store2.edits.value]);
  async function handleCreate() {
    const name = newName.value.trim();
    if (!name)
      return;
    if (store2.tagDefinitions.value.some((t4) => t4.name === name)) {
      errorMsg.value = `Tag "${name}" already exists`;
      return;
    }
    errorMsg.value = "";
    creating.value = true;
    try {
      await store2.createTag(name, newColor.value);
      newName.value = "";
      newColor.value = PRESET_COLORS[1][0];
    } catch (e4) {
      errorMsg.value = `Failed: ${e4 instanceof Error ? e4.message : String(e4)}`;
    } finally {
      creating.value = false;
    }
  }
  function handleCreateKeyDown(e4) {
    if (e4.key === "Enter") {
      e4.preventDefault();
      e4.stopPropagation();
      handleCreate();
    }
  }
  function startEdit(tag) {
    editingTag.value = tag.name;
    editName.value = tag.name;
    editColor.value = tag.color;
  }
  async function saveEdit() {
    const oldName = editingTag.value;
    const newNameVal = editName.value.trim();
    if (!oldName || !newNameVal)
      return;
    if (newNameVal !== oldName && store2.tagDefinitions.value.some((t4) => t4.name === newNameVal)) {
      errorMsg.value = `Tag "${newNameVal}" already exists`;
      return;
    }
    errorMsg.value = "";
    try {
      await store2.updateTag(oldName, newNameVal, editColor.value);
      editingTag.value = null;
    } catch (e4) {
      errorMsg.value = `Failed: ${e4 instanceof Error ? e4.message : String(e4)}`;
    }
  }
  function cancelEdit() {
    editingTag.value = null;
  }
  function handleEditKeyDown(e4) {
    if (e4.key === "Enter") {
      e4.preventDefault();
      e4.stopPropagation();
      saveEdit();
    }
    if (e4.key === "Escape") {
      e4.preventDefault();
      e4.stopPropagation();
      cancelEdit();
    }
  }
  function confirmDelete(name) {
    deleteConfirmName.value = name;
  }
  async function handleDelete() {
    if (!deleteConfirmName.value)
      return;
    const name = deleteConfirmName.value;
    deleteConfirmName.value = null;
    errorMsg.value = "";
    try {
      await store2.deleteTag(name);
    } catch (e4) {
      errorMsg.value = `Failed: ${e4 instanceof Error ? e4.message : String(e4)}`;
    }
  }
  const tagList = store2.tagDefinitions.value;
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-confirm-backdrop",
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1e3
      },
      onClick: (e4) => {
        if (e4.target === e4.currentTarget)
          props.onClose();
      },
      children: /* @__PURE__ */ u4(
        "div",
        {
          style: {
            background: "var(--background-primary, #fff)",
            borderRadius: "8px",
            padding: "0",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "75vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            color: "var(--text-normal, #333)"
          },
          children: [
            /* @__PURE__ */ u4("div", { style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px 16px",
              borderBottom: "1px solid var(--background-modifier-border, #eee)"
            }, children: [
              /* @__PURE__ */ u4("h3", { style: { margin: 0, fontSize: "16px" }, children: "Tag Management" }),
              /* @__PURE__ */ u4(
                "button",
                {
                  onClick: props.onClose,
                  style: {
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    lineHeight: 1,
                    padding: "0 2px",
                    color: "var(--text-muted, #999)"
                  },
                  children: "x"
                }
              )
            ] }),
            /* @__PURE__ */ u4("div", { style: { overflowY: "auto", padding: "16px 24px", flex: 1 }, children: [
              /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "6px", alignItems: "center", marginBottom: "16px" }, children: [
                /* @__PURE__ */ u4("div", { style: { position: "relative", flexShrink: 0 }, children: [
                  /* @__PURE__ */ u4(
                    "button",
                    {
                      onClick: () => {
                        editingTag.value = editingTag.value === "__new__" ? null : "__new__";
                      },
                      title: "Tag color",
                      style: {
                        width: "28px",
                        height: "28px",
                        padding: 0,
                        border: "1px solid var(--background-modifier-border, #ccc)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        background: newColor.value
                      }
                    }
                  ),
                  editingTag.value === "__new__" && /* @__PURE__ */ u4("div", { style: {
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 100,
                    background: "var(--background-primary, #fff)",
                    border: "1px solid var(--background-modifier-border, #ccc)",
                    borderRadius: "4px",
                    padding: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    marginTop: "2px"
                  }, children: /* @__PURE__ */ u4(
                    ColorSwatchPicker,
                    {
                      value: newColor.value,
                      onChange: (c4) => {
                        newColor.value = c4;
                        editingTag.value = null;
                      }
                    }
                  ) })
                ] }),
                /* @__PURE__ */ u4(
                  "input",
                  {
                    type: "text",
                    value: newName.value,
                    onInput: (e4) => {
                      newName.value = e4.target.value;
                    },
                    onKeyDown: handleCreateKeyDown,
                    onKeyUp: (e4) => {
                      e4.stopPropagation();
                    },
                    placeholder: "New tag name...",
                    style: {
                      flex: 1,
                      fontSize: "12px",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid var(--background-modifier-border, #ccc)",
                      background: "var(--background-primary, #fff)",
                      color: "var(--text-normal, #333)"
                    }
                  }
                ),
                /* @__PURE__ */ u4(
                  "button",
                  {
                    onClick: handleCreate,
                    disabled: creating.value || !newName.value.trim() || store2.tagDefinitions.value.some((t4) => t4.name === newName.value.trim()),
                    style: {
                      padding: "4px 12px",
                      border: "none",
                      borderRadius: "4px",
                      background: creating.value ? "var(--background-modifier-border, #ccc)" : "var(--interactive-accent, #4A90D9)",
                      color: "#fff",
                      cursor: creating.value || !newName.value.trim() ? "not-allowed" : "pointer",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      opacity: newName.value.trim() ? 1 : 0.5
                    },
                    children: creating.value ? "..." : "Create"
                  }
                )
              ] }),
              errorMsg.value && /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-error, #e00)", marginBottom: "8px" }, children: errorMsg.value }),
              tagList.length === 0 ? /* @__PURE__ */ u4("div", { style: { color: "var(--text-muted, #999)", fontSize: "13px", textAlign: "center", padding: "20px 0" }, children: "No tags defined yet. Create one above." }) : /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: tagList.map((tag) => /* @__PURE__ */ u4(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 10px",
                    border: "1px solid var(--background-modifier-border, #e0e0e0)",
                    borderRadius: "6px",
                    background: "var(--background-secondary, #f5f5f5)"
                  },
                  children: editingTag.value === tag.name ? /* @__PURE__ */ u4(S, { children: [
                    /* @__PURE__ */ u4("div", { style: { flexShrink: 0 }, children: /* @__PURE__ */ u4(
                      ColorSwatchPicker,
                      {
                        value: editColor.value,
                        onChange: (c4) => {
                          editColor.value = c4;
                        }
                      }
                    ) }),
                    /* @__PURE__ */ u4(
                      "input",
                      {
                        type: "text",
                        value: editName.value,
                        onInput: (e4) => {
                          editName.value = e4.target.value;
                        },
                        onKeyDown: handleEditKeyDown,
                        onKeyUp: (e4) => {
                          e4.stopPropagation();
                        },
                        style: {
                          flex: 1,
                          fontSize: "12px",
                          padding: "3px 6px",
                          borderRadius: "3px",
                          border: "1px solid var(--interactive-accent, #4A90D9)",
                          background: "var(--background-primary, #fff)",
                          color: "var(--text-normal, #333)"
                        }
                      }
                    ),
                    /* @__PURE__ */ u4("button", { onClick: saveEdit, style: { padding: "2px 6px", border: "none", borderRadius: "3px", background: "var(--interactive-accent, #4A90D9)", color: "#fff", cursor: "pointer", fontSize: "11px" }, children: "Save" }),
                    /* @__PURE__ */ u4("button", { onClick: cancelEdit, style: { padding: "2px 6px", border: "1px solid var(--background-modifier-border, #ccc)", borderRadius: "3px", background: "transparent", cursor: "pointer", fontSize: "11px" }, children: "Cancel" })
                  ] }) : /* @__PURE__ */ u4(S, { children: [
                    /* @__PURE__ */ u4("span", { style: {
                      width: "14px",
                      height: "14px",
                      borderRadius: "3px",
                      background: tag.color,
                      flexShrink: 0
                    } }),
                    /* @__PURE__ */ u4("span", { style: { flex: 1, fontSize: "13px", fontWeight: 500 }, children: tag.name }),
                    /* @__PURE__ */ u4("span", { style: { fontSize: "11px", color: "var(--text-muted, #999)" }, children: [
                      usageCounts.get(tag.name) ?? 0,
                      " projects"
                    ] }),
                    /* @__PURE__ */ u4(
                      "button",
                      {
                        onClick: () => startEdit(tag),
                        title: "Edit tag",
                        style: { background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "var(--text-muted, #999)", padding: "0 2px" },
                        children: /* @__PURE__ */ u4(Icon, { name: "pencil", size: 13 })
                      }
                    ),
                    deleteConfirmName.value === tag.name ? /* @__PURE__ */ u4(S, { children: [
                      /* @__PURE__ */ u4(
                        "button",
                        {
                          onClick: handleDelete,
                          title: "Confirm delete",
                          style: { background: "var(--text-error, #e00)", border: "none", borderRadius: "3px", cursor: "pointer", fontSize: "10px", color: "#fff", padding: "2px 6px", whiteSpace: "nowrap" },
                          children: "Sure?"
                        }
                      ),
                      /* @__PURE__ */ u4(
                        "button",
                        {
                          onClick: () => {
                            deleteConfirmName.value = null;
                          },
                          title: "Cancel delete",
                          style: { background: "none", border: "1px solid var(--background-modifier-border, #ccc)", borderRadius: "3px", cursor: "pointer", fontSize: "10px", color: "var(--text-muted, #999)", padding: "2px 4px" },
                          children: /* @__PURE__ */ u4(Icon, { name: "x", size: 10 })
                        }
                      )
                    ] }) : /* @__PURE__ */ u4(
                      "button",
                      {
                        onClick: () => confirmDelete(tag.name),
                        title: "Delete tag",
                        style: { background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "var(--text-error, #e00)", padding: "0 2px" },
                        children: /* @__PURE__ */ u4(Icon, { name: "trash-2", size: 13 })
                      }
                    )
                  ] })
                },
                tag.name
              )) })
            ] })
          ]
        }
      )
    }
  );
}
function PendingChangesPanel(props) {
  const { store: store2 } = props;
  const changes = store2.pendingChanges.value;
  const pushing = useSignal(false);
  const pushResults = useSignal(null);
  const dismissConfirm = useSignal(false);
  const progress = store2.pushProgress;
  const selectedIds = useSignal(new Set(changes.map((c4) => `${c4.entityType}:${c4.entityId}`)));
  function selectedEntityIds() {
    const ids = /* @__PURE__ */ new Set();
    for (const key of selectedIds.value) {
      const colonIdx = key.lastIndexOf(":");
      if (colonIdx > 0)
        ids.add(key.slice(colonIdx + 1));
    }
    return ids;
  }
  function toggleSelect(key) {
    const next = new Set(selectedIds.value);
    if (next.has(key))
      next.delete(key);
    else
      next.add(key);
    selectedIds.value = next;
  }
  function selectAll() {
    selectedIds.value = new Set(changes.map((c4) => `${c4.entityType}:${c4.entityId}`));
  }
  function deselectAll() {
    selectedIds.value = /* @__PURE__ */ new Set();
  }
  async function handlePush() {
    const ids = selectedEntityIds();
    if (ids.size === 0)
      return;
    pushing.value = true;
    pushResults.value = null;
    try {
      const results = await store2.pushChanges(ids);
      pushResults.value = results;
    } finally {
      pushing.value = false;
    }
  }
  async function handleDismiss() {
    if (!dismissConfirm.value) {
      dismissConfirm.value = true;
      return;
    }
    const ids = selectedEntityIds();
    if (ids.size === 0)
      return;
    await store2.dismissChanges(ids);
    dismissConfirm.value = false;
    selectedIds.value = /* @__PURE__ */ new Set();
  }
  const selectedCount = selectedIds.value.size;
  const totalCount = changes.length;
  const stats = {
    added: changes.filter((c4) => c4.changeType === "added").length,
    modified: changes.filter((c4) => c4.changeType === "modified").length,
    deleted: changes.filter((c4) => c4.changeType === "deleted").length
  };
  const changeTypeColor = {
    added: "#4caf50",
    modified: "#2196f3",
    deleted: "#e53935"
  };
  const changeTypeBadge = {
    added: "NEW",
    modified: "MOD",
    deleted: "DEL"
  };
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-confirm-backdrop",
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1e3
      },
      onClick: (e4) => {
        if (e4.target === e4.currentTarget)
          props.onClose();
      },
      children: /* @__PURE__ */ u4(
        "div",
        {
          class: "gantt-pending-panel",
          style: {
            background: "var(--background-primary, #fff)",
            borderRadius: "8px",
            padding: "0",
            maxWidth: "560px",
            width: "90%",
            maxHeight: "75vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            color: "var(--text-normal, #333)"
          },
          children: [
            /* @__PURE__ */ u4("div", { style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px 16px",
              borderBottom: changes.length > 0 ? "1px solid var(--background-modifier-border, #eee)" : "none"
            }, children: [
              /* @__PURE__ */ u4("div", { children: [
                /* @__PURE__ */ u4("h3", { style: { margin: "0 0 4px", fontSize: "16px" }, children: "Changes to Push" }),
                /* @__PURE__ */ u4("span", { style: { fontSize: "12px", color: "var(--text-muted, #999)" }, children: [
                  stats.added > 0 && /* @__PURE__ */ u4("span", { style: { color: changeTypeColor.added, marginRight: "10px" }, children: [
                    "+",
                    stats.added,
                    " new"
                  ] }),
                  stats.modified > 0 && /* @__PURE__ */ u4("span", { style: { color: changeTypeColor.modified, marginRight: "10px" }, children: [
                    "~",
                    stats.modified,
                    " updated"
                  ] }),
                  stats.deleted > 0 && /* @__PURE__ */ u4("span", { style: { color: changeTypeColor.deleted }, children: [
                    "-",
                    stats.deleted,
                    " deleted"
                  ] }),
                  changes.length === 0 && "No pending changes"
                ] })
              ] }),
              /* @__PURE__ */ u4(
                "button",
                {
                  onClick: props.onClose,
                  style: {
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    lineHeight: 1,
                    padding: "0 2px",
                    color: "var(--text-muted, #999)"
                  },
                  children: "x"
                }
              )
            ] }),
            /* @__PURE__ */ u4("div", { style: { overflowY: "auto", padding: "16px 24px", flex: 1 }, children: changes.length === 0 ? /* @__PURE__ */ u4("div", { style: { color: "var(--text-muted, #999)", fontSize: "13px", padding: "20px 0", textAlign: "center" }, children: "No pending changes. All local modifications have been pushed." }) : /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: changes.map((change, i5) => {
              const key = `${change.entityType}:${change.entityId}`;
              const isSelected = selectedIds.value.has(key);
              return /* @__PURE__ */ u4(
                "div",
                {
                  class: "gantt-change-card",
                  style: {
                    border: "1px solid var(--background-modifier-border, #e0e0e0)",
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "12px",
                    opacity: isSelected ? 1 : 0.5,
                    transition: "opacity 0.15s"
                  },
                  children: [
                    /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }, children: [
                      /* @__PURE__ */ u4(
                        "input",
                        {
                          type: "checkbox",
                          checked: isSelected,
                          onChange: () => toggleSelect(key),
                          style: { margin: 0, flexShrink: 0 }
                        }
                      ),
                      /* @__PURE__ */ u4("span", { style: {
                        display: "inline-block",
                        padding: "1px 6px",
                        borderRadius: "3px",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#fff",
                        background: changeTypeColor[change.changeType],
                        letterSpacing: "0.5px",
                        flexShrink: 0
                      }, children: changeTypeBadge[change.changeType] }),
                      /* @__PURE__ */ u4("span", { style: {
                        fontSize: "10px",
                        color: "var(--text-muted, #999)",
                        textTransform: "uppercase",
                        flexShrink: 0
                      }, children: change.entityType === "task" ? "Task" : "Project" }),
                      /* @__PURE__ */ u4("span", { style: {
                        fontWeight: 600,
                        fontSize: "13px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1
                      }, children: change.entityName })
                    ] }),
                    change.changeType === "modified" && change.fields && /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "3px", marginLeft: "24px" }, children: change.fields.map((f5, j4) => /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "baseline", gap: "6px" }, children: [
                      /* @__PURE__ */ u4("span", { style: {
                        color: "var(--text-muted, #999)",
                        fontSize: "11px",
                        minWidth: "70px",
                        flexShrink: 0
                      }, children: [
                        f5.label,
                        ":"
                      ] }),
                      /* @__PURE__ */ u4("span", { style: {
                        color: "var(--interactive-accent, #4A90D9)",
                        fontWeight: 500
                      }, children: f5.field === "keyDates" ? `${(f5.newValue ?? []).length} dates` : f5.field === "keyLinks" ? `${(f5.newValue ?? []).length} links` : f5.field === "tags" ? `[${(f5.newValue ?? []).join(", ")}]` : f5.field === "dependencies" ? `[${(f5.newValue ?? []).join(", ")}]` : String(f5.newValue ?? "(cleared)") })
                    ] }, j4)) }),
                    change.changeType === "added" && change.addedSummary && /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "3px", marginLeft: "24px" }, children: Object.entries(change.addedSummary).map(([key2, val]) => /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "baseline", gap: "6px" }, children: [
                      /* @__PURE__ */ u4("span", { style: {
                        color: "var(--text-muted, #999)",
                        fontSize: "11px",
                        minWidth: "50px",
                        flexShrink: 0
                      }, children: [
                        key2,
                        ":"
                      ] }),
                      /* @__PURE__ */ u4("span", { style: { color: "#4caf50", fontWeight: 500 }, children: String(val) })
                    ] }, key2)) }),
                    change.changeType === "deleted" && /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-error, #e53935)", marginLeft: "24px" }, children: change.relatedInfo ? `Will be deleted \xB7 ${change.relatedInfo}` : "Will be deleted" })
                  ]
                },
                `${change.entityType}-${change.entityId}-${change.changeType}-${i5}`
              );
            }) }) }),
            changes.length > 0 && /* @__PURE__ */ u4("div", { style: {
              padding: "12px 24px",
              borderTop: "1px solid var(--background-modifier-border, #eee)",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }, children: [
              pushing.value && /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: progress.value ? /* @__PURE__ */ u4(S, { children: [
                /* @__PURE__ */ u4("div", { style: {
                  height: "6px",
                  borderRadius: "3px",
                  background: "var(--background-modifier-border, #e0e0e0)",
                  overflow: "hidden"
                }, children: /* @__PURE__ */ u4("div", { style: {
                  height: "100%",
                  width: `${Math.round(progress.value.current / progress.value.total * 100)}%`,
                  borderRadius: "3px",
                  background: "var(--interactive-accent, #4A90D9)",
                  transition: "width 0.2s"
                } }) }),
                /* @__PURE__ */ u4("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted, #999)" }, children: [
                  /* @__PURE__ */ u4("span", { children: progress.value.message }),
                  /* @__PURE__ */ u4("span", { children: [
                    progress.value.current,
                    " / ",
                    progress.value.total
                  ] })
                ] })
              ] }) : /* @__PURE__ */ u4("div", { style: { fontSize: "12px", color: "var(--text-muted, #999)", textAlign: "center" }, children: "Pushing changes..." }) }),
              pushResults.value && !pushing.value && /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px" }, children: (() => {
                const succeeded = pushResults.value.filter((r4) => r4.success);
                const failed = pushResults.value.filter((r4) => !r4.success);
                return /* @__PURE__ */ u4(S, { children: [
                  succeeded.length > 0 && /* @__PURE__ */ u4("div", { style: { color: "#4caf50" }, children: [
                    "Successful: ",
                    succeeded.map((r4) => r4.connectorId).join(", ")
                  ] }),
                  failed.length > 0 && /* @__PURE__ */ u4("div", { style: { color: "var(--text-error, #e00)" }, children: [
                    "Failed: ",
                    failed.map((r4) => `${r4.connectorId} (${r4.error || "unknown error"})`).join("; ")
                  ] }),
                  succeeded.length > 0 && failed.length === 0 && /* @__PURE__ */ u4("div", { style: { color: "#4caf50", fontWeight: 500 }, children: "All changes pushed successfully." }),
                  succeeded.length === 0 && failed.length > 0 && /* @__PURE__ */ u4("div", { style: { color: "var(--text-error, #e00)", fontWeight: 500 }, children: "Push failed \u2014 no changes cleared." })
                ] });
              })() }),
              !pushing.value && /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                /* @__PURE__ */ u4("button", { onClick: selectAll, style: {
                  padding: "4px 8px",
                  border: "1px solid var(--background-modifier-border, #ccc)",
                  borderRadius: "3px",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "11px"
                }, children: "All" }),
                /* @__PURE__ */ u4("button", { onClick: deselectAll, style: {
                  padding: "4px 8px",
                  border: "1px solid var(--background-modifier-border, #ccc)",
                  borderRadius: "3px",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "11px"
                }, children: "None" }),
                /* @__PURE__ */ u4("span", { style: { fontSize: "11px", color: "var(--text-muted, #999)" }, children: [
                  selectedCount,
                  " of ",
                  totalCount,
                  " selected"
                ] }),
                /* @__PURE__ */ u4("div", { style: { flex: 1 } }),
                /* @__PURE__ */ u4(
                  "button",
                  {
                    onClick: handleDismiss,
                    disabled: selectedCount === 0,
                    class: "gantt-btn",
                    style: {
                      padding: "6px 14px",
                      border: "1px solid var(--text-error, #e00)",
                      borderRadius: "4px",
                      background: dismissConfirm.value ? "var(--text-error, #e53935)" : "transparent",
                      color: dismissConfirm.value ? "#fff" : "var(--text-error, #e00)",
                      cursor: selectedCount === 0 ? "not-allowed" : "pointer",
                      fontSize: "12px",
                      opacity: selectedCount === 0 ? 0.5 : 1
                    },
                    children: dismissConfirm.value ? "Click again to confirm" : `Dismiss (${selectedCount})`
                  }
                ),
                /* @__PURE__ */ u4(
                  "button",
                  {
                    onClick: handlePush,
                    disabled: selectedCount === 0,
                    class: "gantt-btn",
                    style: {
                      padding: "8px 20px",
                      border: "none",
                      borderRadius: "4px",
                      background: selectedCount === 0 ? "var(--background-modifier-border, #ccc)" : "var(--interactive-accent, #4A90D9)",
                      color: "#fff",
                      cursor: selectedCount === 0 ? "not-allowed" : "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                      opacity: selectedCount === 0 ? 0.5 : 1
                    },
                    children: [
                      "Push (",
                      selectedCount,
                      ")"
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function DualPane(props) {
  const { store: store2 } = props;
  let personVGuardActive = false;
  let personVGuardTimer = null;
  let projectVGuardActive = false;
  let projectVGuardTimer = null;
  const paneRatio = useSignal(0.5);
  const isResizing = useSignal(false);
  const isResizingPanel = useSignal(false);
  const didInitialScroll = A2(false);
  y2(() => {
    if (didInitialScroll.current || store2.mergedTasks.value.length === 0)
      return;
    didInitialScroll.current = true;
    requestAnimationFrame(() => {
      const timelineEl = document.querySelector(".gantt-timeline");
      if (!timelineEl)
        return;
      let minAbsPx = dateToPx2(todayString());
      for (const t4 of store2.mergedTasks.value) {
        const sd = t4.startDate.value;
        const ed = t4.endDate.value;
        if (sd) {
          const px = dateToPx2(sd);
          if (px < minAbsPx)
            minAbsPx = px;
        }
        if (ed) {
          const px = dateToPx2(ed);
          if (px < minAbsPx)
            minAbsPx = px;
        }
      }
      const bodyOriginPx = Math.floor(minAbsPx - 730 * DAY_WIDTH2);
      const todayBodyPx = dateToPx2(todayString()) - bodyOriginPx;
      const targetScroll = Math.max(0, todayBodyPx - timelineEl.clientWidth / 2);
      store2.sharedScrollLeft.value = targetScroll;
    });
  }, []);
  y2(() => {
    const target = store2.locateTarget.value;
    if (!target)
      return;
    requestAnimationFrame(() => {
      let minAbsPx = dateToPx2(todayString());
      for (const t4 of store2.mergedTasks.value) {
        const sd = t4.startDate.value;
        const ed = t4.endDate.value;
        if (sd) {
          const px = dateToPx2(sd);
          if (px < minAbsPx)
            minAbsPx = px;
        }
        if (ed) {
          const px = dateToPx2(ed);
          if (px < minAbsPx)
            minAbsPx = px;
        }
      }
      const bodyOriginPx = Math.floor(minAbsPx - 730 * DAY_WIDTH2);
      if (target.type === "task") {
        const task = store2.mergedTasks.value.find((t4) => t4.id === target.id);
        if (!task) {
          store2.locateTarget.value = null;
          return;
        }
        const startVal = task.startDate.value;
        if (startVal) {
          const timelineEl = document.querySelector(".gantt-timeline");
          const viewportW = timelineEl ? timelineEl.clientWidth : 800;
          const targetBodyPx = dateToPx2(startVal) - bodyOriginPx;
          store2.sharedScrollLeft.value = Math.max(0, targetBodyPx - viewportW / 4);
        }
        const personKey = task.personId.value || "__unassigned__";
        let personRowY = 0;
        let accY = 0;
        for (const group of store2.personGroups.value) {
          const taskCount = group.tasks.length || 1;
          const lanes = Math.min(taskCount, 3);
          const h4 = ROW_HEIGHT2 + (lanes - 1) * LANE_OFFSET2;
          if (group.personId === personKey) {
            personRowY = accY;
            break;
          }
          accY += h4;
        }
        const personPaneEl = document.querySelector(".gantt-pane");
        const personViewH = personPaneEl ? personPaneEl.clientHeight / 2 : 300;
        store2.personScrollTop.value = Math.max(0, personRowY - personViewH / 3);
        const projectKey = task.projectId.value || "__no_project__";
        let projectRowY = 0;
        accY = 0;
        for (const group of store2.projectGroups.value) {
          const taskCount = group.tasks.length || 1;
          const lanes = Math.min(taskCount, 3);
          const h4 = ROW_HEIGHT2 + (lanes - 1) * LANE_OFFSET2;
          if (group.projectId === projectKey) {
            projectRowY = accY;
            break;
          }
          accY += h4;
        }
        const projectPaneEl = document.querySelectorAll(".gantt-pane")[1];
        const projectViewH = projectPaneEl ? projectPaneEl.clientHeight : 300;
        store2.projectScrollTop.value = Math.max(0, projectRowY - projectViewH / 3);
      }
      if (target.type === "project") {
        const projectTasks = store2.mergedTasks.value.filter((t4) => t4.projectId.value === target.id);
        let earliest = null;
        let latest = null;
        for (const t4 of projectTasks) {
          const s5 = t4.startDate.value;
          const e4 = t4.endDate.value ?? s5;
          if (s5) {
            if (!earliest || s5 < earliest)
              earliest = s5;
            if (!latest || e4 > latest)
              latest = e4;
          }
        }
        if (earliest) {
          const projectMidDate = earliest === latest || !latest ? earliest : addDays(earliest, Math.floor(daysBetween(earliest, latest) / 2));
          if (projectMidDate) {
            const timelineEl = document.querySelector(".gantt-timeline");
            const viewportW = timelineEl ? timelineEl.clientWidth : 800;
            const targetBodyPx = dateToPx2(projectMidDate) - bodyOriginPx;
            store2.sharedScrollLeft.value = Math.max(0, targetBodyPx - viewportW / 4);
          }
        }
        let projectRowY = 0;
        let accY = 0;
        for (const group of store2.projectGroups.value) {
          const taskCount = group.tasks.length || 1;
          const lanes = Math.min(taskCount, 3);
          const h4 = ROW_HEIGHT2 + (lanes - 1) * LANE_OFFSET2;
          if (group.projectId === target.id) {
            projectRowY = accY;
            break;
          }
          accY += h4;
        }
        const projectPaneEl = document.querySelectorAll(".gantt-pane")[1];
        const projectViewH = projectPaneEl ? projectPaneEl.clientHeight : 300;
        store2.projectScrollTop.value = Math.max(0, projectRowY - projectViewH / 3);
      }
      store2.locateTarget.value = null;
    });
  }, [store2.locateTarget.value]);
  function handleResizePointerDown(e4) {
    e4.preventDefault();
    isResizing.value = true;
    const startY = e4.clientY;
    const startRatio = paneRatio.value;
    const containerEl = e4.currentTarget.parentElement;
    const totalHeight = containerEl.clientHeight;
    function onMove(ev) {
      const dy = ev.clientY - startY;
      const newRatio = Math.min(0.8, Math.max(0.2, startRatio + dy / totalHeight));
      paneRatio.value = newRatio;
    }
    function onUp() {
      isResizing.value = false;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }
  function handlePanelResizePointerDown(e4) {
    e4.preventDefault();
    isResizingPanel.value = true;
    const startX = e4.clientX;
    const startWidth = store2.detailPanelWidth.value;
    function onMove(ev) {
      const dx = startX - ev.clientX;
      const newWidth = Math.min(500, Math.max(180, startWidth + dx));
      store2.detailPanelWidth.value = newWidth;
    }
    function onUp() {
      isResizingPanel.value = false;
      store2.saveSettings();
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }
  const sel = store2.selectedEntity.value;
  const showTaskDetail = sel?.type === "task";
  const showProjectDetail = sel?.type === "project";
  const showPersonDetail = sel?.type === "person";
  return /* @__PURE__ */ u4("div", { class: "gantt-dual-pane", style: { display: "flex", flexDirection: "column", height: "100%", width: "100%" }, children: /* @__PURE__ */ u4("div", { style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
    /* @__PURE__ */ u4("div", { style: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }, children: [
      /* @__PURE__ */ u4("div", { style: { flex: `0 0 ${paneRatio.value * 100}%`, display: "flex", overflow: "hidden" }, children: [
        /* @__PURE__ */ u4(
          GanttPane,
          {
            store: store2,
            type: "person",
            scrollLeft: store2.sharedScrollLeft.value,
            scrollTop: store2.personScrollTop.value,
            onScroll: (sl, st) => {
              store2.sharedScrollLeft.value = sl;
              if (!personVGuardActive) {
                personVGuardActive = true;
                store2.personScrollTop.value = st;
                if (personVGuardTimer)
                  clearTimeout(personVGuardTimer);
                personVGuardTimer = setTimeout(() => {
                  personVGuardActive = false;
                }, 100);
              }
            },
            onTaskPointerDown: props.onTaskPointerDown,
            onDrop: props.onDrop,
            onDragOver: props.onDragOver
          }
        ),
        !showTaskDetail && !showProjectDetail && !showPersonDetail && /* @__PURE__ */ u4(UnassignedPanel, { store: store2, onDragStart: () => {
        } })
      ] }),
      /* @__PURE__ */ u4(
        "div",
        {
          class: "gantt-resize-handle",
          style: {
            height: "6px",
            cursor: "row-resize",
            background: isResizing.value ? "var(--interactive-accent, #4A90D9)" : "var(--background-modifier-border, #ccc)",
            flexShrink: 0,
            transition: isResizing.value ? "none" : "background 0.15s"
          },
          onPointerDown: handleResizePointerDown
        }
      ),
      /* @__PURE__ */ u4("div", { style: { flex: 1, display: "flex", overflow: "hidden" }, children: /* @__PURE__ */ u4(
        GanttPane,
        {
          store: store2,
          type: "project",
          scrollLeft: store2.sharedScrollLeft.value,
          scrollTop: store2.projectScrollTop.value,
          onScroll: (sl, st) => {
            store2.sharedScrollLeft.value = sl;
            if (!projectVGuardActive) {
              projectVGuardActive = true;
              store2.projectScrollTop.value = st;
              if (projectVGuardTimer)
                clearTimeout(projectVGuardTimer);
              projectVGuardTimer = setTimeout(() => {
                projectVGuardActive = false;
              }, 100);
            }
          },
          onTaskPointerDown: props.onTaskPointerDown,
          onKeyDatePointerDown: props.onKeyDatePointerDown,
          onDrop: props.onDrop,
          onDragOver: props.onDragOver
        }
      ) })
    ] }),
    /* @__PURE__ */ u4("div", { style: { display: "flex", flexShrink: 0 }, children: [
      /* @__PURE__ */ u4(
        "div",
        {
          class: "gantt-panel-resize-handle",
          style: {
            width: "4px",
            cursor: "col-resize",
            background: isResizingPanel.value ? "var(--interactive-accent, #4A90D9)" : "var(--background-modifier-border, #ccc)",
            flexShrink: 0,
            transition: isResizingPanel.value ? "none" : "background 0.15s"
          },
          onPointerDown: handlePanelResizePointerDown
        }
      ),
      showTaskDetail && /* @__PURE__ */ u4(TaskDetail, { store: store2, onDelete: props.onDeleteTask }),
      showProjectDetail && /* @__PURE__ */ u4(ProjectDetail, { store: store2, onDelete: props.onDeleteProject }),
      showPersonDetail && /* @__PURE__ */ u4(PersonDetail, { store: store2 })
    ] })
  ] }) });
}
function GanttChart(props) {
  const { store: store2 } = props;
  const dragHandler = createDragHandler(store2);
  const confirmState = useSignal(null);
  const showPendingPanel = useSignal(false);
  const showTagPanel = useSignal(false);
  let saveTimer = null;
  function scheduleSave() {
    if (saveTimer)
      clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store2.saveSettings(), 500);
  }
  function handleDeleteTask(taskId, title) {
    confirmState.value = {
      message: `Are you sure you want to delete task "${title}"? This action can be undone until changes are pushed upstream.`,
      onConfirm: () => {
        store2.deleteTask(taskId);
        confirmState.value = null;
      }
    };
  }
  function handleDeleteProject(projectId, name) {
    const taskCount = store2.mergedTasks.value.filter((t4) => t4.projectId.value === projectId).length;
    confirmState.value = {
      message: `Are you sure you want to delete project "${name}"?${taskCount > 0 ? ` This will also delete ${taskCount} associated task(s).` : ""} This action can be undone until changes are pushed upstream.`,
      onConfirm: () => {
        store2.deleteProject(projectId);
        confirmState.value = null;
      }
    };
  }
  y2(() => {
    function onKeyDown(e4) {
      if (e4.key === "Escape") {
        if (confirmState.value) {
          confirmState.value = null;
          return;
        }
        if (showPendingPanel.value) {
          showPendingPanel.value = false;
          return;
        }
        if (showTagPanel.value) {
          showTagPanel.value = false;
          return;
        }
        store2.selectEntity(null);
      }
      if (e4.key === "z" && (e4.ctrlKey || e4.metaKey)) {
        e4.preventDefault();
        dragHandler.undo();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
  function handleTaskPointerDown(e4, taskId, edge, paneType, laneIndex) {
    dragHandler.onTaskPointerDown(e4, taskId, edge, paneType, laneIndex);
  }
  function handleKeyDatePointerDown(e4, projectId, keyDateIndex, currentDate) {
    dragHandler.onKeyDatePointerDown(e4, projectId, keyDateIndex, currentDate);
  }
  function handleDrop(e4, bodyOriginPx) {
    dragHandler.handleTimelineDrop(e4, bodyOriginPx);
  }
  function handleDragOver(e4) {
    dragHandler.handleTimelineDragOver(e4);
  }
  if (store2.isLoading.value) {
    return /* @__PURE__ */ u4("div", { class: "gantt-loading", style: { padding: "24px", textAlign: "center", color: "var(--text-muted, #999)" }, children: "Loading..." });
  }
  if (store2.error.value) {
    return /* @__PURE__ */ u4("div", { class: "gantt-error", style: { padding: "24px", textAlign: "center", color: "var(--text-error, #e00)" }, children: [
      "Error: ",
      store2.error.value
    ] });
  }
  if (!store2.currentViewId.value) {
    return /* @__PURE__ */ u4("div", { class: "gantt-empty", style: { padding: "24px", textAlign: "center", color: "var(--text-muted, #999)" }, children: "No view selected. Create a view to get started." });
  }
  return /* @__PURE__ */ u4("div", { class: "gantt-chart", style: { width: "100%", height: "100%", display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ u4(
      "div",
      {
        class: "gantt-toolbar",
        style: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px 12px",
          borderBottom: "1px solid var(--background-modifier-border, #ccc)",
          fontSize: "13px"
        },
        children: [
          /* @__PURE__ */ u4(
            "button",
            {
              class: "gantt-btn",
              style: {
                padding: "4px 12px",
                border: "1px solid var(--background-modifier-border, #ccc)",
                borderRadius: "4px",
                background: "var(--background-secondary, #f5f5f5)",
                cursor: "pointer",
                fontSize: "12px"
              },
              onClick: () => store2.selectEntity(null),
              children: "Clear Selection"
            }
          ),
          /* @__PURE__ */ u4(
            "button",
            {
              class: "gantt-btn",
              title: "Re-run all connectors to fetch latest data",
              style: {
                padding: "4px 12px",
                border: "1px solid var(--background-modifier-border, #ccc)",
                borderRadius: "4px",
                background: "var(--background-secondary, #f5f5f5)",
                cursor: "pointer",
                fontSize: "12px"
              },
              onClick: async () => {
                const view = store2.views.value.find((v5) => v5.id === store2.currentViewId.value);
                if (!view)
                  return;
                for (const cid of view.connectors) {
                  await store2.refreshConnector(cid);
                }
              },
              children: "Refresh"
            }
          ),
          /* @__PURE__ */ u4(
            "button",
            {
              class: "gantt-btn",
              title: "View and push pending local changes",
              style: {
                padding: "4px 12px",
                border: "1px solid var(--interactive-accent, #4A90D9)",
                borderRadius: "4px",
                background: store2.pendingChanges.value.length > 0 ? "var(--interactive-accent, #4A90D9)" : "var(--background-secondary, #f5f5f5)",
                color: store2.pendingChanges.value.length > 0 ? "#fff" : "var(--text-normal, #333)",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: store2.pendingChanges.value.length > 0 ? 500 : "normal"
              },
              onClick: () => {
                showPendingPanel.value = true;
              },
              children: [
                "Pending (",
                store2.pendingChanges.value.length,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ u4(
            "button",
            {
              class: "gantt-btn",
              title: "Manage tag definitions",
              style: {
                padding: "4px 12px",
                border: "1px solid var(--background-modifier-border, #ccc)",
                borderRadius: "4px",
                background: "var(--background-secondary, #f5f5f5)",
                cursor: "pointer",
                fontSize: "12px"
              },
              onClick: () => {
                showTagPanel.value = true;
              },
              children: "Tags"
            }
          ),
          /* @__PURE__ */ u4("span", { style: { color: "var(--text-muted, #999)", fontSize: "12px" }, children: [
            store2.mergedTasks.value.length,
            " tasks \xB7 ",
            store2.personGroups.value.length,
            " people \xB7 ",
            store2.projectGroups.value.length,
            " projects"
          ] }),
          /* @__PURE__ */ u4("span", { style: { color: "var(--text-muted, #999)", fontSize: "12px", marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ u4(
              "input",
              {
                type: "date",
                value: store2.filterTimeStart.value,
                onInput: (e4) => {
                  store2.filterTimeStart.value = e4.target.value;
                  scheduleSave();
                },
                title: "Filter start date",
                style: {
                  padding: "2px 6px",
                  fontSize: "11px",
                  borderRadius: "3px",
                  width: "120px",
                  border: "1px solid var(--background-modifier-border, #ccc)",
                  background: "var(--background-primary, #fff)",
                  color: "var(--text-normal, #333)"
                }
              }
            ),
            /* @__PURE__ */ u4("span", { style: { fontSize: "11px" }, children: "\u2014" }),
            /* @__PURE__ */ u4(
              "input",
              {
                type: "date",
                value: store2.filterTimeEnd.value,
                onInput: (e4) => {
                  store2.filterTimeEnd.value = e4.target.value;
                  scheduleSave();
                },
                title: "Filter end date",
                style: {
                  padding: "2px 6px",
                  fontSize: "11px",
                  borderRadius: "3px",
                  width: "120px",
                  border: "1px solid var(--background-modifier-border, #ccc)",
                  background: "var(--background-primary, #fff)",
                  color: "var(--text-normal, #333)"
                }
              }
            ),
            /* @__PURE__ */ u4(
              FilterMultiSelect,
              {
                label: "Status",
                options: STATUS_OPTIONS.map((o4) => ({ value: o4.value, label: o4.label })),
                selected: store2.filterStatuses.value,
                onChange: (s5) => {
                  store2.filterStatuses.value = s5;
                  scheduleSave();
                }
              }
            ),
            /* @__PURE__ */ u4(
              FilterMultiSelect,
              {
                label: "Tags",
                options: store2.availableFilterTags.value,
                selected: store2.filterTags.value,
                onChange: (s5) => {
                  store2.filterTags.value = s5;
                  scheduleSave();
                }
              }
            ),
            store2.filteredProjectGroupKeys.value !== null && /* @__PURE__ */ u4("span", { style: { fontSize: "11px", color: "var(--interactive-accent, #4A90D9)", fontWeight: 500 }, children: [
              store2.filteredProjectGroupKeys.value.size,
              " matching"
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ u4(
      DualPane,
      {
        store: store2,
        onTaskPointerDown: handleTaskPointerDown,
        onKeyDatePointerDown: handleKeyDatePointerDown,
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDeleteTask: handleDeleteTask,
        onDeleteProject: handleDeleteProject
      }
    ),
    confirmState.value && /* @__PURE__ */ u4(
      ConfirmDialog,
      {
        message: confirmState.value.message,
        onConfirm: confirmState.value.onConfirm,
        onCancel: () => {
          confirmState.value = null;
        }
      }
    ),
    showPendingPanel.value && /* @__PURE__ */ u4(
      PendingChangesPanel,
      {
        store: store2,
        onClose: () => {
          showPendingPanel.value = false;
        }
      }
    ),
    showTagPanel.value && /* @__PURE__ */ u4(
      TagManagementPanel,
      {
        store: store2,
        onClose: () => {
          showTagPanel.value = false;
        }
      }
    )
  ] });
}

// src/view.tsx
var import_obsidian3 = require("obsidian");

// src/storage.ts
var BASE = "obsidian-gantt-data";
async function ensureDir(dir, adapter) {
  const parts = dir.split("/");
  for (let i5 = 2; i5 <= parts.length; i5++) {
    const partial = parts.slice(0, i5).join("/");
    try {
      const exists = await adapter.exists(partial);
      if (!exists) {
        const marker = `${partial}/.dir`;
        await adapter.write(marker, "");
        await adapter.remove(marker);
      }
    } catch {
    }
  }
}
function createObsidianStorage(adapter) {
  const fullPath = (p5) => `${BASE}/${p5}`;
  return {
    async read(path) {
      const fp = fullPath(path);
      try {
        const exists = await adapter.exists(fp);
        if (!exists)
          return null;
        return await adapter.read(fp);
      } catch {
        return null;
      }
    },
    async write(path, data) {
      const fp = fullPath(path);
      try {
        await adapter.write(fp, data);
      } catch (e4) {
        const dir = fp.split("/").slice(0, -1).join("/");
        try {
          const dirExists = await adapter.exists(dir);
          if (!dirExists) {
            await ensureDir(dir, adapter);
          }
          await adapter.write(fp, data);
        } catch (inner) {
          throw new Error(
            `Failed to write ${fp}: ${inner.message}`
          );
        }
      }
    },
    async delete(path) {
      const fp = fullPath(path);
      try {
        await adapter.remove(fp);
      } catch {
      }
    },
    async list(dir) {
      const dp = fullPath(dir);
      try {
        const result = await adapter.list(dp);
        const prefix = `${dp}/`;
        return result.files.map((f5) => {
          if (f5.startsWith(prefix))
            return f5.slice(prefix.length);
          if (f5.startsWith(dp))
            return f5.slice(dp.length + 1);
          const parts = f5.split("/");
          return parts[parts.length - 1];
        });
      } catch {
        return [];
      }
    }
  };
}

// src/logger.ts
var LOG_DIR = "logs";
var FLUSH_INTERVAL_MS = 5e3;
var LogStore = class {
  constructor() {
    this.entries = [];
    this.settings = { ...DEFAULT_LOG_SETTINGS };
    this.flushTimer = null;
    this.storage = null;
  }
  /** Initialise the store with an IStorage and optional settings. */
  async init(storage, settings) {
    this.storage = storage;
    if (settings) {
      this.settings = { ...this.settings, ...settings };
    }
    if (this.settings.enabled) {
      this.startFlushTimer();
      this.push(createLogEntry("info", "plugin", "Logging initialized", {
        level: this.settings.level,
        retentionDays: this.settings.retentionDays
      }));
    }
    this.pruneOldLogs();
  }
  /** Update settings at runtime (e.g. from settings tab). */
  updateSettings(settings) {
    const previous = { ...this.settings };
    this.settings = { ...this.settings, ...settings };
    if (!this.settings.enabled && this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    } else if (this.settings.enabled && !this.flushTimer && this.storage) {
      this.startFlushTimer();
    }
    if (this.settings.enabled) {
      const changed = [];
      if (settings.enabled !== void 0 && settings.enabled !== previous.enabled) {
        changed.push(`enabled: ${previous.enabled} -> ${settings.enabled}`);
      }
      if (settings.level !== void 0 && settings.level !== previous.level) {
        changed.push(`level: ${previous.level} -> ${settings.level}`);
      }
      if (settings.retentionDays !== void 0 && settings.retentionDays !== previous.retentionDays) {
        changed.push(`retention: ${previous.retentionDays}d -> ${settings.retentionDays}d`);
      }
      if (changed.length > 0) {
        this.push(createLogEntry("info", "plugin", "Log settings updated", { changes: changed }));
      }
    }
  }
  getSettings() {
    return { ...this.settings };
  }
  /** Push an entry to the buffer. No-op if logging is disabled or level too low. */
  push(entry) {
    if (!this.settings.enabled)
      return;
    if (!meetsLevel(entry.level, this.settings.level))
      return;
    this.entries.push(entry);
  }
  /** Flush buffered entries to disk via IStorage. */
  async flush() {
    if (!this.storage || this.entries.length === 0)
      return;
    const toWrite = this.entries.splice(0);
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const filePath = `${LOG_DIR}/gantt-${today}.json`;
    try {
      let existing = [];
      const raw = await this.storage.read(filePath);
      if (raw) {
        try {
          existing = JSON.parse(raw);
        } catch {
          existing = [];
        }
      }
      const merged = [...existing, ...toWrite];
      const serialized = JSON.stringify(merged, null, 2);
      await this.storage.write(filePath, serialized);
      console.log(`[Gantt] Log flushed: ${toWrite.length} entries -> ${filePath} (${serialized.length} bytes)`);
    } catch (err) {
      console.error("[Gantt] Log flush failed:", err);
    }
  }
  /** Clean up log files older than retentionDays. */
  async pruneOldLogs() {
    if (!this.storage)
      return;
    const cutoff = Date.now() - this.settings.retentionDays * 24 * 60 * 60 * 1e3;
    try {
      const files = await this.storage.list(LOG_DIR);
      for (const f5 of files) {
        const match = f5.match(/gantt-(\d{4}-\d{2}-\d{2})\.json$/);
        if (match) {
          const fileDate = new Date(match[1]).getTime();
          if (fileDate < cutoff) {
            await this.storage.delete(`${LOG_DIR}/${f5}`).catch(() => {
            });
          }
        }
      }
    } catch {
    }
  }
  /** Destroy the store: flush and stop timer. */
  async destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flush();
  }
  startFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flush().catch(() => {
      });
    }, FLUSH_INTERVAL_MS);
  }
};
var store = new LogStore();
function createObsidianLogger(source) {
  return {
    debug(message, data) {
      store.push(createLogEntry("debug", source, message, data));
    },
    info(message, data) {
      store.push(createLogEntry("info", source, message, data));
    },
    warn(message, data) {
      store.push(createLogEntry("warn", source, message, data));
    },
    error(message, data) {
      store.push(createLogEntry("error", source, message, data));
    }
  };
}
async function initLogStore(storage, settings) {
  await store.init(storage, settings);
}
function updateLogSettings(settings) {
  store.updateSettings(settings);
}
function destroyLogStore() {
  return store.destroy();
}

// src/connector-loader.ts
function createObsidianConnectorLoader(adapter, requestUrl2) {
  return {
    async load(scriptPath) {
      try {
        const source = await adapter.read(scriptPath);
        if (!source) {
          throw new PlatformError(
            `Connector script not found: ${scriptPath}`,
            "CONNECTOR_NOT_FOUND"
          );
        }
        const moduleCode = `
          const module = { exports: {} };
          const exports = module.exports;
          ${source}
          return module.exports;
        `;
        const fn = new Function(moduleCode);
        const mod = fn();
        if (!mod || typeof mod.fetch !== "function" || typeof mod.transform !== "function") {
          throw new PlatformError(
            `Connector script must export fetch() and transform() functions. Found: ${Object.keys(mod ?? {}).join(", ")}`,
            "CONNECTOR_SCRIPT_ERROR"
          );
        }
        const hasFetchDetail = typeof mod.fetchDetail === "function";
        const hasTransformDetail = typeof mod.transformDetail === "function";
        if (hasFetchDetail !== hasTransformDetail) {
          throw new PlatformError(
            `Connector script must export both fetchDetail() and transformDetail() together, or neither. Found: fetchDetail=${hasFetchDetail}, transformDetail=${hasTransformDetail}`,
            "CONNECTOR_SCRIPT_ERROR"
          );
        }
        return mod;
      } catch (e4) {
        if (e4 instanceof PlatformError)
          throw e4;
        throw new PlatformError(
          `Failed to load connector script: ${e4.message}`,
          "CONNECTOR_SCRIPT_ERROR",
          e4
        );
      }
    }
  };
}
function createObsidianConnectorContext(connectorCfg, vaultAdapter, requestUrl2, viewState, connectorId) {
  const logger = createObsidianLogger(connectorId ? `connector:${connectorId}` : "connector");
  const innerConfig = connectorCfg.config ?? connectorCfg;
  return {
    config: innerConfig,
    viewState,
    log: (message) => logger.info(message),
    logger,
    request: async (url, opts) => {
      const result = await requestUrl2({
        url,
        method: opts?.method ?? "GET",
        headers: opts?.headers,
        body: opts?.body
      });
      return {
        ok: result.status >= 200 && result.status < 300,
        status: result.status,
        json: async () => result.json,
        text: async () => String(result.json)
      };
    },
    readFile: async (path) => {
      return await vaultAdapter.read(path);
    },
    writeFile: async (path, content) => {
      await vaultAdapter.write(path, content);
    },
    parseCSV: (text, options) => {
      return parseCSV(text, options);
    }
  };
}

// src/platform.ts
var import_obsidian = require("obsidian");
function createObsidianPlatform(app) {
  const adapter = app.vault.adapter;
  const appRef = app;
  const storage = createObsidianStorage(adapter);
  const fetchRef = {
    requestUrl: () => {
      throw new Error("requestUrl not bound \u2014 call bindRequestUrl first");
    }
  };
  const connectorLoader = createObsidianConnectorLoader(adapter, (...args) => fetchRef.requestUrl(...args));
  const createConnectorContext = (config, viewState, connectorId) => createObsidianConnectorContext(config, adapter, (...args) => fetchRef.requestUrl(...args), viewState, connectorId);
  const theme = {
    isDark: () => {
      const body = document.body;
      return body?.classList.contains("theme-dark") ?? false;
    },
    onChange: (cb) => {
      const observer = new MutationObserver(() => {
        cb(theme.isDark());
      });
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"]
      });
    },
    variables: {}
  };
  const platform = {
    storage,
    fetch: globalThis.fetch.bind(globalThis),
    connectorLoader,
    createConnectorContext,
    createLogger: (source) => createObsidianLogger(source),
    watcher: null,
    // File watching handled by Obsidian's vault events
    theme,
    setIcon: import_obsidian.setIcon,
    renderMarkdown: async (el, markdown) => {
      const component = new import_obsidian.Component();
      await import_obsidian.MarkdownRenderer.renderMarkdown(markdown, el, "", component);
    },
    openExternal: (url) => {
      let normalizedUrl = url.trim();
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = "https://" + normalizedUrl;
      }
      try {
        const electronRequire = window.require;
        if (electronRequire) {
          const { shell } = electronRequire("electron");
          shell.openExternal(normalizedUrl);
        } else {
          window.open(normalizedUrl, "_blank");
        }
      } catch {
        window.open(normalizedUrl, "_blank");
      }
    },
    pickFile: (accept) => {
      return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.style.display = "none";
        let resolved = false;
        input.onchange = async () => {
          resolved = true;
          const file = input.files?.[0];
          if (!file) {
            resolve(null);
            return;
          }
          const content = await file.text();
          resolve({ name: file.name, content });
        };
        const onFocus = () => {
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve(null);
            }
            window.removeEventListener("focus", onFocus);
          }, 300);
        };
        window.addEventListener("focus", onFocus);
        document.body.appendChild(input);
        input.click();
        setTimeout(() => {
          input.remove();
        }, 1e3);
      });
    }
  };
  platform._fetchRef = fetchRef;
  return platform;
}
function bindObsidianFetch(platform, requestUrl2) {
  const fetchRef = platform._fetchRef;
  if (fetchRef) {
    fetchRef.requestUrl = requestUrl2;
  }
}

// src/settings.ts
var import_obsidian2 = require("obsidian");
var DEFAULT_SETTINGS = {
  holidayConfig: {
    weekendsEnabled: true,
    holidaysEnabled: true,
    holidayDates: [],
    makeupWorkdays: []
  },
  logSettings: { ...DEFAULT_LOG_SETTINGS }
};
var pluginSettings = { ...DEFAULT_SETTINGS };
function getSettings() {
  return pluginSettings;
}
async function saveSettings(plugin, update) {
  pluginSettings = { ...pluginSettings, ...update };
  if (update.logSettings) {
    updateLogSettings(update.logSettings);
  }
  await plugin.saveData(pluginSettings);
}
async function migrateHolidayConfig(plugin, vault) {
  const settingsDir = "obsidian-gantt-data/settings";
  try {
    const listResult = await vault.adapter.list(settingsDir);
    const files = listResult?.files ?? [];
    const merged = {
      weekendsEnabled: true,
      holidaysEnabled: true,
      holidayDates: [],
      makeupWorkdays: []
    };
    let found = false;
    for (const filePath of files) {
      try {
        const exists = await vault.adapter.exists(filePath);
        if (!exists)
          continue;
        const raw = await vault.adapter.read(filePath);
        const data = JSON.parse(raw);
        if (!data.holidayConfig)
          continue;
        found = true;
        const hc = data.holidayConfig;
        if (hc.holidayDates) {
          for (const d4 of hc.holidayDates) {
            if (!merged.holidayDates.includes(d4))
              merged.holidayDates.push(d4);
          }
        }
        if (hc.makeupWorkdays) {
          for (const d4 of hc.makeupWorkdays) {
            if (!merged.makeupWorkdays.includes(d4))
              merged.makeupWorkdays.push(d4);
          }
        }
        if (hc.weekendsEnabled !== void 0 && found) {
          merged.weekendsEnabled = hc.weekendsEnabled;
        }
        if (hc.holidaysEnabled !== void 0) {
          merged.holidaysEnabled = hc.holidaysEnabled;
        }
        delete data.holidayConfig;
        await vault.adapter.write(filePath, JSON.stringify(data, null, 2));
      } catch {
      }
    }
    return found ? merged : null;
  } catch {
    return null;
  }
}
var TAB_DEFS = [
  { id: "holidays", label: "Holidays" },
  { id: "connectors", label: "Connectors" },
  { id: "logging", label: "Logging" }
];
function injectStyles(container) {
  if (container.querySelector("#gantt-settings-styles"))
    return;
  const style = document.createElement("style");
  style.id = "gantt-settings-styles";
  style.textContent = `
    .gantt-tab-bar { display: flex; gap: 0; border-bottom: 1px solid var(--background-modifier-border); margin-bottom: 20px; padding: 0 4px; }
    .gantt-tab-btn { padding: 8px 20px; font-size: 13px; font-weight: 500; border: none; border-bottom: 2px solid transparent; background: none; color: var(--text-muted); cursor: pointer; border-radius: 0; transition: color 0.15s, border-color 0.15s; }
    .gantt-tab-btn:hover { color: var(--text-normal); background: none; }
    .gantt-tab-btn.active { color: var(--text-accent); border-bottom-color: var(--text-accent); }
    .gantt-tab-content { display: none; }
    .gantt-tab-content.active { display: block; }
    .gantt-date-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 12px 0; }
    .gantt-date-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; font-size: 12px; border-radius: 12px; background: var(--background-modifier-hover); border: 1px solid var(--background-modifier-border); }
    .gantt-date-chip .gantt-chip-remove { cursor: pointer; opacity: 0.5; font-size: 14px; line-height: 1; padding: 0 2px; }
    .gantt-date-chip .gantt-chip-remove:hover { opacity: 1; color: var(--text-error); }
    .gantt-date-chip.holiday { border-color: var(--text-error); background: rgba(var(--color-red-rgb), 0.08); }
    .gantt-date-chip.makeup { border-color: var(--text-accent); background: rgba(var(--color-blue-rgb), 0.08); }
    .gantt-connector-card { padding: 10px 12px; margin-bottom: 8px; border: 1px solid var(--background-modifier-border); border-radius: 6px; background: var(--background-secondary); }
    .gantt-connector-card .gantt-connector-header { display: flex; align-items: center; gap: 10px; }
    .gantt-connector-card .gantt-connector-name { font-weight: 600; font-size: 13px; flex: 1; }
    .gantt-connector-card .gantt-connector-meta { font-size: 11px; color: var(--text-muted); }
    .gantt-connector-card .gantt-connector-actions { display: flex; gap: 6px; }
    .gantt-inline-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .gantt-inline-row label { font-size: 12px; color: var(--text-muted); min-width: 80px; white-space: nowrap; }
    .gantt-inline-row input[type="text"], .gantt-inline-row input[type="number"] { flex: 1; padding: 4px 8px; font-size: 12px; border: 1px solid var(--background-modifier-border); border-radius: 4px; background: var(--background-primary); color: var(--text-normal); }
    .gantt-inline-row textarea { width: 100%; font-family: var(--font-monospace); font-size: 12px; border: 1px solid var(--background-modifier-border); border-radius: 4px; background: var(--background-primary); color: var(--text-normal); resize: vertical; }
    .gantt-section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-faint); margin: 16px 0 6px 0; letter-spacing: 0.5px; }
    .gantt-empty-hint { font-size: 12px; color: var(--text-faint); font-style: italic; }
    .gantt-view-selector { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
    .gantt-view-selector label { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
    .gantt-view-selector select { flex: 1; padding: 4px 8px; font-size: 12px; border: 1px solid var(--background-modifier-border); border-radius: 4px; background: var(--background-primary); color: var(--text-normal); }
    .gantt-toggle-icon { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 3px; border: 1px solid var(--background-modifier-border); cursor: pointer; font-size: 14px; line-height: 1; flex-shrink: 0; }
    .gantt-toggle-icon.on { background: var(--text-accent); color: var(--text-on-accent); border-color: var(--text-accent); }
    .gantt-toggle-icon.off { background: transparent; color: transparent; }
  `;
  container.appendChild(style);
}
var GanttSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.activeTab = "holidays";
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    injectStyles(containerEl);
    containerEl.createEl("h2", { text: "Gantt Chart" });
    const tabBar = containerEl.createDiv("gantt-tab-bar");
    const contentArea = containerEl.createDiv();
    for (const tab of TAB_DEFS) {
      const btn = tabBar.createEl("button", {
        text: tab.label,
        cls: `gantt-tab-btn${tab.id === this.activeTab ? " active" : ""}`
      });
      btn.onclick = () => {
        this.activeTab = tab.id;
        this.display();
      };
      const panel = contentArea.createDiv(
        `gantt-tab-content${tab.id === this.activeTab ? " active" : ""}`
      );
      switch (tab.id) {
        case "holidays":
          this.renderHolidaysTab(panel);
          break;
        case "connectors":
          this.renderConnectorsTab(panel);
          break;
        case "logging":
          this.renderLoggingTab(panel);
          break;
      }
    }
  }
  // ═══════════════════════════════════════════════════════════
  // Holidays Tab
  // ═══════════════════════════════════════════════════════════
  renderHolidaysTab(el) {
    const hc = pluginSettings.holidayConfig;
    new import_obsidian2.Setting(el).setName("Weekend shading").setDesc("Mark Sat/Sun as non-working").addToggle((t4) => t4.setValue(hc.weekendsEnabled).onChange(async (v5) => {
      hc.weekendsEnabled = v5;
      await saveSettings(this.plugin, { holidayConfig: hc });
    }));
    new import_obsidian2.Setting(el).setName("Holiday markers").setDesc("Show \u4F11/\u73ED indicators on holiday dates").addToggle((t4) => t4.setValue(hc.holidaysEnabled).onChange(async (v5) => {
      hc.holidaysEnabled = v5;
      await saveSettings(this.plugin, { holidayConfig: hc });
    }));
    el.createEl("div", { cls: "gantt-section-label", text: "Holiday Dates (\u4F11)" });
    const holidayChips = el.createDiv("gantt-date-chips");
    if (hc.holidayDates.length === 0) {
      holidayChips.createEl("span", { cls: "gantt-empty-hint", text: "No holiday dates" });
    } else {
      for (const date of [...hc.holidayDates].sort()) {
        const chip = holidayChips.createDiv("gantt-date-chip holiday");
        chip.createEl("span", { text: "\u4F11" });
        chip.createEl("span", { text: date });
        const rm = chip.createEl("span", { cls: "gantt-chip-remove", text: "\xD7" });
        rm.onclick = async () => {
          const idx = hc.holidayDates.indexOf(date);
          if (idx >= 0)
            hc.holidayDates.splice(idx, 1);
          await saveSettings(this.plugin, { holidayConfig: hc });
          this.display();
        };
      }
    }
    el.createEl("div", { cls: "gantt-section-label", text: "Makeup Workdays (\u73ED)" });
    const makeupChips = el.createDiv("gantt-date-chips");
    if (hc.makeupWorkdays.length === 0) {
      makeupChips.createEl("span", { cls: "gantt-empty-hint", text: "No makeup workdays" });
    } else {
      for (const date of [...hc.makeupWorkdays].sort()) {
        const chip = makeupChips.createDiv("gantt-date-chip makeup");
        chip.createEl("span", { text: "\u73ED" });
        chip.createEl("span", { text: date });
        const rm = chip.createEl("span", { cls: "gantt-chip-remove", text: "\xD7" });
        rm.onclick = async () => {
          const idx = hc.makeupWorkdays.indexOf(date);
          if (idx >= 0)
            hc.makeupWorkdays.splice(idx, 1);
          await saveSettings(this.plugin, { holidayConfig: hc });
          this.display();
        };
      }
    }
    el.createEl("div", { cls: "gantt-section-label", text: "Import from Calendar" });
    const fileRow = el.createDiv("gantt-inline-row");
    fileRow.createEl("label", { text: ".ics file" });
    const fileBtn = fileRow.createEl("button", { text: "Choose file..." });
    fileBtn.onclick = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".ics,.ical,.icalendar,text/calendar";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file)
          return;
        const text = await file.text();
        this.mergeICS(text);
      };
      input.click();
    };
    const urlRow = el.createDiv("gantt-inline-row");
    urlRow.createEl("label", { text: "URL" });
    const urlInput = urlRow.createEl("input", {
      type: "text",
      attr: { placeholder: "https://example.com/holidays.ics" }
    });
    const fetchBtn = urlRow.createEl("button", { text: "Fetch" });
    fetchBtn.onclick = async () => {
      const url = urlInput.value.trim();
      if (!url)
        return;
      try {
        const resp = await fetch(url);
        const text = await resp.text();
        await this.mergeICS(text);
      } catch {
      }
    };
  }
  async mergeICS(text) {
    const hc = pluginSettings.holidayConfig;
    const events = parseICS(text);
    const classified = classifyICSEvents(events);
    for (const d4 of classified.holidayDates) {
      if (!hc.holidayDates.includes(d4))
        hc.holidayDates.push(d4);
    }
    for (const d4 of classified.makeupWorkdays) {
      if (!hc.makeupWorkdays.includes(d4))
        hc.makeupWorkdays.push(d4);
    }
    await saveSettings(this.plugin, { holidayConfig: hc });
    this.display();
  }
  // ═══════════════════════════════════════════════════════════
  // Connectors Tab
  // ═══════════════════════════════════════════════════════════
  async renderConnectorsTab(el) {
    const vault = this.app.vault;
    const adapter = vault.adapter;
    let viewFiles = [];
    let viewMap = /* @__PURE__ */ new Map();
    try {
      const listResult = await adapter.list("obsidian-gantt-data/views");
      viewFiles = (listResult?.files ?? []).map((f5) => {
        const parts = f5.split("/");
        return parts[parts.length - 1];
      }).filter((f5) => f5.endsWith(".json"));
    } catch {
    }
    for (const f5 of viewFiles) {
      try {
        const raw = await adapter.read(`obsidian-gantt-data/views/${f5}`);
        if (raw) {
          const v5 = JSON.parse(raw);
          viewMap.set(v5.id, { id: v5.id, name: v5.name ?? v5.id, connectors: v5.connectors ?? [] });
        }
      } catch {
      }
    }
    if (viewMap.size === 0) {
      el.createEl("p", { cls: "gantt-empty-hint", text: "No views found. Open a Gantt chart view first." });
      return;
    }
    let selectedViewId = viewMap.values().next().value?.id ?? "";
    const selectorRow = el.createDiv("gantt-view-selector");
    selectorRow.createEl("label", { text: "Configure connectors for:" });
    const selectEl = selectorRow.createEl("select");
    for (const [id, v5] of viewMap) {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = v5.name;
      selectEl.appendChild(opt);
    }
    const connectorList = el.createDiv();
    const renderList = () => this.renderConnectorList(connectorList, selectedViewId, viewMap);
    selectEl.onchange = () => {
      selectedViewId = selectEl.value;
      renderList();
    };
    renderList();
  }
  async renderConnectorList(el, viewId, viewMap) {
    el.empty();
    const vault = this.app.vault;
    const adapter = vault.adapter;
    const activeConnectors = viewMap.get(viewId)?.connectors ?? [];
    el.createEl("div", { cls: "gantt-section-label", text: "Available Connectors" });
    let jsFiles = [];
    try {
      const listResult = await adapter.list("connectors");
      const allFiles = listResult?.files ?? [];
      jsFiles = allFiles.filter((f5) => f5.endsWith(".js"));
    } catch {
    }
    if (jsFiles.length === 0) {
      el.createEl("p", { cls: "gantt-empty-hint", text: "Place .js connector scripts in the connectors/ directory at your vault root." });
      return;
    }
    for (const scriptPath of jsFiles) {
      const fileName = scriptPath.split("/").pop() ?? scriptPath;
      const connectorId = fileName.replace(/\.js$/, "");
      const isActive = activeConnectors.includes(connectorId);
      let meta = { name: connectorId, refreshInterval: 0, config: {} };
      try {
        const raw = await adapter.read(`obsidian-gantt-data/connectors/${connectorId}.json`);
        if (raw) {
          const cfg = JSON.parse(raw);
          meta = { name: cfg.name ?? connectorId, refreshInterval: cfg.refreshInterval ?? 0, config: cfg.config ?? {} };
        }
      } catch {
      }
      const card = el.createDiv("gantt-connector-card");
      const header = card.createDiv("gantt-connector-header");
      const toggle = header.createDiv("gantt-toggle-icon");
      toggle.className = isActive ? "gantt-toggle-icon on" : "gantt-toggle-icon off";
      if (isActive)
        toggle.textContent = "\u2713";
      toggle.title = isActive ? "Click to disable" : "Click to enable";
      toggle.onclick = async () => {
        const view = viewMap.get(viewId);
        if (!view)
          return;
        const newActive = !view.connectors.includes(connectorId);
        if (newActive) {
          view.connectors.push(connectorId);
        } else {
          view.connectors = view.connectors.filter((c4) => c4 !== connectorId);
        }
        const viewRaw = await adapter.read(`obsidian-gantt-data/views/${viewId}.json`);
        if (viewRaw) {
          const vd = JSON.parse(viewRaw);
          vd.connectors = view.connectors;
          await adapter.write(`obsidian-gantt-data/views/${viewId}.json`, JSON.stringify(vd, null, 2));
        }
        await this.renderConnectorList(el, viewId, viewMap);
      };
      header.createEl("span", { cls: "gantt-connector-name", text: meta.name });
      header.createEl("span", { cls: "gantt-connector-meta", text: scriptPath });
      const actions = header.createDiv("gantt-connector-actions");
      const editBtn = actions.createEl("button", { text: "Configure" });
      editBtn.style.fontSize = "11px";
      editBtn.style.padding = "2px 8px";
      const editForm = card.createDiv();
      editForm.style.display = "none";
      editForm.style.marginTop = "10px";
      editForm.style.padding = "10px";
      editForm.style.borderTop = "1px solid var(--background-modifier-border)";
      editBtn.onclick = () => {
        const visible = editForm.style.display === "block";
        editForm.style.display = visible ? "none" : "block";
        if (!visible) {
          this.renderConnectorEditForm(editForm, connectorId, meta.name, scriptPath, meta.refreshInterval, meta.config);
        }
      };
    }
  }
  renderConnectorEditForm(container, connectorId, currentName, currentScript, currentInterval, currentConfig) {
    container.empty();
    let editName = currentName;
    let editScript = currentScript;
    let editInterval = String(currentInterval);
    let editConfig = JSON.stringify(currentConfig, null, 2);
    let configError = "";
    const row1 = container.createDiv("gantt-inline-row");
    row1.createEl("label", { text: "Name" });
    const nameInput = row1.createEl("input", { type: "text" });
    nameInput.value = editName;
    nameInput.oninput = () => {
      editName = nameInput.value;
    };
    const row2 = container.createDiv("gantt-inline-row");
    row2.createEl("label", { text: "Script" });
    const scriptInput = row2.createEl("input", { type: "text" });
    scriptInput.value = editScript;
    scriptInput.oninput = () => {
      editScript = scriptInput.value;
    };
    const row3 = container.createDiv("gantt-inline-row");
    row3.createEl("label", { text: "Refresh (s)" });
    const intervalInput = row3.createEl("input", { type: "number", attr: { min: "0", placeholder: "0" } });
    intervalInput.value = editInterval;
    intervalInput.oninput = () => {
      editInterval = intervalInput.value;
    };
    row3.createEl("span", { cls: "gantt-connector-meta", text: "0 = manual only" });
    const configLabel = container.createEl("div", { cls: "gantt-section-label", text: "Config (JSON)" });
    configLabel.style.marginTop = "8px";
    const textarea = container.createEl("textarea", { attr: { rows: "5" } });
    textarea.className = "gantt-inline-row";
    textarea.style.width = "100%";
    textarea.style.fontFamily = "var(--font-monospace)";
    textarea.style.fontSize = "12px";
    textarea.style.padding = "6px";
    textarea.style.border = "1px solid var(--background-modifier-border)";
    textarea.style.borderRadius = "4px";
    textarea.style.background = "var(--background-primary)";
    textarea.style.color = "var(--text-normal)";
    textarea.style.resize = "vertical";
    textarea.value = editConfig;
    textarea.oninput = () => {
      editConfig = textarea.value;
      try {
        JSON.parse(editConfig);
        configError = "";
        textarea.style.borderColor = "";
      } catch {
        configError = "Invalid JSON";
        textarea.style.borderColor = "var(--text-error)";
      }
    };
    if (configError) {
      const err = container.createEl("p");
      err.style.color = "var(--text-error)";
      err.style.fontSize = "11px";
      err.textContent = configError;
    }
    const btnRow = container.createDiv("gantt-inline-row");
    btnRow.style.marginTop = "10px";
    const saveBtn = btnRow.createEl("button", { text: "Save" });
    saveBtn.className = "mod-cta";
    saveBtn.style.fontSize = "12px";
    saveBtn.onclick = async () => {
      if (configError)
        return;
      const configData = editConfig.trim() ? JSON.parse(editConfig) : {};
      const interval = parseInt(editInterval, 10);
      const out = {
        id: connectorId,
        name: editName || connectorId,
        script: editScript,
        refreshInterval: isNaN(interval) ? 0 : interval,
        config: configData
      };
      const vault = this.app.vault;
      await vault.adapter.write(
        `obsidian-gantt-data/connectors/${connectorId}.json`,
        JSON.stringify(out, null, 2)
      );
      this.display();
    };
    const cancelBtn = btnRow.createEl("button", { text: "Cancel" });
    cancelBtn.style.fontSize = "12px";
    cancelBtn.onclick = () => {
      this.display();
    };
  }
  // ═══════════════════════════════════════════════════════════
  // Logging Tab
  // ═══════════════════════════════════════════════════════════
  renderLoggingTab(el) {
    const ls = pluginSettings.logSettings;
    new import_obsidian2.Setting(el).setName("Enable logging").setDesc("Record communication data between Gantt chart and connectors to daily log files").addToggle((t4) => t4.setValue(ls.enabled).onChange(async (v5) => {
      ls.enabled = v5;
      await saveSettings(this.plugin, { logSettings: ls });
    }));
    new import_obsidian2.Setting(el).setName("Minimum level").setDesc("Debug captures raw data samples; Error only records failures").addDropdown((d4) => d4.addOption("debug", "Debug \u2014 all details").addOption("info", "Info \u2014 key steps").addOption("warn", "Warn \u2014 issues only").addOption("error", "Error \u2014 failures only").setValue(ls.level).onChange(async (v5) => {
      ls.level = v5;
      await saveSettings(this.plugin, { logSettings: ls });
    }));
    new import_obsidian2.Setting(el).setName("Retention").setDesc("Days to keep log files before auto-deletion").addText((t4) => t4.setValue(String(ls.retentionDays)).setPlaceholder("30").onChange(async (v5) => {
      const n3 = parseInt(v5, 10);
      if (!isNaN(n3) && n3 > 0) {
        ls.retentionDays = n3;
        await saveSettings(this.plugin, { logSettings: ls });
      }
    }));
    el.lastChild?.querySelector("input")?.setAttribute("type", "number");
    el.lastChild?.querySelector("input")?.setAttribute("style", "width: 70px;");
    el.createEl("p", {
      cls: "gantt-empty-hint",
      text: "Log files: obsidian-gantt-data/logs/gantt-YYYY-MM-DD.json"
    });
  }
};

// src/view.tsx
var VIEW_TYPE = "obsidian-gantt-view";
var GanttView = class extends import_obsidian3.ItemView {
  constructor(leaf) {
    super(leaf);
    this.store = null;
    this.platform = null;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "Gantt Chart";
  }
  getIcon() {
    return "bar-chart-2";
  }
  async onOpen() {
    this.platform = createObsidianPlatform(this.app);
    bindObsidianFetch(this.platform, import_obsidian3.requestUrl);
    this.store = createGanttStore(this.platform);
    this.store.setHolidayConfig(getSettings().holidayConfig);
    const vault = this.app.vault;
    const BASE2 = "obsidian-gantt-data";
    for (const sub of ["tags", "settings"]) {
      const dir = `${BASE2}/${sub}`;
      try {
        const exists = await vault.adapter.exists(dir);
        if (!exists) {
          await vault.createFolder(dir);
        }
      } catch {
      }
    }
    const root = this.contentEl.createDiv("gantt-root");
    root.style.width = "100%";
    root.style.height = "100%";
    R(k(GanttChart, { store: this.store }), root);
    await this.seedIfEmpty();
  }
  async seedIfEmpty() {
    if (!this.platform || !this.store)
      return;
    try {
      const viewFiles = await this.platform.storage.list("views");
      if (viewFiles.length > 0) {
        const viewId = viewFiles[0].replace(/\.json$/, "");
        await this.store.loadView(viewId);
        return;
      }
      const persons = [
        { id: "alice", name: "Alice Chen", position: "Engineer" },
        { id: "bob", name: "Bob Martinez", position: "Designer" },
        { id: "carol", name: "Carol Wu", position: "Manager" }
      ];
      const projects = [
        { id: "proj-api", name: "API Redesign", color: "#4A90D9", description: "Redesign the core API endpoints for v2", requester: "Platform Team" },
        { id: "proj-mobile", name: "Mobile App v2", color: "#7B61F8" },
        { id: "proj-infra", name: "Infrastructure", color: "#98C379" },
        { id: "proj-ux", name: "UX Overhaul", color: "#E06C75" }
      ];
      const tasks = [
        { id: "t1", title: "Design new endpoints", startDate: "2026-06-01", endDate: "2026-06-08", progress: 1, personId: "alice", projectId: "proj-api" },
        { id: "t2", title: "Implement auth middleware", startDate: "2026-06-03", endDate: "2026-06-12", progress: 0.6, personId: "bob", projectId: "proj-api" },
        { id: "t3", title: "Write API tests", startDate: "2026-06-10", endDate: "2026-06-18", progress: 0.1, personId: "carol", projectId: "proj-api" },
        { id: "t4", title: "Deploy API to staging", startDate: "2026-06-19", endDate: "2026-06-22", progress: 0, personId: "alice", projectId: "proj-api" },
        { id: "t5", title: "Home screen redesign", startDate: "2026-05-28", endDate: "2026-06-10", progress: 0.8, personId: "carol", projectId: "proj-mobile" },
        { id: "t6", title: "Push notification system", startDate: "2026-06-05", endDate: "2026-06-20", progress: 0.3, personId: "bob", projectId: "proj-mobile" },
        { id: "t7", title: "Offline sync engine", startDate: "2026-06-15", endDate: "2026-07-05", progress: 0, personId: "bob", projectId: "proj-mobile" },
        { id: "t8", title: "Set up CI/CD pipeline", startDate: "2026-05-25", endDate: "2026-06-02", progress: 0.95, personId: "alice", projectId: "proj-infra" },
        { id: "t9", title: "Database migration plan", startDate: "2026-06-08", endDate: "2026-06-16", progress: 0.4, personId: "carol", projectId: "proj-infra" },
        { id: "t10", title: "User research sessions", startDate: "2026-06-01", endDate: "2026-06-07", progress: 0.5, personId: "alice", projectId: "proj-ux" },
        { id: "t11", title: "Wireframe review", startDate: "2026-06-01", endDate: "2026-06-05", progress: 0.7, personId: "alice", projectId: "proj-ux" }
      ];
      const cache = {
        connectorId: "demo",
        lastFetch: (/* @__PURE__ */ new Date()).toISOString(),
        lastError: null,
        tasks,
        persons,
        projects
      };
      const view = {
        id: "demo",
        name: "Demo View",
        connectors: ["demo"],
        display: {
          defaultGroupBy: "person",
          visibleColumns: ["progress", "person"]
        }
      };
      const edits = {
        viewId: "demo",
        overrides: {},
        order: [],
        hidden: [],
        localTasks: []
      };
      await this.platform.storage.write("views/demo.json", JSON.stringify(view, null, 2));
      await this.platform.storage.write("cache/demo.json", JSON.stringify(cache, null, 2));
      await this.platform.storage.write("edits/demo.json", JSON.stringify(edits, null, 2));
      await this.store.loadView("demo");
    } catch (e4) {
      console.error("[Gantt] Seed failed:", e4);
    }
  }
  async onClose() {
  }
};

// src/main.ts
var GanttPlugin = class extends import_obsidian4.Plugin {
  async onload() {
    const data = await this.loadData();
    const saved = data && typeof data === "object" ? data : {};
    const settings = { ...DEFAULT_SETTINGS, ...saved };
    await saveSettings(this, settings);
    const vault = this.app.vault;
    if (!data?.holidayConfig) {
      const migrated = await migrateHolidayConfig(this, vault);
      if (migrated) {
        await saveSettings(this, { holidayConfig: migrated });
      }
    }
    const logStorage = createObsidianStorage(vault.adapter);
    await initLogStore(logStorage, getSettings().logSettings);
    this.addSettingTab(new GanttSettingTab(this.app, this));
    this.registerView(
      VIEW_TYPE,
      (leaf) => new GanttView(leaf)
    );
    this.addRibbonIcon("bar-chart-2", "Open Gantt Chart", () => {
      this.activateView();
    });
    this.addCommand({
      id: "open-gantt-chart",
      name: "Open Gantt Chart",
      callback: () => {
        this.activateView();
      }
    });
  }
  async onunload() {
    await destroyLogStore();
  }
  async activateView() {
    const { workspace } = this.app;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE);
    if (leaves.length > 0) {
      workspace.revealLeaf(leaves[0]);
      return;
    }
    await workspace.getLeaf(false)?.setViewState({
      type: VIEW_TYPE,
      active: true
    });
  }
};
//# sourceMappingURL=main.js.map
