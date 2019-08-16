<template>
  <div id="makeForm">
    <el-breadcrumb>
      <el-breadcrumb-item>
        <a>在线测试</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>制作试卷</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header">
      <el-steps :active="active" finish-status="success">
        <el-step title="试卷信息"></el-step>
        <el-step title="添加题目"></el-step>
        <el-step title="完成制作"></el-step>
      </el-steps>
    </div>
    <div class="course" v-show="active==0">
      <make-test-paper @geNext="next"/>
    </div>
    <div class="course1" v-show="active==1">
      <add-test-paper/>
    </div>
    <div class="course" v-show="active==2">
      <h1>完成</h1>
    </div>
  </div>
</template>

<script>
import MakeTestPaper from '@/components/MakeTestPaper';
import AddTestPaper from '@/components/AddTestPaper';
export default {
  components: {
    MakeTestPaper,
    AddTestPaper
  },
  data() {
    return {
      active: 1 //步骤条位置
    };
  },
  methods: {
    /**
     * 步骤条
     */
    next() {
      if (this.active++ > 2) this.active = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
#makeForm {
  .header {
    padding: 20px 0;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    margin-bottom: 20px;
    text-align: left;
  }
  .course {
    width: 50%;
    margin: 0 auto;
  }
  .course1{
    text-align: left;
  }
}
</style>
