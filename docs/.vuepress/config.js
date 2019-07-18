module.exports = {
    title: 'Bella\'s documents',
    description: '我见青山多妩媚，料青山见我应如是',
    themeConfig: {
        sidebarDepth:2,
        sidebar: {
            'weixin': {collapsable: false,children:['/documents/weixin']},
            'plan':{collapsable: false,children:['/documents/plan']},
        }
    }
}