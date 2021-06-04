<template>
  <el-table-column
    v-bind="column"
    :label="getColLabel(column.label)">
    <!--Sub-column-->
    <template v-if="column.children">
      <slot/>
    </template>
    <!--this column-->
    <template slot-scope="scope">
      <template>
        <template v-if="column.formatter">
          <span
            v-html="getFormatter(column.formatter,scope.row, column,scope.row[column.prop]||getDescendantantProp(scope.row,column.prop),index)"/>
            <!--v-html="column.formatter(scope.row, column,scope.row[column.prop]||getDescendantantProp(scope.row,column.prop),index)"/>-->
        </template>
        <template v-else-if="column.prop.includes('.')">
          <span v-html="getDescendantantProp(scope.row,column.prop)"/>
        </template>
        <template v-else>
          <span>{{ scope.row[column.prop] }}</span>
        </template>
      </template>
    </template>
  </el-table-column>
</template>

<script>
import {deepGet} from './util'

export default {
  name: 'TableColumn',
  props: ['column', 'index'],
  methods: {
    // Whether to show columns
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
    // label
    getColLabel(x) {
      try {
        if (typeof x === 'function') {
          return x()
        } else {
          return x
        }
      } catch (e) {
        return x
      }
    },
    getDescendantantProp(obj, desc) {
      return deepGet(obj, desc)
    },
    // formatter
    getFormatter(x, row, coulmn, cell, index) {
      try {
        if (typeof x === 'function') {
          return x(row, coulmn, cell, index)
        }
      } catch (e) {
        console.warn('table字段报错了，formatter')
        return ''
      }
    }
  }
}
</script>
