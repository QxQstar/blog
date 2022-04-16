const { config } = require("vuepress-theme-hope");

module.exports = config({
    title: '何遇的博客',
    description: '何其有幸，今生相遇',
    themeConfig: {
        record: '蜀ICP备19040311号-1',
        recordLink: 'https://beian.miit.gov.cn/',
        startYear:'2019',
        nav: [{
                text: 'git系列',
                items: [
                    { text: 'git commit message 规范', link: '/documents/webBasic/gitCommit/' },
                    { text: 'git 分支管理', link: '/documents/webBasic/gitBranch/' },
                    { text: 'git的基本用法', link: '/documents/git/' }
                ]
            },
            {
                text: '低代码',
                items: [
                    {
                        text: '关于低代码的思考',
                        link: '/documents/lowCode/lowCode'
                    },
                    {
                        text: '基础理论知识 -- Promise',
                        link: '/documents/lowCode/basicTheory/TypeScript/ES6ES7/Promise'
                    },
                    {
                        text: '基础理论知识 -- async/await',
                        link: '/documents/lowCode/basicTheory/TypeScript/ES6ES7/asyncAwait'
                    },
                    {
                        text: '基础理论知识 -- class',
                        link: '/documents/lowCode/basicTheory/TypeScript/ES6ES7/class'
                    }
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
                        text: '2021 总结｜2021年年终自述',
                        link :'/documents/summary/2021/'
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
                    },
                    {
                        text: '给视频和图片添加特效',
                        link: '/documents/summary/realTimeEffectForVideo/'
                    },
                    {
                        text:'Web 性能优化第一篇',
                        link: '/documents/summary/fastLoadTime/result'
                    },
                    {
                        text:'优化网站中的图片和视频',
                        link: '/documents/summary/optimizeYourImages/result'
                    },
                    {
                        text:'优化 JS 的加载性能之 Tree Shaking',
                        link: '/documents/summary/treeshaking/treeShaking'
                    },
                    {
                        text: 'Javascript 异步编程',
                        link: '/documents/asynchronous/'
                    },
                    {
                        text: 'ECMAScript modules 详解',
                        link: '/documents/summary/esModules/index'
                    },
                    {
                        text: 'TypeScript 类型系统和自定义数据类型',
                        link: '/documents/lowCode/basicTheory/TypeScript/typesystem'
                    },
                    {
                        text: '类型断言 VS 类型守卫',
                        link: '/documents/lowCode/basicTheory/TypeScript/typeGuard'
                    },
                    {
                        text: '我搞懂了 React 的函数组件',
                        link: '/documents/summary/functionComponent/index'
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
})