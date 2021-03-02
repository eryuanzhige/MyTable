<!-- 封装的分页 table-->
<template>
  <div v-loading="tableSetting.options.loading" class="my-table clearfix">
    <el-table
      v-if="forceUpdate"
      id="iTable"
      ref="mutipleTable"
      :data="tableSetting.list"
      :stripe="tableSetting.options.stripe"
      :span-method="cellMerge"
      :cell-class-name="cellClassMethod"
      :row-class-name="tableRowClassName"
      :max-height="height"
      header-row-class-name="i-header"
      border
      @selection-change="handleSelectionChange"
      @row-dblclick="rowDbClickHandle"
      @row-click="rowClickHandle"
      @cell-click="cellClick"
      @sort-change="sortTableChange">
      <!--选择框-->
      <el-table-column v-if="tableSetting.options.mutiSelect" type="selection" align="center" style="width: 50px;"/>
      <!--数据列-->
      <!--添加序号-->
      <el-table-column
        v-if="!tableSetting.options.disableIndex"
        :index="indexMethod"
        type="index"
        label="序号"
        width="60"
        align="center"/>
      <!--添加序号end-->
      <template v-for="(column, index) in tableSetting.columns">
        <table-column v-if="getColumnShow(column.show)" :column="column" :index="index" :key="column.label+index">
          <template v-for="(column1, index1) in column.children">
            <table-column
              v-if="getColumnShow(column1.show)"
              :key="column1.label+index1"
              :column="column1"
              :index="index1"/>
          </template>
        </table-column>
      </template>
      <!--空时展示的行-->
      <!--<el-table-column-->
      <!--v-if="isColumnNull"-->
      <!--align="center"/>-->
      <!-- 按钮操作组-->
      <el-table-column
        v-if="operatesWidth() > 10"
        ref="fixedColumn"
        :width="operatesWidth()"
        :fixed="tableSetting.operates.fixed"
        label="操作"
        align="center">
        <template slot-scope="scope">
          <div class="operate-group">
            <template v-for="(btn, key) in tableSetting.operates.list">
              <div v-if="getButtonShow(btn.show,scope.row)" :key="btn.label" class="item">
                <el-button
                  :type="btn.type"
                  :icon="btn.icon"
                  :disabled="btn.disabled"
                  :plain="btn.plain"
                  size="mini"
                  @click.native.prevent="btn.method(key,scope.row)"
                >{{ getLabel(btn.label, scope.row) }}
                </el-button>
              </div>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="height:12px"/>
    <!-- 分页-->
    <el-pagination
      v-if="! tableSetting.isPaginateDisabled"
      :page-size="tableSetting.pageSize"
      :small="tableSetting.small"
      :page-sizes="tableSetting.pageSizes"
      :current-page="tableSetting.page"
      :layout="tableSetting.small?'total, prev, pager, next':'total,sizes, prev, pager, next,jumper'"
      :total="tableSetting.total"
      :disabled="tableSetting.isPaginateDisabled"
      background
      class="myPagination"
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
    />

  </div>
</template>
<script>
import TableColumn from './TableColumn'
import {deepGet} from './util'

export default {
  name: 'MyTable',
  components: {
    TableColumn,
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index
        }
        if (ctx.props.column) params.column = ctx.props.column
        return ctx.props.render(h, params)
      }
    }
  },
  props: {
    // 主设置
    tableSetting: {
      required: true,
      type: Object
    },
    // 单元格样式方法
    cellClassMethod: {
      type: Function,
      default: function () {
        return function () {

        }
      }
    }
  },
  data() {
    return {
      forceUpdate: true, // 触发重现渲染
      multipleSelection: [] // 多行选中
    }
  },
  computed: {
    height() {
      if (this.tableSetting.options.maxHeight) {
        return this.tableSetting.options.maxHeight
      }
      const height = document.documentElement.clientHeight - this.tableSetting.otherHeight
      return height
    }
  },
  watch: {
    thisLength: function () {
      this.refreshTable()
    },
    'tableSetting.options.loading': function () {
      // 触发刷新
    }
  },
  beforeUpdate() {
    this.getSpanArr()
  },
  methods: {
    // 强制刷新
    updateTable() {
      this.tableSetting.options.loading = true
      this.forceUpdate = false
      console.warn('table force updated')
      setTimeout(() => {
        this.forceUpdate = true
        this.tableSetting.options.loading = false
      }, 20)
    },
    // 切换每页显示的数量
    handleSizeChange(size) {
      this.$emit('handleSizeChange', size)
      this.tableSetting.page = 1
      this.tableSetting.pageSize = size
      this.refreshTable()
    },
    // 切换页码
    handleIndexChange(index) {
      this.$emit('handleIndexChange', index)
      this.tableSetting.page = index
      this.refreshTable()
    },
    // 多行选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.tableSetting.multipleSelection = val
      this.$emit('handleSelectionChange', val)
    },
    // 刷新当前表格
    refreshTable(size) {
      this.$emit('refreshTabl', size)
    },
    // 单行被点击时使用
    rowClickHandle(row, event, column) {
      this.$emit('rowClickHandle', row, event, column)
    },
    // 单行被双击击时使用
    rowDbClickHandle(row) {
      this.$emit('rowDbClickHandle', row)
    },
    // 单元格被点击时使用
    cellClick(row, column, cell) {
      this.$emit('cellClick', row, column, cell)
    },
    // 排序触发
    sortTableChange(colum) {
      this.$emit('sort-change', colum)
    },
    // 计算行号方法
    indexMethod(index) {
      return this.tableSetting.pageSize * (this.tableSetting.page - 1) + index + 1
    },
    // 每行样式
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'twice-row'
      } else {
        return 'single-row'
      }
    },
    // 获取深层对象属相
    getDescendantantProp(obj, desc) {
      try {
        const arr = desc.split('.')
        while (arr.length) {
          obj = obj[arr.shift()]
        }
        return obj
      } catch (e) {
        console.warn('table字段报错了')
      }
    },
    // 获取宽度
    operatesWidth() {
      let widthFinally = 0
      if (Array.isArray(this.tableSetting.list)) {
        for (const row of this.tableSetting.list) {
          let widthTemp = 0
          for (const _x of this.tableSetting.operates.list) {
            if (this.getButtonShow(_x.show, row)) {
              widthTemp += (_x.label.length * 13)
              if (_x.icon) {
                widthTemp += 13
              }
              widthTemp += 50
            }
          }
          if (widthTemp > widthFinally) {
            widthFinally = widthTemp
          }
        }
      }
      return widthFinally
    },
    // 是否显示填充列，解决空列时留白问题 ：todo
    isColumnNull() {
      for (const _x of this.tableSetting.columns) {
        if (_x.show === true) {
          return false
        }
      }
      return true
    }, // 是否显示列
    getColumnShow(x) {
      try {
        if (typeof x === 'function') {
          return x()
        } else if (typeof x === 'boolean') {
          return x
        } else {
          return true
        }
      } catch (e) {
        return true
      }
    }, // 是否显示按钮
    getButtonShow(x, row) {
      try {
        if (typeof x === 'function') {
          return x(row)
        } else if (typeof x === 'boolean') {
          return x
        } else {
          return true
        }
      } catch (e) {
        return true
      }
    }, // button label
    getLabel(x, row) {
      try {
        if (typeof x === 'function') {
          return x(row)
        } else {
          return x
        }
      } catch (e) {
        return x
      }
    },
    // 合并行表格
    cellMerge({row, column, rowIndex, columnIndex}) {
      if (deepGet(this.tableSetting, 'span.columnIndex')) {
        const columns = this.tableSetting.span.columnIndex.toString().split(',')
        if (columns.includes(columnIndex.toString())) {
          const _row = this.tableSetting.spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
    }, // 获取合并表格数组
    getSpanArr() {
      if (deepGet(this.tableSetting, 'span.columnIndex')) {
        if (this.tableSetting.list) {
          console.log('computed span')
          this.tableSetting.spanArr = []
          for (var i = 0; i < this.tableSetting.list.length; i++) {
            if (i === 0) {
              this.tableSetting.spanArr.push(1)
              this.pos = 0
            } else {
              // 判断当前元素与上一个元素是否相同
              if (deepGet(this.tableSetting.list[i], this.tableSetting.span.spanColumn) === deepGet(this.tableSetting.list[i - 1], this.tableSetting.span.spanColumn) && deepGet(this.tableSetting.list[i], this.tableSetting.span.spanColumn)) {
                this.tableSetting.spanArr[this.pos] += 1
                this.tableSetting.spanArr.push(0)
              } else {
                this.tableSetting.spanArr.push(1)
                this.pos = i
              }
            }
          }
        }
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.my-table {
  overflow: auto;

  .el-table {
    border-radius: 3px;
  }

  @headerHeight: 38px;

  /deep/ .i-header {
    th {
      //line-height: @headerHeight;
      // min-height: @headerHeight;
      padding-top: 0;
      padding-bottom: 0;
      color: #fff !important;

      .cell {
        // line-height: @headerHeight;
        // min-height: @headerHeight;
      }
    }
  }

  /deep/ .single-row {
    background: #fff !important;

  }

  /deep/ .twice-row {
    background: #f6f7fc !important;

  }

  height: 100%;

  .el-pagination {
    float: right;
    margin: 20px;
  }

  .myPagination {
    margin: 10px;
  }

  .el-table__fixed-right {
    bottom: 0 !important;
    right: 6px !important;
    z-index: 1004;
  }

  .operate-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;

    .item {
      display: inline-block;
      float: left;
      margin-right: 5px;

      .el-button {
        display: inline-block;
      }
    }
  }

  .fix-right {
    position: absolute;
    right: 0;
    height: 100px;
    color: #ffffff;
    width: 30px;
    display: block;
    z-index: 1005;
    writing-mode: vertical-rl;
    text-align: center;
    line-height: 28px;
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px;
    cursor: pointer;
  }
}

</style>
