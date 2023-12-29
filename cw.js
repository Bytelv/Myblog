importScripts('https://unpkg.com/clientworker@2.7.2-beta-2/dist/cw.js')
importScripts('https://cdn.webpushr.com/sw-server.min.js');
importScripts('https://npm.sourcegcdn.com/marked@4.0.18/marked.min.js')

const list_post = async (args) =>{
    const urlObj = new URL(args.request.url)
    const path = urlObj.pathname
    const githubapiend = 'https://api.github.com/repos/ChenYFan/blog/contents/source/_posts' + path
    return fetch(githubapiend).then(res => res.json()).then(res => {
        const posts = res.filter(item => item.name.endsWith('.md')).map(item => {
            return {
                name: item.name,
                url: item.path
            }
        }).sort((a, b) => {
            return b.name.split('-')[0] - a.name.split('-')[0]
        }).map(item => {
            return {
                name: item.name,
                url: item.url.replace('source/_posts','')
            }
        })
        let html = '<h1>CyanFalseの博客</h1></br>'
        posts.forEach(item => {
            html += `<a href="${item.url}">${item.name.replace(/\.md$/g,'')}</a><br>`
        })
        return {
            fetched: true,
            response: new Response(html,{
                headers:{
                    'Content-Type': 'text/html;charset=utf-8'
                }
            })
        }
    })
}

const show_post = async (args) =>{
    const urlObj = new URL(args.request.url)
    const path = urlObj.pathname
    const githubdownloadend = 'https://raw.githubusercontent.com/ChenYFan/blog/master/source/_posts' + path
    return fetch(githubdownloadend).then(res => res.text()).then(res => {
        return {
            fetched: true,
            response: new Response('<a href="/">👈返回主页</a></br>'+marked.parse(res),{
                headers:{
                    'Content-Type': 'text/html;charset=utf-8'
                }
            })
        }
    })
}
