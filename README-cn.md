# my_table

> 基于ElementUI的table组件，支持通过简单的配置渲染table，相比于直接使用ElementUI/table更加简洁，代码更少

## 预览
### 在线地址
http://207.148.23.60:8090/

## 功能
### elementUI原有功能支持
* table全部属性支持，在mytable组件上传入即可
* table-column全部属性支持，在配置文件column上传入
### 增加功能
* 只需要一个配置对象就可以渲染一个table，
* pagination组件集成，传配置即可
* 支持column指定show属性，show支持Boolen和函数两种
* column的prop支持深层属性(obj.x.a)
* 支持配置式操作栏，自动计算操作栏宽度
* 支持简单合并单元格基于配置即可
```
    span: {
        columnIndex: '1,3',//合并第几列
        spanColumn: 'name'//根据数据的那个属性合并（columns——>prop）
    }
```
* 支持嵌套表头
```
   {
              label: '表头',
              align: 'center',
              children: [
                {
                  prop: 'name',
                  label: '子1',
                  align: 'center'
                },
                {
                  prop: 'deep.name',
                  label: '子2',
                  align: 'center'
                }
                ]
   }
```

### clone项目并安装

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

### 基本使用
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
              name: '圆圆',
              address: '李沧区金水路'
            },
            {
              deep: {
                name: 'yuan',
              },
              level: 1,
              date: '2016-05-02',
              name: '梦',
              address: '上海市普陀区金沙江路 1519 弄'
            },
            {
              deep: {
                name: 'yuan',
              },
              level: 1,
              date: '2016-05-02',
              name: '梦',
              address: '李沧区金水路'
            }
          ],
          // 当前页码
          page: 1,
          // 每页数量
          pageSize: 15,
          //切换每页数量
          pageSizes: [15, 30, 50, 100],
          options: {
            // 是否添加表格loading加载动画，可在加载数据前设为true，获取到数据后设置为false
            loading: false,
            // 是否支持列表项选中功能
            selection: false,
            // 是否支持 表格操作功能
            action: false
          },
          // 需要展示的列定义
          columns: [
            {
              //此列是否显示,ElementUI基础上扩展的属性
              show: () => {
                return true
                // return this.nowTable != null && this.nowTable.col1 != null
              },
              //字段名，支持深层数据获取，支持formatter，参考下面的列定义，自定义支持返回html，ElementUI基础上扩展的功能
              prop: 'deep.name',
              //ElementUI的el-table-column组件属性全部支持，可以在这里传入
              fixed:'left',
              //头部名
              label: '名称',
              sortable:true,
              //对其方式
              align: 'center',
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

### 通过ref调用ElementUI-Table方法
``` bash
<my-table ref="table" :table-setting="tableSetting"/>
```
``` bash
this.$refs['table'].clearSort();
```
## todo

* ~~代码优化，目前只是从项目中拷贝出来~~
* ~~通过$attrs支持ElementUI所有属性，通过$listeners返回所有事件~~
* ~~移除lodash,只用到了Object.get~~
* 移除less依赖
* ~~更换英文注释，添加英文文档~~
* ~~ref获取表格组件引用~~

## author

sunzuoyuan@gmail.com

## 感谢小梦梦的支持和鼓励

