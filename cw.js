(()=>{
    var __webpack_modules__ = {
        385: e=>{
            e.exports = function() {
                function e(e, t) {
                    this.namespace = e || "CacheDBDefaultNameSpace",
                    this.prefix = t || "CacheDBDefaultPrefix",
                    this.read = async function(e, t) {
                        return t = t || {
                            type: "text"
                        },
                        new Promise(((n,r)=>{
                            caches.open(this.namespace).then((r=>{
                                r.match(new Request(`https://${this.prefix}/${encodeURIComponent(e)}`)).then((e=>{
                                    switch (t.type) {
                                    case "json":
                                        return void n(e.json());
                                    case "arrayBuffer":
                                        return void n(e.arrayBuffer());
                                    case "blob":
                                        return void n(e.blob());
                                    default:
                                        return void n(e.text())
                                    }
                                }
                                )).catch((e=>{
                                    n(null)
                                }
                                ))
                            }
                            ))
                        }
                        ))
                    }
                    ,
                    this.write = async function(e, t, n) {
                        return n = n || {
                            type: "text"
                        },
                        new Promise(((r,i)=>{
                            caches.open(this.namespace).then((i=>{
                                i.put(new Request(`https://${this.prefix}/${encodeURIComponent(e)}`), new Response(t,{
                                    headers: {
                                        "Content-Type": (()=>{
                                            switch (n.type) {
                                            case "json":
                                                return "application/json";
                                            case "arrayBuffer":
                                            case "blob":
                                                return "application/octet-stream";
                                            default:
                                                return "text/plain"
                                            }
                                        }
                                        )()
                                    }
                                })).then(r(!0)).catch((e=>{
                                    r(!1)
                                }
                                ))
                            }
                            ))
                        }
                        ))
                    }
                    ,
                    this.delete = async function(e) {
                        return new Promise(((t,n)=>{
                            caches.open(this.namespace).then((n=>{
                                n.delete(new Request(`https://${this.prefix}/${encodeURIComponent(e)}`)).then(t(!0)).catch((e=>{
                                    t(!1)
                                }
                                ))
                            }
                            ))
                        }
                        ))
                    }
                }
                return e
            }()
        }
        ,
        710: (__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__)=>{
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Z: ()=>__WEBPACK_DEFAULT_EXPORT__
            });
            var js_yaml__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(272)
              , _chenyfan_cache_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(385)
              , _utils_engine_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(671)
              , _package_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(147);
            const router_cgi = async request=>{
                const db = new _chenyfan_cache_db__WEBPACK_IMPORTED_MODULE_1__
                  , urlStr = request.url.toString()
                  , urlObj = new URL(urlStr)
                  , pathname = urlObj.pathname
                  , q = e=>urlObj.searchParams.get(e);
                let config;
                switch (pathname.split("/")[2]) {
                case "hello":
                    return new Response("Hello ClientWorker!");
                case "info":
                    return new Response(JSON.stringify({
                        version: _package_json__WEBPACK_IMPORTED_MODULE_3__.i8
                    }),{
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                case "page":
                    return "install" === q("type") ? fetch("/404") : new Response("Error, page type not found");
                case "api":
                    switch (q("type")) {
                    case "config":
                        return fetch(q("url") || "/config.yaml").then((e=>e.text())).then((e=>js_yaml__WEBPACK_IMPORTED_MODULE_0__.ZP.load(e))).then((async e=>(await db.write("config", JSON.stringify(e), {
                            type: "json"
                        }),
                        new Response("ok")))).catch((async e=>(await db.write("config", ""),
                        new Response(e))));
                    case "clear":
                        return caches.open("ClientWorker_ResponseCache").then((async e=>e.keys().then((async t=>(await Promise.all(t.map((t=>{
                            e.delete(t)
                        }
                        ))),
                        new Response("ok"))))));
                    case "hotpatch":
                        if (config = JSON.parse(await db.read("config")),
                        "object" != typeof config.hotpatch)
                            return new Response("Error, config.hotpatch not found");
                        const hotpatch = config.hotpatch;
                        return await _utils_engine_js__WEBPACK_IMPORTED_MODULE_2__.Z.parallel(hotpatch).then((e=>e.text())).then((async script=>{
                            await db.write("hotpatch", script, {
                                type: "text"
                            }),
                            eval(script)
                        }
                        )),
                        new Response("ok");
                    case "hotconfig":
                        if (config = JSON.parse(await db.read("config")),
                        "object" != typeof config.hotconfig)
                            return new Response("Error, config.hotconfig not found");
                        const hotconfig = config.hotconfig
                          , nConfig = await _utils_engine_js__WEBPACK_IMPORTED_MODULE_2__.Z.parallel(hotconfig).then((e=>e.text())).then((e=>js_yaml__WEBPACK_IMPORTED_MODULE_0__.ZP.load(e))).then((e=>JSON.stringify(e))).catch((e=>""));
                        return nConfig && await db.write("config", nConfig),
                        new Response("ok");
                    default:
                        return new Response("Error, api type not found")
                    }
                default:
                    return new Response("Not Found!, Client Worker!")
                }
            }
              , __WEBPACK_DEFAULT_EXPORT__ = router_cgi
        }
        ,
        755: (__unused_webpack___webpack_module__,__unused_webpack___webpack_exports__,__webpack_require__)=>{
            "use strict";
            var _cgi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(710)
              , _chenyfan_cache_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(385)
              , _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(70)
              , _utils_engine_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(671)
              , _utils_rebuild_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(431);
            self.clientworkerhandle = async request=>{
                const domain = new URL(new Request("").url).host
                  , db = new _chenyfan_cache_db__WEBPACK_IMPORTED_MODULE_1__;
                let tReq = request;
                const urlStr = tReq.url.toString()
                  , urlObj = new URL(urlStr)
                  , pathname = urlObj.pathname;
                if ("cw-cgi" === pathname.split("/")[1])
                    return (0,
                    _cgi_js__WEBPACK_IMPORTED_MODULE_0__.Z)(request);
                const config = await db.read("config", {
                    type: "json"
                });
                if (!config)
                    return fetch(request);
                let tFetched = !1
                  , EngineFetch = !1
                  , fetchConfig = {}
                  , EngineFetchList = []
                  , tRes = new Response;
                for (let catch_rule of config.catch_rules)
                    if ("_" === catch_rule.rule && (catch_rule.rule = domain),
                    tReq.url.match(new RegExp(catch_rule.rule)))
                        for (let transform_rule of catch_rule.transform_rules) {
                            let tSearched = !1;
                            switch ("_" === transform_rule.search && (transform_rule.search = catch_rule.rule),
                            transform_rule.searchin || "url") {
                            case "url":
                                tReq.url.match(new RegExp(transform_rule.search,transform_rule.searchflags)) && (tSearched = !0);
                                break;
                            case "header":
                                tReq.headers.get(transform_rule.searchkey).match(new RegExp(transform_rule.search,transform_rule.searchflags)) && (tSearched = !0);
                                break;
                            case "status":
                                if (!tFetched) {
                                    _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.w(`${tReq.url} is not fetched yet,the status rule are ignored`);
                                    break
                                }
                                String(tRes.status).match(new RegExp(transform_rule.search,transform_rule.searchflags)) && (tSearched = !0);
                                break;
                            case "statusText":
                                if (!tFetched) {
                                    _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.w(`${tReq.url} is not fetched yet,the statusText rule are ignored`);
                                    break
                                }
                                tRes.statusText.match(new RegExp(transform_rule.search,transform_rule.searchflags)) && (tSearched = !0);
                                break;
                            case "body":
                                if (!tFetched) {
                                    _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.w(`${tReq.url} is not fetched yet,the body rule are ignored`);
                                    break
                                }
                                (await tRes.clone().text()).match(new RegExp(transform_rule.search,transform_rule.searchflags)) && (tSearched = !0);
                                break;
                            default:
                                _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.e(`${tReq.url} the ${transform_rule.searchin} search rule are not supported`)
                            }
                            switch (transform_rule.replacein || "url") {
                            case "url":
                                if (tFetched && tSearched) {
                                    _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.w(`${tReq.url} is already fetched,the url transform rule:${transform_rule.search} are ignored`);
                                    break
                                }
                                if (void 0 !== transform_rule.replace && tSearched)
                                    if ("string" == typeof transform_rule.replace)
                                        EngineFetch && _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.w(`EngineFetch Disabled for ${tReq.url},the request will downgrade to normal fetch`),
                                        tReq = _utils_rebuild_js__WEBPACK_IMPORTED_MODULE_4__.Z.request(tReq, {
                                            url: tReq.url.replace(new RegExp(transform_rule.replacekey || transform_rule.search,transform_rule.replaceflags), transform_rule.replace)
                                        }),
                                        EngineFetch = !1;
                                    else {
                                        if (EngineFetch) {
                                            _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.w(`Replacement cannot be used for ${tReq.url},the request is already powered by fetch-engine `);
                                            break
                                        }
                                        transform_rule.replace.forEach((e=>{
                                            "_" !== e ? EngineFetchList.push(_utils_rebuild_js__WEBPACK_IMPORTED_MODULE_4__.Z.request(tReq, {
                                                url: tReq.url.replace(new RegExp(transform_rule.replacekey || transform_rule.search,transform_rule.replaceflags), e)
                                            })) : EngineFetchList.push(tReq)
                                        }
                                        )),
                                        EngineFetch = !0
                                    }
                                break;
                            case "body":
                                tSearched && (tFetched ? tRes = _utils_rebuild_js__WEBPACK_IMPORTED_MODULE_4__.Z.response(tRes, {
                                    body: (await tRes.clone().text()).replace(new RegExp(transform_rule.replacekey || transform_rule.search,transform_rule.replaceflags), transform_rule.replace)
                                }) : tReq = _utils_rebuild_js__WEBPACK_IMPORTED_MODULE_4__.Z.request(tReq, {
                                    body: (await tReq.clone().text()).replace(new RegExp(transform_rule.replacekey || transform_rule.search,transform_rule.replaceflags), transform_rule.replace)
                                }));
                                break;
                            case "status":
                                "string" == typeof transform_rule.replace && tSearched && (tRes = _utils_rebuild_js__WEBPACK_IMPORTED_MODULE_4__.Z.response(tRes, {
                                    status: tRes.status.replace(new RegExp(transform_rule.replacekey || transform_rule.search,transform_rule.replaceflags), transform_rule.replace)
                                }));
                                break;
                            case "statusText":
                                "string" == typeof transform_rule.replace && tSearched && (tRes = _utils_rebuild_js__WEBPACK_IMPORTED_MODULE_4__.Z.response(tRes, {
                                    statusText: tRes.statusText.replace(new RegExp(transform_rule.replacekey || transform_rule.search,transform_rule.replaceflags), transform_rule.replace)
                                }));
                                break;
                            default:
                                _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.e(`${tReq.url} the ${transform_rule.replacein} replace rule are not supported`)
                            }
                            if (tSearched) {
                                if ("object" == typeof transform_rule.header)
                                    for (var header in transform_rule.header)
                                        tFetched ? tRes = _utils_rebuild_js__WEBPACK_IMPORTED_MODULE_4__.Z.response(tRes, {
                                            headers: {
                                                [header]: transform_rule.header[header]
                                            }
                                        }) : tReq = _utils_rebuild_js__WEBPACK_IMPORTED_MODULE_4__.Z.request(tReq, {
                                            headers: {
                                                [header]: transform_rule.header[header]
                                            }
                                        });
                                if (void 0 !== transform_rule.action)
                                    switch (transform_rule.action) {
                                    case "skip":
                                        return fetch(request);
                                    case "fetch":
                                        if (tFetched) {
                                            _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.w(`${tReq.url} is already fetched,the fetch action are ignored`);
                                            break
                                        }
                                        if (void 0 === transform_rule.fetch) {
                                            _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.e(`Fetch Config is not defined for ${tReq.url}`);
                                            break
                                        }
                                        if (fetchConfig = {
                                            status: transform_rule.fetch.status,
                                            mode: transform_rule.fetch.mode,
                                            credentials: transform_rule.fetch.credentials,
                                            redirect: transform_rule.fetch.redirect,
                                            timeout: transform_rule.fetch.timeout,
                                            threads: transform_rule.fetch.threads,
                                            limit: transform_rule.fetch.limit
                                        },
                                        !transform_rule.fetch.preflight)
                                            for (var eReq in tReq = new Request(tReq.url,{
                                                method: (method = tReq.method,
                                                "GET" === method || "HEAD" === method || "POST" === method ? method : "GET"),
                                                body: (body = tReq.body,
                                                "POST" === tReq.method ? body : null)
                                            }),
                                            delete fetchConfig.credentials,
                                            EngineFetchList)
                                                EngineFetchList[eReq] = new Request(EngineFetchList[eReq].url,tReq);
                                        tRes = await new Promise((async(res,rej)=>{
                                            const EngineFetcher = async()=>{
                                                let cRes;
                                                return new Promise((async(resolve,reject)=>{
                                                    if (EngineFetch)
                                                        switch (transform_rule.fetch.engine || "parallel") {
                                                        case "classic":
                                                            cRes = await _utils_engine_js__WEBPACK_IMPORTED_MODULE_3__.Z.classic(EngineFetchList, fetchConfig);
                                                            break;
                                                        case "parallel":
                                                            cRes = await _utils_engine_js__WEBPACK_IMPORTED_MODULE_3__.Z.parallel(EngineFetchList, fetchConfig);
                                                            break;
                                                        case "KFCThursdayVW50":
                                                            4 === (new Date).getDay() && _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.e("VW50! The Best Fetch Engine in the World Said!"),
                                                            cRes = await _utils_engine_js__WEBPACK_IMPORTED_MODULE_3__.Z.KFCThursdayVW50(EngineFetchList, fetchConfig);
                                                            break;
                                                        default:
                                                            _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.e(`Fetch Engine ${transform_rule.fetch.engine} is not supported`)
                                                        }
                                                    else
                                                        switch (transform_rule.fetch.engine || "fetch") {
                                                        case "fetch":
                                                            cRes = await _utils_engine_js__WEBPACK_IMPORTED_MODULE_3__.Z.fetch(tReq, fetchConfig);
                                                            break;
                                                        case "crazy":
                                                            cRes = await _utils_engine_js__WEBPACK_IMPORTED_MODULE_3__.Z.crazy(tReq, fetchConfig);
                                                            break;
                                                        default:
                                                            _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.e(`${tReq.url} the ${transform_rule.fetch.engine} engine are not supported`)
                                                        }
                                                    "object" == typeof transform_rule.fetch.cache && cRes.status === (transform_rule.fetch.status || 200) ? (cRes = _utils_rebuild_js__WEBPACK_IMPORTED_MODULE_4__.Z.response(cRes, {
                                                        headers: {
                                                            ClientWorker_ExpireTime: (new Date).getTime() + Number(eval(transform_rule.fetch.cache.expire || "0"))
                                                        }
                                                    }),
                                                    caches.open("ClientWorker_ResponseCache").then((e=>{
                                                        e.put(tReq, cRes.clone()).then((()=>{
                                                            resolve(cRes)
                                                        }
                                                        ))
                                                    }
                                                    ))) : resolve(cRes)
                                                }
                                                ))
                                            }
                                            ;
                                            "object" == typeof transform_rule.fetch.cache ? caches.open("ClientWorker_ResponseCache").then((e=>{
                                                e.match(tReq).then((e=>{
                                                    if (e) {
                                                        if (Number(e.headers.get("ClientWorker_ExpireTime")) > (new Date).getTime())
                                                            return _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.s(`${tReq.url} is fetched from cache`),
                                                            void res(e);
                                                        _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.w(`${tReq.url} is expired.`),
                                                        res(Promise.any([EngineFetcher(), new Promise((async(t,n)=>{
                                                            setTimeout((()=>{
                                                                _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.e(`${tReq.url} is too late to fetch,even though the cache has expired,so return by cache`),
                                                                t(e)
                                                            }
                                                            ), transform_rule.fetch.cache.delay || 3e3)
                                                        }
                                                        ))]))
                                                    } else
                                                        _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.w(`${tReq.url} is not cached!And it is too late to fetch!`),
                                                        res(EngineFetcher())
                                                }
                                                ))
                                            }
                                            )) : res(EngineFetcher())
                                        }
                                        )),
                                        tFetched = !0;
                                        break;
                                    case "redirect":
                                        if (void 0 === transform_rule.redirect) {
                                            _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.e(`Redirect Config is not defined for ${tReq.url}`);
                                            break
                                        }
                                        return "string" == typeof transform_rule.redirect.url ? Response.redirect(transform_rule.redirect.url, transform_rule.redirect.status || 301) : Response.redirect(tReq.url.replace(new RegExp(transform_rule.search), transform_rule.redirect.to), transform_rule.redirect.status || 301);
                                    case "return":
                                        return void 0 === transform_rule.return && (transform_rule.return = {}),
                                        new Response(transform_rule.return.body || "Error!",{
                                            status: transform_rule.return.status || 503,
                                            headers: transform_rule.return.headers || {}
                                        });
                                    case "script":
                                        if (void 0 === transform_rule.script) {
                                            _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.e(`Script Config is not defined for ${tReq.url}`);
                                            break
                                        }
                                        if ("string" == typeof transform_rule.script.function) {
                                            const ClientWorkerAnonymousFunctionName = `ClientWorker_AnonymousFunction_${(new Date).getTime()}`;
                                            self[ClientWorkerAnonymousFunctionName] = eval(transform_rule.script.function),
                                            transform_rule.script.name = ClientWorkerAnonymousFunctionName
                                        }
                                        const ScriptAns = await Function("return (" + transform_rule.script.name + ")")()({
                                            fetched: tFetched,
                                            request: tReq,
                                            response: tRes
                                        });
                                        if (ScriptAns.fetched) {
                                            if (transform_rule.script.skip)
                                                return ScriptAns.response;
                                            tFetched = !0,
                                            tRes = ScriptAns.response
                                        } else
                                            tReq = ScriptAns.request;
                                        break;
                                    default:
                                        _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.w(`This Action:${transform_rule.action} is not supported yet`)
                                    }
                            }
                        }
                var body, method;
                return tFetched ? tRes : fetch(request)
            }
            ;
            var __WEBPACK_DEFAULT_EXPORT__ = {}
        }
        ,
        70: (e,t,n)=>{
            "use strict";
            n.d(t, {
                Z: ()=>r
            });
            const r = {
                s: e=>{
                    console.log(`%c[SUCCESS]%c ${e}`, "color:white;background:green;", "")
                }
                ,
                w: e=>{
                    console.log(`%c[WARNING]%c ${e}`, "color:brown;background:yellow;", "")
                }
                ,
                i: e=>{
                    console.log(`%c[INFO]%c ${e}`, "color:white;background:blue;", "")
                }
                ,
                e: e=>{
                    console.log(`%c[ERROR]%c ${e}`, "color:white;background:red;", "")
                }
                ,
                d: e=>{
                    console.log(`%c[DEBUG]%c ${e}`, "color:white;background:black;", "")
                }
            }
        }
        ,
        671: (e,t,n)=>{
            "use strict";
            n.d(t, {
                Z: ()=>o
            });
            var r = n(70)
              , i = n(431);
            Promise.any || (Promise.any = function(e) {
                return new Promise(((t,n)=>{
                    let r = (e = Array.isArray(e) ? e : []).length
                      , i = [];
                    if (0 === r)
                        return n(new AggregateError("All promises were rejected"));
                    e.forEach((e=>{
                        e.then((e=>{
                            t(e)
                        }
                        ), (e=>{
                            r--,
                            i.push(e),
                            0 === r && n(new AggregateError(i))
                        }
                        ))
                    }
                    ))
                }
                ))
            }
            );
            const a = {
                fetch: async(e,t)=>(t = t || {
                    status: 200
                },
                new Promise(((n,r)=>{
                    const i = Object.prototype.toString.call(e);
                    "[object String]" !== i && "[object Request]" !== i && r(`FetchEngine.fetch: req must be a string or Request object,but got ${i}`),
                    setTimeout((()=>{
                        r(new Response("504 All GateWays Failed,ClientWorker Show This Page,Engine Fetch",{
                            status: 504,
                            statusText: "504 All Gateways Timeout"
                        }))
                    }
                    ), t.timeout || 5e3),
                    fetch(e, {
                        mode: t.mode,
                        credentials: t.credential,
                        redirect: t.redirect || "follow"
                    }).then((e=>{
                        n(e)
                    }
                    )).catch((e=>{
                        r(e)
                    }
                    ))
                }
                ))),
                crazy: async(e,t)=>{
                    (t = t || {
                        status: 200
                    }).threads = t.threads || 4,
                    t.trylimit = t.trylimit || 10;
                    const n = Object.prototype.toString.call(e);
                    if ("[object String]" !== n && "[object Request]" !== n)
                        return void r.Z.e(`FetchEngine.fetch: req must be a string or Request object,but got ${n}`);
                    const o = new AbortController
                      , s = await fetch(e, {
                        signal: o.signal,
                        mode: t.mode,
                        credentials: t.credential,
                        redirect: t.redirect || "follow"
                    })
                      , c = s.headers
                      , l = c.get("Content-Length");
                    return s.status.toString().match(t.status) ? new Response("504 All GateWays Failed,ClientWorker Show This Page,Engine Crazy",{
                        status: 504,
                        statusText: "504 All Gateways Timeout"
                    }) : (o.abort(),
                    !l || l < t.threads ? (r.Z.e(`FetchEngine.crazy: The Origin is not support Crazy Mode,or the size of the file is less than ${t.threads} bytes,downgrade to normal fetch`),
                    a.fetch(e, t)) : new Promise(((n,r)=>{
                        const a = parseInt(l / t.threads)
                          , o = [];
                        for (let n = 0; n < t.threads; n++)
                            o.push(new Promise((async(o,s)=>{
                                let c = 1;
                                const l = async()=>{
                                    c += 1;
                                    const o = i.Z.request(e, {
                                        headers: {
                                            Range: `bytes=${n * a}-${(n + 1) * a - 1}`
                                        },
                                        url: e.url
                                    });
                                    return fetch(o, {
                                        mode: t.mode,
                                        credentials: t.credential,
                                        redirect: t.redirect || "follow"
                                    }).then((e=>e.arrayBuffer())).catch((e=>{
                                        if (!(c >= t.trylimit))
                                            return l();
                                        r()
                                    }
                                    ))
                                }
                                ;
                                o(l())
                            }
                            )));
                        Promise.all(o).then((e=>{
                            const t = [];
                            for (let n = 0; n < e.length; n++)
                                t.push(e[n]);
                            n(new Response(new Blob(t),{
                                headers: c,
                                status: 200,
                                statusText: "OK"
                            }))
                        }
                        )),
                        setTimeout((()=>{
                            r(new Response("504 All GateWays Failed,ClientWorker Show This Page,Engine Crazy",{
                                status: 504,
                                statusText: "504 All Gateways Timeout"
                            }))
                        }
                        ), t.timeout || 5e3)
                    }
                    )))
                }
                ,
                KFCThursdayVW50: async(e,t)=>{
                    (t = t || {
                        status: 200
                    }).threads = t.threads || 4,
                    t.trylimit = t.trylimit || 10;
                    const n = Object.prototype.toString.call(e);
                    if ("[object String]" === n || "[object Request]" === n)
                        return r.Z.w("FetchEngine.KFCThursdayVW50: reqs is a string or Request object,downgrade to crazy"),
                        a.crazy(e, t);
                    if ("[object Array]" !== n)
                        return r.Z.e(`FetchEngine.KFCThursdayVW50: reqs must be a string or Request object or an array,but got ${n}`),
                        Promise.reject(`FetchEngine.KFCThursdayVW50: reqs must be a string or Request object or an array,but got ${n}`);
                    if ("[object Array]" === n && (0 === e.length && (r.Z.e("FetchEngine.KFCThursdayVW50: reqs array is empty"),
                    reject()),
                    1 === e.length))
                        return r.Z.w("FetchEngine.KFCThursdayVW50: reqs array is only one,downgrade to crazy"),
                        a.crazy(e[0], t);
                    const o = new AbortController
                      , s = await a.parallel(e, {
                        signal: o.signal,
                        mode: t.mode,
                        credentials: t.credential,
                        redirect: t.redirect || "follow",
                        timeout: t.timeout || 3e4
                    })
                      , c = s.headers
                      , l = c.get("Content-Length");
                    return s.status.toString().match(t.status) && reject(new Response("504 All GateWays Failed,ClientWorker Show This Page,Engine KFCThursdayVW50",{
                        status: 504,
                        statusText: "504 All Gateways Timeout"
                    })),
                    o.abort(),
                    !l || l < t.threads ? (r.Z.e(`FetchEngine.KFCThursdayVW50: The Origin is not support KFCThursdayVW50 Mode,or the size of the file is less than ${t.threads} bytes,downgrade to normal fetch`),
                    a.fetch(e, t)) : new Promise(((n,o)=>{
                        const s = parseInt(l / t.threads)
                          , u = [];
                        for (let n = 0; n < t.threads; n++)
                            u.push(new Promise((async(c,l)=>{
                                let u = 1;
                                const p = async()=>{
                                    u += 1;
                                    const c = [];
                                    return e.forEach((e=>{
                                        c.push(i.Z.request(e, {
                                            headers: {
                                                Range: `bytes=${n * s}-${(n + 1) * s - 1}`
                                            },
                                            url: e.url
                                        }))
                                    }
                                    )),
                                    a.parallel(c, {
                                        mode: t.mode,
                                        credentials: t.credential,
                                        redirect: t.redirect || "follow",
                                        timeout: t.timeout || 3e4,
                                        status: 206
                                    }).then((e=>e.arrayBuffer())).catch((async e=>{
                                        if (r.Z.e(`FetchEngine.KFCThursdayVW50: ${await e.text()}`),
                                        !(u >= t.trylimit))
                                            return p();
                                        o()
                                    }
                                    ))
                                }
                                ;
                                c(p())
                            }
                            )));
                        Promise.all(u).then((e=>{
                            const t = [];
                            for (let n = 0; n < e.length; n++)
                                t.push(e[n]);
                            n(new Response(new Blob(t),{
                                headers: c,
                                status: 200,
                                statusText: "OK"
                            }))
                        }
                        )),
                        setTimeout((()=>{
                            o(new Response("504 All GateWays Failed,ClientWorker Show This Page,Engine KFCThursdayVW50",{
                                status: 504,
                                statusText: "504 All Gateways Timeout"
                            }))
                        }
                        ), t.timeout || 3e4)
                    }
                    ))
                }
                ,
                classic: async(e,t)=>new Promise(((n,i)=>{
                    t = t || {
                        status: 200
                    };
                    const o = Object.prototype.toString.call(e);
                    "[object String]" === o || "[object Request]" === o ? (r.Z.w(`FetchEngine.classic: reqs should be an array,but got ${o},this request will downgrade to normal fetch`),
                    n(a.fetch(e, t))) : "[object Array]" !== o ? (r.Z.e(`FetchEngine.classic: reqs must be a string , Request or Array object,but got ${o}`),
                    i()) : "[object Array]" === o && (0 === o.length && (r.Z.e("FetchEngine.classic: reqs array is empty"),
                    i()),
                    1 === o.length && (r.Z.w("FetchEngine.classic: reqs array is only one element,this request will downgrade to normal fetch"),
                    n(a.fetch(e[0], t))));
                    const s = new AbortController
                      , c = async e=>new Response(await e.arrayBuffer(),{
                        status: e.status,
                        headers: e.headers,
                        statusText: e.statusText
                    });
                    Promise.any(e.map((e=>{
                        fetch(e, {
                            signal: s.signal,
                            mode: t.mode,
                            credentials: t.credential,
                            redirect: t.redirect || "follow"
                        }).then(c).then((e=>{
                            e.status.toString().match(t.status) && (s.abort(),
                            n(e))
                        }
                        )).catch((e=>{
                            "DOMException: The user aborted a request." == e && console.log()
                        }
                        ))
                    }
                    ))),
                    setTimeout((()=>{
                        i(new Response("504 All GateWays Failed,ClientWorker Show This Page,Engine Classic",{
                            status: 504,
                            statusText: "504 All Gateways Timeout"
                        }))
                    }
                    ), t.timeout || 5e3)
                }
                )),
                parallel: async(e,t)=>new Promise(((n,o)=>{
                    t = t || {
                        status: 200
                    };
                    const s = Object.prototype.toString.call(e);
                    "[object String]" === s || "[object Request]" === s ? (r.Z.w(`FetchEngine.parallel: reqs should be an array,but got ${s},this request will downgrade to normal fetch`),
                    n(a.fetch(e, t))) : "[object Array]" !== s ? (r.Z.e(`FetchEngine.parallel: reqs must be a string , Request or Array object,but got ${s}`),
                    o()) : "[object Array]" === s && (0 === s.length && (r.Z.e("FetchEngine.parallel: reqs array is empty"),
                    o()),
                    1 === s.length && (r.Z.w("FetchEngine.parallel: reqs array is only one element,this request will downgrade to normal fetch"),
                    n(a.fetch(e[0], t))));
                    const c = new Event("abortOtherInstance")
                      , l = new EventTarget;
                    Promise.any(e.map((async e=>{
                        let r = new AbortController
                          , a = !1;
                        l.addEventListener(c.type, (()=>{
                            a || r.abort()
                        }
                        )),
                        fetch(e, {
                            signal: r.signal,
                            mode: t.mode,
                            credentials: t.credential,
                            redirect: t.redirect || "follow"
                        }).then((e=>{
                            e.status.toString().match(t.status) && (a = !0,
                            l.dispatchEvent(c),
                            n(i.Z.response(e, {})))
                        }
                        )).catch((e=>{
                            "DOMException: The user aborted a request." == e && console.log()
                        }
                        ))
                    }
                    ))),
                    setTimeout((()=>{
                        o(new Response("504 All GateWays Failed,ClientWorker Show This Page,Engine Parallel",{
                            status: 504,
                            statusText: "504 All Gateways Timeout"
                        }))
                    }
                    ), t.timeout || 5e3)
                }
                ))
            }
              , o = a
        }
        ,
        431: (e,t,n)=>{
            "use strict";
            n.d(t, {
                Z: ()=>o
            });
            var r = n(70);
            const i = {
                request: (e,t)=>{
                    "navigate" === (e = e.clone()).mode && r.Z.w("You can't rebuild a POST method with body when it is a navigate request.ClientWorker will ignore it's body");
                    let n = new Request(e,{
                        headers: a(e, t.headers),
                        method: t.method || e.method,
                        mode: "navigate" === e.mode ? "same-origin" : t.mode || e.mode,
                        credentials: t.credentials || e.credentials,
                        redirect: t.redirect || e.redirect
                    });
                    return t.url && (n = new Request(t.url,n)),
                    n
                }
                ,
                response: (e,t)=>{
                    if ("opaque" === e.type)
                        return r.Z.e("You can't rebuild a opaque response.ClientWorker will ignore this build"),
                        e;
                    return new Response(e.body,{
                        headers: a(e, t.headers),
                        status: t.status || e.status,
                        statusText: t.statusText || e.statusText
                    })
                }
            }
              , a = (e,t)=>{
                if (t) {
                    const n = new Headers(e.headers);
                    for (let e in t)
                        void 0 !== t[e] ? n.set(e, t[e]) : n.delete(e);
                    return n
                }
                return new Headers(e.headers)
            }
              , o = i
        }
        ,
        272: (e,t,n)=>{
            "use strict";
            /*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
            function r(e) {
                return null == e
            }
            n.d(t, {
                ZP: ()=>et
            });
            var i = {
                isNothing: r,
                isObject: function(e) {
                    return "object" == typeof e && null !== e
                },
                toArray: function(e) {
                    return Array.isArray(e) ? e : r(e) ? [] : [e]
                },
                repeat: function(e, t) {
                    var n, r = "";
                    for (n = 0; n < t; n += 1)
                        r += e;
                    return r
                },
                isNegativeZero: function(e) {
                    return 0 === e && Number.NEGATIVE_INFINITY === 1 / e
                },
                extend: function(e, t) {
                    var n, r, i, a;
                    if (t)
                        for (n = 0,
                        r = (a = Object.keys(t)).length; n < r; n += 1)
                            e[i = a[n]] = t[i];
                    return e
                }
            };
            function a(e, t) {
                var n = ""
                  , r = e.reason || "(unknown reason)";
                return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '),
                n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")",
                !t && e.mark.snippet && (n += "\n\n" + e.mark.snippet),
                r + " " + n) : r
            }
            function o(e, t) {
                Error.call(this),
                this.name = "YAMLException",
                this.reason = e,
                this.mark = t,
                this.message = a(this, !1),
                Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (new Error).stack || ""
            }
            o.prototype = Object.create(Error.prototype),
            o.prototype.constructor = o,
            o.prototype.toString = function(e) {
                return this.name + ": " + a(this, e)
            }
            ;
            var s = o;
            function c(e, t, n, r, i) {
                var a = ""
                  , o = ""
                  , s = Math.floor(i / 2) - 1;
                return r - t > s && (t = r - s + (a = " ... ").length),
                n - r > s && (n = r + s - (o = " ...").length),
                {
                    str: a + e.slice(t, n).replace(/\t/g, "→") + o,
                    pos: r - t + a.length
                }
            }
            function l(e, t) {
                return i.repeat(" ", t - e.length) + e
            }
            var u = function(e, t) {
                if (t = Object.create(t || null),
                !e.buffer)
                    return null;
                t.maxLength || (t.maxLength = 79),
                "number" != typeof t.indent && (t.indent = 1),
                "number" != typeof t.linesBefore && (t.linesBefore = 3),
                "number" != typeof t.linesAfter && (t.linesAfter = 2);
                for (var n, r = /\r?\n|\r|\0/g, a = [0], o = [], s = -1; n = r.exec(e.buffer); )
                    o.push(n.index),
                    a.push(n.index + n[0].length),
                    e.position <= n.index && s < 0 && (s = a.length - 2);
                s < 0 && (s = a.length - 1);
                var u, p, _ = "", f = Math.min(e.line + t.linesAfter, o.length).toString().length, h = t.maxLength - (t.indent + f + 3);
                for (u = 1; u <= t.linesBefore && !(s - u < 0); u++)
                    p = c(e.buffer, a[s - u], o[s - u], e.position - (a[s] - a[s - u]), h),
                    _ = i.repeat(" ", t.indent) + l((e.line - u + 1).toString(), f) + " | " + p.str + "\n" + _;
                for (p = c(e.buffer, a[s], o[s], e.position, h),
                _ += i.repeat(" ", t.indent) + l((e.line + 1).toString(), f) + " | " + p.str + "\n",
                _ += i.repeat("-", t.indent + f + 3 + p.pos) + "^\n",
                u = 1; u <= t.linesAfter && !(s + u >= o.length); u++)
                    p = c(e.buffer, a[s + u], o[s + u], e.position - (a[s] - a[s + u]), h),
                    _ += i.repeat(" ", t.indent) + l((e.line + u + 1).toString(), f) + " | " + p.str + "\n";
                return _.replace(/\n$/, "")
            }
              , p = ["kind", "multi", "resolve", "construct", "instanceOf", "predicate", "represent", "representName", "defaultStyle", "styleAliases"]
              , _ = ["scalar", "sequence", "mapping"];
            var f = function(e, t) {
                if (t = t || {},
                Object.keys(t).forEach((function(t) {
                    if (-1 === p.indexOf(t))
                        throw new s('Unknown option "' + t + '" is met in definition of "' + e + '" YAML type.')
                }
                )),
                this.options = t,
                this.tag = e,
                this.kind = t.kind || null,
                this.resolve = t.resolve || function() {
                    return !0
                }
                ,
                this.construct = t.construct || function(e) {
                    return e
                }
                ,
                this.instanceOf = t.instanceOf || null,
                this.predicate = t.predicate || null,
                this.represent = t.represent || null,
                this.representName = t.representName || null,
                this.defaultStyle = t.defaultStyle || null,
                this.multi = t.multi || !1,
                this.styleAliases = function(e) {
                    var t = {};
                    return null !== e && Object.keys(e).forEach((function(n) {
                        e[n].forEach((function(e) {
                            t[String(e)] = n
                        }
                        ))
                    }
                    )),
                    t
                }(t.styleAliases || null),
                -1 === _.indexOf(this.kind))
                    throw new s('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.')
            };
            function h(e, t) {
                var n = [];
                return e[t].forEach((function(e) {
                    var t = n.length;
                    n.forEach((function(n, r) {
                        n.tag === e.tag && n.kind === e.kind && n.multi === e.multi && (t = r)
                    }
                    )),
                    n[t] = e
                }
                )),
                n
            }
            function d(e) {
                return this.extend(e)
            }
            d.prototype.extend = function(e) {
                var t = []
                  , n = [];
                if (e instanceof f)
                    n.push(e);
                else if (Array.isArray(e))
                    n = n.concat(e);
                else {
                    if (!e || !Array.isArray(e.implicit) && !Array.isArray(e.explicit))
                        throw new s("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
                    e.implicit && (t = t.concat(e.implicit)),
                    e.explicit && (n = n.concat(e.explicit))
                }
                t.forEach((function(e) {
                    if (!(e instanceof f))
                        throw new s("Specified list of YAML types (or a single Type object) contains a non-Type object.");
                    if (e.loadKind && "scalar" !== e.loadKind)
                        throw new s("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
                    if (e.multi)
                        throw new s("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")
                }
                )),
                n.forEach((function(e) {
                    if (!(e instanceof f))
                        throw new s("Specified list of YAML types (or a single Type object) contains a non-Type object.")
                }
                ));
                var r = Object.create(d.prototype);
                return r.implicit = (this.implicit || []).concat(t),
                r.explicit = (this.explicit || []).concat(n),
                r.compiledImplicit = h(r, "implicit"),
                r.compiledExplicit = h(r, "explicit"),
                r.compiledTypeMap = function() {
                    var e, t, n = {
                        scalar: {},
                        sequence: {},
                        mapping: {},
                        fallback: {},
                        multi: {
                            scalar: [],
                            sequence: [],
                            mapping: [],
                            fallback: []
                        }
                    };
                    function r(e) {
                        e.multi ? (n.multi[e.kind].push(e),
                        n.multi.fallback.push(e)) : n[e.kind][e.tag] = n.fallback[e.tag] = e
                    }
                    for (e = 0,
                    t = arguments.length; e < t; e += 1)
                        arguments[e].forEach(r);
                    return n
                }(r.compiledImplicit, r.compiledExplicit),
                r
            }
            ;
            var g = d
              , m = new f("tag:yaml.org,2002:str",{
                kind: "scalar",
                construct: function(e) {
                    return null !== e ? e : ""
                }
            })
              , y = new f("tag:yaml.org,2002:seq",{
                kind: "sequence",
                construct: function(e) {
                    return null !== e ? e : []
                }
            })
              , b = new f("tag:yaml.org,2002:map",{
                kind: "mapping",
                construct: function(e) {
                    return null !== e ? e : {}
                }
            })
              , w = new g({
                explicit: [m, y, b]
            });
            var E = new f("tag:yaml.org,2002:null",{
                kind: "scalar",
                resolve: function(e) {
                    if (null === e)
                        return !0;
                    var t = e.length;
                    return 1 === t && "~" === e || 4 === t && ("null" === e || "Null" === e || "NULL" === e)
                },
                construct: function() {
                    return null
                },
                predicate: function(e) {
                    return null === e
                },
                represent: {
                    canonical: function() {
                        return "~"
                    },
                    lowercase: function() {
                        return "null"
                    },
                    uppercase: function() {
                        return "NULL"
                    },
                    camelcase: function() {
                        return "Null"
                    },
                    empty: function() {
                        return ""
                    }
                },
                defaultStyle: "lowercase"
            });
            var A = new f("tag:yaml.org,2002:bool",{
                kind: "scalar",
                resolve: function(e) {
                    if (null === e)
                        return !1;
                    var t = e.length;
                    return 4 === t && ("true" === e || "True" === e || "TRUE" === e) || 5 === t && ("false" === e || "False" === e || "FALSE" === e)
                },
                construct: function(e) {
                    return "true" === e || "True" === e || "TRUE" === e
                },
                predicate: function(e) {
                    return "[object Boolean]" === Object.prototype.toString.call(e)
                },
                represent: {
                    lowercase: function(e) {
                        return e ? "true" : "false"
                    },
                    uppercase: function(e) {
                        return e ? "TRUE" : "FALSE"
                    },
                    camelcase: function(e) {
                        return e ? "True" : "False"
                    }
                },
                defaultStyle: "lowercase"
            });
            function C(e) {
                return 48 <= e && e <= 55
            }
            function O(e) {
                return 48 <= e && e <= 57
            }
            var R = new f("tag:yaml.org,2002:int",{
                kind: "scalar",
                resolve: function(e) {
                    if (null === e)
                        return !1;
                    var t, n, r = e.length, i = 0, a = !1;
                    if (!r)
                        return !1;
                    if ("-" !== (t = e[i]) && "+" !== t || (t = e[++i]),
                    "0" === t) {
                        if (i + 1 === r)
                            return !0;
                        if ("b" === (t = e[++i])) {
                            for (i++; i < r; i++)
                                if ("_" !== (t = e[i])) {
                                    if ("0" !== t && "1" !== t)
                                        return !1;
                                    a = !0
                                }
                            return a && "_" !== t
                        }
                        if ("x" === t) {
                            for (i++; i < r; i++)
                                if ("_" !== (t = e[i])) {
                                    if (!(48 <= (n = e.charCodeAt(i)) && n <= 57 || 65 <= n && n <= 70 || 97 <= n && n <= 102))
                                        return !1;
                                    a = !0
                                }
                            return a && "_" !== t
                        }
                        if ("o" === t) {
                            for (i++; i < r; i++)
                                if ("_" !== (t = e[i])) {
                                    if (!C(e.charCodeAt(i)))
                                        return !1;
                                    a = !0
                                }
                            return a && "_" !== t
                        }
                    }
                    if ("_" === t)
                        return !1;
                    for (; i < r; i++)
                        if ("_" !== (t = e[i])) {
                            if (!O(e.charCodeAt(i)))
                                return !1;
                            a = !0
                        }
                    return !(!a || "_" === t)
                },
                construct: function(e) {
                    var t, n = e, r = 1;
                    if (-1 !== n.indexOf("_") && (n = n.replace(/_/g, "")),
                    "-" !== (t = n[0]) && "+" !== t || ("-" === t && (r = -1),
                    t = (n = n.slice(1))[0]),
                    "0" === n)
                        return 0;
                    if ("0" === t) {
                        if ("b" === n[1])
                            return r * parseInt(n.slice(2), 2);
                        if ("x" === n[1])
                            return r * parseInt(n.slice(2), 16);
                        if ("o" === n[1])
                            return r * parseInt(n.slice(2), 8)
                    }
                    return r * parseInt(n, 10)
                },
                predicate: function(e) {
                    return "[object Number]" === Object.prototype.toString.call(e) && e % 1 == 0 && !i.isNegativeZero(e)
                },
                represent: {
                    binary: function(e) {
                        return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1)
                    },
                    octal: function(e) {
                        return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1)
                    },
                    decimal: function(e) {
                        return e.toString(10)
                    },
                    hexadecimal: function(e) {
                        return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1)
                    }
                },
                defaultStyle: "decimal",
                styleAliases: {
                    binary: [2, "bin"],
                    octal: [8, "oct"],
                    decimal: [10, "dec"],
                    hexadecimal: [16, "hex"]
                }
            })
              , k = new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
            var v = /^[-+]?[0-9]+e/;
            var T = new f("tag:yaml.org,2002:float",{
                kind: "scalar",
                resolve: function(e) {
                    return null !== e && !(!k.test(e) || "_" === e[e.length - 1])
                },
                construct: function(e) {
                    var t, n;
                    return n = "-" === (t = e.replace(/_/g, "").toLowerCase())[0] ? -1 : 1,
                    "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)),
                    ".inf" === t ? 1 === n ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : ".nan" === t ? NaN : n * parseFloat(t, 10)
                },
                predicate: function(e) {
                    return "[object Number]" === Object.prototype.toString.call(e) && (e % 1 != 0 || i.isNegativeZero(e))
                },
                represent: function(e, t) {
                    var n;
                    if (isNaN(e))
                        switch (t) {
                        case "lowercase":
                            return ".nan";
                        case "uppercase":
                            return ".NAN";
                        case "camelcase":
                            return ".NaN"
                        }
                    else if (Number.POSITIVE_INFINITY === e)
                        switch (t) {
                        case "lowercase":
                            return ".inf";
                        case "uppercase":
                            return ".INF";
                        case "camelcase":
                            return ".Inf"
                        }
                    else if (Number.NEGATIVE_INFINITY === e)
                        switch (t) {
                        case "lowercase":
                            return "-.inf";
                        case "uppercase":
                            return "-.INF";
                        case "camelcase":
                            return "-.Inf"
                        }
                    else if (i.isNegativeZero(e))
                        return "-0.0";
                    return n = e.toString(10),
                    v.test(n) ? n.replace("e", ".e") : n
                },
                defaultStyle: "lowercase"
            })
              , j = w.extend({
                implicit: [E, A, R, T]
            })
              , P = j
              , M = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$")
              , x = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
            var D = new f("tag:yaml.org,2002:timestamp",{
                kind: "scalar",
                resolve: function(e) {
                    return null !== e && (null !== M.exec(e) || null !== x.exec(e))
                },
                construct: function(e) {
                    var t, n, r, i, a, o, s, c, l = 0, u = null;
                    if (null === (t = M.exec(e)) && (t = x.exec(e)),
                    null === t)
                        throw new Error("Date resolve error");
                    if (n = +t[1],
                    r = +t[2] - 1,
                    i = +t[3],
                    !t[4])
                        return new Date(Date.UTC(n, r, i));
                    if (a = +t[4],
                    o = +t[5],
                    s = +t[6],
                    t[7]) {
                        for (l = t[7].slice(0, 3); l.length < 3; )
                            l += "0";
                        l = +l
                    }
                    return t[9] && (u = 6e4 * (60 * +t[10] + +(t[11] || 0)),
                    "-" === t[9] && (u = -u)),
                    c = new Date(Date.UTC(n, r, i, a, o, s, l)),
                    u && c.setTime(c.getTime() - u),
                    c
                },
                instanceOf: Date,
                represent: function(e) {
                    return e.toISOString()
                }
            });
            var I = new f("tag:yaml.org,2002:merge",{
                kind: "scalar",
                resolve: function(e) {
                    return "<<" === e || null === e
                }
            })
              , q = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
            var F = new f("tag:yaml.org,2002:binary",{
                kind: "scalar",
                resolve: function(e) {
                    if (null === e)
                        return !1;
                    var t, n, r = 0, i = e.length, a = q;
                    for (n = 0; n < i; n++)
                        if (!((t = a.indexOf(e.charAt(n))) > 64)) {
                            if (t < 0)
                                return !1;
                            r += 6
                        }
                    return r % 8 == 0
                },
                construct: function(e) {
                    var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, a = q, o = 0, s = [];
                    for (t = 0; t < i; t++)
                        t % 4 == 0 && t && (s.push(o >> 16 & 255),
                        s.push(o >> 8 & 255),
                        s.push(255 & o)),
                        o = o << 6 | a.indexOf(r.charAt(t));
                    return 0 === (n = i % 4 * 6) ? (s.push(o >> 16 & 255),
                    s.push(o >> 8 & 255),
                    s.push(255 & o)) : 18 === n ? (s.push(o >> 10 & 255),
                    s.push(o >> 2 & 255)) : 12 === n && s.push(o >> 4 & 255),
                    new Uint8Array(s)
                },
                predicate: function(e) {
                    return "[object Uint8Array]" === Object.prototype.toString.call(e)
                },
                represent: function(e) {
                    var t, n, r = "", i = 0, a = e.length, o = q;
                    for (t = 0; t < a; t++)
                        t % 3 == 0 && t && (r += o[i >> 18 & 63],
                        r += o[i >> 12 & 63],
                        r += o[i >> 6 & 63],
                        r += o[63 & i]),
                        i = (i << 8) + e[t];
                    return 0 === (n = a % 3) ? (r += o[i >> 18 & 63],
                    r += o[i >> 12 & 63],
                    r += o[i >> 6 & 63],
                    r += o[63 & i]) : 2 === n ? (r += o[i >> 10 & 63],
                    r += o[i >> 4 & 63],
                    r += o[i << 2 & 63],
                    r += o[64]) : 1 === n && (r += o[i >> 2 & 63],
                    r += o[i << 4 & 63],
                    r += o[64],
                    r += o[64]),
                    r
                }
            })
              , S = Object.prototype.hasOwnProperty
              , L = Object.prototype.toString;
            var W = new f("tag:yaml.org,2002:omap",{
                kind: "sequence",
                resolve: function(e) {
                    if (null === e)
                        return !0;
                    var t, n, r, i, a, o = [], s = e;
                    for (t = 0,
                    n = s.length; t < n; t += 1) {
                        if (r = s[t],
                        a = !1,
                        "[object Object]" !== L.call(r))
                            return !1;
                        for (i in r)
                            if (S.call(r, i)) {
                                if (a)
                                    return !1;
                                a = !0
                            }
                        if (!a)
                            return !1;
                        if (-1 !== o.indexOf(i))
                            return !1;
                        o.push(i)
                    }
                    return !0
                },
                construct: function(e) {
                    return null !== e ? e : []
                }
            })
              , U = Object.prototype.toString;
            var K = new f("tag:yaml.org,2002:pairs",{
                kind: "sequence",
                resolve: function(e) {
                    if (null === e)
                        return !0;
                    var t, n, r, i, a, o = e;
                    for (a = new Array(o.length),
                    t = 0,
                    n = o.length; t < n; t += 1) {
                        if (r = o[t],
                        "[object Object]" !== U.call(r))
                            return !1;
                        if (1 !== (i = Object.keys(r)).length)
                            return !1;
                        a[t] = [i[0], r[i[0]]]
                    }
                    return !0
                },
                construct: function(e) {
                    if (null === e)
                        return [];
                    var t, n, r, i, a, o = e;
                    for (a = new Array(o.length),
                    t = 0,
                    n = o.length; t < n; t += 1)
                        r = o[t],
                        i = Object.keys(r),
                        a[t] = [i[0], r[i[0]]];
                    return a
                }
            })
              , B = Object.prototype.hasOwnProperty;
            var N = new f("tag:yaml.org,2002:set",{
                kind: "mapping",
                resolve: function(e) {
                    if (null === e)
                        return !0;
                    var t, n = e;
                    for (t in n)
                        if (B.call(n, t) && null !== n[t])
                            return !1;
                    return !0
                },
                construct: function(e) {
                    return null !== e ? e : {}
                }
            })
              , Z = P.extend({
                implicit: [D, I],
                explicit: [F, W, K, N]
            })
              , $ = Object.prototype.hasOwnProperty
              , G = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/
              , Y = /[\x85\u2028\u2029]/
              , V = /[,\[\]\{\}]/
              , z = /^(?:!|!!|![a-z\-]+!)$/i
              , H = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
            function J(e) {
                return Object.prototype.toString.call(e)
            }
            function Q(e) {
                return 10 === e || 13 === e
            }
            function X(e) {
                return 9 === e || 32 === e
            }
            function ee(e) {
                return 9 === e || 32 === e || 10 === e || 13 === e
            }
            function te(e) {
                return 44 === e || 91 === e || 93 === e || 123 === e || 125 === e
            }
            function ne(e) {
                var t;
                return 48 <= e && e <= 57 ? e - 48 : 97 <= (t = 32 | e) && t <= 102 ? t - 97 + 10 : -1
            }
            function re(e) {
                return 48 === e ? "\0" : 97 === e ? "" : 98 === e ? "\b" : 116 === e || 9 === e ? "\t" : 110 === e ? "\n" : 118 === e ? "\v" : 102 === e ? "\f" : 114 === e ? "\r" : 101 === e ? "" : 32 === e ? " " : 34 === e ? '"' : 47 === e ? "/" : 92 === e ? "\\" : 78 === e ? "" : 95 === e ? " " : 76 === e ? "\u2028" : 80 === e ? "\u2029" : ""
            }
            function ie(e) {
                return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(55296 + (e - 65536 >> 10), 56320 + (e - 65536 & 1023))
            }
            for (var ae = new Array(256), oe = new Array(256), se = 0; se < 256; se++)
                ae[se] = re(se) ? 1 : 0,
                oe[se] = re(se);
            function ce(e, t) {
                this.input = e,
                this.filename = t.filename || null,
                this.schema = t.schema || Z,
                this.onWarning = t.onWarning || null,
                this.legacy = t.legacy || !1,
                this.json = t.json || !1,
                this.listener = t.listener || null,
                this.implicitTypes = this.schema.compiledImplicit,
                this.typeMap = this.schema.compiledTypeMap,
                this.length = e.length,
                this.position = 0,
                this.line = 0,
                this.lineStart = 0,
                this.lineIndent = 0,
                this.firstTabInLine = -1,
                this.documents = []
            }
            function le(e, t) {
                var n = {
                    name: e.filename,
                    buffer: e.input.slice(0, -1),
                    position: e.position,
                    line: e.line,
                    column: e.position - e.lineStart
                };
                return n.snippet = u(n),
                new s(t,n)
            }
            function ue(e, t) {
                throw le(e, t)
            }
            function pe(e, t) {
                e.onWarning && e.onWarning.call(null, le(e, t))
            }
            var _e = {
                YAML: function(e, t, n) {
                    var r, i, a;
                    null !== e.version && ue(e, "duplication of %YAML directive"),
                    1 !== n.length && ue(e, "YAML directive accepts exactly one argument"),
                    null === (r = /^([0-9]+)\.([0-9]+)$/.exec(n[0])) && ue(e, "ill-formed argument of the YAML directive"),
                    i = parseInt(r[1], 10),
                    a = parseInt(r[2], 10),
                    1 !== i && ue(e, "unacceptable YAML version of the document"),
                    e.version = n[0],
                    e.checkLineBreaks = a < 2,
                    1 !== a && 2 !== a && pe(e, "unsupported YAML version of the document")
                },
                TAG: function(e, t, n) {
                    var r, i;
                    2 !== n.length && ue(e, "TAG directive accepts exactly two arguments"),
                    r = n[0],
                    i = n[1],
                    z.test(r) || ue(e, "ill-formed tag handle (first argument) of the TAG directive"),
                    $.call(e.tagMap, r) && ue(e, 'there is a previously declared suffix for "' + r + '" tag handle'),
                    H.test(i) || ue(e, "ill-formed tag prefix (second argument) of the TAG directive");
                    try {
                        i = decodeURIComponent(i)
                    } catch (t) {
                        ue(e, "tag prefix is malformed: " + i)
                    }
                    e.tagMap[r] = i
                }
            };
            function fe(e, t, n, r) {
                var i, a, o, s;
                if (t < n) {
                    if (s = e.input.slice(t, n),
                    r)
                        for (i = 0,
                        a = s.length; i < a; i += 1)
                            9 === (o = s.charCodeAt(i)) || 32 <= o && o <= 1114111 || ue(e, "expected valid JSON character");
                    else
                        G.test(s) && ue(e, "the stream contains non-printable characters");
                    e.result += s
                }
            }
            function he(e, t, n, r) {
                var a, o, s, c;
                for (i.isObject(n) || ue(e, "cannot merge mappings; the provided source object is unacceptable"),
                s = 0,
                c = (a = Object.keys(n)).length; s < c; s += 1)
                    o = a[s],
                    $.call(t, o) || (t[o] = n[o],
                    r[o] = !0)
            }
            function de(e, t, n, r, i, a, o, s, c) {
                var l, u;
                if (Array.isArray(i))
                    for (l = 0,
                    u = (i = Array.prototype.slice.call(i)).length; l < u; l += 1)
                        Array.isArray(i[l]) && ue(e, "nested arrays are not supported inside keys"),
                        "object" == typeof i && "[object Object]" === J(i[l]) && (i[l] = "[object Object]");
                if ("object" == typeof i && "[object Object]" === J(i) && (i = "[object Object]"),
                i = String(i),
                null === t && (t = {}),
                "tag:yaml.org,2002:merge" === r)
                    if (Array.isArray(a))
                        for (l = 0,
                        u = a.length; l < u; l += 1)
                            he(e, t, a[l], n);
                    else
                        he(e, t, a, n);
                else
                    e.json || $.call(n, i) || !$.call(t, i) || (e.line = o || e.line,
                    e.lineStart = s || e.lineStart,
                    e.position = c || e.position,
                    ue(e, "duplicated mapping key")),
                    "__proto__" === i ? Object.defineProperty(t, i, {
                        configurable: !0,
                        enumerable: !0,
                        writable: !0,
                        value: a
                    }) : t[i] = a,
                    delete n[i];
                return t
            }
            function ge(e) {
                var t;
                10 === (t = e.input.charCodeAt(e.position)) ? e.position++ : 13 === t ? (e.position++,
                10 === e.input.charCodeAt(e.position) && e.position++) : ue(e, "a line break is expected"),
                e.line += 1,
                e.lineStart = e.position,
                e.firstTabInLine = -1
            }
            function me(e, t, n) {
                for (var r = 0, i = e.input.charCodeAt(e.position); 0 !== i; ) {
                    for (; X(i); )
                        9 === i && -1 === e.firstTabInLine && (e.firstTabInLine = e.position),
                        i = e.input.charCodeAt(++e.position);
                    if (t && 35 === i)
                        do {
                            i = e.input.charCodeAt(++e.position)
                        } while (10 !== i && 13 !== i && 0 !== i);
                    if (!Q(i))
                        break;
                    for (ge(e),
                    i = e.input.charCodeAt(e.position),
                    r++,
                    e.lineIndent = 0; 32 === i; )
                        e.lineIndent++,
                        i = e.input.charCodeAt(++e.position)
                }
                return -1 !== n && 0 !== r && e.lineIndent < n && pe(e, "deficient indentation"),
                r
            }
            function ye(e) {
                var t, n = e.position;
                return !(45 !== (t = e.input.charCodeAt(n)) && 46 !== t || t !== e.input.charCodeAt(n + 1) || t !== e.input.charCodeAt(n + 2) || (n += 3,
                0 !== (t = e.input.charCodeAt(n)) && !ee(t)))
            }
            function be(e, t) {
                1 === t ? e.result += " " : t > 1 && (e.result += i.repeat("\n", t - 1))
            }
            function we(e, t) {
                var n, r, i = e.tag, a = e.anchor, o = [], s = !1;
                if (-1 !== e.firstTabInLine)
                    return !1;
                for (null !== e.anchor && (e.anchorMap[e.anchor] = o),
                r = e.input.charCodeAt(e.position); 0 !== r && (-1 !== e.firstTabInLine && (e.position = e.firstTabInLine,
                ue(e, "tab characters must not be used in indentation")),
                45 === r) && ee(e.input.charCodeAt(e.position + 1)); )
                    if (s = !0,
                    e.position++,
                    me(e, !0, -1) && e.lineIndent <= t)
                        o.push(null),
                        r = e.input.charCodeAt(e.position);
                    else if (n = e.line,
                    Ce(e, t, 3, !1, !0),
                    o.push(e.result),
                    me(e, !0, -1),
                    r = e.input.charCodeAt(e.position),
                    (e.line === n || e.lineIndent > t) && 0 !== r)
                        ue(e, "bad indentation of a sequence entry");
                    else if (e.lineIndent < t)
                        break;
                return !!s && (e.tag = i,
                e.anchor = a,
                e.kind = "sequence",
                e.result = o,
                !0)
            }
            function Ee(e) {
                var t, n, r, i, a = !1, o = !1;
                if (33 !== (i = e.input.charCodeAt(e.position)))
                    return !1;
                if (null !== e.tag && ue(e, "duplication of a tag property"),
                60 === (i = e.input.charCodeAt(++e.position)) ? (a = !0,
                i = e.input.charCodeAt(++e.position)) : 33 === i ? (o = !0,
                n = "!!",
                i = e.input.charCodeAt(++e.position)) : n = "!",
                t = e.position,
                a) {
                    do {
                        i = e.input.charCodeAt(++e.position)
                    } while (0 !== i && 62 !== i);
                    e.position < e.length ? (r = e.input.slice(t, e.position),
                    i = e.input.charCodeAt(++e.position)) : ue(e, "unexpected end of the stream within a verbatim tag")
                } else {
                    for (; 0 !== i && !ee(i); )
                        33 === i && (o ? ue(e, "tag suffix cannot contain exclamation marks") : (n = e.input.slice(t - 1, e.position + 1),
                        z.test(n) || ue(e, "named tag handle cannot contain such characters"),
                        o = !0,
                        t = e.position + 1)),
                        i = e.input.charCodeAt(++e.position);
                    r = e.input.slice(t, e.position),
                    V.test(r) && ue(e, "tag suffix cannot contain flow indicator characters")
                }
                r && !H.test(r) && ue(e, "tag name cannot contain such characters: " + r);
                try {
                    r = decodeURIComponent(r)
                } catch (t) {
                    ue(e, "tag name is malformed: " + r)
                }
                return a ? e.tag = r : $.call(e.tagMap, n) ? e.tag = e.tagMap[n] + r : "!" === n ? e.tag = "!" + r : "!!" === n ? e.tag = "tag:yaml.org,2002:" + r : ue(e, 'undeclared tag handle "' + n + '"'),
                !0
            }
            function Ae(e) {
                var t, n;
                if (38 !== (n = e.input.charCodeAt(e.position)))
                    return !1;
                for (null !== e.anchor && ue(e, "duplication of an anchor property"),
                n = e.input.charCodeAt(++e.position),
                t = e.position; 0 !== n && !ee(n) && !te(n); )
                    n = e.input.charCodeAt(++e.position);
                return e.position === t && ue(e, "name of an anchor node must contain at least one character"),
                e.anchor = e.input.slice(t, e.position),
                !0
            }
            function Ce(e, t, n, r, a) {
                var o, s, c, l, u, p, _, f, h, d = 1, g = !1, m = !1;
                if (null !== e.listener && e.listener("open", e),
                e.tag = null,
                e.anchor = null,
                e.kind = null,
                e.result = null,
                o = s = c = 4 === n || 3 === n,
                r && me(e, !0, -1) && (g = !0,
                e.lineIndent > t ? d = 1 : e.lineIndent === t ? d = 0 : e.lineIndent < t && (d = -1)),
                1 === d)
                    for (; Ee(e) || Ae(e); )
                        me(e, !0, -1) ? (g = !0,
                        c = o,
                        e.lineIndent > t ? d = 1 : e.lineIndent === t ? d = 0 : e.lineIndent < t && (d = -1)) : c = !1;
                if (c && (c = g || a),
                1 !== d && 4 !== n || (f = 1 === n || 2 === n ? t : t + 1,
                h = e.position - e.lineStart,
                1 === d ? c && (we(e, h) || function(e, t, n) {
                    var r, i, a, o, s, c, l, u = e.tag, p = e.anchor, _ = {}, f = Object.create(null), h = null, d = null, g = null, m = !1, y = !1;
                    if (-1 !== e.firstTabInLine)
                        return !1;
                    for (null !== e.anchor && (e.anchorMap[e.anchor] = _),
                    l = e.input.charCodeAt(e.position); 0 !== l; ) {
                        if (m || -1 === e.firstTabInLine || (e.position = e.firstTabInLine,
                        ue(e, "tab characters must not be used in indentation")),
                        r = e.input.charCodeAt(e.position + 1),
                        a = e.line,
                        63 !== l && 58 !== l || !ee(r)) {
                            if (o = e.line,
                            s = e.lineStart,
                            c = e.position,
                            !Ce(e, n, 2, !1, !0))
                                break;
                            if (e.line === a) {
                                for (l = e.input.charCodeAt(e.position); X(l); )
                                    l = e.input.charCodeAt(++e.position);
                                if (58 === l)
                                    ee(l = e.input.charCodeAt(++e.position)) || ue(e, "a whitespace character is expected after the key-value separator within a block mapping"),
                                    m && (de(e, _, f, h, d, null, o, s, c),
                                    h = d = g = null),
                                    y = !0,
                                    m = !1,
                                    i = !1,
                                    h = e.tag,
                                    d = e.result;
                                else {
                                    if (!y)
                                        return e.tag = u,
                                        e.anchor = p,
                                        !0;
                                    ue(e, "can not read an implicit mapping pair; a colon is missed")
                                }
                            } else {
                                if (!y)
                                    return e.tag = u,
                                    e.anchor = p,
                                    !0;
                                ue(e, "can not read a block mapping entry; a multiline key may not be an implicit key")
                            }
                        } else
                            63 === l ? (m && (de(e, _, f, h, d, null, o, s, c),
                            h = d = g = null),
                            y = !0,
                            m = !0,
                            i = !0) : m ? (m = !1,
                            i = !0) : ue(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),
                            e.position += 1,
                            l = r;
                        if ((e.line === a || e.lineIndent > t) && (m && (o = e.line,
                        s = e.lineStart,
                        c = e.position),
                        Ce(e, t, 4, !0, i) && (m ? d = e.result : g = e.result),
                        m || (de(e, _, f, h, d, g, o, s, c),
                        h = d = g = null),
                        me(e, !0, -1),
                        l = e.input.charCodeAt(e.position)),
                        (e.line === a || e.lineIndent > t) && 0 !== l)
                            ue(e, "bad indentation of a mapping entry");
                        else if (e.lineIndent < t)
                            break
                    }
                    return m && de(e, _, f, h, d, null, o, s, c),
                    y && (e.tag = u,
                    e.anchor = p,
                    e.kind = "mapping",
                    e.result = _),
                    y
                }(e, h, f)) || function(e, t) {
                    var n, r, i, a, o, s, c, l, u, p, _, f, h = !0, d = e.tag, g = e.anchor, m = Object.create(null);
                    if (91 === (f = e.input.charCodeAt(e.position)))
                        o = 93,
                        l = !1,
                        a = [];
                    else {
                        if (123 !== f)
                            return !1;
                        o = 125,
                        l = !0,
                        a = {}
                    }
                    for (null !== e.anchor && (e.anchorMap[e.anchor] = a),
                    f = e.input.charCodeAt(++e.position); 0 !== f; ) {
                        if (me(e, !0, t),
                        (f = e.input.charCodeAt(e.position)) === o)
                            return e.position++,
                            e.tag = d,
                            e.anchor = g,
                            e.kind = l ? "mapping" : "sequence",
                            e.result = a,
                            !0;
                        h ? 44 === f && ue(e, "expected the node content, but found ','") : ue(e, "missed comma between flow collection entries"),
                        _ = null,
                        s = c = !1,
                        63 === f && ee(e.input.charCodeAt(e.position + 1)) && (s = c = !0,
                        e.position++,
                        me(e, !0, t)),
                        n = e.line,
                        r = e.lineStart,
                        i = e.position,
                        Ce(e, t, 1, !1, !0),
                        p = e.tag,
                        u = e.result,
                        me(e, !0, t),
                        f = e.input.charCodeAt(e.position),
                        !c && e.line !== n || 58 !== f || (s = !0,
                        f = e.input.charCodeAt(++e.position),
                        me(e, !0, t),
                        Ce(e, t, 1, !1, !0),
                        _ = e.result),
                        l ? de(e, a, m, p, u, _, n, r, i) : s ? a.push(de(e, null, m, p, u, _, n, r, i)) : a.push(u),
                        me(e, !0, t),
                        44 === (f = e.input.charCodeAt(e.position)) ? (h = !0,
                        f = e.input.charCodeAt(++e.position)) : h = !1
                    }
                    ue(e, "unexpected end of the stream within a flow collection")
                }(e, f) ? m = !0 : (s && function(e, t) {
                    var n, r, a, o, s, c = 1, l = !1, u = !1, p = t, _ = 0, f = !1;
                    if (124 === (o = e.input.charCodeAt(e.position)))
                        r = !1;
                    else {
                        if (62 !== o)
                            return !1;
                        r = !0
                    }
                    for (e.kind = "scalar",
                    e.result = ""; 0 !== o; )
                        if (43 === (o = e.input.charCodeAt(++e.position)) || 45 === o)
                            1 === c ? c = 43 === o ? 3 : 2 : ue(e, "repeat of a chomping mode identifier");
                        else {
                            if (!((a = 48 <= (s = o) && s <= 57 ? s - 48 : -1) >= 0))
                                break;
                            0 === a ? ue(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : u ? ue(e, "repeat of an indentation width identifier") : (p = t + a - 1,
                            u = !0)
                        }
                    if (X(o)) {
                        do {
                            o = e.input.charCodeAt(++e.position)
                        } while (X(o));
                        if (35 === o)
                            do {
                                o = e.input.charCodeAt(++e.position)
                            } while (!Q(o) && 0 !== o)
                    }
                    for (; 0 !== o; ) {
                        for (ge(e),
                        e.lineIndent = 0,
                        o = e.input.charCodeAt(e.position); (!u || e.lineIndent < p) && 32 === o; )
                            e.lineIndent++,
                            o = e.input.charCodeAt(++e.position);
                        if (!u && e.lineIndent > p && (p = e.lineIndent),
                        Q(o))
                            _++;
                        else {
                            if (e.lineIndent < p) {
                                3 === c ? e.result += i.repeat("\n", l ? 1 + _ : _) : 1 === c && l && (e.result += "\n");
                                break
                            }
                            for (r ? X(o) ? (f = !0,
                            e.result += i.repeat("\n", l ? 1 + _ : _)) : f ? (f = !1,
                            e.result += i.repeat("\n", _ + 1)) : 0 === _ ? l && (e.result += " ") : e.result += i.repeat("\n", _) : e.result += i.repeat("\n", l ? 1 + _ : _),
                            l = !0,
                            u = !0,
                            _ = 0,
                            n = e.position; !Q(o) && 0 !== o; )
                                o = e.input.charCodeAt(++e.position);
                            fe(e, n, e.position, !1)
                        }
                    }
                    return !0
                }(e, f) || function(e, t) {
                    var n, r, i;
                    if (39 !== (n = e.input.charCodeAt(e.position)))
                        return !1;
                    for (e.kind = "scalar",
                    e.result = "",
                    e.position++,
                    r = i = e.position; 0 !== (n = e.input.charCodeAt(e.position)); )
                        if (39 === n) {
                            if (fe(e, r, e.position, !0),
                            39 !== (n = e.input.charCodeAt(++e.position)))
                                return !0;
                            r = e.position,
                            e.position++,
                            i = e.position
                        } else
                            Q(n) ? (fe(e, r, i, !0),
                            be(e, me(e, !1, t)),
                            r = i = e.position) : e.position === e.lineStart && ye(e) ? ue(e, "unexpected end of the document within a single quoted scalar") : (e.position++,
                            i = e.position);
                    ue(e, "unexpected end of the stream within a single quoted scalar")
                }(e, f) || function(e, t) {
                    var n, r, i, a, o, s, c;
                    if (34 !== (s = e.input.charCodeAt(e.position)))
                        return !1;
                    for (e.kind = "scalar",
                    e.result = "",
                    e.position++,
                    n = r = e.position; 0 !== (s = e.input.charCodeAt(e.position)); ) {
                        if (34 === s)
                            return fe(e, n, e.position, !0),
                            e.position++,
                            !0;
                        if (92 === s) {
                            if (fe(e, n, e.position, !0),
                            Q(s = e.input.charCodeAt(++e.position)))
                                me(e, !1, t);
                            else if (s < 256 && ae[s])
                                e.result += oe[s],
                                e.position++;
                            else if ((o = 120 === (c = s) ? 2 : 117 === c ? 4 : 85 === c ? 8 : 0) > 0) {
                                for (i = o,
                                a = 0; i > 0; i--)
                                    (o = ne(s = e.input.charCodeAt(++e.position))) >= 0 ? a = (a << 4) + o : ue(e, "expected hexadecimal character");
                                e.result += ie(a),
                                e.position++
                            } else
                                ue(e, "unknown escape sequence");
                            n = r = e.position
                        } else
                            Q(s) ? (fe(e, n, r, !0),
                            be(e, me(e, !1, t)),
                            n = r = e.position) : e.position === e.lineStart && ye(e) ? ue(e, "unexpected end of the document within a double quoted scalar") : (e.position++,
                            r = e.position)
                    }
                    ue(e, "unexpected end of the stream within a double quoted scalar")
                }(e, f) ? m = !0 : !function(e) {
                    var t, n, r;
                    if (42 !== (r = e.input.charCodeAt(e.position)))
                        return !1;
                    for (r = e.input.charCodeAt(++e.position),
                    t = e.position; 0 !== r && !ee(r) && !te(r); )
                        r = e.input.charCodeAt(++e.position);
                    return e.position === t && ue(e, "name of an alias node must contain at least one character"),
                    n = e.input.slice(t, e.position),
                    $.call(e.anchorMap, n) || ue(e, 'unidentified alias "' + n + '"'),
                    e.result = e.anchorMap[n],
                    me(e, !0, -1),
                    !0
                }(e) ? function(e, t, n) {
                    var r, i, a, o, s, c, l, u, p = e.kind, _ = e.result;
                    if (ee(u = e.input.charCodeAt(e.position)) || te(u) || 35 === u || 38 === u || 42 === u || 33 === u || 124 === u || 62 === u || 39 === u || 34 === u || 37 === u || 64 === u || 96 === u)
                        return !1;
                    if ((63 === u || 45 === u) && (ee(r = e.input.charCodeAt(e.position + 1)) || n && te(r)))
                        return !1;
                    for (e.kind = "scalar",
                    e.result = "",
                    i = a = e.position,
                    o = !1; 0 !== u; ) {
                        if (58 === u) {
                            if (ee(r = e.input.charCodeAt(e.position + 1)) || n && te(r))
                                break
                        } else if (35 === u) {
                            if (ee(e.input.charCodeAt(e.position - 1)))
                                break
                        } else {
                            if (e.position === e.lineStart && ye(e) || n && te(u))
                                break;
                            if (Q(u)) {
                                if (s = e.line,
                                c = e.lineStart,
                                l = e.lineIndent,
                                me(e, !1, -1),
                                e.lineIndent >= t) {
                                    o = !0,
                                    u = e.input.charCodeAt(e.position);
                                    continue
                                }
                                e.position = a,
                                e.line = s,
                                e.lineStart = c,
                                e.lineIndent = l;
                                break
                            }
                        }
                        o && (fe(e, i, a, !1),
                        be(e, e.line - s),
                        i = a = e.position,
                        o = !1),
                        X(u) || (a = e.position + 1),
                        u = e.input.charCodeAt(++e.position)
                    }
                    return fe(e, i, a, !1),
                    !!e.result || (e.kind = p,
                    e.result = _,
                    !1)
                }(e, f, 1 === n) && (m = !0,
                null === e.tag && (e.tag = "?")) : (m = !0,
                null === e.tag && null === e.anchor || ue(e, "alias node should not have any properties")),
                null !== e.anchor && (e.anchorMap[e.anchor] = e.result)) : 0 === d && (m = c && we(e, h))),
                null === e.tag)
                    null !== e.anchor && (e.anchorMap[e.anchor] = e.result);
                else if ("?" === e.tag) {
                    for (null !== e.result && "scalar" !== e.kind && ue(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'),
                    l = 0,
                    u = e.implicitTypes.length; l < u; l += 1)
                        if ((_ = e.implicitTypes[l]).resolve(e.result)) {
                            e.result = _.construct(e.result),
                            e.tag = _.tag,
                            null !== e.anchor && (e.anchorMap[e.anchor] = e.result);
                            break
                        }
                } else if ("!" !== e.tag) {
                    if ($.call(e.typeMap[e.kind || "fallback"], e.tag))
                        _ = e.typeMap[e.kind || "fallback"][e.tag];
                    else
                        for (_ = null,
                        l = 0,
                        u = (p = e.typeMap.multi[e.kind || "fallback"]).length; l < u; l += 1)
                            if (e.tag.slice(0, p[l].tag.length) === p[l].tag) {
                                _ = p[l];
                                break
                            }
                    _ || ue(e, "unknown tag !<" + e.tag + ">"),
                    null !== e.result && _.kind !== e.kind && ue(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + _.kind + '", not "' + e.kind + '"'),
                    _.resolve(e.result, e.tag) ? (e.result = _.construct(e.result, e.tag),
                    null !== e.anchor && (e.anchorMap[e.anchor] = e.result)) : ue(e, "cannot resolve a node with !<" + e.tag + "> explicit tag")
                }
                return null !== e.listener && e.listener("close", e),
                null !== e.tag || null !== e.anchor || m
            }
            function Oe(e) {
                var t, n, r, i, a = e.position, o = !1;
                for (e.version = null,
                e.checkLineBreaks = e.legacy,
                e.tagMap = Object.create(null),
                e.anchorMap = Object.create(null); 0 !== (i = e.input.charCodeAt(e.position)) && (me(e, !0, -1),
                i = e.input.charCodeAt(e.position),
                !(e.lineIndent > 0 || 37 !== i)); ) {
                    for (o = !0,
                    i = e.input.charCodeAt(++e.position),
                    t = e.position; 0 !== i && !ee(i); )
                        i = e.input.charCodeAt(++e.position);
                    for (r = [],
                    (n = e.input.slice(t, e.position)).length < 1 && ue(e, "directive name must not be less than one character in length"); 0 !== i; ) {
                        for (; X(i); )
                            i = e.input.charCodeAt(++e.position);
                        if (35 === i) {
                            do {
                                i = e.input.charCodeAt(++e.position)
                            } while (0 !== i && !Q(i));
                            break
                        }
                        if (Q(i))
                            break;
                        for (t = e.position; 0 !== i && !ee(i); )
                            i = e.input.charCodeAt(++e.position);
                        r.push(e.input.slice(t, e.position))
                    }
                    0 !== i && ge(e),
                    $.call(_e, n) ? _e[n](e, n, r) : pe(e, 'unknown document directive "' + n + '"')
                }
                me(e, !0, -1),
                0 === e.lineIndent && 45 === e.input.charCodeAt(e.position) && 45 === e.input.charCodeAt(e.position + 1) && 45 === e.input.charCodeAt(e.position + 2) ? (e.position += 3,
                me(e, !0, -1)) : o && ue(e, "directives end mark is expected"),
                Ce(e, e.lineIndent - 1, 4, !1, !0),
                me(e, !0, -1),
                e.checkLineBreaks && Y.test(e.input.slice(a, e.position)) && pe(e, "non-ASCII line breaks are interpreted as content"),
                e.documents.push(e.result),
                e.position === e.lineStart && ye(e) ? 46 === e.input.charCodeAt(e.position) && (e.position += 3,
                me(e, !0, -1)) : e.position < e.length - 1 && ue(e, "end of the stream or a document separator is expected")
            }
            function Re(e, t) {
                t = t || {},
                0 !== (e = String(e)).length && (10 !== e.charCodeAt(e.length - 1) && 13 !== e.charCodeAt(e.length - 1) && (e += "\n"),
                65279 === e.charCodeAt(0) && (e = e.slice(1)));
                var n = new ce(e,t)
                  , r = e.indexOf("\0");
                for (-1 !== r && (n.position = r,
                ue(n, "null byte is not allowed in input")),
                n.input += "\0"; 32 === n.input.charCodeAt(n.position); )
                    n.lineIndent += 1,
                    n.position += 1;
                for (; n.position < n.length - 1; )
                    Oe(n);
                return n.documents
            }
            var ke = {
                loadAll: function(e, t, n) {
                    null !== t && "object" == typeof t && void 0 === n && (n = t,
                    t = null);
                    var r = Re(e, n);
                    if ("function" != typeof t)
                        return r;
                    for (var i = 0, a = r.length; i < a; i += 1)
                        t(r[i])
                },
                load: function(e, t) {
                    var n = Re(e, t);
                    if (0 !== n.length) {
                        if (1 === n.length)
                            return n[0];
                        throw new s("expected a single document in the stream, but found more")
                    }
                }
            }
              , ve = Object.prototype.toString
              , Te = Object.prototype.hasOwnProperty
              , je = 65279
              , Pe = {
                0: "\\0",
                7: "\\a",
                8: "\\b",
                9: "\\t",
                10: "\\n",
                11: "\\v",
                12: "\\f",
                13: "\\r",
                27: "\\e",
                34: '\\"',
                92: "\\\\",
                133: "\\N",
                160: "\\_",
                8232: "\\L",
                8233: "\\P"
            }
              , Me = ["y", "Y", "yes", "Yes", "YES", "on", "On", "ON", "n", "N", "no", "No", "NO", "off", "Off", "OFF"]
              , xe = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
            function De(e) {
                var t, n, r;
                if (t = e.toString(16).toUpperCase(),
                e <= 255)
                    n = "x",
                    r = 2;
                else if (e <= 65535)
                    n = "u",
                    r = 4;
                else {
                    if (!(e <= 4294967295))
                        throw new s("code point within a string may not be greater than 0xFFFFFFFF");
                    n = "U",
                    r = 8
                }
                return "\\" + n + i.repeat("0", r - t.length) + t
            }
            function Ie(e) {
                this.schema = e.schema || Z,
                this.indent = Math.max(1, e.indent || 2),
                this.noArrayIndent = e.noArrayIndent || !1,
                this.skipInvalid = e.skipInvalid || !1,
                this.flowLevel = i.isNothing(e.flowLevel) ? -1 : e.flowLevel,
                this.styleMap = function(e, t) {
                    var n, r, i, a, o, s, c;
                    if (null === t)
                        return {};
                    for (n = {},
                    i = 0,
                    a = (r = Object.keys(t)).length; i < a; i += 1)
                        o = r[i],
                        s = String(t[o]),
                        "!!" === o.slice(0, 2) && (o = "tag:yaml.org,2002:" + o.slice(2)),
                        (c = e.compiledTypeMap.fallback[o]) && Te.call(c.styleAliases, s) && (s = c.styleAliases[s]),
                        n[o] = s;
                    return n
                }(this.schema, e.styles || null),
                this.sortKeys = e.sortKeys || !1,
                this.lineWidth = e.lineWidth || 80,
                this.noRefs = e.noRefs || !1,
                this.noCompatMode = e.noCompatMode || !1,
                this.condenseFlow = e.condenseFlow || !1,
                this.quotingType = '"' === e.quotingType ? 2 : 1,
                this.forceQuotes = e.forceQuotes || !1,
                this.replacer = "function" == typeof e.replacer ? e.replacer : null,
                this.implicitTypes = this.schema.compiledImplicit,
                this.explicitTypes = this.schema.compiledExplicit,
                this.tag = null,
                this.result = "",
                this.duplicates = [],
                this.usedDuplicates = null
            }
            function qe(e, t) {
                for (var n, r = i.repeat(" ", t), a = 0, o = -1, s = "", c = e.length; a < c; )
                    -1 === (o = e.indexOf("\n", a)) ? (n = e.slice(a),
                    a = c) : (n = e.slice(a, o + 1),
                    a = o + 1),
                    n.length && "\n" !== n && (s += r),
                    s += n;
                return s
            }
            function Fe(e, t) {
                return "\n" + i.repeat(" ", e.indent * t)
            }
            function Se(e) {
                return 32 === e || 9 === e
            }
            function Le(e) {
                return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && 8232 !== e && 8233 !== e || 57344 <= e && e <= 65533 && e !== je || 65536 <= e && e <= 1114111
            }
            function We(e) {
                return Le(e) && e !== je && 13 !== e && 10 !== e
            }
            function Ue(e, t, n) {
                var r = We(e)
                  , i = r && !Se(e);
                return (n ? r : r && 44 !== e && 91 !== e && 93 !== e && 123 !== e && 125 !== e) && 35 !== e && !(58 === t && !i) || We(t) && !Se(t) && 35 === e || 58 === t && i
            }
            function Ke(e, t) {
                var n, r = e.charCodeAt(t);
                return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1)) >= 56320 && n <= 57343 ? 1024 * (r - 55296) + n - 56320 + 65536 : r
            }
            function Be(e) {
                return /^\n* /.test(e)
            }
            function Ne(e, t, n, r, i, a, o, s) {
                var c, l, u = 0, p = null, _ = !1, f = !1, h = -1 !== r, d = -1, g = Le(l = Ke(e, 0)) && l !== je && !Se(l) && 45 !== l && 63 !== l && 58 !== l && 44 !== l && 91 !== l && 93 !== l && 123 !== l && 125 !== l && 35 !== l && 38 !== l && 42 !== l && 33 !== l && 124 !== l && 61 !== l && 62 !== l && 39 !== l && 34 !== l && 37 !== l && 64 !== l && 96 !== l && function(e) {
                    return !Se(e) && 58 !== e
                }(Ke(e, e.length - 1));
                if (t || o)
                    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
                        if (!Le(u = Ke(e, c)))
                            return 5;
                        g = g && Ue(u, p, s),
                        p = u
                    }
                else {
                    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
                        if (10 === (u = Ke(e, c)))
                            _ = !0,
                            h && (f = f || c - d - 1 > r && " " !== e[d + 1],
                            d = c);
                        else if (!Le(u))
                            return 5;
                        g = g && Ue(u, p, s),
                        p = u
                    }
                    f = f || h && c - d - 1 > r && " " !== e[d + 1]
                }
                return _ || f ? n > 9 && Be(e) ? 5 : o ? 2 === a ? 5 : 2 : f ? 4 : 3 : !g || o || i(e) ? 2 === a ? 5 : 2 : 1
            }
            function Ze(e, t, n, r, i) {
                e.dump = function() {
                    if (0 === t.length)
                        return 2 === e.quotingType ? '""' : "''";
                    if (!e.noCompatMode && (-1 !== Me.indexOf(t) || xe.test(t)))
                        return 2 === e.quotingType ? '"' + t + '"' : "'" + t + "'";
                    var a = e.indent * Math.max(1, n)
                      , o = -1 === e.lineWidth ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a)
                      , c = r || e.flowLevel > -1 && n >= e.flowLevel;
                    switch (Ne(t, c, e.indent, o, (function(t) {
                        return function(e, t) {
                            var n, r;
                            for (n = 0,
                            r = e.implicitTypes.length; n < r; n += 1)
                                if (e.implicitTypes[n].resolve(t))
                                    return !0;
                            return !1
                        }(e, t)
                    }
                    ), e.quotingType, e.forceQuotes && !r, i)) {
                    case 1:
                        return t;
                    case 2:
                        return "'" + t.replace(/'/g, "''") + "'";
                    case 3:
                        return "|" + $e(t, e.indent) + Ge(qe(t, a));
                    case 4:
                        return ">" + $e(t, e.indent) + Ge(qe(function(e, t) {
                            var n, r, i = /(\n+)([^\n]*)/g, a = (s = e.indexOf("\n"),
                            s = -1 !== s ? s : e.length,
                            i.lastIndex = s,
                            Ye(e.slice(0, s), t)), o = "\n" === e[0] || " " === e[0];
                            var s;
                            for (; r = i.exec(e); ) {
                                var c = r[1]
                                  , l = r[2];
                                n = " " === l[0],
                                a += c + (o || n || "" === l ? "" : "\n") + Ye(l, t),
                                o = n
                            }
                            return a
                        }(t, o), a));
                    case 5:
                        return '"' + function(e) {
                            for (var t, n = "", r = 0, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
                                r = Ke(e, i),
                                !(t = Pe[r]) && Le(r) ? (n += e[i],
                                r >= 65536 && (n += e[i + 1])) : n += t || De(r);
                            return n
                        }(t) + '"';
                    default:
                        throw new s("impossible error: invalid scalar style")
                    }
                }()
            }
            function $e(e, t) {
                var n = Be(e) ? String(t) : ""
                  , r = "\n" === e[e.length - 1];
                return n + (r && ("\n" === e[e.length - 2] || "\n" === e) ? "+" : r ? "" : "-") + "\n"
            }
            function Ge(e) {
                return "\n" === e[e.length - 1] ? e.slice(0, -1) : e
            }
            function Ye(e, t) {
                if ("" === e || " " === e[0])
                    return e;
                for (var n, r, i = / [^ ]/g, a = 0, o = 0, s = 0, c = ""; n = i.exec(e); )
                    (s = n.index) - a > t && (r = o > a ? o : s,
                    c += "\n" + e.slice(a, r),
                    a = r + 1),
                    o = s;
                return c += "\n",
                e.length - a > t && o > a ? c += e.slice(a, o) + "\n" + e.slice(o + 1) : c += e.slice(a),
                c.slice(1)
            }
            function Ve(e, t, n, r) {
                var i, a, o, s = "", c = e.tag;
                for (i = 0,
                a = n.length; i < a; i += 1)
                    o = n[i],
                    e.replacer && (o = e.replacer.call(n, String(i), o)),
                    (He(e, t + 1, o, !0, !0, !1, !0) || void 0 === o && He(e, t + 1, null, !0, !0, !1, !0)) && (r && "" === s || (s += Fe(e, t)),
                    e.dump && 10 === e.dump.charCodeAt(0) ? s += "-" : s += "- ",
                    s += e.dump);
                e.tag = c,
                e.dump = s || "[]"
            }
            function ze(e, t, n) {
                var r, i, a, o, c, l;
                for (a = 0,
                o = (i = n ? e.explicitTypes : e.implicitTypes).length; a < o; a += 1)
                    if (((c = i[a]).instanceOf || c.predicate) && (!c.instanceOf || "object" == typeof t && t instanceof c.instanceOf) && (!c.predicate || c.predicate(t))) {
                        if (n ? c.multi && c.representName ? e.tag = c.representName(t) : e.tag = c.tag : e.tag = "?",
                        c.represent) {
                            if (l = e.styleMap[c.tag] || c.defaultStyle,
                            "[object Function]" === ve.call(c.represent))
                                r = c.represent(t, l);
                            else {
                                if (!Te.call(c.represent, l))
                                    throw new s("!<" + c.tag + '> tag resolver accepts not "' + l + '" style');
                                r = c.represent[l](t, l)
                            }
                            e.dump = r
                        }
                        return !0
                    }
                return !1
            }
            function He(e, t, n, r, i, a, o) {
                e.tag = null,
                e.dump = n,
                ze(e, n, !1) || ze(e, n, !0);
                var c, l = ve.call(e.dump), u = r;
                r && (r = e.flowLevel < 0 || e.flowLevel > t);
                var p, _, f = "[object Object]" === l || "[object Array]" === l;
                if (f && (_ = -1 !== (p = e.duplicates.indexOf(n))),
                (null !== e.tag && "?" !== e.tag || _ || 2 !== e.indent && t > 0) && (i = !1),
                _ && e.usedDuplicates[p])
                    e.dump = "*ref_" + p;
                else {
                    if (f && _ && !e.usedDuplicates[p] && (e.usedDuplicates[p] = !0),
                    "[object Object]" === l)
                        r && 0 !== Object.keys(e.dump).length ? (!function(e, t, n, r) {
                            var i, a, o, c, l, u, p = "", _ = e.tag, f = Object.keys(n);
                            if (!0 === e.sortKeys)
                                f.sort();
                            else if ("function" == typeof e.sortKeys)
                                f.sort(e.sortKeys);
                            else if (e.sortKeys)
                                throw new s("sortKeys must be a boolean or a function");
                            for (i = 0,
                            a = f.length; i < a; i += 1)
                                u = "",
                                r && "" === p || (u += Fe(e, t)),
                                c = n[o = f[i]],
                                e.replacer && (c = e.replacer.call(n, o, c)),
                                He(e, t + 1, o, !0, !0, !0) && ((l = null !== e.tag && "?" !== e.tag || e.dump && e.dump.length > 1024) && (e.dump && 10 === e.dump.charCodeAt(0) ? u += "?" : u += "? "),
                                u += e.dump,
                                l && (u += Fe(e, t)),
                                He(e, t + 1, c, !0, l) && (e.dump && 10 === e.dump.charCodeAt(0) ? u += ":" : u += ": ",
                                p += u += e.dump));
                            e.tag = _,
                            e.dump = p || "{}"
                        }(e, t, e.dump, i),
                        _ && (e.dump = "&ref_" + p + e.dump)) : (!function(e, t, n) {
                            var r, i, a, o, s, c = "", l = e.tag, u = Object.keys(n);
                            for (r = 0,
                            i = u.length; r < i; r += 1)
                                s = "",
                                "" !== c && (s += ", "),
                                e.condenseFlow && (s += '"'),
                                o = n[a = u[r]],
                                e.replacer && (o = e.replacer.call(n, a, o)),
                                He(e, t, a, !1, !1) && (e.dump.length > 1024 && (s += "? "),
                                s += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "),
                                He(e, t, o, !1, !1) && (c += s += e.dump));
                            e.tag = l,
                            e.dump = "{" + c + "}"
                        }(e, t, e.dump),
                        _ && (e.dump = "&ref_" + p + " " + e.dump));
                    else if ("[object Array]" === l)
                        r && 0 !== e.dump.length ? (e.noArrayIndent && !o && t > 0 ? Ve(e, t - 1, e.dump, i) : Ve(e, t, e.dump, i),
                        _ && (e.dump = "&ref_" + p + e.dump)) : (!function(e, t, n) {
                            var r, i, a, o = "", s = e.tag;
                            for (r = 0,
                            i = n.length; r < i; r += 1)
                                a = n[r],
                                e.replacer && (a = e.replacer.call(n, String(r), a)),
                                (He(e, t, a, !1, !1) || void 0 === a && He(e, t, null, !1, !1)) && ("" !== o && (o += "," + (e.condenseFlow ? "" : " ")),
                                o += e.dump);
                            e.tag = s,
                            e.dump = "[" + o + "]"
                        }(e, t, e.dump),
                        _ && (e.dump = "&ref_" + p + " " + e.dump));
                    else {
                        if ("[object String]" !== l) {
                            if ("[object Undefined]" === l)
                                return !1;
                            if (e.skipInvalid)
                                return !1;
                            throw new s("unacceptable kind of an object to dump " + l)
                        }
                        "?" !== e.tag && Ze(e, e.dump, t, a, u)
                    }
                    null !== e.tag && "?" !== e.tag && (c = encodeURI("!" === e.tag[0] ? e.tag.slice(1) : e.tag).replace(/!/g, "%21"),
                    c = "!" === e.tag[0] ? "!" + c : "tag:yaml.org,2002:" === c.slice(0, 18) ? "!!" + c.slice(18) : "!<" + c + ">",
                    e.dump = c + " " + e.dump)
                }
                return !0
            }
            function Je(e, t) {
                var n, r, i = [], a = [];
                for (Qe(e, i, a),
                n = 0,
                r = a.length; n < r; n += 1)
                    t.duplicates.push(i[a[n]]);
                t.usedDuplicates = new Array(r)
            }
            function Qe(e, t, n) {
                var r, i, a;
                if (null !== e && "object" == typeof e)
                    if (-1 !== (i = t.indexOf(e)))
                        -1 === n.indexOf(i) && n.push(i);
                    else if (t.push(e),
                    Array.isArray(e))
                        for (i = 0,
                        a = e.length; i < a; i += 1)
                            Qe(e[i], t, n);
                    else
                        for (i = 0,
                        a = (r = Object.keys(e)).length; i < a; i += 1)
                            Qe(e[r[i]], t, n)
            }
            function Xe(e, t) {
                return function() {
                    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.")
                }
            }
            const et = {
                Type: f,
                Schema: g,
                FAILSAFE_SCHEMA: w,
                JSON_SCHEMA: j,
                CORE_SCHEMA: P,
                DEFAULT_SCHEMA: Z,
                load: ke.load,
                loadAll: ke.loadAll,
                dump: {
                    dump: function(e, t) {
                        var n = new Ie(t = t || {});
                        n.noRefs || Je(e, n);
                        var r = e;
                        return n.replacer && (r = n.replacer.call({
                            "": r
                        }, "", r)),
                        He(n, 0, r, !0, !0) ? n.dump + "\n" : ""
                    }
                }.dump,
                YAMLException: s,
                types: {
                    binary: F,
                    float: T,
                    map: b,
                    null: E,
                    pairs: K,
                    set: N,
                    timestamp: D,
                    bool: A,
                    int: R,
                    merge: I,
                    omap: W,
                    seq: y,
                    str: m
                },
                safeLoad: Xe("safeLoad", "load"),
                safeLoadAll: Xe("safeLoadAll", "loadAll"),
                safeDump: Xe("safeDump", "dump")
            }
        }
        ,
        147: e=>{
            "use strict";
            e.exports = JSON.parse('{"i8":"3.0.0-beta-4"}')
        }
    }
      , __webpack_module_cache__ = {};
    function __webpack_require__(e) {
        var t = __webpack_module_cache__[e];
        if (void 0 !== t)
            return t.exports;
        var n = __webpack_module_cache__[e] = {
            exports: {}
        };
        return __webpack_modules__[e](n, n.exports, __webpack_require__),
        n.exports
    }
    __webpack_require__.d = (e,t)=>{
        for (var n in t)
            __webpack_require__.o(t, n) && !__webpack_require__.o(e, n) && Object.defineProperty(e, n, {
                enumerable: !0,
                get: t[n]
            })
    }
    ,
    __webpack_require__.o = (e,t)=>Object.prototype.hasOwnProperty.call(e, t);
    var __webpack_exports__ = {};
    (()=>{
        "use strict";
        var _handle_main_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(755)
          , _package_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(147)
          , _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(70)
          , _chenyfan_cache_db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(385);
        _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.s(`ClientWorker${_package_json__WEBPACK_IMPORTED_MODULE_1__.i8} Started!`);
        const db = new _chenyfan_cache_db__WEBPACK_IMPORTED_MODULE_3__;
        db.read("hotpatch").then((script=>{
            script ? (_utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.s("Hotpatch Loaded!"),
            eval(script)) : _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.w("Hotpatch Not Found!")
        }
        )),
        db.read("config").then((config=>{
            config = JSON.parse(config) || {},
            setInterval((()=>{
                _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.s(`ClientWorker@${_package_json__WEBPACK_IMPORTED_MODULE_1__.i8} Start to Clean Expired Cache!`),
                caches.open("ClientWorker_ResponseCache").then((e=>{
                    e.keys().then((t=>{
                        t.forEach((t=>{
                            e.match(t).then((n=>{
                                Number(n.headers.get("ClientWorker_ExpireTime")) <= (new Date).getTime() && e.delete(t)
                            }
                            ))
                        }
                        ))
                    }
                    ))
                }
                ))
            }
            ), eval(config.cleaninterval) || 6e4)
        }
        )),
        addEventListener("fetch", (e=>{
            e.respondWith(self.clientworkerhandle(e.request))
        }
        )),
        addEventListener("install", (function() {
            _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.s(`ClientWorker@${_package_json__WEBPACK_IMPORTED_MODULE_1__.i8} Installed!`),
            self.skipWaiting()
        }
        )),
        addEventListener("activate", (function() {
            _utils_cons_js__WEBPACK_IMPORTED_MODULE_2__.Z.s(`ClientWorker@${_package_json__WEBPACK_IMPORTED_MODULE_1__.i8} Activated!`),
            self.clients.claim()
        }
        ))
    }
    )()
}
)();
