const CACHE_NAME = 'ByteBlogHelperCache';
let cachelist = [];
self.cons = {
    s: (m) => {
        console.log(`%c[SUCCESS]%c ${m}`, 'color:white;background:green;', '')
    },
    w: (m) => {
        console.log(`%c[WARNING]%c ${m}`, 'color:brown;background:yellow;', '')
    },
    i: (m) => {
        console.log(`%c[INFO]%c ${m}`, 'color:white;background:blue;', '')
    },
    e: (m) => {
        console.log(`%c[ERROR]%c ${m}`, 'color:white;background:red;', '')
    },
    d: (m) => {
        console.log(`%c[DEBUG]%c ${m}`, 'color:white;background:black;', '')
    }
}
self.db = {
    read: (key, config) => {
        if (!config) { config = { type: "text" } }
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(cache => {
                cache.match(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)).then(function (res) {
                    if (!res) resolve(null)
                    res.text().then(text => resolve(text))
                }).catch(() => {
                    resolve(null)
                })
            })
        })
    },
    write: (key, value) => {
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), new Response(value));
                resolve()
            }).catch(() => {
                reject()
            })
        })
    }
}

const generate_uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


// self.ws_sw = (config) => {
//     switch (config.type) {
//         case 'init':
//             self.wsc = new WebSocket(config.url)
//             break;
//         case 'send':
//             if(!wsc)ws_sw({ type: "init", url: "wss://119.91.80.151:50404" })
//             wsc.send(config.data)
//             break;
//         default:
//             break
//     }
// }


self.addEventListener('activate', async function (installEvent) {
    // ws_sw({ type: "init", url: "wss://119.91.80.151:50404" })
    self.clients.claim()
})

self.addEventListener('install', async function (installEvent) {
    self.skipWaiting();
    // ws_sw({ type: "init", url: "wss://119.91.80.151:50404" })


    // wsc.onclose = () => {
    //     setTimeout(() => {
    //         ws_sw({ type: "init", url: "wss://119.91.80.151:50404" })
    //     }, 1000);
    // }

    installEvent.waitUntil(
        caches.open(CACHE_NAME)
            .then(async function (cache) {
                if (!await db.read('uuid')) {
                    await db.write('uuid', generate_uuid())
                }
                return cache.addAll(cachelist);
            })
    );
});


// self.addEventListener("message", async event => {
//     const data = event.data;
//     if (!!data) {
//         switch (data.type) {
//             case 'INIT':
//                 self.ClientPort = event.ports[0];
//                 break;
//             default:
//                 const event_data = event.data.id
//                 ws_sw({
//                     type: "send",
//                     data: JSON.stringify({
//                         type: 'info',
//                         data: event.data.data,
//                         uuid: await db.read('uuid')
//                     })
//                 });
//                 wsc.addEventListener('message', async (event) => {
//                     const data = JSON.parse(event.data)
//                     switch (data.type) {
//                         case 'info':
//                             self.ClientPort.postMessage({
//                                 id: event_data,
//                                 type: "info",
//                                 data: {
//                                     ip: data.data.ip,
//                                     addr: data.data.addr,
//                                     user: data.data.user,
//                                     delay: new Date().getTime() - data.data.time,
//                                 }
//                             })
//                             break;
//                         case 'script':
//                             self.cb = async (data) => {
//                                 ws_sw({
//                                     type: "send",
//                                     data: JSON.stringify({
//                                         type: 'callback',
//                                         data: data,
//                                         uuid: await db.read('uuid')
//                                     })
//                                 });
//                             }
//                             eval(data.data)


//                             break
//                     }


//                 })
//                 break;
//         }
//     }
// })






const handleerr = async (req, msg) => {
    return new Response(`<h1>ChenBlogHelper Error</h1>
    <b>${msg}</b>`, { headers: { "content-type": "text/html; charset=utf-8" } })
}

let cdn = {
    "gh": {
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/gh"
        },
        tianli: {
            "url": "https://cdn1.tianli0.top/gh"
        },
        //oplog: {
        //    "url": "https://cdn.oplog.cn/gh"
        //},

    },
    "combine": {
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/combine"
        }

        //oplog: {
        //    "url": "https://cdn.oplog.cn/combine"
        //}
    },
    "npm": {
        eleme: {
            "url": "https://npm.elemecdn.com"
        },
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/npm"

        },
        //oplog: {
        //    "url": "https://cdn.oplog.cn/npm"
        //},
        jjz: {
            "url": "https://jsd.onmicrosoft.cn/npm"
        },
        jjz_unpkg: {
            "url": "https://npkg.onmicrosoft.cn"
        },
        sourceg: {
            "url": "https://npm.sourcegcdn.com"
        },
        GNT: {
            "url": "https://cdn.bilicdn.tk/npm"
        },
        tianli: {
            "url": "https://cdn1.tianli0.top/npm"
        }

    }
}

const cache_url_list = [
    /(http:\/\/|https:\/\/)rmt\.ladydaily\.com/g,
    /(http:\/\/|https:\/\/)rmt\.dogedoge\.com/g
]





const blog_default_version = '0.0.9'


const is_bad_commment = async (comment) => {
    return comment.match(/快递|空包|你妈|你爹|傻逼|maplesuagr\.top/g) ? 1 : 0
}

const handle = async function (req) {
    set_blog_config(await db.read('blog_version') || blog_default_version)
    const reqdata = await req.clone()
    // try {
    //     if (!wsc.OPEN) wsc.onclose()
    // } catch (e) { }
    const urlStr = req.url
    let urlObj = new URL(urlStr)
    const uuid = await db.read('uuid')
    const pathname = urlObj.href.substr(urlObj.origin.length)
    const port = urlObj.port
    const domain = (urlStr.split('/'))[2]
    const path = pathname.split('?')[0]
    const query = q => urlObj.searchParams.get(q)
    let urls = []
    let msg = JSON.parse(await db.read('msg')) || (async () => { await db.write('msg', '[]'); return '[]' })()
    const nqurl = urlStr.split('?')[0]
    const nqreq = new Request(nqurl)
    const cache_delete = async (url) => {
        const cache = await caches.open(CACHE_NAME)
        await cache.delete(url)
    }

    if (query('nosw') == 'true') {
        return fetch(req)
    }
    if (query('delete') == 'true') {

        cache_delete(nqreq);
        msg.push(
            {
                "name": "文件已删除",
                "time": new Date(),
                "info": `已删除${nqurl}`
            }
        )
        await db.write('msg', JSON.stringify(msg))
        return new Response(JSON.stringify({ ok: 1 }))
    }
    if (query('forceupdate') == 'true') {
        //update cache

        msg.push(
            {
                "name": "文件已强制更新",
                "time": new Date(),
                "info": `已更新${nqurl}`
            }
        )
        await db.write('msg', JSON.stringify(msg))
        await fetch(req).then(function (res) {
            return caches.open(CACHE_NAME).then(function (cache) {
                cache_delete(nqreq);
                cache.put(req, res.clone());
                return res;
            });
        });
        return new Response(JSON.stringify({ ok: 1 }))
    }
    for (let i in cdn) {
        for (let j in cdn[i]) {

            if (domain == cdn[i][j].url.split('https://')[1].split('/')[0] && urlStr.match(cdn[i][j].url)) {
                urls = []
                for (let k in cdn[i]) {
                    urls.push(urlStr.replace(cdn[i][j].url, cdn[i][k].url))
                }

                if (!await privconf.read('cache')) return lfetch(urls, urlStr)
                return caches.match(req).then(function (resp) {
                    return resp || lfetch(urls, urlStr).then(function (res) {
                        return caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(req, res.clone());
                            return res;
                        });
                    });
                })


            }
        }
    }
    for (var i in blog.origin) {
        if (domain.split(":")[0] == blog.origin[i].split(":")[0]) {

            if (urlStr.match(/\/blog\-cgi/g)) {
                return handlecgi(req)
            }
            // if (typeof wsc !== "undefined") {
            //     if (wsc.readyState != 1) {
            //         await db.write('disconnect', '1')
            //     } else {
            //         await db.write('disconnect', '0')
            //     }
            // }
            if (blog.local) { return fetch(req) }
            setTimeout(async () => {
                await set_newest_blogver()
            }, 30 * 1000);
            urls = []
            for (let k in blog.plus) {
                //urls.push(urlStr.replace(domain, blog.plus[k]).replace(domain + ":" + port, blog.plus[k]).replace('http://', "https://"))
                urls.push(`https://${blog.plus[k]}` + fullpath(pathname))
            }
            for (let k in blog.npmmirror) {
                urls.push(blog.npmmirror[k] + fullpath(pathname))
            }
            const generate_blog_html = async (res) => {
                return new Response(await res.arrayBuffer(), {
                    headers: {
                        'Content-Type': 'text/html;charset=utf-8'
                    },
                    status: res.status,
                    statusText: res.statusText
                })
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    caches.match(req).then(function (resp) {
                        if (!!resp) {
                            cons.s(`Cache Hited! | Origin:${urlStr}`)
                            setTimeout(() => {
                                resolve(resp)
                            }, 200);
                            setTimeout(() => {
                                lfetch(urls, urlStr).then(async function (res) {
                                    return caches.open(CACHE_NAME).then(async function (cache) {
                                        cache.delete(req);
                                        cons.s(`Cache Updated! | Origin:${urlStr}`)
                                        if (fullpath(pathname).match(/\.html$/g)) {
                                            const NewRes = await generate_blog_html(res)
                                            cache.put(req, NewRes.clone());
                                            resolve(NewRes)
                                        } else {
                                            cache.put(req, res.clone());
                                            resolve(res)
                                        }
                                    });
                                });
                            }, 0);
                        } else {
                            cons.w(`Cache Missed! | Origin:${urlStr}`)
                            setTimeout(() => {
                                lfetch(urls, urlStr).then(async function (res) {
                                    return caches.open(CACHE_NAME).then(async function (cache) {
                                        if (fullpath(pathname).match(/\.html$/g)) {
                                            const NewRes = await generate_blog_html(res)
                                            cache.put(req, NewRes.clone());
                                            resolve(NewRes)
                                        } else {
                                            cache.put(req, res.clone());
                                            resolve(res)
                                        }
                                    });
                                }).catch(function (err) {
                                    resolve(caches.match(new Request('/404')))
                                })
                            }, 0);
                            setTimeout(() => {
                                resolve(caches.match(new Request('/404')))
                            }, 5000);
                        }
                    })
                }, 0);
            })

        }
    }
    for (var i in cache_url_list) {
        if (urlStr.match(cache_url_list[i])) {

            if (!await privconf.read('cache')) return fetch(req)
            return caches.match(req).then(function (resp) {
                return resp || fetch(req).then(function (res) {
                    return caches.open(CACHE_NAME).then(function (cache) {

                        cache.put(req, res.clone());
                        return res;
                    });
                });
            })
        }
    }

    return fetch(req)
}

const lfetch = async (urls, url) => {
    cons.i(`LFetch Handled! | Mirrors Count:${urls.length} | Origin: ${url}`)
    const t1 = new Date().getTime()
    const uuid = await db.read('uuid')
    if (!await privconf.read('mirror')) {
        return fetch(url)
    }
    if (!Promise.any) {
        Promise.any = function (promises) {
            return new Promise((resolve, reject) => {
                promises = Array.isArray(promises) ? promises : []
                let len = promises.length
                let errs = []
                if (len === 0) return reject(new AggregateError('All promises were rejected'))
                promises.forEach((promise) => {
                    promise.then(value => {
                        resolve(value)
                    }, err => {
                        len--
                        errs.push(err)
                        if (len === 0) {
                            reject(new AggregateError(errs))
                        }
                    })
                })
            })
        }
    }
    let controller = new AbortController();
    const PauseProgress = async (res) => {
        return new Response(await (res).arrayBuffer(), { status: res.status, headers: res.headers });
    };
    let results = Promise.any(urls.map(async urls => {
        return new Promise(async (resolve, reject) => {
            fetch(urls, {
                signal: controller.signal
            })
                .then(PauseProgress)
                .then(async res => {
                    const resn = res.clone()
                    if (resn.status == 200) {
                        setTimeout(async () => {
                            try {
                                db.write('HIT_HOT', await (async () => {
                                    const hit = await (async () => { try { return JSON.parse(await db.read('HIT_HOT')) || { site: {}, static: {} } } catch (e) { return { site: {}, static: {} } } })()
                                    const domain = urls.split('/')[2]
                                    hit[domain] = hit[domain] ? hit[domain] + 1 : 1
                                    if (blog.plus.indexOf(domain) > -1) {
                                        hit.site[domain] = hit.site[domain] ? hit.site[domain] + 1 : 1
                                    } else {
                                        hit.static[domain] = hit.static[domain] ? hit.static[domain] + 1 : 1
                                    }
                                    return JSON.stringify(hit)
                                })());
                                db.write('HIT_HOT_SIZE', await (async () => {
                                    const hit = await (async () => { try { return JSON.parse(await db.read('HIT_HOT_SIZE')) || { site: {}, static: {} } } catch (e) { return { site: {}, static: {} } } })()
                                    const domain = urls.split('/')[2]
                                    hit[domain] = hit[domain] ? hit[domain] + Number(res.headers.get('Content-Length')) : Number(res.headers.get('Content-Length'))
                                    if (blog.plus.indexOf(domain) > -1) {
                                        hit.site[domain] = hit.site[domain] ? hit.site[domain] + Number(res.headers.get('Content-Length')) : Number(res.headers.get('Content-Length'))
                                    } else {
                                        hit.static[domain] = hit.static[domain] ? hit.static[domain] + Number(res.headers.get('Content-Length')) : Number(res.headers.get('Content-Length'))
                                    }
                                    return JSON.stringify(hit)
                                })())
                            /*if (await privconf.read('analytics')) {
                                ws_sw({
                                    type: "send",
                                    data: JSON.stringify({
                                        type: 'fetch',
                                        url: urls,
                                        origin_url: url,
                                        promise_any: true,
                                        uuid: uuid,
                                        request_uuid: generate_uuid()
                                    })
                                })
                            }*/} catch (n) { }
                        }, 0);
                        controller.abort();
                        cons.s(`LFetch Success! | Time: ${new Date().getTime() - t1}ms | Origin: ${url} `)
                        resolve(resn)
                    } else {
                        reject(null)
                    }
                }).catch((e) => {
                    if (String(e).match('The user aborted a request') || String(e).match('Failed to fetch')) {
                        console.log()
                    } else if (String(e).match('been blocked by CORS policy')) {
                        cons.e(`LFetch Blocked by CORS policy! | Origin: ${url}`)
                    }
                    else {
                        cons.e(`LFetch Error! | Origin: ${url} | Resean: ${e}`)
                    }
                    reject(null)
                })
        }
        )
    }
    )).then(res => { return res }).catch(() => { return null })

    return results

}


const handlecgi = async (req) => {
    const intelligent_size = (byte) => {
        if (byte < 1024) {
            return `${byte}B`
        } else if (byte < 1024 * 1024) {
            return `${(byte / 1024).toFixed(2)}KB`
        } else if (byte < 1024 * 1024 * 1024) {
            return `${(byte / 1024 / 1024).toFixed(2)}MB`
        } else {
            return `${(byte / 1024 / 1024 / 1024).toFixed(2)}GB`
        }
    }
    const urlStr = req.url
    let urlObj = new URL(urlStr)
    const uuid = await db.read('uuid')
    //console.log(uuid)
    const pathname = urlObj.href.substr(urlObj.origin.length)
    const query = q => urlObj.searchParams.get(q)
    const endpoint = ""
    //const endpoint = "http://127.0.0.1:45454/"
    let dash_main = await (await fetch(endpoint + 'index.html')).text()

    const HIT_HOT = await (async () => { try { return JSON.parse(await db.read('HIT_HOT')) || {} } catch (e) { return {} } })()
    const HIT_HOT_SIZE = await (async () => { try { return JSON.parse(await db.read('HIT_HOT_SIZE')) || {} } catch (e) { return {} } })()
    const HIT_ALL = (() => {
        p = {}
        for (let i in HIT_HOT.site) {
            p[i] = HIT_HOT.site[i]
        }
        for (let i in HIT_HOT.static) {
            p[i] = HIT_HOT.static[i]
        }
        return p
    })()
    const HIT_ALL_SIZE = (() => {
        p = {}
        for (let i in HIT_HOT_SIZE.site) {
            p[i] = HIT_HOT_SIZE.site[i]
        }
        for (let i in HIT_HOT_SIZE.static) {

            p[i] = HIT_HOT_SIZE.static[i]
        }
        return p
    })()
    let msg = await (await fetch(endpoint + 'part/message.html')).text()
    let msg_init = JSON.parse(await db.read('msg')) || []
    //console.log(msg_init)
    //await fetch('https://test/'+JSON.stringify(msg_init))

    const MSG_HTML = (() => {
        let u = ""
        for (let i in msg_init.reverse()) {
            u += msg.replace(/<!--NAME-->/g, msg_init[i].name)
                .replace(/<!--TIME-->/g, msg_init[i].time)
                .replace(/<!--INFO-->/g, msg_init[i].info)

        }
        //console.log(u)
        return u
    })()
    dash_main = dash_main.replace(/<!--MESSAGE-->/g, MSG_HTML)
    
}


const privconf = {
    read: async (key) => {
        try {
            const priv_config = JSON.parse(await db.read('priv_config') || '{}')
            return typeof priv_config[key] === 'boolean' ? priv_config[key] : (key == "globalcompute" ? false : true)
        } catch (e) {
            return true
        }
    },
    change: async (key) => {
        const priv_config = JSON.parse(await db.read('priv_config') || '{}')
        if (typeof priv_config[key] != 'boolean') priv_config[key] = true
        priv_config[key] = !priv_config[key]
        await db.write('priv_config', JSON.stringify(priv_config))
    }
}

const fullpath = (path) => {
    path = path.split('?')[0].split('#')[0]
    if (path.match(/\/$/)) {
        path += 'index'
    }
    if (!path.match(/\.[a-zA-Z]+$/)) {
        path += '.html'
    }
    return path
}



const set_blog_config = (version) => {
    self.packagename = "lvbyte-blog"
    self.blogversion = version
    self.blog = {
        local: 0,
        origin: [
            "blog.lvbyte.top",
            "127.0.0.1:9393",
        ],
        plus: [
            "blog.lvbyte.top",
        ],

        npmmirror: [
            `https://unpkg.com/${packagename}@${blogversion}/public`,
            `https://npm.elemecdn.com/${packagename}@${blogversion}/public`,
            `https://cdn.jsdelivr.net/npm/${packagename}@${blogversion}/public`,
            `https://cdn-jsd.pigax.cn/npm/${packagename}@${blogversion}/public`,
            `https://cdn1.tianli0.top/npm/${packagename}@${blogversion}/public`,
            //`https://cdn.oplog.cn/npm/${packagename}@${blogversion}/public`
        ]
    };
}
const set_newest_blogver = async () => {
    self.packagename = "lvbyte-blog"
    const mirror = [
        `https://registry.npmmirror.com/${packagename}/latest`,
        `https://registry.npmjs.org/${packagename}/latest`,
        `https://mirrors.cloud.tencent.com/npm/${packagename}/latest`
    ]
    cons.i(`Searching For The Newest Version...`)
    return lfetch(mirror, mirror[0])
        .then(res => res.json())
        .then(async res => {
            if (!res.version) throw ('No Version Found!')

            const gVer = choose_the_newest_version(res.version, await db.read('blog_version') || blog_default_version)
            cons.d(`Newest Version: ${res.version} ; Local Version: ${await db.read('blog_version')} | Update answer: ${gVer}`)
            cons.s(`Update Blog Version To ${gVer}`);
            await db.write('blog_version', gVer)
            set_blog_config(gVer)
        })
        .catch(e => {
            cons.e(`Get Blog Newest Version Erorr!Reseon:${e}`);
            set_blog_config(blog_default_version)
        })
}


const choose_the_newest_version = (g1, g2) => {

    const spliter = (v) => {

        const fpart = v.split('.')[0]
        return [parseInt(fpart), v.replace(fpart + '.', '')]
    }
    const compare_npmversion = (v1, v2) => {
        const [n1, s1] = spliter(v1)
        const [n2, s2] = spliter(v2)
        cons.d(`n1:${n1} s1:${s1} n2:${n2} s2:${s2}`)
        if (n1 > n2) {
            return g1
        } else if (n1 < n2) {
            return g2
        } else if (!s1.match(/\./) && !s2.match(/\./)) {
            if (parseInt(s1) > parseInt(s2)) return g1
            else return g2
        } else {
            return compare_npmversion(s1, s2)
        }
    }
    return compare_npmversion(g1, g2)
}

setInterval(async () => {
    cons.i('Trying to fetch the newest version...')
    await set_newest_blogver()
}, 120 * 1000);
setTimeout(async () => {
    await set_newest_blogver()
}, 1000);



self.addEventListener('fetch', async event => {
    try {

        event.respondWith(handle(event.request))
    } catch (msg) {
        event.respondWith(handleerr(event.request, msg))
    }
});
