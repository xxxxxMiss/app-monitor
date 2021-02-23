export default [
  {
    path: '/img-edit',
    component: '@/layouts/blank',
    menu: {
      name: '图片编辑',
    },
    routes: [
      {
        path: '/add-watermark',
        component: '@/pages/img-edit/add-watermark',
        menu: {
          name: '添加水印',
        },
      },
      {
        path: '/modify-size',
        component: '@/pages/img-edit/modify-size',
        menu: {
          name: '修改图片尺寸',
        },
      },
      {
        path: '/cut',
        component: '@/pages/img-edit/cut',
        menu: {
          name: '裁切图片',
        },
      },
      {
        path: '/compress',
        component: '@/pages/img-edit/compress',
        menu: {
          name: '图片压缩',
        },
      },
      {
        path: '/join',
        component: '@/pages/img-edit/join',
        menu: {
          name: '图片合成',
        },
      },
      {
        path: '/add-vip',
        component: '@/pages/img-edit/add-vip',
        menu: {
          name: '图像加V',
        },
      },
    ],
  },
  {
    path: '/img-conversion',
    component: '@/pages/home',
    menu: {
      name: '图片转化',
    },
    routes: [
      {
        path: '/covert-type',
        component: '@/pages/img-coversion/covert-type',
        menu: {
          name: '格式转化',
        },
      },
      {
        path: '/to-icon',
        component: '@/pages/img-coversion/to-icon',
        menu: {
          name: '转ICON',
        },
      },
    ],
  },
]
