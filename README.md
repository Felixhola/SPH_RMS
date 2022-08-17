最新接口地址： http://gmall-h5-api.atguigu.cn

项目接口如果失效，请联系QQ：487554983

项目由本人亲自书写，于2022.8.18收尾，后期可能有更新，请注意。

项目适合刚刚学完Vue全家桶的前端小伙伴，如果对项目有任何不理解的地方，也可以联系我(QQ如上)，我会尽力解答。		

此后台系统使用了潘家臣的vue后台管理系统开源模板
地址：https://github.com/PanJiaChen/vue-admin-template.git

潘家臣模板：这是一个极简的 vue admin 管理后台。它只包含了 Element UI & axios & iconfont & permission control & lint，这些搭建后台必要的东西。

 安装依赖

npm install

启动服务

npm run dev

此后台管理系统与之前发布的尚品汇前台电商系统为配套系统，项目二者相互独立，又可以结合在一起，满足刚学完Vue的同学对大型Vue项目实战的需求

前台电商管理系统GitHub地址：https://github.com/Felixhola/SPH_ShangPinHui.git

在线地址：[app (sph-shangpinhui.vercel.app)](https://sph-shangpinhui.vercel.app/#/)

项目主要使用了element-ui和vue实现，整套系统大量使用了element-ui的组件，学完本系统可以对element-ui有一个很深的认识。

项目历经了本人的诸多心血，希望各位后来人好好加油



配置文件:

1. .editorconfig:编辑器的配置,不需要修改
2. .env.development:配置了开发环境下,转发代理的前缀
3. .env.production:配置了生产环境下,转发代理的前缀
4. .env.staging:配置了测试环境的,转发代理的前缀
5. .eslintignore:eslint的忽略文件
6. .eslintrc.js:eslint配置文件
7. babel.config.js:babel的配置文件
8. .gitignore:git的忽略文件
9. babel.config.js:babel的配置文件
10. jsconfig.json:在其中配置了@的提示效果
11. postcss.config.js:在css中配置了浏览器厂商前缀
12. vue.config.js:在vue中对webpack的配置

src目录下的文件:

1. api:接口请求函数文件,引入了utils/request.js(对axios的二次封装)
2. utils:工具文件,在该目录中存储了对axios的二次封装文件
3. assets:多个组件共用的静态资源
4. components:共用的组件和非路由组件
5. icons:svg矢量图
6. layout:一级路由组件,用来布局,整个项目就两个一级路由组件,剩下的一个就是Login
7. styles:项目中用到的样式
8. router:路由器配置文件
9. store:vuex仓库文件
10. style:项目中用到的所有公共样式
11. views:路由组件