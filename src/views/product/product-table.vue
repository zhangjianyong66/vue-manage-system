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
        <template #state="{ rows }">
          <el-tag :type="rows.state===0 ? 'success' : 'danger'">
            {{ rows.state === 0 ? '上架' : '下架' }}
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
import {
  GuideTravelPackageSearchParam,
  pageAsync as guideTravelPackagePage,
  removeAsync as guideTravelPackageRemove,
  saveAsync as guideTravelPackageSave,
  updateAsync as guideTravelPackageUpdate,
} from "@/api/product";
import {ApiResponse} from "@/types/api-response";

// 查询相关
const query = reactive({
  name: '',
});
const searchOpt = ref<FormOptionList[]>([
  //{type: 'input', label: '用户名：', prop: 'name'}
])
const handleSearch = () => {
  changePage(1);
};

// 表格相关
let columns = ref([
  {type: 'selection'},
  {type: 'index', label: '序号', width: 55, align: 'center', visible: false},
  {prop: 'id', label: 'id', visible: false},

  {prop: 'title', label: '标题'},
  {type: 'img', prop: 'image', label: '产品图'},
  {prop: 'duration', label: '时长'},
  {prop: 'price', label: '价格'},
  {prop: 'area', label: '地区'},
  {prop: 'province', label: '省', visible: false},
  {prop: 'city', label: '市', visible: false},
  {prop: 'district', label: '区', visible: false},

  {prop: 'address', label: '地址'},
  {type: 'img', prop: 'introImage', label: '简介图'},
  {prop: 'hostPerson', label: '招待人'},
  {prop: 'hostIntroduction', label: '招待人简介'},
  {type: 'img', prop: 'hostAvatar', label: '招待人头像'},
  {type: 'img', prop: 'locationMap', label: '地点图'},
  {prop: 'locationDetail', label: '地点详情'},
  {prop: 'state', label: '状态'},
  {prop: 'operator', label: '操作', width: 250, fixed: 'right'},
])
const page = reactive({
  index: 1,
  size: 10,
  total: 200,
})

const searchParma: GuideTravelPackageSearchParam = {}
let tableData = ref<TableItem[]>([]);
const getData = async () => {
  const resData = await guideTravelPackagePage(page.index, page.size, searchParma)
  tableData.value = resData?.data?.records
  page.index = resData?.data?.current ?? 1
  page.total = resData?.data?.total ?? 100
  ElMessage.success(resData.message)
};
getData();

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
const visible = ref(false);//编辑新增显示标记
const isEdit = ref(false);//是否编辑
const rowData = ref({});
const handleEdit = (row: TableItem) => {
  rowData.value = {...row};
  isEdit.value = true;
  visible.value = true;
};

//保存数据
const updateData = async (form: any) => {
  let resData: ApiResponse;
  if (isEdit.value) {//更新
    resData = await guideTravelPackageUpdate(form.id, form)
  } else {//新增
    resData = await guideTravelPackageSave(form)
  }
  if (resData.code === 200) {
    ElMessage.success(resData.message)
    closeDialog();
    await getData();
  } else {
    ElMessage.error(resData.message)
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
  // rowData.value = {...row};
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
const handleDelete = async (row: TableItem) => {
  const resData = await guideTravelPackageRemove(row.id);
  if (resData.code === 200) {
    ElMessage.success(res.data.message);
    await getData();
  } else {
    ElMessage.error(res.data.message);
  }
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
