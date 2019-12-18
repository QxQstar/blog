module.exports = {
    title: 'Bella\'s blog',
    description: '我见青山多妩媚，料青山见我应如是',
    themeConfig: {
        nav:[
            {
                text:'git系列',
                items:[
                    { text: 'git commit message 规范', link: '/documents/webBasic/gitCommit/' },
                    { text: 'git 分支管理', link: '/documents/webBasic/gitBranch/' },
                    { text: 'git的基本用法', link: '/documents/git/' }
                ]
            },
            {
                text:'single-spa微前端系列',
                items:[
                    {
                        text:'single-spa微前端落地',
                        link:'/documents/singleSPA/'
                    },
                    {
                        text:'微前端框架',
                        link:'/documents/grape/'
                    }
                ],

            },
            {
                text:'早读系列',
                items:[
                    {
                        text:'codeReview',
                        link:'/documents/morningRead/codeReview.html'
                    },
                    {
                        text:'js 错误上报',
                        link:'/documents/morningRead/javaScriptErrors.html'
                    },
                    {
                        text:'session,cookie和token',
                        link:'/documents/morningRead/sessionCookie.html'
                    }
                ]
            },
            {
                text:'微信小程序',
                link:'/documents/weixin/'
            },
            {
                text:'element-ui自定义主题原理',
                link:'/documents/element/'
            },
            {
                text:'github',
                link:'https://github.com/QxQstar',
                target:'_blank'
            }
        ],
        sidebarDepth:3,
        sidebar: 'auto'
    },
    base:'/',
    dest:'docs'
}
