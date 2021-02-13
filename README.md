# my_table

> 基于ElementUI的table组件，支持通过简单的配置渲染table，相比于直接使用ElementUI/table更加简洁，代码更少

## 预览

``` bash
# install dependencies
npm install

# build for production with minification
npm run build
```

然后在浏览器打开index.html就可以预览了

## 安装
### 浏览器直接引用
参考index.html,script标签引入build.js即可，需要先引入ElementUI
### webpack使用
安装
``` bash
npm install @yuany_an/my_table
```
main.js
``` bash
import MyTable from '@yuany_an/my_table'
Vue.use(MyTable)
```
## 使用
参考index.html
template
``` bash
  <my-table :table-setting="tableSetting" @refreshTabl="refreshTable"/>
```
data
``` bash
tableSetting: {
          // table数据总条数，一般在获取数据后更新此项
          total: 100,
          //数据，一般通过接口获取
          list: [
            {
              deep: {
                name: 'meng',
              },
              level: 0,
              date: '2016-05-02',
              name: '黑黑',
              address: '上海市普陀区金沙江路 1518 弄'
            },
            {
              deep: {
                name: 'yuan',
              },
              level: 1,
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }
          ],
          // 除了table表格之外的高度，为了做table表格的高度自适应
          otherHeight: 260,
          // 当前页码
          page: 1,
          // 每页数量
          pageSize: 15,
          //切换每页数量
          pageSizes: [15, 30, 50, 100],
          options: {
            // 是否为斑马纹 table
            stripe: true,
            // 是否添加表格loading加载动画，可在加载数据前设为true，获取到数据后设置为false
            loading: false,
            // 是否支持当前行高亮显示
            highlightCurrentRow: true,
            // 是否支持列表项选中功能
            mutiSelect: false,
            // 是否支持数据过滤功能
            filter: false,
            // 是否支持 表格操作功能
            action: false
          },
          // 需要展示的列定义
          columns: [
            {
              //字段名，支持深层数据获取，支持formatter，参考下面的列定义，自定义支持返回html
              prop: 'deep.name',
              //头部名
              label: '工地名称',
              //对其方式
              align: 'center',
              //此列是否显示
              show: () => {
                // return this.nowTable != null && this.nowTable.col1 != null
              }
            },
            {
              prop: '',
              label: '接收人',
              align: 'center',
              formatter: row => {
                return row.name
              }
            },
            {
              prop: 'address',
              label: '接收人',
              align: 'center'
            },
            {
              prop: 'tranOpinion',
              label: '自定义的列',
              align: 'center',
              formatter: row => {
                if (row.level !== 0) {
                  return row.level
                } else {
                  return `<span style="color: red">尚未审核</span>`
                }
              }
            }
          ],
          //操作列按钮定义
          operates: { // 列操作按钮
            fixed: 'right',
            list: [
              {
                label: '审核',
                type: 'warning',
                //此按钮是否显示
                show: row => {
                  return true
                },
                icon: 'el-icon-edit',
                plain: true,
                disabled: false,
                method: (index, row) => {

                }
              },
              {
                label: '查看',
                type: 'info',
                show: row => {
                  if (row.level !== 0) {
                    return true
                  } else {
                    return false
                  }
                },
                icon: 'el-icon-view',
                plain: false,
                disabled: false,
                method: (index, row) => {
                }
              }
            ]
          }
        }
```
methods
``` bash
refreshTable() {
        this.tableSetting.options.loading = true
        fetch({
          url: '/inspect/ins/data',
          method: 'get',
          params: {
            pn: this.tableSetting.page,
            ps: this.tableSetting.pageSize
          }
        }).then(res => {
          this.tableSetting.list = res.t.list
          this.tableSetting.total = res.t.total
        }).finally(() => {
          this.tableSetting.options.loading = false
        })
      }
```
配置项有对应说明

## todo

* 代码优化，目前只是从项目中拷贝出来
* 通过$attrs支持ElementUI所有属性，通过$listeners返回所有事件
* 移除lodash,只用到了Object.get

## author

sunzuoyuan@gmail.com

## 感谢小梦梦的支持和鼓励

