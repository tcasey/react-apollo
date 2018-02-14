(function(a, b) {
  'object' == typeof exports && 'undefined' != typeof module
    ? b(
        exports,
        require('react'),
        require('object-assign'),
        require('prop-types'),
        require('invariant'),
        require('fbjs/lib/shallowEqual'),
        require('apollo-client'),
        require('lodash/pick'),
        require('hoist-non-react-statics'),
        require('lodash/flowRight'),
        require('react-dom/server'),
      )
    : 'function' == typeof define && define.amd
      ? define(
          [
            'exports',
            'react',
            'object-assign',
            'prop-types',
            'invariant',
            'fbjs/lib/shallowEqual',
            'apollo-client',
            'lodash/pick',
            'hoist-non-react-statics',
            'lodash/flowRight',
            'react-dom/server',
          ],
          b,
        )
      : b(
          (a['react-apollo'] = {}),
          a.React,
          a.assign,
          a.PropTypes,
          a.invariant,
          a.shallowEqual,
          a.apolloClient,
          a.pick,
          a.hoistNonReactStatics,
          a.flowRight,
          a.server,
        );
})(this, function(a, b, c, d, e, f, g, h, i, j, k) {
  'use strict';
  function l(a) {
    return a &&
      a.__esModule &&
      Object.prototype.hasOwnProperty.call(a, 'default')
      ? a['default']
      : a;
  }
  function m(a, b) {
    return (b = { exports: {} }), a(b, b.exports), b.exports;
  }
  (b = b && b.hasOwnProperty('default') ? b['default'] : b),
    (c = c && c.hasOwnProperty('default') ? c['default'] : c),
    (d = d && d.hasOwnProperty('default') ? d['default'] : d),
    (e = e && e.hasOwnProperty('default') ? e['default'] : e),
    (f = f && f.hasOwnProperty('default') ? f['default'] : f),
    (g = g && g.hasOwnProperty('default') ? g['default'] : g),
    (h = h && h.hasOwnProperty('default') ? h['default'] : h),
    (i = i && i.hasOwnProperty('default') ? i['default'] : i),
    (j = j && j.hasOwnProperty('default') ? j['default'] : j),
    (k = k && k.hasOwnProperty('default') ? k['default'] : k);
  var n =
      'undefined' == typeof window
        ? 'undefined' == typeof global
          ? 'undefined' == typeof self ? {} : self
          : global
        : window,
    o = m(function(a, d) {
      function e(a) {
        return a.props || a.attributes;
      }
      function f(a) {
        return !!a.type;
      }
      function g(a) {
        return (
          a.prototype && (a.prototype.render || a.prototype.isReactComponent)
        );
      }
      function h(a) {
        return !!a.getChildContext;
      }
      function i(a, d, j) {
        if (Array.isArray(a))
          return void a.forEach(function(a) {
            return i(a, d, j);
          });
        if (a)
          if (!f(a))
            ('string' == typeof a || 'number' == typeof a) && j(a, null, d);
          else if ('function' == typeof a.type) {
            var k,
              l = a.type,
              m = c({}, l.defaultProps, e(a)),
              n = d;
            if (g(l)) {
              var o = new l(m, d);
              if (
                ((o.props = o.props || m),
                (o.context = o.context || d),
                (o.state = o.state || null),
                (o.setState = function(a) {
                  'function' == typeof a &&
                    (a = a(o.state, o.props, o.context)),
                    (o.state = c({}, o.state, a));
                }),
                o.componentWillMount && o.componentWillMount(),
                h(o) && (n = c({}, d, o.getChildContext())),
                !1 === j(a, o, d))
              )
                return;
              k = o.render();
            } else {
              if (!1 === j(a, null, d)) return;
              k = l(m, d);
            }
            k &&
              (Array.isArray(k)
                ? k.forEach(function(a) {
                    return i(a, d, j);
                  })
                : i(k, n, j));
          } else {
            if (!1 === j(a, null, d)) return;
            a.props &&
              a.props.children &&
              b.Children.forEach(a.props.children, function(a) {
                a && i(a, d, j);
              });
          }
      }
      function j(a) {
        return 'function' == typeof a.fetchData;
      }
      function k(a) {
        return 'function' == typeof a.then;
      }
      function l(a, b) {
        var c = a.rootElement,
          d = a.rootContext,
          e = void 0 === d ? {} : d;
        void 0 === b && (b = !0);
        var g = [];
        return (
          i(c, e, function(a, d, e) {
            var h = !b && a === c;
            if (!h && d && f(a) && j(d)) {
              var i = d.fetchData();
              if (k(i)) return g.push({ query: i, element: a, context: e }), !1;
            }
          }),
          g
        );
      }
      function m(a, b, c) {
        void 0 === b && (b = {}), void 0 === c && (c = !0);
        var d = l({ rootElement: a, rootContext: b }, c);
        if (!d.length) return Promise.resolve();
        var f = [],
          e = d.map(function(a) {
            var b = a.query,
              c = a.element,
              d = a.context;
            return b
              .then(function() {
                return m(c, d, !1);
              })
              .catch(function(a) {
                return f.push(a);
              });
          });
        return Promise.all(e).then(function() {
          if (0 < f.length) {
            var a =
              1 === f.length
                ? f[0]
                : new Error(
                    f.length +
                      ' errors were thrown when executing your GraphQL queries.',
                  );
            throw ((a.queryErrors = f), a);
          }
        });
      }
      Object.defineProperty(d, '__esModule', { value: !0 }),
        (d.walkTree = i),
        (d.default = m);
    });
  l(o);
  var p = o.walkTree,
    q = m(function(a, b) {
      Object.defineProperty(b, '__esModule', { value: !0 });
      var c = function(a, b) {
        return (
          e(
            !!b.client,
            'Could not find "client" in the context of ApolloConsumer. Wrap the root component in an <ApolloProvider>',
          ),
          a.children(b.client)
        );
      };
      (c.contextTypes = { client: d.object.isRequired }), (b.default = c);
    });
  l(q);
  var r = m(function(a, b) {
    var c =
        (n && n.__assign) ||
        Object.assign ||
        function(a) {
          for (var b, c = 1, d = arguments.length; c < d; c++)
            for (var e in ((b = arguments[c]), b))
              Object.prototype.hasOwnProperty.call(b, e) && (a[e] = b[e]);
          return a;
        },
      d =
        (n && n.__rest) ||
        function(a, b) {
          var c = {};
          for (var d in a)
            Object.prototype.hasOwnProperty.call(a, d) &&
              0 > b.indexOf(d) &&
              (c[d] = a[d]);
          if (null != a && 'function' == typeof Object.getOwnPropertySymbols)
            for (
              var e = 0, d = Object.getOwnPropertySymbols(a);
              e < d.length;
              e++
            )
              0 > b.indexOf(d[e]) && (c[d[e]] = a[d[e]]);
          return c;
        };
    Object.defineProperty(b, '__esModule', { value: !0 });
    var e = (function() {
      function a() {
        this.observableQueries = [];
      }
      return (
        (a.prototype.recycle = function(a) {
          a.setOptions({
            fetchPolicy: 'standby',
            pollInterval: 0,
            fetchResults: !1,
          }),
            this.observableQueries.push({
              observableQuery: a,
              subscription: a.subscribe({}),
            });
        }),
        (a.prototype.reuse = function(a) {
          if (0 >= this.observableQueries.length) return null;
          var b = this.observableQueries.pop();
          if (!b) return null;
          var e = b.observableQuery,
            g = b.subscription;
          g.unsubscribe();
          var h = a.ssr,
            i = a.client,
            j = d(a, ['ssr', 'client']);
          return f(j.variables || {}, e.variables)
            ? (e.setOptions(
                c({}, j, {
                  pollInterval: a.pollInterval,
                  fetchPolicy: a.fetchPolicy,
                }),
              ),
              e)
            : null;
        }),
        a
      );
    })();
    b.ObservableQueryRecycler = e;
  });
  l(r);
  var s = r.ObservableQueryRecycler,
    t = m(function(a, c) {
      var e =
        (n && n.__extends) ||
        (function() {
          var a =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(a, c) {
                a.__proto__ = c;
              }) ||
            function(a, c) {
              for (var b in c) c.hasOwnProperty(b) && (a[b] = c[b]);
            };
          return function(c, d) {
            function b() {
              this.constructor = c;
            }
            a(c, d),
              (c.prototype =
                null === d
                  ? Object.create(d)
                  : ((b.prototype = d.prototype), new b()));
          };
        })();
      Object.defineProperty(c, '__esModule', { value: !0 });
      var f = (function(a) {
        function b(b) {
          var c = a.call(this, b) || this;
          return (
            (c.recyclers = new WeakMap()),
            (c.getQueryRecycler = c.getQueryRecycler.bind(c)),
            c
          );
        }
        return (
          e(b, a),
          (b.prototype.componentWillReceiveProps = function(a, b) {
            this.context.client !== b.client &&
              (this.recyclers = new WeakMap());
          }),
          (b.prototype.getQueryRecycler = function(a) {
            return (
              this.recyclers.has(a) ||
                this.recyclers.set(a, new r.ObservableQueryRecycler()),
              this.recyclers.get(a)
            );
          }),
          (b.prototype.getChildContext = function() {
            return { getQueryRecycler: this.getQueryRecycler };
          }),
          (b.prototype.render = function() {
            return this.props.children;
          }),
          (b.propTypes = { children: d.element.isRequired }),
          (b.contextTypes = { client: d.object }),
          (b.childContextTypes = { getQueryRecycler: d.func.isRequired }),
          b
        );
      })(b.Component);
      c.default = f;
    });
  l(t);
  var u = m(function(a, c) {
    var f =
      (n && n.__extends) ||
      (function() {
        var a =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function(a, c) {
              a.__proto__ = c;
            }) ||
          function(a, c) {
            for (var b in c) c.hasOwnProperty(b) && (a[b] = c[b]);
          };
        return function(c, d) {
          function b() {
            this.constructor = c;
          }
          a(c, d),
            (c.prototype =
              null === d
                ? Object.create(d)
                : ((b.prototype = d.prototype), new b()));
        };
      })();
    Object.defineProperty(c, '__esModule', { value: !0 });
    var g = b,
      h = (function(a) {
        function c(b, c) {
          var d = a.call(this, b, c) || this;
          return (
            e(
              b.client,
              'ApolloClient was not passed a client instance. Make sure you pass in your client via the "client" prop.',
            ),
            d
          );
        }
        return (
          f(c, a),
          (c.prototype.getChildContext = function() {
            return { client: this.props.client };
          }),
          (c.prototype.render = function() {
            return b.createElement(
              t.default,
              null,
              b.Children.only(this.props.children),
            );
          }),
          (c.propTypes = {
            client: d.object.isRequired,
            children: d.element.isRequired,
          }),
          (c.childContextTypes = { client: d.object.isRequired }),
          c
        );
      })(g.Component);
    c.default = h;
  });
  l(u);
  var v = m(function(a, b) {
    function c(a) {
      var b, c, f;
      e(
        !!a && !!a.kind,
        'Argument of ' +
          a +
          " passed to parser was not a valid GraphQL DocumentNode. You may need to use 'graphql-tag' or another method to convert your operation into a document",
      );
      var g = a.definitions.filter(function(a) {
          return 'FragmentDefinition' === a.kind;
        }),
        h = a.definitions.filter(function(a) {
          return 'OperationDefinition' === a.kind && 'query' === a.operation;
        }),
        i = a.definitions.filter(function(a) {
          return 'OperationDefinition' === a.kind && 'mutation' === a.operation;
        }),
        j = a.definitions.filter(function(a) {
          return (
            'OperationDefinition' === a.kind && 'subscription' === a.operation
          );
        });
      e(
        !g.length || h.length || i.length || j.length,
        "Passing only a fragment to 'graphql' is not yet supported. You must include a query, subscription or mutation as well",
      ),
        e(
          1 >= h.length + i.length + j.length,
          'react-apollo only supports a query, subscription, or a mutation per HOC. ' +
            (a + ' had ' + h.length + ' queries, ' + j.length + ' ') +
            ('subscriptions and ' +
              i.length +
              " mutations. You can use 'compose' to join multiple operation types to a component"),
        ),
        (c = h.length ? d.Query : d.Mutation),
        h.length || i.length || (c = d.Subscription);
      var k = h.length ? h : i.length ? i : j;
      e(
        1 === k.length,
        'react-apollo only supports one defintion per HOC. ' +
          a +
          ' had ' +
          (k.length +
            " definitions. You can use 'compose' to join multiple operation types to a component"),
      );
      var l = k[0];
      return (
        (b = l.variableDefinitions || []),
        (f = l.name && 'Name' === l.name.kind ? l.name.value : 'data'),
        { name: f, type: c, variables: b }
      );
    }
    Object.defineProperty(b, '__esModule', { value: !0 });
    var d;
    (function(a) {
      (a[(a.Query = 0)] = 'Query'),
        (a[(a.Mutation = 1)] = 'Mutation'),
        (a[(a.Subscription = 2)] = 'Subscription');
    })((d = b.DocumentType || (b.DocumentType = {}))),
      (b.parser = c);
  });
  l(v);
  var w = v.DocumentType,
    x = v.parser,
    y = m(function(a, c) {
      function i(a) {
        var b = h(
          a,
          'refetch',
          'fetchMore',
          'updateQuery',
          'startPolling',
          'stopPolling',
        );
        return (
          Object.keys(b).forEach(function(c) {
            var d = c;
            'function' == typeof b[d] && (b[d] = b[d].bind(a));
          }),
          b
        );
      }
      function j(a) {
        return 0 < Object.keys(a).length;
      }
      var k =
          (n && n.__extends) ||
          (function() {
            var a =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function(a, c) {
                  a.__proto__ = c;
                }) ||
              function(a, c) {
                for (var b in c) c.hasOwnProperty(b) && (a[b] = c[b]);
              };
            return function(c, d) {
              function b() {
                this.constructor = c;
              }
              a(c, d),
                (c.prototype =
                  null === d
                    ? Object.create(d)
                    : ((b.prototype = d.prototype), new b()));
            };
          })(),
        l =
          (n && n.__assign) ||
          Object.assign ||
          function(a) {
            for (var b, c = 1, d = arguments.length; c < d; c++)
              for (var e in ((b = arguments[c]), b))
                Object.prototype.hasOwnProperty.call(b, e) && (a[e] = b[e]);
            return a;
          },
        m =
          (n && n.__rest) ||
          function(a, b) {
            var c = {};
            for (var d in a)
              Object.prototype.hasOwnProperty.call(a, d) &&
                0 > b.indexOf(d) &&
                (c[d] = a[d]);
            if (null != a && 'function' == typeof Object.getOwnPropertySymbols)
              for (
                var e = 0, d = Object.getOwnPropertySymbols(a);
                e < d.length;
                e++
              )
                0 > b.indexOf(d[e]) && (c[d[e]] = a[d[e]]);
            return c;
          };
      Object.defineProperty(c, '__esModule', { value: !0 });
      var o = (function(a) {
        function b(b, c) {
          var d = a.call(this, b, c) || this;
          return (
            (d.previousData = {}),
            (d.initializeQueryObservable = function(a) {
              var b = a.variables,
                c = a.pollInterval,
                f = a.fetchPolicy,
                g = a.errorPolicy,
                h = a.notifyOnNetworkStatusChange,
                i = a.query,
                j = v.parser(i);
              e(
                j.type === v.DocumentType.Query,
                'The <Query /> component requires a graphql query, but got a ' +
                  (j.type === v.DocumentType.Mutation
                    ? 'mutation'
                    : 'subscription') +
                  '.',
              );
              d.queryObservable = d.client.watchQuery({
                variables: b,
                pollInterval: c,
                query: i,
                fetchPolicy: f,
                errorPolicy: g,
                notifyOnNetworkStatusChange: h,
              });
            }),
            (d.startQuerySubscription = function() {
              d.querySubscription = d.queryObservable.subscribe({
                next: d.updateCurrentData,
                error: function(a) {
                  if (
                    (d.resubscribeToQuery(), !a.hasOwnProperty('graphQLErrors'))
                  )
                    throw a;
                  d.updateCurrentData();
                },
              });
            }),
            (d.removeQuerySubscription = function() {
              d.querySubscription && d.querySubscription.unsubscribe();
            }),
            (d.updateCurrentData = function() {
              d.setState({ result: d.queryObservable.currentResult() });
            }),
            (d.getQueryResult = function() {
              var a = d.state.result,
                b = a.loading,
                c = a.networkStatus,
                e = a.errors,
                f = a.error;
              e &&
                0 < e.length &&
                (f = new g.ApolloError({ graphQLErrors: e }));
              var h = {};
              return (
                b
                  ? Object.assign(h, d.previousData, a.data)
                  : f
                    ? Object.assign(
                        h,
                        (d.queryObservable.getLastResult() || {}).data,
                      )
                    : ((h = a.data), (d.previousData = a.data)),
                l(
                  {
                    client: d.client,
                    data: j(h) ? h : void 0,
                    loading: b,
                    error: f,
                    networkStatus: c,
                  },
                  i(d.queryObservable),
                )
              );
            }),
            e(
              !!c.client,
              'Could not find "client" in the context of Query. Wrap the root component in an <ApolloProvider>',
            ),
            (d.client = c.client),
            d.initializeQueryObservable(b),
            (d.state = { result: d.queryObservable.currentResult() }),
            d
          );
        }
        return (
          k(b, a),
          (b.prototype.fetchData = function() {
            var a = this.props,
              b = a.children,
              c = a.ssr,
              d = m(a, ['children', 'ssr']),
              e = d.fetchPolicy;
            if (!1 === c) return !1;
            ('network-only' === e || 'cache-and-network' === e) &&
              (e = 'cache-first');
            var f = this.client.watchQuery(l({}, d, { fetchPolicy: e })),
              g = this.queryObservable.currentResult();
            return !!g.loading && f.result();
          }),
          (b.prototype.componentDidMount = function() {
            this.startQuerySubscription();
          }),
          (b.prototype.componentWillReceiveProps = function(a, b) {
            (f(this.props, a) && this.client === b.client) ||
              (this.client !== b.client && (this.client = b.client),
              this.removeQuerySubscription(),
              this.initializeQueryObservable(a),
              this.startQuerySubscription(),
              this.updateCurrentData());
          }),
          (b.prototype.componentWillUnmount = function() {
            this.removeQuerySubscription();
          }),
          (b.prototype.render = function() {
            var a = this.props.children,
              b = this.getQueryResult();
            return a(b);
          }),
          (b.prototype.resubscribeToQuery = function() {
            this.removeQuerySubscription();
            var a = this.queryObservable.getLastError(),
              b = this.queryObservable.getLastResult();
            this.queryObservable.resetLastResults(),
              this.startQuerySubscription(),
              Object.assign(this.queryObservable, {
                lastError: a,
                lastResult: b,
              });
          }),
          (b.contextTypes = { client: d.object.isRequired }),
          b
        );
      })(b.Component);
      c.default = o;
    });
  l(y);
  var z = m(function(a, j) {
    function k(a) {
      var b = h(
        a,
        'variables',
        'refetch',
        'fetchMore',
        'updateQuery',
        'startPolling',
        'stopPolling',
        'subscribeToMore',
      );
      return (
        Object.keys(b).forEach(function(c) {
          var d = c;
          'function' == typeof b[d] && (b[d] = b[d].bind(a));
        }),
        b
      );
    }
    function l(a) {
      return a.displayName || a.name || 'Component';
    }
    function m(a, h) {
      function j(j) {
        var m = y + '(' + l(j) + ')',
          n = (function(i) {
            function n(a, b) {
              var c = i.call(this, a, b) || this;
              return (
                (c.previousData = {}),
                (c.version = D),
                (c.type = C.type),
                (c.dataForChildViaMutation = c.dataForChildViaMutation.bind(c)),
                (c.setWrappedInstance = c.setWrappedInstance.bind(c)),
                c
              );
            }
            return (
              o(n, i),
              (n.prototype.componentWillMount = function() {
                this.shouldSkip(this.props) || this.setInitialProps();
              }),
              (n.prototype.componentDidMount = function() {
                if (
                  ((this.hasMounted = !0),
                  this.type !== v.DocumentType.Mutation) &&
                  !this.shouldSkip(this.props) &&
                  (this.subscribeToQuery(), this.refetcherQueue)
                ) {
                  var a = this.refetcherQueue,
                    b = a.args,
                    c = a.resolve,
                    d = a.reject;
                  this.queryObservable
                    .refetch(b)
                    .then(c)
                    .catch(d);
                }
              }),
              (n.prototype.componentWillReceiveProps = function(a, b) {
                if (this.shouldSkip(a))
                  return void (
                    this.shouldSkip(this.props) || this.unsubscribeFromQuery()
                  );
                var c = z(a).client;
                if (
                  !(
                    f(this.props, a) &&
                    (this.client === c || this.client === b.client)
                  )
                )
                  return (
                    (this.shouldRerender = !0),
                    this.client !== c && this.client !== b.client
                      ? ((this.client = c ? c : b.client),
                        this.unsubscribeFromQuery(),
                        (this.queryObservable = null),
                        (this.previousData = {}),
                        this.updateQuery(a),
                        void (this.shouldSkip(a) || this.subscribeToQuery()))
                      : this.type === v.DocumentType.Mutation
                        ? void 0
                        : this.type === v.DocumentType.Subscription &&
                          h.shouldResubscribe &&
                          h.shouldResubscribe(this.props, a)
                          ? (this.unsubscribeFromQuery(),
                            delete this.queryObservable,
                            this.updateQuery(a),
                            void this.subscribeToQuery())
                          : void (this.updateQuery(a), this.subscribeToQuery())
                  );
              }),
              (n.prototype.componentWillUnmount = function() {
                if (this.type === v.DocumentType.Query) {
                  if (this.queryObservable) {
                    var a = this.getQueryRecycler();
                    a &&
                      (a.recycle(this.queryObservable),
                      delete this.queryObservable);
                  }
                  this.unsubscribeFromQuery();
                }
                this.type === v.DocumentType.Subscription &&
                  this.unsubscribeFromQuery(),
                  (this.hasMounted = !1);
              }),
              (n.prototype.getQueryRecycler = function() {
                return (
                  this.context.getQueryRecycler &&
                  this.context.getQueryRecycler(n)
                );
              }),
              (n.prototype.getClient = function(a) {
                if (this.client) return this.client;
                var b = z(a).client;
                return (
                  (this.client = b ? b : this.context.client),
                  e(
                    !!this.client,
                    'Could not find "client" in the context of "' +
                      m +
                      '". Wrap the root component in an <ApolloProvider>',
                  ),
                  this.client
                );
              }),
              (n.prototype.calculateOptions = function(a, b) {
                void 0 === a && (a = this.props);
                var d = z(a);
                if (
                  (b &&
                    b.variables &&
                    (b.variables = c({}, d.variables, b.variables)),
                  b && (d = c({}, d, b)),
                  d.variables || !C.variables.length)
                )
                  return d;
                for (var f = {}, g = 0, h = C.variables; g < h.length; g++) {
                  var i = h[g],
                    k = i.variable,
                    n = i.type;
                  if (k.name && k.name.value) {
                    var o = k.name.value,
                      q = a[o];
                    if ('undefined' != typeof q) {
                      f[o] = q;
                      continue;
                    }
                    if ('NonNullType' !== n.kind) {
                      f[o] = null;
                      continue;
                    }
                    e(
                      'undefined' != typeof q,
                      "The operation '" +
                        C.name +
                        "' wrapping '" +
                        l(j) +
                        "' " +
                        ("is expecting a variable: '" +
                          k.name.value +
                          "' but it was not found in the props ") +
                        ("passed to '" + m + "'"),
                    );
                  }
                }
                return (d = p({}, d, { variables: f })), d;
              }),
              (n.prototype.calculateResultProps = function(a) {
                var b =
                  this.type === v.DocumentType.Mutation ? 'mutate' : 'data';
                h.name && (b = h.name);
                var c = ((d = {}), (d[b] = a), (d.ownProps = this.props), d);
                return B ? B(c) : ((e = {}), (e[b] = r(a)), e);
                var d, e;
              }),
              (n.prototype.setInitialProps = function() {
                if (this.type !== v.DocumentType.Mutation) {
                  var a = this.calculateOptions(this.props);
                  this.createQuery(a);
                }
              }),
              (n.prototype.createQuery = function(b, d) {
                if (
                  (void 0 === d && (d = this.props),
                  this.type === v.DocumentType.Subscription)
                )
                  this.queryObservable = this.getClient(d).subscribe(
                    c({ query: a }, b),
                  );
                else {
                  var e = this.getQueryRecycler(),
                    f = null;
                  e && (f = e.reuse(b)),
                    (this.queryObservable =
                      null === f
                        ? this.getClient(d).watchQuery(
                            c(
                              {
                                query: a,
                                metadata: {
                                  reactComponent: { displayName: m },
                                },
                              },
                              b,
                            ),
                          )
                        : f);
                }
              }),
              (n.prototype.updateQuery = function(a) {
                var b = this.calculateOptions(a);
                this.queryObservable || this.createQuery(b, a),
                  this.queryObservable._setOptionsNoResult
                    ? this.queryObservable._setOptionsNoResult(b)
                    : this.queryObservable.setOptions &&
                      this.queryObservable.setOptions(b).catch(function() {
                        return null;
                      });
              }),
              (n.prototype.fetchData = function() {
                if (this.shouldSkip()) return !1;
                if (
                  C.type === v.DocumentType.Mutation ||
                  C.type === v.DocumentType.Subscription
                )
                  return !1;
                var b = this.calculateOptions();
                if (!1 === b.ssr) return !1;
                ('network-only' === b.fetchPolicy ||
                  'cache-and-network' === b.fetchPolicy) &&
                  (b.fetchPolicy = 'cache-first');
                var d = this.getClient(this.props).watchQuery(
                    c({ query: a }, b),
                  ),
                  e = d.currentResult();
                return !!e.loading && d.result();
              }),
              (n.prototype.subscribeToQuery = function() {
                var a = this;
                if (!this.querySubscription) {
                  var b = function(b) {
                      a.type === v.DocumentType.Subscription &&
                        (a.lastSubscriptionData = b);
                      var c = Object.keys(k(b.data));
                      e(
                        0 === c.length,
                        "the result of the '" +
                          m +
                          "' operation contains keys that conflict with the return object." +
                          c
                            .map(function(a) {
                              return "'" + a + "'";
                            })
                            .join(', ') +
                          ' not allowed.',
                      ),
                        a.forceRenderChildren();
                    },
                    c = function(c) {
                      if (
                        (a.resubscribeToQuery(),
                        c.hasOwnProperty('graphQLErrors'))
                      )
                        return b({ error: c });
                      throw c;
                    };
                  this.querySubscription = this.queryObservable.subscribe({
                    next: b,
                    error: c,
                  });
                }
              }),
              (n.prototype.unsubscribeFromQuery = function() {
                this.querySubscription &&
                  (this.querySubscription.unsubscribe(),
                  delete this.querySubscription);
              }),
              (n.prototype.resubscribeToQuery = function() {
                var a = this.querySubscription;
                a && delete this.querySubscription;
                var b = this.queryObservable,
                  c = b.lastError,
                  d = b.lastResult;
                this.queryObservable.resetLastResults(),
                  this.subscribeToQuery(),
                  Object.assign(this.queryObservable, {
                    lastError: c,
                    lastResult: d,
                  }),
                  a && a.unsubscribe();
              }),
              (n.prototype.shouldSkip = function(a) {
                return void 0 === a && (a = this.props), A(a);
              }),
              (n.prototype.forceRenderChildren = function() {
                (this.shouldRerender = !0),
                  this.hasMounted && this.forceUpdate();
              }),
              (n.prototype.getWrappedInstance = function() {
                return (
                  e(
                    h.withRef,
                    'To access the wrapped instance, you need to specify { withRef: true } in the options',
                  ),
                  this.wrappedInstance
                );
              }),
              (n.prototype.setWrappedInstance = function(a) {
                this.wrappedInstance = a;
              }),
              (n.prototype.dataForChildViaMutation = function(b) {
                var c = this.calculateOptions(this.props, b);
                return (
                  'undefined' == typeof c.variables && delete c.variables,
                  (c.mutation = a),
                  this.getClient(this.props).mutate(c)
                );
              }),
              (n.prototype.dataForChild = function() {
                var a = this;
                if (this.type === v.DocumentType.Mutation)
                  return this.dataForChildViaMutation;
                var b = this.calculateOptions(this.props),
                  d = {};
                if (
                  (c(d, k(this.queryObservable)),
                  this.type === v.DocumentType.Subscription)
                )
                  c(
                    d,
                    {
                      loading: !this.lastSubscriptionData,
                      variables: b.variables,
                    },
                    this.lastSubscriptionData && this.lastSubscriptionData.data,
                  );
                else {
                  var e = this.queryObservable.currentResult(),
                    f = e.loading,
                    h = e.networkStatus,
                    i = e.errors,
                    j = e.error;
                  i &&
                    0 < i.length &&
                    (j = new g.ApolloError({ graphQLErrors: i })),
                    c(d, { loading: f, networkStatus: h });
                  var l = setTimeout(function() {
                    if (j) {
                      var a = j;
                      j.stack &&
                        (a = j.stack.includes(j.message)
                          ? j.stack
                          : j.message + '\n' + j.stack),
                        console.error(
                          'Unhandled (in react-apollo:' + m + ')',
                          a,
                        );
                    }
                  }, 10);
                  Object.defineProperty(d, 'error', {
                    configurable: !0,
                    enumerable: !0,
                    get: function() {
                      return clearTimeout(l), j;
                    },
                  }),
                    f
                      ? c(d, this.previousData, e.data)
                      : j
                        ? c(
                            d,
                            (this.queryObservable.getLastResult() || {}).data,
                          )
                        : (c(d, e.data), (this.previousData = e.data)),
                    this.querySubscription ||
                      (d.refetch = function(b) {
                        return new Promise(function(c, d) {
                          a.refetcherQueue = { resolve: c, reject: d, args: b };
                        });
                      });
                }
                return d;
              }),
              (n.prototype.render = function() {
                if (this.shouldSkip())
                  return h.withRef
                    ? b.createElement(
                        j,
                        p(
                          {},
                          c({}, this.props, { ref: this.setWrappedInstance }),
                        ),
                      )
                    : b.createElement(j, p({}, this.props));
                var a = this,
                  d = a.shouldRerender,
                  e = a.renderedElement,
                  f = a.props;
                if (((this.shouldRerender = !1), !d && e && e.type === j))
                  return e;
                var g = this.dataForChild(),
                  i = this.calculateResultProps(g),
                  k = c({}, f, i);
                return (
                  h.withRef && (k.ref = this.setWrappedInstance),
                  (this.renderedElement = b.createElement(j, p({}, k))),
                  this.renderedElement
                );
              }),
              (n.displayName = m),
              (n.WrappedComponent = j),
              (n.contextTypes = { client: d.object, getQueryRecycler: d.func }),
              n
            );
          })(b.Component);
        return i(n, j, {});
      }
      void 0 === h && (h = {});
      var m = h.options,
        n = void 0 === m ? q : m,
        u = h.skip,
        w = void 0 === u ? s : u,
        x = h.alias,
        y = void 0 === x ? 'Apollo' : x,
        z = n;
      'function' != typeof z &&
        (z = function() {
          return n;
        });
      var A = w;
      'function' != typeof A &&
        (A = function() {
          return w;
        });
      var B = h.props,
        C = v.parser(a),
        D = t++;
      return j;
    }
    var o =
        (n && n.__extends) ||
        (function() {
          var a =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(a, c) {
                a.__proto__ = c;
              }) ||
            function(a, c) {
              for (var b in c) c.hasOwnProperty(b) && (a[b] = c[b]);
            };
          return function(c, d) {
            function b() {
              this.constructor = c;
            }
            a(c, d),
              (c.prototype =
                null === d
                  ? Object.create(d)
                  : ((b.prototype = d.prototype), new b()));
          };
        })(),
      p =
        (n && n.__assign) ||
        Object.assign ||
        function(a) {
          for (var b, c = 1, d = arguments.length; c < d; c++)
            for (var e in ((b = arguments[c]), b))
              Object.prototype.hasOwnProperty.call(b, e) && (a[e] = b[e]);
          return a;
        };
    Object.defineProperty(j, '__esModule', { value: !0 });
    var q = function() {
        return {};
      },
      r = function(a) {
        return a;
      },
      s = function() {
        return !1;
      },
      t = 0;
    j.default = m;
  });
  l(z);
  var A = m(function(a, d) {
    function f(a) {
      return a.displayName || a.name || 'Component';
    }
    function g(a, d) {
      void 0 === d && (d = {});
      var g = 'withApollo(' + f(a) + ')',
        k = (function(f) {
          function i(a) {
            var b = f.call(this, a) || this;
            return (b.setWrappedInstance = b.setWrappedInstance.bind(b)), b;
          }
          return (
            h(i, f),
            (i.prototype.getWrappedInstance = function() {
              return (
                e(
                  d.withRef,
                  'To access the wrapped instance, you need to specify { withRef: true } in the options',
                ),
                this.wrappedInstance
              );
            }),
            (i.prototype.setWrappedInstance = function(a) {
              this.wrappedInstance = a;
            }),
            (i.prototype.render = function() {
              var e = this;
              return b.createElement(q.default, null, function(f) {
                var g = c({}, e.props, {
                  client: f,
                  ref: d.withRef ? e.setWrappedInstance : void 0,
                });
                return b.createElement(a, j({}, g));
              });
            }),
            (i.displayName = g),
            (i.WrappedComponent = a),
            i
          );
        })(b.Component);
      return i(k, a, {});
    }
    var h =
        (n && n.__extends) ||
        (function() {
          var a =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(a, c) {
                a.__proto__ = c;
              }) ||
            function(a, c) {
              for (var b in c) c.hasOwnProperty(b) && (a[b] = c[b]);
            };
          return function(c, d) {
            function b() {
              this.constructor = c;
            }
            a(c, d),
              (c.prototype =
                null === d
                  ? Object.create(d)
                  : ((b.prototype = d.prototype), new b()));
          };
        })(),
      j =
        (n && n.__assign) ||
        Object.assign ||
        function(a) {
          for (var b, c = 1, d = arguments.length; c < d; c++)
            for (var e in ((b = arguments[c]), b))
              Object.prototype.hasOwnProperty.call(b, e) && (a[e] = b[e]);
          return a;
        };
    Object.defineProperty(d, '__esModule', { value: !0 }), (d.default = g);
  });
  l(A);
  var B = m(function(a, b) {
    function c(a) {
      for (var c in a) b.hasOwnProperty(c) || (b[c] = a[c]);
    }
    Object.defineProperty(b, '__esModule', { value: !0 }),
      (b.getDataFromTree = o.default),
      c(o),
      (b.ApolloConsumer = q.default),
      c(q),
      (b.ApolloProvider = u.default),
      c(u),
      (b.Query = y.default),
      c(y),
      (b.graphql = z.default),
      c(z),
      (b.withApollo = A.default),
      (b.compose = j);
  });
  l(B);
  var C = B.getDataFromTree,
    D = B.ApolloConsumer,
    E = B.ApolloProvider,
    F = B.Query,
    G = B.graphql,
    H = B.withApollo,
    I = B.compose,
    J = m(function(a, b) {
      Object.defineProperty(b, '__esModule', { value: !0 }),
        (b.renderToStringWithData = function(a) {
          return o.default(a).then(function() {
            return k.renderToString(a);
          });
        });
    });
  l(J);
  var K = J.renderToStringWithData,
    L = m(function(a, b) {
      Object.defineProperty(b, '__esModule', { value: !0 }),
        (function(a) {
          for (var c in a) b.hasOwnProperty(c) || (b[c] = a[c]);
        })(B),
        (b.renderToStringWithData = J.renderToStringWithData);
    }),
    M = l(L),
    N = L.renderToStringWithData;
  (a.default = M),
    (a.renderToStringWithData = N),
    Object.defineProperty(a, '__esModule', { value: !0 });
});
