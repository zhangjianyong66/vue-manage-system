<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch"/>
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                   :delFunc="handleDelete" :editFunc="handleEdit" :refresh="getData" :currentPage="page.index"
                   :changePage="changePage">
        <template #toolbarBtn>
          <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
        </template>
        <template #money="{ rows }">
          ￥{{ rows.money }}
        </template>
        <template #thumb="{ rows }">
          <el-image class="table-td-thumb" :src="rows.thumb" :z-index="10" :preview-src-list="[rows.thumb]"
                    preview-teleported>
          </el-image>
        </template>
        <template #state="{ rows }">
          <el-tag :type="rows.state ? 'success' : 'danger'">
            {{ rows.state ? '正常' : '异常' }}
          </el-tag>
        </template>
      </TableCustom>

    </div>
    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
               :close-on-click-modal="false" @close="closeDialog">
      <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData">
      </TableEdit>
    </el-dialog>
    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
        <template #thumb="{ rows }">
          <el-image :src="rows.thumb"></el-image>
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import {CirclePlusFilled} from '@element-plus/icons-vue';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import {TableItem} from '@/types/table';
import {FormOption, FormOptionList} from '@/types/form-option';
import TableEdit from "@/components/table-edit.vue";
import {ElMessage} from "element-plus";
import {guideTravelPackageSearchParam, page as guideTravelPackagePage, save as guideTravelPackageSave} from "@/api/product";

// 查询相关
const query = reactive({
  name: '',
});
const searchOpt = ref<FormOptionList[]>([
  {type: 'input', label: '用户名：', prop: 'name'}
])
const handleSearch = () => {
  changePage(1);
};

// 表格相关
let columns = ref([
  {type: 'selection'},
  {type: 'index', label: '序号', width: 55, align: 'center'},
  {prop: 'name', label: '用户名'},
  {prop: 'money', label: '账户余额'},
  {prop: 'thumb', label: '头像'},
  {prop: 'state', label: '账户状态'},
  {prop: 'operator', label: '操作', width: 250},
])
const page = reactive({
  index: 1,
  size: 10,
  total: 200,
})

const searchParma: guideTravelPackageSearchParam = {}
const tableData = ref<TableItem[]>([]);
const getData = async () => {
  const res = await guideTravelPackagePage(page.index, page.size, searchParma)
  tableData.value = res.data.list;
};
getData();

tableData.value = [
  {
    "id": 1,
    "name": "张三",
    "money": 123,
    "address": "广东省东莞市长安镇",
    "state": 'true',
    "date": "2019-11-1",
    "thumb": "https://lin-xin.gitee.io/images/post/wms.png"
  },
  {
    "id": 2,
    "name": "李四",
    "money": 456,
    "address": "广东省广州市白云区",
    "state": 'true',
    "date": "2019-10-11",
    "thumb": "https://lin-xin.gitee.io/images/post/node3.png"
  },
  {
    "id": 3,
    "name": "王五",
    "money": 789,
    "address": "湖南省长沙市",
    "state": 'false',
    "date": "2019-11-11",
    "thumb": "https://lin-xin.gitee.io/images/post/parcel.png"
  },
  {
    "id": 4,
    "name": "赵六",
    "money": 1011,
    "address": "福建省厦门市鼓浪屿",
    "state": 'true',
    "date": "2019-10-20",
    "thumb": "https://lin-xin.gitee.io/images/post/notice.png"
  }
]
const changePage = (val: number) => {
  page.index = val;
  getData();
};
const uploadAction = import.meta.env.VITE_BASE_API + "/file/upload"
// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: '100px',
  span: 24,
  list: [
    {type: 'input', label: '标题', prop: 'title', required: true},
    {
      type: 'upload', label: '产品图', prop: 'image', required: true,
      action: uploadAction, data: {type: 'image'}
    },
    {type: 'input', label: '时长', prop: 'duration', required: true},
    {type: 'number', label: '价格', prop: 'price', required: true},
    {type: 'input', label: '地区', prop: 'area', required: true},
    {type: 'input', label: '省', prop: 'province', required: true},
    {type: 'input', label: '市', prop: 'city', required: true},
    {type: 'input', label: '区', prop: 'district', required: true},
    {type: 'input', label: '地址', prop: 'address', required: true},
    {
      type: 'upload', label: '简介图', prop: 'introImage', required: true,
      action: uploadAction, data: {type: 'introImage'}
    },
    {type: 'input', label: '招待人', prop: 'hostPerson', required: true},
    {type: 'textarea', label: '招待人简介', prop: 'hostIntroduction', required: true},
    {
      type: 'upload', label: '招待人头像', prop: 'hostAvatar', required: true,
      action: uploadAction, data: {type: 'hostAvatar'}
    },
    {
      type: 'upload', label: '地点图', prop: 'locationMap', required: true,
      action: uploadAction, data: {type: 'locationMap'}
    },
    {type: 'textarea', label: '地点详情', prop: 'locationDetail', required: true},
    {
      type: 'switch', label: '状态', activeText: '上架', inactiveText: '下架', prop: 'state', required: true,
      activeValue: 1, inactiveValue: '0'
    },

  ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: TableItem) => {
  rowData.value = {...row};
  isEdit.value = true;
  visible.value = true;
};

//保存数据
const updateData = async (form: any) => {
  const res = await guideTravelPackageSave(form)
  if (res.data.code === 200) {
    console.log(res.data.data)
    ElMessage.success(res.data.message)
    closeDialog();
    await getData();
  } else {
    ElMessage.error(res.data.message)
  }

};

const closeDialog = () => {
  visible.value = false;
  isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: []
});
const handleView = (row: TableItem) => {
  viewData.value.row = {...row}
  viewData.value.list = [
    {
      prop: 'id',
      label: '用户ID',
    },
    {
      prop: 'name',
      label: '用户名',
    },
    {
      prop: 'money',
      label: '账户余额',
    },
    {
      prop: 'state',
      label: '账户状态',
    },
    {
      prop: 'thumb',
      label: '头像',
    },
  ]
  visible1.value = true;
};

// 删除相关
const handleDelete = (row: TableItem) => {
  ElMessage.success('删除成功');
}
</script>

<style scoped>
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
