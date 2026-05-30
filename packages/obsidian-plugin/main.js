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
  default: () => GanttPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

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
  "tags"
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
  return {
    id: task.id,
    title: get("title", task.title),
    startDate: get("startDate", task.startDate ?? null),
    endDate: get("endDate", task.endDate ?? null),
    progress: get("progress", task.progress ?? 0),
    status: get("status", task.status ?? "pending"),
    personId: get("personId", task.personId ?? null),
    projectId: get("projectId", task.projectId ?? null),
    parentId: get("parentId", task.parentId ?? null),
    dependencies: get("dependencies", task.dependencies ?? []),
    tags: get("tags", task.tags ?? []),
    url: fieldWithSource(task.url ?? null, "upstream"),
    // url is not user-editable
    metadata: task.metadata ?? {},
    connectorId,
    upstreamId: task.id,
    upstreamDeleted: false
  };
}
function localToLocalTask(task) {
  return {
    id: task.id,
    title: fieldWithSource(task.title, "manual"),
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
  const [y4, m4, d4] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y4, m4 - 1, d4, 12, 0, 0));
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
  return Math.round((db.getTime() - da.getTime()) / 864e5);
}
function addDays(date, days) {
  const d4 = parseDate(date);
  const result = new Date(d4.getTime() + days * 864e5);
  return formatDate(result);
}
function todayString() {
  return formatDate(/* @__PURE__ */ new Date());
}
function computeTimelineRange(dates, paddingDays = 7) {
  const validDates = dates.filter((d4) => !!d4);
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
    startDate: addDays(minDate, -paddingDays),
    endDate: addDays(maxDate, paddingDays)
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
var SCROLL_GUARD_DURATION = 100;
function safeName(name) {
  return name.replace(/[\\/:*?"<>|]/g, "_");
}
function createGanttStore(platform) {
  const caches = y3([]);
  const edits = y3(null);
  const views = y3([]);
  const currentViewId = y3(null);
  const selectedEntity = y3(null);
  const sharedScrollLeft = y3(0);
  const personScrollTop = y3(0);
  const projectScrollTop = y3(0);
  const personSortMode = y3("name");
  const isLoading = y3(false);
  const error = y3(null);
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
        personMap.set(p5.id, p5);
      }
    }
    return [...personMap.values()];
  });
  const projects = g2(() => {
    const projectMap = /* @__PURE__ */ new Map();
    for (const cache of caches.value) {
      for (const p5 of cache.projects) {
        projectMap.set(p5.id, p5);
      }
    }
    return [...projectMap.values()];
  });
  const mergedProjects = g2(() => {
    const overrides = edits.value?.projectOverrides ?? {};
    const deletedProjects = new Set(edits.value?.deletedProjects ?? []);
    return projects.value.filter((p5) => !deletedProjects.has(p5.id)).map((p5) => {
      const override = overrides[p5.id];
      if (!override)
        return p5;
      return { ...p5, ...override };
    });
  });
  const personGroups = g2(() => {
    const map = /* @__PURE__ */ new Map();
    const personMap = new Map(persons.value.map((p5) => [p5.id, p5]));
    for (const t4 of mergedTasks.value) {
      const key = t4.personId.value || "__unassigned__";
      if (!map.has(key))
        map.set(key, []);
      map.get(key).push(t4);
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
    groups.sort((a4, b3) => {
      if (a4.personId === "__unassigned__")
        return 1;
      if (b3.personId === "__unassigned__")
        return -1;
      if (mode === "position") {
        const pa = a4.position;
        const pb = b3.position;
        if (pa && pb)
          return pa.localeCompare(pb);
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
    const projectInfoMap = new Map(projects.value.map((p5) => [p5.id, p5]));
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
        projectName: info?.name ?? projectId,
        color: info?.color,
        tasks
      });
    }
    groups.sort((a4, b3) => a4.projectName.localeCompare(b3.projectName));
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
    } catch (e4) {
      error.value = e4 instanceof Error ? e4.message : String(e4);
    } finally {
      isLoading.value = false;
    }
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
        console.log(`[Gantt] Auto-created connector config: ${configPath}`);
      }
      const scriptPath = connConfig.script || `connectors/${safeName(connectorId)}.js`;
      const mod = await platform.connectorLoader.load(scriptPath);
      const ctx = platform.createConnectorContext(connConfig);
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
    } catch (e4) {
      const msg = e4 instanceof Error ? e4.message : String(e4);
      console.error(`[Gantt] Failed to refresh connector "${connectorId}":`, msg);
      error.value = msg;
    } finally {
      isLoading.value = false;
    }
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
  }
  async function setProjectStatus(projectId, status) {
    await persistProjectEdit(projectId, "status", status);
  }
  async function pushChanges() {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId)
      return [];
    const results = [];
    const payload = {
      tasks: [],
      projects: [],
      deletedTaskIds: currentEdits.deletedTasks ?? [],
      deletedProjectIds: currentEdits.deletedProjects ?? []
    };
    const pushedTaskIds = /* @__PURE__ */ new Set();
    const pushedProjectIds = /* @__PURE__ */ new Set();
    const allMerged = mergeAll(caches.value, currentEdits);
    const overrideIds = new Set(Object.keys(currentEdits.overrides));
    for (const task of allMerged) {
      if (task.connectorId !== null && overrideIds.has(task.id)) {
        payload.tasks.push({
          id: task.id,
          title: task.title.value,
          startDate: task.startDate.value ?? void 0,
          endDate: task.endDate.value ?? void 0,
          progress: task.progress.value,
          status: task.status.value,
          personId: task.personId.value ?? void 0,
          projectId: task.projectId.value ?? void 0,
          dependencies: task.dependencies.value,
          tags: task.tags.value,
          url: task.url.value ?? void 0
        });
        pushedTaskIds.add(task.id);
      }
    }
    for (const lt of currentEdits.localTasks) {
      payload.tasks.push(lt);
      pushedTaskIds.add(lt.id);
    }
    if (currentEdits.projectOverrides) {
      for (const [projectId, overrides] of Object.entries(currentEdits.projectOverrides)) {
        const project = caches.value.flatMap((c4) => c4.projects).find((p5) => p5.id === projectId);
        if (project) {
          payload.projects.push({ ...project, ...overrides });
        }
        pushedProjectIds.add(projectId);
      }
    }
    for (const id of payload.deletedTaskIds)
      pushedTaskIds.add(id);
    for (const id of payload.deletedProjectIds)
      pushedProjectIds.add(id);
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
        const ctx = platform.createConnectorContext(connConfig);
        const result = await mod.push(payload, ctx);
        results.push({ connectorId: cache.connectorId, success: result.success, error: result.error });
      } catch (e4) {
        results.push({ connectorId: cache.connectorId, success: false, error: e4 instanceof Error ? e4.message : String(e4) });
      }
    }
    const anySuccess = results.some((r4) => r4.success);
    if (anySuccess) {
      const newOverrides = { ...currentEdits.overrides };
      for (const id of pushedTaskIds)
        delete newOverrides[id];
      const newProjectOverrides = { ...currentEdits.projectOverrides ?? {} };
      for (const id of pushedProjectIds)
        delete newProjectOverrides[id];
      const cleared = {
        ...currentEdits,
        overrides: newOverrides,
        // Remove pushed local tasks (NOT keep — filter was inverted)
        localTasks: currentEdits.localTasks.filter(
          (lt) => !pushedTaskIds.has(lt.id)
        ),
        projectOverrides: Object.keys(newProjectOverrides).length > 0 ? newProjectOverrides : void 0,
        deletedTasks: (currentEdits.deletedTasks ?? []).filter((id) => !pushedTaskIds.has(id)),
        deletedProjects: (currentEdits.deletedProjects ?? []).filter((id) => !pushedProjectIds.has(id))
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
    sharedScrollLeft,
    personScrollTop,
    projectScrollTop,
    personSortMode,
    timelineRange,
    conflicts,
    pendingChanges,
    isLoading,
    error,
    loadView,
    refreshConnector,
    persistEdit,
    resetField,
    createLocalTask,
    persistProjectEdit,
    selectEntity,
    deleteTask,
    deleteProject,
    setTaskStatus,
    setProjectStatus,
    pushChanges
  };
}
function TimelineGrid(props) {
  const { dayWidth, scrollLeft, viewportWidth, bufferPx, bodyOriginPx } = props;
  const dayPx = dayWidth;
  const weekPx = dayWidth * 7;
  const absLeft = bodyOriginPx + scrollLeft;
  const absAlignedLeft = Math.floor((absLeft - bufferPx) / dayPx) * dayPx;
  const left = absAlignedLeft - bodyOriginPx;
  const width = viewportWidth + 2 * bufferPx;
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
        background: `repeating-linear-gradient(
          to right,
          transparent 0,
          transparent ${dayPx - 1}px,
          var(--gantt-grid-line-day, #e0e0e0) ${dayPx - 1}px,
          var(--gantt-grid-line-day, #e0e0e0) ${dayPx}px
        ), repeating-linear-gradient(
          to right,
          transparent 0,
          transparent ${weekPx - 1}px,
          var(--gantt-grid-line-week, #c0c0c0) ${weekPx - 1}px,
          var(--gantt-grid-line-week, #c0c0c0) ${weekPx}px
        )`,
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
  const { dayWidth, scrollLeft, viewportWidth, bufferPx, bodyOriginPx } = props;
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
                    color: "var(--text-muted, #999)"
                  },
                  children: getDayLabel(date)
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
function TaskBar(props) {
  const { data, groupStartY, laneIndex, rowHeight, laneOffset, paneType } = props;
  const barHeight = rowHeight * 0.6;
  const barTop = groupStartY + (rowHeight - barHeight) / 2 + laneIndex * laneOffset;
  const barWidth = Math.max(data.width, 4);
  const showHandles = barWidth >= 12;
  return /* @__PURE__ */ u4(
    "div",
    {
      class: `gantt-task-bar ${data.isHighlighted ? "highlighted" : ""} ${data.isDimmed ? "dimmed" : ""}`,
      style: {
        position: "absolute",
        left: `${data.left}px`,
        top: `${barTop}px`,
        width: `${barWidth}px`,
        height: `${barHeight}px`,
        background: data.color,
        borderRadius: "4px",
        opacity: data.isDimmed ? 0.3 : 1,
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        paddingLeft: "4px",
        fontSize: "11px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "var(--text-on-accent, #fff)",
        zIndex: 2 + props.laneIndex,
        boxShadow: data.isHighlighted ? "0 0 0 2px var(--gantt-highlight-border, #4A90D9)" : "none",
        transition: "opacity 0.15s, box-shadow 0.15s"
      },
      onPointerDown: (e4) => {
        const rect = e4.currentTarget.getBoundingClientRect();
        const relX = e4.clientX - rect.left;
        const edge = relX < 8 ? "left" : relX > rect.width - 8 ? "right" : "body";
        props.onPointerDown(e4, data.id, edge, paneType);
      },
      onClick: (e4) => {
        e4.stopPropagation();
        props.onClick(data.id);
      },
      title: `${data.title}`,
      children: [
        showHandles && /* @__PURE__ */ u4("span", { class: "gantt-bar-handle gantt-bar-handle-left" }),
        data.width > 40 ? data.title : "",
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
  const [y4, m4, d4] = s5.split("-").map(Number);
  return new Date(Date.UTC(y4, m4 - 1, d4, 12, 0, 0));
}
function formatDateStr(d4) {
  const y4 = d4.getUTCFullYear();
  const m4 = String(d4.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d4.getUTCDate()).padStart(2, "0");
  return `${y4}-${m4}-${day}`;
}
function daysBetweenDates(a4, b3) {
  const da = parseDate2(a4);
  const db = parseDate2(b3);
  return Math.round((db.getTime() - da.getTime()) / 864e5);
}
function addDaysToDate(date, days) {
  const d4 = parseDate2(date);
  const r4 = new Date(d4.getTime() + days * 864e5);
  return formatDateStr(r4);
}
function getDayLabel(date) {
  const d4 = parseDate2(date);
  return String(d4.getUTCDate());
}
function KeyDateMarker(props) {
  const size = 10;
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
        top: `${props.groupTopY + 3}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: bg,
        transform: "rotate(45deg)",
        zIndex: 3,
        pointerEvents: "auto",
        cursor: props.onPointerDown ? "ew-resize" : "help",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      children: props.icon && /* @__PURE__ */ u4("span", { style: {
        transform: "rotate(-45deg)",
        fontSize: "7px",
        color: "#fff",
        lineHeight: 1,
        fontWeight: "bold",
        pointerEvents: "none"
      }, children: props.icon })
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
  return dateToAbsolutePixel(date, DAY_WIDTH);
}
function pxToDate(px) {
  return absolutePixelToDate(px, DAY_WIDTH);
}
var dragState = y3(null);
function createDragHandler(store) {
  let undoStack = [];
  function onTaskPointerDown(e4, taskId, edge, paneType) {
    const task = store.mergedTasks.value.find((t4) => t4.id === taskId);
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
    const groups = paneType === "person" ? store.personGroups.value : store.projectGroups.value;
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
    const groups = store.projectGroups.value;
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
        const pg = store.personGroups.value;
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
      const project = store.mergedProjects.value.find((p5) => p5.id === projectId);
      if (!project)
        return;
      const keyDates = [...project.keyDates ?? []];
      keyDates[keyDateIndex] = { ...keyDates[keyDateIndex], date: newDate };
      const undo3 = async () => {
        await store.persistProjectEdit(projectId, "keyDates", keyDates.map(
          (kd, i5) => i5 === keyDateIndex ? { ...kd, date: origDate } : kd
        ));
      };
      await store.persistProjectEdit(projectId, "keyDates", keyDates);
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
        await store.persistEdit(taskId, "startDate", origStart);
      }
      if (origEnd !== newEnd) {
        await store.persistEdit(taskId, "endDate", origEnd);
      }
      if (origPersonId !== newPersonId) {
        await store.persistEdit(taskId, "personId", origPersonId ?? null);
      }
    };
    if (newStart !== origStart) {
      await store.persistEdit(taskId, "startDate", newStart);
    }
    if (newEnd !== origEnd) {
      await store.persistEdit(taskId, "endDate", newEnd);
    }
    if (newPersonId !== origPersonId) {
      await store.persistEdit(taskId, "personId", newPersonId ?? null);
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
    const personGroups = store.personGroups.value;
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
    store.createLocalTask(newTask);
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
var DAY_WIDTH2 = 30;
var ROW_HEIGHT2 = 40;
var LANE_OFFSET2 = 12;
var LEFT_PANEL_WIDTH = 180;
var RIGHT_PANEL_WIDTH = 220;
var GRID_BUFFER_PX = 600;
function dateToPx2(date) {
  return dateToAbsolutePixel(date, DAY_WIDTH2);
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
function TaskList(props) {
  const totalRowsHeight = props.rowHeights.reduce((a4, b3) => a4 + b3, 0);
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-task-list",
      style: {
        width: `${LEFT_PANEL_WIDTH}px`,
        minWidth: `${LEFT_PANEL_WIDTH}px`,
        overflow: "hidden",
        borderRight: "1px solid var(--gantt-grid-line-week, #c0c0c0)"
      },
      children: [
        /* @__PURE__ */ u4("div", { style: { height: "44px", borderBottom: "1px solid var(--gantt-grid-line-day, #e0e0e0)", display: "flex", alignItems: "center", paddingLeft: "8px", paddingRight: "8px" }, children: props.headerContent }),
        /* @__PURE__ */ u4(
          "div",
          {
            style: {
              height: `${totalRowsHeight}px`,
              transform: props.scrollTop ? `translateY(-${props.scrollTop}px)` : void 0
            },
            children: props.labels.map((label, i5) => {
              const isHighlighted = props.highlightedRowKeys?.has(label.key) ?? false;
              const isDimmed = props.dimmedRowKeys?.has(label.key) ?? false;
              const h4 = props.rowHeights[i5] ?? ROW_HEIGHT2;
              return /* @__PURE__ */ u4(
                "div",
                {
                  class: `gantt-task-list-row ${isHighlighted ? "highlighted" : ""} ${isDimmed ? "dimmed" : ""}`,
                  style: {
                    height: `${h4}px`,
                    borderBottom: "1px solid var(--gantt-grid-line-day, #e0e0e0)",
                    opacity: isDimmed ? 0.4 : 1,
                    background: isHighlighted ? "var(--gantt-row-highlight-bg, rgba(74, 144, 217, 0.08))" : "transparent",
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
                    /* @__PURE__ */ u4("span", { style: { overflow: "hidden", textOverflow: "ellipsis" }, title: label.tooltip, children: label.name })
                  ]
                },
                label.key
              );
            })
          }
        )
      ]
    }
  );
}
function Timeline(props) {
  const containerRef = A2(null);
  const { store, groups, scrollLeft, scrollTop } = props;
  const paneType = props.groupKeyField === "personId" ? "person" : "project";
  const viewportWidth = useSignal(800);
  const didInitialScroll = A2(false);
  y2(() => {
    const el = containerRef.current;
    if (!el)
      return;
    viewportWidth.value = el.clientWidth;
    const ro = new ResizeObserver(() => {
      viewportWidth.value = el.clientWidth;
    });
    ro.observe(el);
    if (!didInitialScroll.current) {
      didInitialScroll.current = true;
      const todayBodyPx = originToBody(dateToPx2(todayString()));
      const targetScroll = todayBodyPx - el.clientWidth / 2;
      requestAnimationFrame(() => {
        el.scrollLeft = targetScroll;
        props.onScroll(targetScroll, 0);
      });
    }
    return () => ro.disconnect();
  }, []);
  const TWO_YEARS_PX = 730 * DAY_WIDTH2;
  const bodyOriginPx = T2(() => {
    let minAbsPx = dateToPx2(todayString());
    for (const group of groups) {
      for (const task of group.tasks) {
        const startVal = task.startDate.value;
        const endVal = task.endDate.value;
        if (startVal) {
          const px = dateToPx2(startVal);
          if (px < minAbsPx)
            minAbsPx = px;
        }
        if (endVal) {
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
        if (startVal) {
          const px = dateToPx2(startVal);
          if (px > maxAbsPx)
            maxAbsPx = px;
        }
        if (endVal) {
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
  const taskBars = [];
  const groupLayout = [];
  const projectColorMap = /* @__PURE__ */ new Map();
  for (const p5 of store.projects.value) {
    projectColorMap.set(p5.id, p5.color ?? getDefaultColor(p5.id));
  }
  const DEFAULT_COLORS = ["#4A90D9", "#7B61F8", "#E06C75", "#61AFEF", "#98C379", "#E5C07B", "#C678DD", "#56B6C2"];
  function getDefaultColor(id) {
    let hash = 0;
    for (let i5 = 0; i5 < id.length; i5++)
      hash = (hash << 5) - hash + id.charCodeAt(i5);
    return DEFAULT_COLORS[Math.abs(hash) % DEFAULT_COLORS.length];
  }
  for (const group of groups) {
    const groupTasks = [];
    for (const task of group.tasks) {
      const startVal = task.startDate.value;
      if (!startVal)
        continue;
      const endVal = task.endDate.value ?? startVal;
      const left = originToBody(dateToPx2(startVal));
      const right = originToBody(dateToPx2(endVal));
      const width = Math.max(right - left, 4);
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
  const highlightedIds = store.highlightedTaskIds.value;
  const hasSelection = store.selectedEntity.value !== null;
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
        bodyOriginPx
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
              /* @__PURE__ */ u4(TimelineGrid, { dayWidth: DAY_WIDTH2, scrollLeft, viewportWidth: viewportWidth.value, bufferPx: GRID_BUFFER_PX, bodyOriginPx }),
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
                      background: dragHovering ? "var(--gantt-drag-hover-bg, rgba(74, 144, 217, 0.2))" : isHighlighted ? "var(--gantt-row-highlight-bg, rgba(74, 144, 217, 0.08))" : "transparent",
                      outline: dragHovering ? "2px dashed var(--gantt-drag-hover-border, #4A90D9)" : "none",
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
                    isDimmed: hasSelection && !highlightedIds.has(task.id),
                    progress: task.progress.value
                  },
                  rowHeight: ROW_HEIGHT2,
                  laneOffset: LANE_OFFSET2,
                  onPointerDown: props.onTaskPointerDown,
                  onClick: props.onTaskClick
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
                const project = store.mergedProjects.value.find((p5) => p5.id === projectId);
                if (!project?.keyDates?.length)
                  return null;
                return project.keyDates.map((kd, ki) => /* @__PURE__ */ u4(
                  KeyDateMarker,
                  {
                    leftPx: originToBody(dateToPx2(kd.date)),
                    groupTopY: layout.startY,
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
                const barTop = ghostLayout ? ghostLayout.startY + (ROW_HEIGHT2 - barHeight) / 2 : ds.rowIndex * ROW_HEIGHT2 + (ROW_HEIGHT2 - barHeight) / 2;
                const ghostTask = store.mergedTasks.value.find((t4) => t4.id === ds.taskId);
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
  const { store, type } = props;
  const groups = type === "person" ? store.personGroups.value : store.projectGroups.value;
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
        tooltip: void 0
      };
    }),
    [groups]
  );
  const groupHeights = T2(() => {
    return groups.map((group) => {
      const ranges = [];
      for (const task of group.tasks) {
        const s5 = task.startDate.value;
        if (!s5)
          continue;
        ranges.push({ start: s5, end: task.endDate.value ?? s5 });
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
      return ROW_HEIGHT2 + (Math.max(1, lanes.length) - 1) * LANE_OFFSET2;
    });
  }, [groups]);
  const highlightedIds = store.highlightedTaskIds.value;
  const hasSelection = store.selectedEntity.value !== null;
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
      store.selectEntity({ type: "person", id: key });
    } else {
      store.selectEntity({ type: "project", id: key });
    }
  }
  function handleTaskClick(taskId) {
    store.selectEntity({ type: "task", id: taskId });
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
        onRowClick: handleRowClick,
        headerContent: type === "person" ? /* @__PURE__ */ u4(
          "button",
          {
            class: "gantt-sort-toggle",
            onClick: () => {
              store.personSortMode.value = store.personSortMode.value === "name" ? "position" : "name";
            },
            title: `Sort: ${store.personSortMode.value === "name" ? "by name" : "by position"}`,
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
              store.personSortMode.value === "name" ? "Name" : "Position"
            ]
          }
        ) : void 0
      }
    ),
    /* @__PURE__ */ u4(
      Timeline,
      {
        store,
        groups,
        groupKeyField: type === "person" ? "personId" : "projectId",
        scrollLeft: props.scrollLeft,
        scrollTop: props.scrollTop,
        onScroll: props.onScroll,
        highlightedRowKeys,
        dimmedRowKeys,
        onRowClick: handleRowClick,
        onTaskClick: handleTaskClick,
        onTaskPointerDown: props.onTaskPointerDown,
        onKeyDatePointerDown: props.onKeyDatePointerDown,
        onDrop: props.onDrop,
        onDragOver: props.onDragOver
      }
    )
  ] });
}
var KEY_DATE_PRESETS = [
  { name: "\u9A8C\u6536\u65F6\u95F4", color: "#98C379", icon: "\u2713" },
  { name: "\u4E0A\u7EBF\u65F6\u95F4", color: "#61AFEF", icon: "\u25B2" },
  { name: "\u63D0\u6D4B\u65F6\u95F4", color: "#C678DD", icon: "\u25C6" },
  { name: "\u8BC4\u5BA1\u65F6\u95F4", color: "#E5C07B", icon: "\u25CE" },
  { name: "\u4EA4\u4ED8\u65F6\u95F4", color: "#56B6C2", icon: "\u25CF" },
  { name: "\u542F\u52A8\u65F6\u95F4", color: "#4A90D9", icon: "\u25B6" }
];
function UnassignedPanel(props) {
  const projects = props.store.unassignedProjects.value;
  if (projects.length === 0) {
    return /* @__PURE__ */ u4(
      "div",
      {
        class: "gantt-unassigned-panel",
        style: {
          width: `${RIGHT_PANEL_WIDTH}px`,
          minWidth: `${RIGHT_PANEL_WIDTH}px`,
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
        width: `${RIGHT_PANEL_WIDTH}px`,
        minWidth: `${RIGHT_PANEL_WIDTH}px`,
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
            style: {
              padding: "8px 10px",
              marginBottom: "6px",
              border: "1px solid var(--gantt-grid-line-day, #e0e0e0)",
              borderRadius: "6px",
              background: "var(--background-secondary, #f5f5f5)",
              cursor: "grab",
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
function ProjectDetail(props) {
  const { store } = props;
  const sel = store.selectedEntity.value;
  const editing = useSignal(false);
  if (!sel || sel.type !== "project")
    return null;
  const project = store.mergedProjects.value.find((p5) => p5.id === sel.id);
  if (!project)
    return null;
  const projectOverrides = store.edits.value?.projectOverrides?.[project.id];
  const description = projectOverrides?.description ?? project.description ?? "";
  const requester = projectOverrides?.requester ?? project.requester ?? "";
  const keyDates = projectOverrides?.keyDates ?? project.keyDates ?? [];
  const keyLinks = projectOverrides?.keyLinks ?? project.keyLinks ?? [];
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
      store.persistProjectEdit(project.id, "name", newName);
    }
    editName.value = false;
  }
  function cancelName() {
    editNameValue.value = project.name;
    editName.value = false;
  }
  function handleNameKeyDown(e4) {
    if (e4.key === "Enter")
      saveName();
    if (e4.key === "Escape")
      cancelName();
  }
  const associatedTasks = store.mergedTasks.value.filter((t4) => t4.projectId.value === project.id);
  const editDescription = useSignal(description);
  const editRequester = useSignal(requester);
  const editKeyDates = useSignal(
    keyDates.map((kd) => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon }))
  );
  const editKeyLinks = useSignal(
    keyLinks.map((kl) => ({ ...kl }))
  );
  function handleEdit() {
    editDescription.value = description;
    editRequester.value = requester;
    editKeyDates.value = keyDates.map((kd) => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon }));
    editKeyLinks.value = keyLinks.map((kl) => ({ ...kl }));
    editing.value = true;
  }
  async function handleSave() {
    await store.persistProjectEdit(project.id, "description", editDescription.value || void 0);
    await store.persistProjectEdit(project.id, "requester", editRequester.value || void 0);
    await store.persistProjectEdit(project.id, "keyDates", editKeyDates.value.length > 0 ? editKeyDates.value.map((kd) => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon })) : void 0);
    await store.persistProjectEdit(project.id, "keyLinks", editKeyLinks.value.length > 0 ? editKeyLinks.value : void 0);
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
        width: `${RIGHT_PANEL_WIDTH}px`,
        minWidth: `${RIGHT_PANEL_WIDTH}px`,
        borderLeft: "1px solid var(--gantt-grid-line-week, #c0c0c0)",
        padding: "12px",
        fontSize: "13px",
        color: "var(--text-normal, #333)",
        overflowY: "auto",
        background: "var(--background-secondary, #f5f5f5)"
      },
      children: [
        /* @__PURE__ */ u4("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }, children: [
          /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "6px", flex: 1 }, children: [
            project.color && /* @__PURE__ */ u4("span", { style: {
              width: "12px",
              height: "12px",
              borderRadius: "3px",
              background: project.color,
              flexShrink: 0
            } }),
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
                onClick: startEditName,
                title: "Click to edit name",
                children: project.name
              }
            )
          ] }),
          /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "2px", flexShrink: 0 }, children: editing.value ? /* @__PURE__ */ u4(S, { children: [
            /* @__PURE__ */ u4(
              "button",
              {
                onClick: handleSave,
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
                onClick: handleCancel,
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
            /* @__PURE__ */ u4(
              "button",
              {
                onClick: handleEdit,
                title: "Edit project details",
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
                children: "\u270E"
              }
            ),
            /* @__PURE__ */ u4(
              "button",
              {
                onClick: () => props.onDelete?.(project.id, project.name),
                title: "Delete project",
                style: {
                  padding: "2px 4px",
                  border: "none",
                  borderRadius: "3px",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--text-error, #e00)",
                  lineHeight: 1
                },
                children: "\u{1F5D1}"
              }
            ),
            /* @__PURE__ */ u4(
              "button",
              {
                onClick: () => store.selectEntity(null),
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
                children: "\u2715"
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
          /* @__PURE__ */ u4("div", { style: labelStyle, children: "Status" }),
          /* @__PURE__ */ u4(
            "select",
            {
              value: projectOverrides?.status ?? project.status ?? "pending",
              onChange: (e4) => store.setProjectStatus(project.id, e4.target.value),
              style: {
                width: "100%",
                fontSize: "12px",
                padding: "3px 6px",
                borderRadius: "4px",
                border: "1px solid var(--background-modifier-border, #ccc)",
                background: "var(--background-primary, #fff)",
                color: "var(--text-normal, #333)",
                cursor: "pointer"
              },
              children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ u4("option", { value: opt.value, children: opt.label }, opt.value))
            }
          )
        ] }),
        /* @__PURE__ */ u4(
          "div",
          {
            draggable: true,
            onDragStart: (e4) => {
              e4.dataTransfer?.setData("text/plain", JSON.stringify({ projectId: project.id, projectName: project.name }));
            },
            class: "gantt-drag-create-area",
            title: "Drag to person timeline to create a new task for this project",
            style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 10px",
              marginBottom: "12px",
              border: "2px dashed var(--interactive-accent, #4A90D9)",
              borderRadius: "6px",
              background: "rgba(74, 144, 217, 0.04)",
              cursor: "grab",
              fontSize: "12px",
              color: "var(--interactive-accent, #4A90D9)",
              transition: "background 0.15s, border-color 0.15s"
            },
            children: [
              /* @__PURE__ */ u4("span", { style: { fontSize: "14px", lineHeight: 1, flexShrink: 0 }, children: "\u283F" }),
              /* @__PURE__ */ u4("span", { style: { fontWeight: 500 }, children: "Drag to person timeline to create task" })
            ]
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
          ) : /* @__PURE__ */ u4("div", { style: valueStyle, children: description || "\u2014" })
        ] }),
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
          ) : /* @__PURE__ */ u4("div", { style: valueStyle, children: requester || "\u2014" })
        ] }),
        /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
          /* @__PURE__ */ u4("div", { style: labelStyle, children: "Key Dates" }),
          editing.value ? /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
            /* @__PURE__ */ u4("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "4px" }, children: KEY_DATE_PRESETS.map((preset) => /* @__PURE__ */ u4(
              "button",
              {
                onClick: () => {
                  editKeyDates.value = [...editKeyDates.value, {
                    name: preset.name,
                    date: todayString(),
                    color: preset.color,
                    icon: preset.icon
                  }];
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
                    lineHeight: "12px",
                    textAlign: "center",
                    fontSize: "9px",
                    borderRadius: "2px",
                    background: preset.color,
                    color: "#fff",
                    marginRight: "3px"
                  }, children: preset.icon }),
                  preset.name
                ]
              },
              preset.name
            )) }),
            editKeyDates.value.map((kd, i5) => /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "3px", alignItems: "center" }, children: [
              /* @__PURE__ */ u4(
                "input",
                {
                  type: "color",
                  value: kd.color ?? "#E5C07B",
                  onInput: (e4) => {
                    const next = [...editKeyDates.value];
                    next[i5] = { ...next[i5], color: e4.target.value };
                    editKeyDates.value = next;
                  },
                  title: "Marker color",
                  style: { width: "22px", height: "22px", padding: "0", border: "none", borderRadius: "3px", cursor: "pointer", flexShrink: 0 }
                }
              ),
              /* @__PURE__ */ u4(
                "input",
                {
                  type: "text",
                  value: kd.icon ?? "",
                  onInput: (e4) => {
                    const next = [...editKeyDates.value];
                    next[i5] = { ...next[i5], icon: e4.target.value || void 0 };
                    editKeyDates.value = next;
                  },
                  placeholder: "\u25C6",
                  maxLength: 2,
                  title: "Icon (1-2 chars shown in marker)",
                  style: {
                    width: "22px",
                    fontSize: "11px",
                    padding: "3px",
                    textAlign: "center",
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
                  type: "text",
                  value: kd.name,
                  onInput: (e4) => {
                    const next = [...editKeyDates.value];
                    next[i5] = { ...next[i5], name: e4.target.value };
                    editKeyDates.value = next;
                  },
                  placeholder: "Name",
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
                "input",
                {
                  type: "date",
                  value: kd.date,
                  onInput: (e4) => {
                    const next = [...editKeyDates.value];
                    next[i5] = { ...next[i5], date: e4.target.value };
                    editKeyDates.value = next;
                  },
                  style: {
                    width: "110px",
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
                "button",
                {
                  onClick: () => {
                    editKeyDates.value = editKeyDates.value.filter((_3, idx) => idx !== i5);
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
                  editKeyDates.value = [...editKeyDates.value, { name: "", date: "", color: "#E5C07B", icon: "" }];
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
          ] }) : /* @__PURE__ */ u4("div", { children: keyDates.length > 0 ? keyDates.map((kd, i5) => /* @__PURE__ */ u4("div", { style: { fontSize: "12px", padding: "2px 0", display: "flex", gap: "6px", alignItems: "center" }, children: [
            /* @__PURE__ */ u4("span", { style: {
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              background: kd.color ?? "var(--gantt-key-date-color, #E5C07B)",
              flexShrink: 0,
              transform: "rotate(45deg)"
            } }),
            kd.icon && /* @__PURE__ */ u4("span", { style: { fontSize: "9px", fontWeight: "bold", color: kd.color ?? "var(--text-muted, #999)", flexShrink: 0 }, children: kd.icon }),
            /* @__PURE__ */ u4("span", { style: { color: "var(--text-muted, #999)", minWidth: "80px" }, children: kd.date }),
            /* @__PURE__ */ u4("span", { children: kd.name })
          ] }, i5)) : /* @__PURE__ */ u4("div", { style: valueStyle, children: "\u2014" }) })
        ] }),
        /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
          /* @__PURE__ */ u4("div", { style: labelStyle, children: "Key Links" }),
          editing.value ? /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
            editKeyLinks.value.map((kl, i5) => /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "4px", alignItems: "center" }, children: [
              /* @__PURE__ */ u4(
                "input",
                {
                  type: "text",
                  value: kl.name,
                  onInput: (e4) => {
                    const next = [...editKeyLinks.value];
                    next[i5] = { ...next[i5], name: e4.target.value };
                    editKeyLinks.value = next;
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
                    editKeyLinks.value = editKeyLinks.value.filter((_3, idx) => idx !== i5);
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
                  editKeyLinks.value = [...editKeyLinks.value, { name: "", url: "" }];
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
          ] }) : /* @__PURE__ */ u4("div", { children: keyLinks.length > 0 ? keyLinks.map((kl, i5) => /* @__PURE__ */ u4("div", { style: { fontSize: "12px", padding: "2px 0" }, children: /* @__PURE__ */ u4(
            "a",
            {
              href: kl.url,
              target: "_blank",
              rel: "noopener noreferrer",
              style: {
                color: "var(--interactive-accent, #4A90D9)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              },
              children: [
                /* @__PURE__ */ u4("span", { style: { fontSize: "10px" }, children: "\u2197" }),
                kl.name || kl.url
              ]
            }
          ) }, i5)) : /* @__PURE__ */ u4("div", { style: valueStyle, children: "\u2014" }) })
        ] }),
        /* @__PURE__ */ u4("div", { style: fieldStyle, children: [
          /* @__PURE__ */ u4("div", { style: labelStyle, children: [
            "Tasks (",
            associatedTasks.length,
            ")"
          ] }),
          associatedTasks.length > 0 ? /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "2px" }, children: associatedTasks.map((t4) => /* @__PURE__ */ u4(
            "div",
            {
              onClick: () => store.selectEntity({ type: "task", id: t4.id }),
              style: {
                fontSize: "12px",
                padding: "3px 6px",
                cursor: "pointer",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              },
              class: "gantt-task-link-item",
              title: "Click to view task details",
              children: [
                /* @__PURE__ */ u4(StatusBadge, { status: t4.status.value }),
                /* @__PURE__ */ u4("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: t4.title.value })
              ]
            },
            t4.id
          )) }) : /* @__PURE__ */ u4("div", { style: valueStyle, children: "No tasks" })
        ] })
      ]
    }
  );
}
var STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "#888" },
  { value: "in-progress", label: "In Progress", color: "#2196f3" },
  { value: "cancelled", label: "Cancelled", color: "#e53935" },
  { value: "pending-online", label: "Pending Online", color: "#fb8c00" },
  { value: "online", label: "Online", color: "#00897b" },
  { value: "completed", label: "Completed", color: "#4caf50" }
];
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
function DetailPanel(props) {
  const { store } = props;
  const sel = store.selectedEntity.value;
  if (!sel || sel.type !== "task")
    return null;
  const task = store.mergedTasks.value.find((t4) => t4.id === sel.id);
  if (!task)
    return null;
  const personName = task.personId.value ? store.persons.value.find((p5) => p5.id === task.personId.value)?.name ?? task.personId.value : null;
  const project = task.projectId.value ? store.projects.value.find((p5) => p5.id === task.projectId.value) : null;
  const editTitle = useSignal(false);
  const editTitleValue = useSignal(task.title.value);
  let titleInputRef = null;
  function startEditTitle() {
    editTitleValue.value = task.title.value;
    editTitle.value = true;
    requestAnimationFrame(() => titleInputRef?.focus());
  }
  function saveTitle() {
    const newTitle = editTitleValue.value.trim();
    if (newTitle && newTitle !== task.title.value) {
      store.persistEdit(task.id, "title", newTitle);
    }
    editTitle.value = false;
  }
  function cancelTitle() {
    editTitleValue.value = task.title.value;
    editTitle.value = false;
  }
  function handleTitleKeyDown(e4) {
    if (e4.key === "Enter")
      saveTitle();
    if (e4.key === "Escape")
      cancelTitle();
  }
  const sourceLabel = task.connectorId ? `Connector: ${task.connectorId}` : task.upstreamId ? "Local override" : "Manual entry";
  const sourceStyle = task.upstreamDeleted ? "line-through" : "normal";
  return /* @__PURE__ */ u4(
    "div",
    {
      class: "gantt-detail-panel",
      style: {
        width: `${RIGHT_PANEL_WIDTH}px`,
        minWidth: `${RIGHT_PANEL_WIDTH}px`,
        borderLeft: "1px solid var(--gantt-grid-line-week, #c0c0c0)",
        padding: "12px",
        fontSize: "13px",
        color: "var(--text-normal, #333)",
        overflowY: "auto",
        background: "var(--background-secondary, #f5f5f5)"
      },
      children: [
        /* @__PURE__ */ u4("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }, children: [
          editTitle.value ? /* @__PURE__ */ u4(
            "input",
            {
              ref: (el) => {
                titleInputRef = el;
              },
              type: "text",
              value: editTitleValue.value,
              onInput: (e4) => {
                editTitleValue.value = e4.target.value;
              },
              onBlur: saveTitle,
              onKeyDown: handleTitleKeyDown,
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
            "div",
            {
              style: { fontWeight: "bold", fontSize: "14px", wordBreak: "break-word", flex: 1, cursor: "text" },
              onClick: startEditTitle,
              title: "Click to edit title",
              children: task.title.value
            }
          ),
          /* @__PURE__ */ u4("div", { style: { display: "flex", gap: "2px", flexShrink: 0, marginLeft: "4px" }, children: [
            /* @__PURE__ */ u4(
              "button",
              {
                onClick: () => props.onDelete?.(task.id, task.title.value),
                style: {
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  lineHeight: 1,
                  padding: "0 2px",
                  color: "var(--text-error, #e00)"
                },
                title: "Delete task",
                children: "\u{1F5D1}"
              }
            ),
            /* @__PURE__ */ u4(
              "button",
              {
                onClick: () => store.selectEntity(null),
                style: {
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  lineHeight: 1,
                  padding: "0 2px",
                  color: "var(--text-muted, #999)"
                },
                title: "Close detail panel",
                children: "x"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
          /* @__PURE__ */ u4("div", { children: [
            /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", marginBottom: "2px" }, children: "Status" }),
            /* @__PURE__ */ u4(
              "select",
              {
                value: task.status.value,
                onChange: (e4) => store.setTaskStatus(task.id, e4.target.value),
                style: {
                  width: "100%",
                  fontSize: "12px",
                  padding: "3px 6px",
                  borderRadius: "4px",
                  border: "1px solid var(--background-modifier-border, #ccc)",
                  background: "var(--background-primary, #fff)",
                  color: "var(--text-normal, #333)",
                  cursor: "pointer"
                },
                children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ u4("option", { value: opt.value, children: opt.label }, opt.value))
              }
            )
          ] }),
          /* @__PURE__ */ u4(FieldRow, { label: "Start", value: task.startDate.value ?? "-" }),
          /* @__PURE__ */ u4(FieldRow, { label: "End", value: task.endDate.value ?? "-" }),
          /* @__PURE__ */ u4("div", { children: [
            /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", marginBottom: "2px" }, children: "Progress" }),
            /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
              /* @__PURE__ */ u4("div", { style: {
                flex: 1,
                height: "6px",
                borderRadius: "3px",
                background: "var(--background-modifier-border, #ccc)",
                overflow: "hidden"
              }, children: /* @__PURE__ */ u4("div", { style: {
                height: "100%",
                width: `${(task.progress.value ?? 0) * 100}%`,
                background: task.progress.value === 1 ? "var(--gantt-completed, #4caf50)" : "var(--gantt-in-progress, #2196f3)",
                borderRadius: "3px"
              } }) }),
              /* @__PURE__ */ u4("span", { style: { fontSize: "12px", fontWeight: "bold" }, children: [
                Math.round((task.progress.value ?? 0) * 100),
                "%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ u4(FieldRow, { label: "Person", value: personName ?? "-" }),
          /* @__PURE__ */ u4("div", { children: [
            /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", marginBottom: "2px" }, children: "Project" }),
            /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
              project?.color && /* @__PURE__ */ u4("span", { style: {
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background: project.color,
                flexShrink: 0
              } }),
              /* @__PURE__ */ u4(
                "span",
                {
                  style: { cursor: "pointer", color: "var(--interactive-accent, #4A90D9)" },
                  onClick: () => project && store.selectEntity({ type: "project", id: project.id }),
                  title: "Click to view project details",
                  children: project?.name ?? task.projectId.value ?? "-"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ u4("div", { children: [
            /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", marginBottom: "2px" }, children: "Link" }),
            task.url.value ? /* @__PURE__ */ u4(
              "a",
              {
                href: task.url.value,
                target: "_blank",
                rel: "noopener noreferrer",
                style: {
                  color: "var(--interactive-accent, #4A90D9)",
                  textDecoration: "none",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                },
                children: [
                  /* @__PURE__ */ u4("span", { style: { fontSize: "10px" }, children: "\u2197" }),
                  task.url.value
                ]
              }
            ) : /* @__PURE__ */ u4("div", { style: { fontSize: "12px" }, children: "\u2014" })
          ] }),
          /* @__PURE__ */ u4("div", { children: [
            /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", marginBottom: "2px" }, children: "Dependencies" }),
            /* @__PURE__ */ u4("div", { style: { fontSize: "12px" }, children: task.dependencies.value.length > 0 ? task.dependencies.value.map((d4) => /* @__PURE__ */ u4("div", { style: { padding: "1px 0" }, children: d4 }, d4)) : "-" })
          ] }),
          task.tags.value.length > 0 && /* @__PURE__ */ u4("div", { children: [
            /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", marginBottom: "2px" }, children: "Tags" }),
            /* @__PURE__ */ u4("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: task.tags.value.map((tag) => /* @__PURE__ */ u4("span", { style: {
              padding: "1px 6px",
              borderRadius: "10px",
              background: "var(--background-modifier-border, #e0e0e0)",
              fontSize: "11px"
            }, children: tag }, tag)) })
          ] }),
          /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", marginTop: "4px" }, children: [
            /* @__PURE__ */ u4("div", { style: { textDecoration: sourceStyle }, children: sourceLabel }),
            task.upstreamDeleted && /* @__PURE__ */ u4("div", { style: { color: "var(--text-error, #e00)", marginTop: "2px" }, children: "Deleted upstream" })
          ] })
        ] })
      ]
    }
  );
}
function FieldRow(props) {
  return /* @__PURE__ */ u4("div", { children: [
    /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-muted, #999)", marginBottom: "1px" }, children: props.label }),
    /* @__PURE__ */ u4("div", { style: { fontSize: "13px" }, children: props.value })
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
function PendingChangesPanel(props) {
  const { store } = props;
  const changes = store.pendingChanges.value;
  const pushing = useSignal(false);
  const pushResults = useSignal(null);
  async function handlePush() {
    pushing.value = true;
    pushResults.value = null;
    try {
      const results = await store.pushChanges();
      pushResults.value = results;
    } finally {
      pushing.value = false;
    }
  }
  const stats = {
    added: changes.filter((c4) => c4.changeType === "added").length,
    modified: changes.filter((c4) => c4.changeType === "modified").length,
    deleted: changes.filter((c4) => c4.changeType === "deleted").length
  };
  const changeTypeLabel = {
    added: "New",
    modified: "Updated",
    deleted: "Deleted"
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
            /* @__PURE__ */ u4("div", { style: { overflowY: "auto", padding: "16px 24px", flex: 1 }, children: changes.length === 0 ? /* @__PURE__ */ u4("div", { style: { color: "var(--text-muted, #999)", fontSize: "13px", padding: "20px 0", textAlign: "center" }, children: "No pending changes. All local modifications have been pushed." }) : /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: changes.map((change, i5) => /* @__PURE__ */ u4(
              "div",
              {
                class: "gantt-change-card",
                style: {
                  border: "1px solid var(--background-modifier-border, #e0e0e0)",
                  borderRadius: "6px",
                  padding: "12px",
                  fontSize: "12px"
                },
                children: [
                  /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }, children: [
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
                  change.changeType === "modified" && change.fields && /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "3px" }, children: change.fields.map((f5, j4) => /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "baseline", gap: "6px" }, children: [
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
                    }, children: f5.field === "keyDates" ? `${f5.newValue.length} dates` : f5.field === "keyLinks" ? `${f5.newValue.length} links` : f5.field === "tags" ? `[${f5.newValue.join(", ")}]` : f5.field === "dependencies" ? `[${f5.newValue.join(", ")}]` : String(f5.newValue) })
                  ] }, j4)) }),
                  change.changeType === "added" && change.addedSummary && /* @__PURE__ */ u4("div", { style: { display: "flex", flexDirection: "column", gap: "3px" }, children: Object.entries(change.addedSummary).map(([key, val]) => /* @__PURE__ */ u4("div", { style: { display: "flex", alignItems: "baseline", gap: "6px" }, children: [
                    /* @__PURE__ */ u4("span", { style: {
                      color: "var(--text-muted, #999)",
                      fontSize: "11px",
                      minWidth: "50px",
                      flexShrink: 0
                    }, children: [
                      key,
                      ":"
                    ] }),
                    /* @__PURE__ */ u4("span", { style: { color: "#4caf50", fontWeight: 500 }, children: String(val) })
                  ] }, key)) }),
                  change.changeType === "deleted" && /* @__PURE__ */ u4("div", { style: { fontSize: "11px", color: "var(--text-error, #e53935)" }, children: change.relatedInfo ? `Will be deleted \xB7 ${change.relatedInfo}` : "Will be deleted" })
                ]
              },
              `${change.entityType}-${change.entityId}-${change.changeType}-${i5}`
            )) }) }),
            changes.length > 0 && /* @__PURE__ */ u4("div", { style: {
              padding: "12px 24px",
              borderTop: "1px solid var(--background-modifier-border, #eee)",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }, children: [
              /* @__PURE__ */ u4(
                "button",
                {
                  onClick: handlePush,
                  disabled: pushing.value,
                  class: "gantt-btn",
                  style: {
                    padding: "8px 20px",
                    border: "none",
                    borderRadius: "4px",
                    background: pushing.value ? "var(--background-modifier-border, #ccc)" : "var(--interactive-accent, #4A90D9)",
                    color: "#fff",
                    cursor: pushing.value ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: 500
                  },
                  children: pushing.value ? "Pushing..." : `Push ${changes.length} Changes`
                }
              ),
              pushResults.value && /* @__PURE__ */ u4("span", { style: { fontSize: "12px" }, children: [
                pushResults.value.some((r4) => r4.success) ? `Pushed to ${pushResults.value.filter((r4) => r4.success).map((r4) => r4.connectorId).join(", ")}` : "Push failed",
                pushResults.value.some((r4) => !r4.success) && /* @__PURE__ */ u4("span", { style: { color: "var(--text-error, #e00)" }, children: [
                  " \xB7 ",
                  pushResults.value.filter((r4) => !r4.success).map((r4) => r4.error).join("; ")
                ] })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function DualPane(props) {
  const { store } = props;
  let personVGuardActive = false;
  let personVGuardTimer = null;
  let projectVGuardActive = false;
  let projectVGuardTimer = null;
  const paneRatio = useSignal(0.5);
  const isResizing = useSignal(false);
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
  const sel = store.selectedEntity.value;
  const showTaskDetail = sel?.type === "task";
  const showProjectDetail = sel?.type === "project";
  return /* @__PURE__ */ u4("div", { class: "gantt-dual-pane", style: { display: "flex", flexDirection: "column", height: "100%", width: "100%" }, children: /* @__PURE__ */ u4("div", { style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
    /* @__PURE__ */ u4("div", { style: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }, children: [
      /* @__PURE__ */ u4("div", { style: { flex: `0 0 ${paneRatio.value * 100}%`, display: "flex", overflow: "hidden" }, children: [
        /* @__PURE__ */ u4(
          GanttPane,
          {
            store,
            type: "person",
            scrollLeft: store.sharedScrollLeft.value,
            scrollTop: store.personScrollTop.value,
            onScroll: (sl, st) => {
              store.sharedScrollLeft.value = sl;
              if (!personVGuardActive) {
                personVGuardActive = true;
                store.personScrollTop.value = st;
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
        !showTaskDetail && !showProjectDetail && /* @__PURE__ */ u4(UnassignedPanel, { store, onDragStart: () => {
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
          store,
          type: "project",
          scrollLeft: store.sharedScrollLeft.value,
          scrollTop: store.projectScrollTop.value,
          onScroll: (sl, st) => {
            store.sharedScrollLeft.value = sl;
            if (!projectVGuardActive) {
              projectVGuardActive = true;
              store.projectScrollTop.value = st;
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
    showTaskDetail && /* @__PURE__ */ u4(DetailPanel, { store, onDelete: props.onDeleteTask }),
    showProjectDetail && /* @__PURE__ */ u4(ProjectDetail, { store, onDelete: props.onDeleteProject })
  ] }) });
}
function GanttChart(props) {
  const { store } = props;
  const dragHandler = createDragHandler(store);
  const confirmState = useSignal(null);
  const showPendingPanel = useSignal(false);
  function handleDeleteTask(taskId, title) {
    confirmState.value = {
      message: `Are you sure you want to delete task "${title}"? This action can be undone until changes are pushed upstream.`,
      onConfirm: () => {
        store.deleteTask(taskId);
        confirmState.value = null;
      }
    };
  }
  function handleDeleteProject(projectId, name) {
    const taskCount = store.mergedTasks.value.filter((t4) => t4.projectId.value === projectId).length;
    confirmState.value = {
      message: `Are you sure you want to delete project "${name}"?${taskCount > 0 ? ` This will also delete ${taskCount} associated task(s).` : ""} This action can be undone until changes are pushed upstream.`,
      onConfirm: () => {
        store.deleteProject(projectId);
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
        store.selectEntity(null);
      }
      if (e4.key === "z" && (e4.ctrlKey || e4.metaKey)) {
        e4.preventDefault();
        dragHandler.undo();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
  function handleTaskPointerDown(e4, taskId, edge, paneType) {
    dragHandler.onTaskPointerDown(e4, taskId, edge, paneType);
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
  if (store.isLoading.value) {
    return /* @__PURE__ */ u4("div", { class: "gantt-loading", style: { padding: "24px", textAlign: "center", color: "var(--text-muted, #999)" }, children: "Loading..." });
  }
  if (store.error.value) {
    return /* @__PURE__ */ u4("div", { class: "gantt-error", style: { padding: "24px", textAlign: "center", color: "var(--text-error, #e00)" }, children: [
      "Error: ",
      store.error.value
    ] });
  }
  if (!store.currentViewId.value) {
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
              onClick: () => store.selectEntity(null),
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
                const view = store.views.value.find((v5) => v5.id === store.currentViewId.value);
                if (!view)
                  return;
                for (const cid of view.connectors) {
                  await store.refreshConnector(cid);
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
                background: store.pendingChanges.value.length > 0 ? "var(--interactive-accent, #4A90D9)" : "var(--background-secondary, #f5f5f5)",
                color: store.pendingChanges.value.length > 0 ? "#fff" : "var(--text-normal, #333)",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: store.pendingChanges.value.length > 0 ? 500 : "normal"
              },
              onClick: () => {
                showPendingPanel.value = true;
              },
              children: [
                "Pending (",
                store.pendingChanges.value.length,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ u4("span", { style: { color: "var(--text-muted, #999)", fontSize: "12px" }, children: [
            store.mergedTasks.value.length,
            " tasks \xB7 ",
            store.personGroups.value.length,
            " people \xB7 ",
            store.projectGroups.value.length,
            " projects"
          ] }),
          /* @__PURE__ */ u4("span", { style: { color: "var(--text-muted, #999)", fontSize: "12px", marginLeft: "auto" }, children: store.conflicts.value.length > 0 ? `\u26A0 ${store.conflicts.value.length} conflicts` : "" })
        ]
      }
    ),
    /* @__PURE__ */ u4(
      DualPane,
      {
        store,
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
        store,
        onClose: () => {
          showPendingPanel.value = false;
        }
      }
    )
  ] });
}

// src/view.tsx
var import_obsidian = require("obsidian");

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

// src/connector-loader.ts
function createObsidianConnectorLoader(adapter, requestUrl) {
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
function createObsidianConnectorContext(config, vaultAdapter, requestUrl) {
  return {
    config,
    log: (...args) => console.log("[Gantt Connector]", ...args),
    request: async (url, opts) => {
      const result = await requestUrl({
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
function createObsidianPlatform(app) {
  const adapter = app.vault.adapter;
  const storage = createObsidianStorage(adapter);
  const fetchRef = {
    requestUrl: () => {
      throw new Error("requestUrl not bound \u2014 call bindRequestUrl first");
    }
  };
  const connectorLoader = createObsidianConnectorLoader(adapter, (...args) => fetchRef.requestUrl(...args));
  const createConnectorContext = (config) => createObsidianConnectorContext(config, adapter, (...args) => fetchRef.requestUrl(...args));
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
    watcher: null,
    // File watching handled by Obsidian's vault events
    theme
  };
  platform._fetchRef = fetchRef;
  return platform;
}

// src/view.tsx
var VIEW_TYPE = "obsidian-gantt-view";
var GanttView = class extends import_obsidian.ItemView {
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
    this.store = createGanttStore(this.platform);
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
var GanttPlugin = class extends import_obsidian2.Plugin {
  async onload() {
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
  }
  async activateView() {
    const { workspace } = this.app;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE);
    if (leaves.length > 0) {
      workspace.revealLeaf(leaves[0]);
      return;
    }
    await workspace.getRightLeaf(false)?.setViewState({
      type: VIEW_TYPE,
      active: true
    });
  }
};
//# sourceMappingURL=main.js.map
