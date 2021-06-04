<template>
  <div v-loading="tableSetting.options.loading" class="my-table clearfix">
    <el-table
      ref="tableInst"
      v-if="forceUpdate"
      v-bind="$attrs"
      v-on="$listeners"
      :data="tableSetting.list"
      :span-method="cellMerge"
      @selection-change="handleSelectionChange">
      <!--ChecnkBox-->
      <el-table-column v-if="tableSetting.options.selection" type="selection" align="center" style="width: 50px;"/>
      <!--Index-->
      <el-table-column
        v-if="!tableSetting.options.disableIndex"
        :index="indexMethod"
        type="index"
        label="序号"
        width="60"
        align="center"/>
      <!--Index end-->
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
      <!--Empty rows-->
      <!--<el-table-column-->
      <!--v-if="isColumnNull"-->
      <!--align="center"/>-->
      <!-- Button operation group-->
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
    <!-- pagination-->
    <el-pagination
      class="my-pagination"
      v-if="! tableSetting.isPaginateDisabled"
      :page-size="tableSetting.pageSize"
      :small="tableSetting.small"
      :page-sizes="tableSetting.pageSizes"
      :current-page="tableSetting.page"
      :layout="tableSetting.small?'total, prev, pager, next':'total,sizes, prev, pager, next,jumper'"
      :total="tableSetting.total"
      :disabled="tableSetting.isPaginateDisabled"
      background
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
    />

  </div>
</template>
<script>
import TableColumn from './TableColumn'
import {deepGet} from './util'

const tableMethods = ['clearSelection', 'toggleRowSelection', 'toggleAllSelection', 'toggleRowExpansion', 'setCurrentRow', 'clearSort', 'clearFilter', 'doLayout', 'sort']
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
    }
  },
  data() {
    return {
      forceUpdate: true, // 触发重现渲染
    }
  },
  watch: {
    thisLength: function () {
      this.refreshTable()
    },
    'tableSetting.options.loading': function () {
      // force update
    }
  },
  mounted() {
    //Add elementUI method to mytable
    tableMethods.forEach(method => {
      this[method] = this.$refs['tableInst'][method]
    })
  },
  beforeUpdate() {
    this.getSpanArr()
  },
  methods: {
    // force update
    updateTable() {
      this.tableSetting.options.loading = true
      this.forceUpdate = false
      console.warn('table force updated')
      setTimeout(() => {
        this.forceUpdate = true
        this.tableSetting.options.loading = false
      }, 20)
    },
    // Toggle the number displayed on each page
    handleSizeChange(size) {
      this.$emit('handleSizeChange', size)
      this.tableSetting.page = 1
      this.tableSetting.pageSize = size
      this.refreshTable()
    },
    // Switch page number
    handleIndexChange(index) {
      this.$emit('handleIndexChange', index)
      this.tableSetting.page = index
      this.refreshTable()
    },
    // Multi-line selection
    handleSelectionChange(val) {
      this.tableSetting.multipleSelection = val
    },
    // Refresh the current table
    refreshTable(size) {
      this.$emit('refreshTabl', size)
    },
    // Calculating line number method
    indexMethod(index) {
      return this.tableSetting.pageSize * (this.tableSetting.page - 1) + index + 1
    },
    // Get deep object zodiac
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
    // Get width
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
    // Whether to display filled columns, to solve the problem of blanking when empty columns：todo
    isColumnNull() {
      for (const _x of this.tableSetting.columns) {
        if (_x.show === true) {
          return false
        }
      }
      return true
    }, // Whether to show columns
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
    },
    // Whether to show the button
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
    },
    // button label
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
    // Combine row table
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
    }, // Get the combined table array
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
              // Determine whether the current element is the same as the previous element
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
  height: 100%;

  .my-pagination {
    float: right;
    margin: 10px;
    border-radius: 3px;
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
