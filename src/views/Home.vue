<template>
  <div class="home">
    <el-container style="height: 100%;position: relative;">
      <!-- 侧边栏 -->
      <el-aside width="auto" style="background-color: #545c64">
        <el-row class="pic">
          <router-link to="/home">
            <img src="../assets/logo.png">
          </router-link>
        </el-row>
        <el-menu
          :default-openeds="['1', '2']"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu v-for="(value,index) in asideTion" :key="index" :index="String(index+1)">
            <template slot="title">
              <i :class="value.class"></i>
              <span slot="title">{{ value.aside }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="(value,index) in value.option"
                :key="index"
                @click="addTab(value,index)"
                class="menu_a"
              >
                <router-link :to="value.path">{{ value.name }}</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体 -->
      <el-container>
        <!-- tab标签页导航 -->
        <el-header>
          <!-- 展开/收起按钮 -->
          <el-tooltip
            class="tooltip"
            effect="dark"
            :content="isCollapse?'展开':'收起'"
            placement="right"
          >
            <el-button
              @click="isCollapse=!isCollapse"
              :icon="isCollapse?'el-icon-arrow-right':'el-icon-arrow-left'"
              style="color:#fff;border: 0;"
            />
          </el-tooltip>
          <!-- tab标签页 -->
          <el-row class="tab-position">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              @tab-click="clickTab"
              @tab-remove="removeTab"
            >
              <el-tab-pane
                v-for="item in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              ></el-tab-pane>
            </el-tabs>
          </el-row>
          <!-- 详情 -->
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px;"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 用户名 -->
          <span>王小虎</span>
          <!-- 用户头像 -->
          <el-avatar :size="50" :src="circleUrl" style="margin-left: 15px"></el-avatar>
        </el-header>
        <el-main>
          <!-- 路由视图 -->
          <router-view name="sidebar"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false, //侧边栏是否收起
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //用作用户头像
      asideTion: [
        //侧边栏动态内容
        {
          aside: "基础数据", //一级菜单
          class: "el-icon-menu", //定义icon样式
          option: [
            //二级菜单
            {
              name: "首页",
              path: "/home"
            },
            {
              name: "学生管理",
              path: "/studentManage"
            },
            {
              name: "老师管理",
              path: "/teacherManage"
            },
            {
              name: "班级管理",
              path: "/gradeManage"
            },
            {
              name: "修改密码",
              path: "/changePassword"
            }
          ]
        },
        {
          aside: "在线测试",
          class: "el-icon-s-claim",
          option: [
            {
              name: "制作试卷",
              path: "/makeExamination"
            },
            {
              name: "安排测试",
              path: "/testExamination"
            },
            {
              name: "试卷管理",
              path: "/examManage"
            },
            {
              name: "查看成绩",
              path: "/lookExamination"
            },
            {
              name: "批阅试卷",
              path: "/readExamination"
            }
          ]
        }
      ],
      asideTionList: [], //提取侧边栏name,path
      editableTabsValue: "1", //默认tab标签页位置
      editableTabs: [
        //tab标签页内容
        {
          title: "首页",
          name: "1", //内容中表示位置
          content: "首页标题"
        }
      ],
      tabIndex: 1 //用于添加tab标签页时,从下标1开始,因为一开始有首页
    };
  },
  created() {
    let _this = this;
    // 侧边栏结构不同,用option自己拼接成单独数组对象
    _this.asideTion.forEach(item => {
      item.option.forEach(item => {
        _this.asideTionList.push(item);
      });
    });
    var getTabList = JSON.parse(sessionStorage.getItem("editableTabs")); //得到存储的tab内容
    var getTabName = sessionStorage.getItem("TabName"); //得到存储的tab位置name
    if (getTabList && getTabName) {
      //如果存在sessionStorage数据,改变其结果
      _this.editableTabs = getTabList;
      _this.editableTabsValue = getTabName;
      _this.tabIndex = Number(getTabName);
    }
  },
  methods: {
    /**
     * 侧边栏点击添加tab标签页
     */
    addTab(value, index) {
      let _this = this;
      function checkAdult(ediTabTittle) {
        //点击时查询传入name的下标
        return ediTabTittle.title == value.name; //editableTabs中的title与传入name相等返回查询下标 ，没有返回-1
      }
      let asideindex = _this.editableTabs.findIndex(checkAdult); //使用findIndex方法 返回符合测试条件的第一个数组元素索引
      let newTabName = asideindex + 1 + ""; // 索引+1 == editableTabsValue tab标签页位置
      if (asideindex == -1) {
        //如果查询结果为 -1 证明tab标签页不存在 可以添加tab标签页
        newTabName = ++_this.tabIndex + "";
        _this.editableTabs.push({
          title: value.name,
          name: newTabName,
          content: value.name
        });
      } else {
        newTabName = _this.editableTabs[asideindex].name; //使用editableTabs数组中name指定tab标签页位置
      }
      _this.editableTabsValue = newTabName; //点击后tab标签页默认位置对应改变
      sessionStorage.setItem(
        "editableTabs",
        JSON.stringify(_this.editableTabs)
      ); //添加存储用户操作的tab内容
      sessionStorage.setItem("TabName", newTabName); //存储用户操作的tab位置,这里需要的是editableTabs数组中name
    },
    /**
     * tab标签页点击,侧边栏路由对应
     */
    clickTab(targetIndex) {
      let _this = this;
      let label = targetIndex.label; //得到点击的name
      function checkLabel(tabName) {
        //返回查询的下标
        return tabName.name == targetIndex.label;
      }
      let index = _this.asideTionList.findIndex(checkLabel);
      sessionStorage.setItem("TabName", targetIndex.name);
      _this.routerPath(index); //使用自定义方法跳转
    },
    /**
     * tab标签页点击删除
     */
    removeTab(targetName) {
      // targetName 现在删除的tab标签页位置
      let _this = this;
      let tabs = _this.editableTabs; //得到editableTabs数组信息
      let activeName = _this.editableTabsValue; //得到现在tab标签页默认位置
      if (activeName === targetName) {
        //判断删除的位置与现在tab标签页默认位置是否相等
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            //判断遍历得到name(数组内容中表示位置)与现在tab标签页默认位置是否相等
            //当前得到的位置(对应editableTabs数组)有上一个对象得到上一个数组对象
            //没有得到下一个数组对象
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              //true 得到数组对象内容中表示位置的name赋值给activeName
              activeName = nextTab.name;
            }
          }
        });
      }
      _this.editableTabsValue = activeName; //删除后tab标签页默认位置对应改变
      if (targetName == 1) {
        _this.$message({
          //首页tab不可以删除
          message: "不允许操作",
          type: "error"
        });
      }
      //默认位置不等于1(首页tab位置),才更改,使用filter方法过滤
      _this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      function checkTabe(tabName) {
        //返回查询name的下标
        return tabName.name == activeName;
      }
      let index1 = tabs.findIndex(checkTabe);
      function checkPath(tabName) {
        //查询title返回对应name(提取的侧边栏name)的下标
        return tabName.name == tabs[index1].title;
      }
      let index2 = _this.asideTionList.findIndex(checkPath);
      // console.log(index2, activeName, tabs[index1].title);
      sessionStorage.setItem("editableTabs", JSON.stringify(_this.editableTabs)); //删除时存储用户操作的tab内容
      sessionStorage.setItem("TabName", activeName); //存储用户操作的tab位置,这里需要的是editableTabs数组中name
      _this.routerPath(index2); //使用自定义方法跳转,activeName时位置要-1
    },
    /**
     * 路由对应跳转,传入下标
     */
    routerPath(index) {
      let _this = this;
      let path = _this.asideTionList[index].path; //找到根据侧边栏筛选出来的数组的path
      //使用replace ，跳转到指定url路径，但是history栈中不会有记录，点击返回会跳转到上上个页面
      _this.$router.replace(path);
    }
  }
};
</script>

<style lang="scss" scoped>
// 根据选择是否展开状态添加宽度
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.home {
  height: 100%;
  line-height: 60px;
  .pic {
    position: relative;
    height: 60px;
    a {
      width: 60px;
      display: inline-block;
    }
    img {
      width: 100%;
      max-width: 100%;
    }
  }
  /deep/ .el-menu {
    border-right: 0;
  }
  .menu_a {
    /deep/ a {
      display: block;
      color: #ccc;
      &.router-link-exact-active {
        &.router-link-active {
          position: relative;
          z-index: 2;
          color: #409eff;
          font-size: 15px;
          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: -40px;
            width: 200px;
            height: 100%;
            background: rgba($color: #000000, $alpha: 0.4);
            z-index: -1;
          }
          &::after {
            content: "";
            position: absolute;
            top: 12.5px;
            right: -45px;
            width: 0;
            height: 0;
            border: 10px solid transparent;
            border-right: 10px solid #fff;
            z-index: -1;
          }
        }
      }
    }
  }
}
// 导航栏
.el-header {
  background-color: #545c64;
  color: #fff;
  line-height: 60px;
  font-size: 12px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  i{
    color: #fff;
  }
  .tooltip {
    width: 20px;
    height: 60px;
    background: rgba($color: #000000, $alpha: 0.7);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 12px 0;
  }
}
// tab标签页
/deep/ .tab-position {
  width: 75%;
  max-width: 75%;
  margin-right: 5%;
  .el-tabs__item{
    color: white;
    height: 49px;
    &.is-active{
      color: #409EFF;
      border-bottom: 2px solid #409EFF !important;
    }
  }
  .el-tabs__header{
    margin-bottom: 0;
  }
  .el-tabs__nav{
    max-height: 60px;
  }
  .el-tabs--card>.el-tabs__header{
    border-bottom: 0;
  }
  .el-tabs__nav-next, .el-tabs__nav-prev{
    color: #fff;
  }
}
// 侧边栏
.el-aside {
  color: #333;
}
</style>
