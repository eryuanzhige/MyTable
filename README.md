# my_table

> Table component based on ElementUI supports rendering table through simple configuration, which is more concise and less code than using ElementUI/table directly


## Features
### ElementUI original function support
* All table attributes are supported, just pass in the mytable component
* All attributes of table-column are supported and passed in on the configuration file column
### add feature
* Only one configuration object is needed to render a table,
* Pagination component integration, just pass the configuration
* Support column designation show attribute, show supports Boolen and function two
* The prop of column supports deep attributes (obj.x.a)
* Support configuration type operation bar, automatically calculate the width of the operation bar
* Support simple merging of cells based on configuration
```
    span: {
        columnIndex: '1,3',//How many columns to merge
        spanColumn:'name'//Merge according to the attribute of the data (columns——>prop)
    }
```
* Support nested header
```
   {
              label:'Header',
              align:'center',
              children: [
                {
                  prop:'name',
                  label:'子1',
                  align:'center'
                },
                {
                  prop:'deep.name',
                  label:'子2',
                  align:'center'
                }
                ]
   }
```

### Clone the project and install

``` bash
# install dependencies
npm install

# build for production with minification
npm run build
```

Then open index.html in the browser to preview

## Installation
### Direct browser reference
Refer to index.html, script tag to import build.js, you need to import ElementUI first
### webpack usage
installation
``` bash
npm install @yuany_an/my_table
```
main.js
``` bash
import MyTable from'@yuany_an/my_table'
Vue.use(MyTable)
```
## Use

### Basic usage
Refer to index.html
template
``` bash
  <my-table :table-setting="tableSetting" @refreshTabl="refreshTable"/>
```
data
``` bash
tableSetting: {
          // The total number of table data, generally update this item after obtaining the data
          total: 100,
          //Data, generally obtained through the interface
          list: [
            {
              deep: {
                name:'meng',
              },
              level: 0,
              date: '2016-05-02',
              name:'Yuanyuan',
              address:'Licang District Jinshui Road'
            },
            {
              deep: {
                name:'yuan',
              },
              level: 1,
              date: '2016-05-02',
              name:'dream',
              address:'Lane 1519, Jinshajiang Road, Putuo District, Shanghai'
            },
            {
              deep: {
                name:'yuan',
              },
              level: 1,
              date: '2016-05-02',
              name:'dream',
              address:'Licang District Jinshui Road'
            }
          ],
          // current page number
          page: 1,
          // number per page
          pageSize: 15,
          //Switch the number per page
          pageSizes: [15, 30, 50, 100],
          options: {
            // Whether to add table loading loading animation, it can be set to true before loading the data, and set to false after the data is obtained
            loading: false,
            // Whether to support the list item selection function
            selection: false,
            // Whether to support table operation function
            action: false
          },
          // column definition to be displayed
          columns: [
            {
              //Whether this column is displayed, the extended attributes on the basis of ElementUI
              show: () => {
                return true
                // return this.nowTable != null && this.nowTable.col1 != null
              },
              //Field name, support in-depth data acquisition, support formatter, refer to the column definition below, custom support to return html, extended functions based on ElementUI
              prop:'deep.name',
              //ElementUI's el-table-column component properties are all supported, you can pass in here
              fixed:'left',
              //Head name
              label:'Name',
              sortable:true,
              //On the way
              align:'center',
            },
            {
              prop:'',
              label:'Recipient',
              align:'center',
              formatter: row => {
                return row.name
              }
            },
            {
              prop:'address',
              label:'Recipient',
              align:'center'
            },
            {
              prop:'tranOpinion',
              label:'Custom column',
              align:'center',
              formatter: row => {
                if (row.level !== 0) {
                  return row.level
                } else {
                  return `<span style="color: red">Not yet reviewed</span>`
                }
              }
            }
          ],
          //Operation column button definition
          operates: {// Column operation button
            fixed:'right',
            list: [
              {
                label:'review',
                type:'warning',
                //Whether this button is displayed
                show: row => {
                  return true
                },
                icon:'el-icon-edit',
                plain: true,
                disabled: false,
                method: (index, row) => {

                }
              },
              {
                label:'View',
                type:'info',
                show: row => {
                  if (row.level !== 0) {
                    return true
                  } else {
                    return false
                  }
                },
                icon:'el-icon-view',
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
Configuration items have corresponding instructions

### Call ElementUI-Table method by ref
``` bash
<my-table ref="table" :table-setting="tableSetting"/>
```
``` bash
this.$refs['table'].clearSort();
```
## todo

* ~~Code optimization, currently only copied from the project~~
* ~~All attributes of ElementUI are supported through $attrs, and all events are returned through $listeners~~
* ~~Remove lodash, only Object.get is used~~
* Remove less dependency
* ~~Replace English comments and add English documents~~
* ~~ref Get the table component reference~~

## author

sunzuoyuan@gmail.com
