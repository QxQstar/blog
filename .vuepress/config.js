module.exports = {
    title: '何遇的博客',
    description: '何其有幸，今生相遇',
    themeConfig: {
        nav: [{
                text: 'git系列',
                items: [
                    { text: 'git commit message 规范', link: '/documents/webBasic/gitCommit/' },
                    { text: 'git 分支管理', link: '/documents/webBasic/gitBranch/' },
                    { text: 'git的基本用法', link: '/documents/git/' }
                ]
            },
            {
                text: '微前端系列',
                items: [{
                        text: 'webComponent + 微前端',
                        link: '/documents/microFE/webComponent/'
                    },
                    {
                        text: '实现微前端不同方式',
                        link: '/documents/microFE/mutilResolve/'
                    },
                    {
                        text: '微前端在 react 项目中应用',
                        link: '/documents/microFE/reactResolve/'
                    },
                    {
                        text: 'single-spa 微前端落地',
                        link: '/documents/microFE/singleSPA/'
                    },
                    {
                        text: '基于 single-spa 的微前端框架',
                        link: '/documents/microFE/grape/'
                    }
                ],

            },
            // {
            //     text:'可视化页面搭建',
            //     link:'/documents/VisualPageCreation/list/'
            // },
            {
                text: '早读系列',
                items: [{
                        text: 'codeReview',
                        link: '/documents/morningRead/codeReview.html'
                    },
                    {
                        text: 'js 错误上报',
                        link: '/documents/morningRead/javaScriptErrors.html'
                    },
                    {
                        text: 'session,cookie和token',
                        link: '/documents/morningRead/sessionCookie.html'
                    },
                    {
                        text: '微信小程序',
                        link: '/documents/morningRead/weixin/'
                    }
                ]
            },
            {
                text: '第三方库',
                items: [{
                        text: 'element-ui自定义主题原理',
                        link: '/documents/library/element/'
                    },
                    {
                        text: ' Vue 源码解读之 Vue 实例创建与挂载流程 ',
                        link: '/documents/library/vue/'
                    },
                    {
                        text: 'VueRouter 源码解读',
                        link: '/documents/library/vue-router/'
                    },
                    {
                        text: 'Vuex 源码解读',
                        link: '/documents/library/vuex/'
                    },
                    {
                        text: 'VueCli 3.x 工具介绍',
                        link: '/documents/library/vue-cli 3.x/'
                    }
                ]
            },
            {
                text: '总结',
                items: [{
                        text: '2019年度总结',
                        link: '/documents/summary/2019/'
                    },
                    {
                        text: '个人简历',
                        link: '/documents/summary/resumes/2020.html'
                    },
                    {
                        text: '前端知识你问我答',
                        link: '/documents/summary/QA/interview.html'
                    },
                    {
                        text: '页面可视化搭建系统设计思路',
                        link: '/documents/VisualPageCreation/'
                    },
                    {
                        text: "是时候用 useMemo,useCallback,React's memo API 优化性能了?",
                        link: '/documents/reactHooks/useCallback+UseMemo+MemoApi.html'
                    },{
                        text: "手把手带你实现一个简易版 React",
                        link: '/documents/analyseReact/'
                    },
                    {
                        text: '前端状态管理的历史回溯与思考',
                        link :'/documents/summary/stateManager/'
                    },
                    {
                        text: '2020 总结｜何遇 - 写给 2020 年的何遇',
                        link :'/documents/summary/2020/'
                    },
                    {
                        text: '深入学习 React Fiber',
                        link: '/documents/summary/fiber/result.html'
                    },
                    {
                        text: '深入讲解 React 中的 state 和 props 更新',
                        link: '/documents/summary/reactUpdate/'
                    },
                    {
                        text: '图片美化',
                        link: '/documents/visualization/beautify/'
                    },
                    {
                        text: '用 Lerna 管理 TypeScript monorepo',
                        link: '/documents/summary/lernaWithTs/'
                    },
                    {
                        text: '颜色空间的基本指南',
                        link: '/documents/summary/colorSpace/result'
                    }
                ]
            },
            {
                text: 'github',
                link: 'https://github.com/QxQstar',
                target: '_blank'
            }

        ],
        sidebarDepth: 3,
        sidebar: 'auto'
    },
    base: '/',
    dest: 'docs',
    head: [
        ['link', { rel: 'shortcut icon', href: './logo-small.png' }]
    ]
}