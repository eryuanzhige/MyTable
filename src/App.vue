<template>
  <div id="app">
    <h5>常规</h5>
    <div>
      <my-table :table-setting="tableSetting"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      tableSetting: {
        total: 100, // table数据总条数
        list: [
          {
            deep: {
              name: '圆圆',
            },
            level: 0,
            date: '1997-05-28',
            address: '青岛市李沧区金水路88号'
          },
          {
            deep: {
              name: '梦梦',
            },
            level: 1,
            date: '1998-07-24',
            address: '青岛市李沧区金水路88号'
          }
        ], // table数据
        otherHeight: 260, // 除了table表格之外的高度，为了做table表格的高度自适应
        page: 1, // 当前页码
        pageSize: 15, // 每页数量
        pageSizes: [15, 30, 50, 100],
        options: {
          stripe: true, // 是否为斑马纹 table
          loading: false, // 是否添加表格loading加载动画
          highlightCurrentRow: true, // 是否支持当前行高亮显示
          mutiSelect: false, // 是否支持列表项选中功能
          filter: false, // 是否支持数据过滤功能
          action: false // 是否支持 表格操作功能
        },
        columns: [ // 需要展示的列
          {
            prop: 'deep.name',
            label: '名字',
            align: 'center'
          },
          {
            prop: 'date',
            label: '日期',
            align: 'center'
          },
          {
            prop: 'address',
            label: '地址',
            align: 'center',
            formatter: row => {
              return row.address
            }
          },
          {
            prop: 'tranOpinion',
            label: '状态',
            align: 'center',
            formatter: row => {
              return `<span style="color: red">未婚</span>`
            }
          }
        ],
        operates: { // 列操作按钮
          fixed: 'right',
          list: [
            {
              label: '哈哈',
              type: 'warning',
              show: row => {
                return true
              },
              icon: 'el-icon-edit',
              plain: true,
              disabled: false,
              method: (index, row) => {
                this.$message({
                  message: '加油！' + row.deep.name,
                  type: 'success'
                });
              }
            },
            {
              label: '嘿嘿',
              type: 'info',
              show: row => {
                return true
              },
              icon: 'el-icon-view',
              plain: false,
              disabled: false,
              method: (index, row) => {
                this.$message({
                  message: '新年快乐！' + row.deep.name,
                  type: 'success'
                });
              }
            }
          ]
        }
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h5 {
  text-align: left;
}
</style>
