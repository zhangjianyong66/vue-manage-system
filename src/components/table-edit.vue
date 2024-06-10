<template>
  <el-form ref="formRef" :model="form" :rules="rules" :label-width="options.labelWidth">
    <el-row>
      <el-col :span="options.span" v-for="item in options.list">
        <el-form-item :label="item.label" :prop="item.prop">
          <!-- 文本框、数字框、下拉框、日期框、开关、上传 -->
          <el-input v-if="item.type === 'input'" v-model="form[item.prop]" :disabled="item.disabled"
                    :placeholder="item.placeholder" clearable></el-input>
          <el-input v-else-if="item.type === 'number'" v-model="form[item.prop]" type="number"
                    :disabled="item.disabled" :placeholder="item.placeholder" clearable></el-input>
          <el-input v-else-if="item.type === 'textarea'" v-model="form[item.prop]" type="textarea"
                    :disabled="item.disabled" :placeholder="item.placeholder" clearable></el-input>
          <el-select v-else-if="item.type === 'select'" v-model="form[item.prop]" :disabled="item.disabled"
                     :placeholder="item.placeholder" clearable>
            <el-option v-for="opt in item.opts" :label="opt.label" :value="opt.value"></el-option>
          </el-select>
          <el-date-picker v-else-if="item.type === 'date'" type="date" v-model="form[item.prop]"
                          :value-format="item.format"></el-date-picker>
          <el-switch v-else-if="item.type === 'switch'" v-model="form[item.prop]"
                     :active-value="item.activeValue" :inactive-value="item.inactiveValue"
                     :active-text="item.activeText" :inactive-text="item.inactiveText"></el-switch>
          <el-upload v-else-if="item.type === 'upload'" class="image-uploader"
                     :action="item.action" :data="item.data"
                     :show-file-list="false"
                     :on-success="(response: any)=>{return uploadSuccess(response,item)}">
            <img v-if="form[item.prop+'_show']" :src="form[item.prop+'_show']" class="image" alt=""/>
            <el-icon v-else class="image-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
          <slot :name="item.prop" v-else>
          </slot>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button type="primary" @click="saveEdit(formRef)">保 存</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {FormOption, FormOptionList} from '@/types/form-option';
import {ElMessage, FormInstance, FormRules} from 'element-plus';
import {PropType, ref} from 'vue';
import {Plus} from "@element-plus/icons-vue";
import {pathToUrl} from "@/utils/image";

const {options, formData, edit, update} = defineProps({
  options: {//字段配置
    type: Object as PropType<FormOption>,
    required: true
  },
  formData: {//数据
    type: Object,
    required: true
  },
  edit: {
    type: Boolean,
    required: false
  },
  update: {
    type: Function,
    required: true
  }
});


const form = ref({...(edit ? formData : {})});

const rules: FormRules = options.list.map(item => {
  if (item.required) {
    return {[item.prop]: [{required: true, message: `${item.label}不能为空`, trigger: 'blur'}]};
  }
  return {};
}).reduce((acc, cur) => ({...acc, ...cur}), {});


const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (!valid) return false;
    update(form.value);
  });
};

const initImageShow = () => {
  options.list
      .filter(o => o.type === 'upload')
      .forEach(o => form.value[o.prop + '_show'] = pathToUrl(form.value[o.prop]))

}
initImageShow()
const uploadSuccess = (response: any, item: FormOptionList) => {
  if (response.code === 200) {
    form.value[item.prop] = response.data
    form.value[item.prop + '_show'] = pathToUrl(response.data)
    //form.value.thumb = URL.createObjectURL(uploadFile.raw!);
  } else {
    ElMessage.error(response.message);
  }

};

</script>

<style>
textarea {
  width: 100%;
  height: 8rem;
}

.image {
  width: 100%;
}

.image-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.image-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
