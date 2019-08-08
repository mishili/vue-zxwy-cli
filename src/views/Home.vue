<template>
  <div class="home">
    <el-container style="height: 100%;position: relative;">
      <!-- 侧边栏 -->
      <el-aside width="auto" style="background-color: #545c64">
        <el-row class="pic" >
          <p>
            <img src="../assets/logo.png">
          </p>
          <span v-show="!isCollapse">教学管理系统</span>
        </el-row>
        <el-menu
          :default-openeds="['1', '2']"
          :default-active="activeindex"
          class="el-menu-vertical-demo"
          router
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#ccc"
          active-text-color="#409eff"
        >
          <el-menu-item :class="isCollapse?'':'el_item'" index="/home" @click="addTab('首页')">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu v-for="(value,index) in asideTion" :key="index" :index="''+(index+1)">
            <template slot="title">
              <i :class="value.class"></i>
              <span slot="title">{{ value.aside }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="(value,index) in value.option"
                :key="index"
                @click="addTab(value.name,value.path)"
                class="menu_a"
                :index="value.path"
              >{{ value.name }}</el-menu-item>
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
              @tab-click="clickTab"
              @tab-remove="removeTab"
            >
              <el-tab-pane
                v-for="(item,index) in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                :closable="index>0"
              ></el-tab-pane>
            </el-tabs>
          </el-row>
          <!-- 详情 -->
          <el-dropdown trigger="click" @command="handleCommand">
            <i class="el-icon-setting" style="margin-right: 15px;"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">查看</el-dropdown-item>
              <el-dropdown-item command="b">新增</el-dropdown-item>
              <el-dropdown-item command="exit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 用户名 -->
          <span>{{ userName }}</span>
          <!-- 用户头像 -->
          <el-avatar :size="50" :src="circleUrl" style="margin-left: 15px"></el-avatar>
        </el-header>
        <el-main>
          <!-- 路由视图 -->
          <keep-alive>
              <router-view/>
          </keep-alive>
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
      activeindex: "/home", //当前激活菜单的 Path
      isCollapse: false, //侧边栏是否收起
      userName: '王大胖',//用作用户名
      circleUrl:  //用作用户头像
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      asideTion: [
        //侧边栏动态内容
        {
          aside: "基础数据", //一级菜单
          class: "el-icon-menu", //定义icon样式
          option: [
            //二级菜单
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
      asideTionList: [], //提取侧边栏name,path //无用
      editableTabsValue: "1", //默认tab标签页位置
      editableTabs: [
        //tab标签页内容
        {
          title: "首页",
          name: "1",//内容中表示位置
          path: '/home'
        }
      ],
      tabIndex: 1 //用于添加tab标签页时,从name=1开始,因为一开始有首页
    };
  },
  created() {
    let _this = this;
    // 侧边栏结构不同,用option自己拼接成单独数组对象 //无用
    // _this.asideTion.forEach(item => {
    //   _this.asideTionList.push(...item.option);
    //   // item.option.forEach(item => {
    //   //   _this.asideTionList.push(item);
    //   // });
    // });
    _this.userName = sessionStorage.getItem("userName");
    
    var getTabList = JSON.parse(sessionStorage.getItem("editableTabs")); //得到存储的tab内容
    var getTabName = sessionStorage.getItem("TabName"); //得到存储的tab位置name
    if (getTabList && getTabName) {
      //如果存在sessionStorage数据,改变其结果
      _this.editableTabs = getTabList;
      _this.editableTabsValue = getTabName;
      _this.tabIndex = getTabList[getTabList.length - 1].name;
      let index = _this.editableTabs.findIndex(
        item => item.name == getTabName
      );
      _this.activeindex = getTabList[index].path;
    }
  },
  methods: {
    /**
     * 侧边栏点击添加tab标签页
     * @param {String} name 侧边栏标题
     * @param {String} path 侧边栏路径
     */
    addTab(name,path) {
      let _this = this;
      function checkAdult(ediTabTittle) {
        //点击时查询传入name的下标
        return ediTabTittle.title == name; //editableTabs中的title与传入name相等返回查询下标 ，没有返回-1
      }
      let asideindex = _this.editableTabs.findIndex(checkAdult); //使用findIndex方法 返回符合测试条件的第一个数组元素索引
      let newTabName = ""; // 定义变量表示tab标签页位置
      if (asideindex == -1) {
        //如果查询结果为 -1 证明tab标签页不存在 可以添加tab标签页
        newTabName = ++_this.tabIndex + "";
        _this.editableTabs.push({
          title: name,
          name: newTabName,
          path: path
        });
      } else {
        newTabName = _this.editableTabs[asideindex].name; //使用editableTabs数组中name指定tab标签页位置
      }
      _this.routerViem(newTabName);
    },
    /**
     * tab标签页点击,侧边栏路由对应
     * @param {String} targetPane tab标签页name
     */
    clickTab(targetPane) {
      let _this = this;
      _this.routerViem(targetPane.name);
    },
    /**
     * tab标签页点击删除
     * @param {String} targetName 现在删除的tab标签页位置
     */
    removeTab(targetName) {
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
      //删除后更改,使用filter方法过滤
      _this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      _this.routerViem(activeName);
    },
    /**
     * 视图对应跳转
     * @param {String} name 传入tab标签页的name
     */
    routerViem(name) {
      let _this = this;
      _this.editableTabsValue = name; //点击后tab标签页默认位置对应改变
      //返回查询name的下标
      let index = _this.editableTabs.findIndex(
        item => item.name == name
      );
      // 侧边栏菜单默认打开位置
      _this.activeindex = _this.editableTabs[index].path;
      //使用replace ，跳转到指定url路径，但是history栈中不会有记录，点击返回会跳转到上上个页面
      _this.$router.replace(_this.activeindex);
      
      //操作时存储用户操作的tab内容
      sessionStorage.setItem(
        "editableTabs",
        JSON.stringify(_this.editableTabs)
      );
      //存储用户操作的tab位置,这里需要的是editableTabs数组中name
      sessionStorage.setItem("TabName", name);
    },
    /**
     * 详情点击
     * @param {String} command 详情点击 通过相应的菜单项 key 
     */
    handleCommand(command){
      let _this = this;
      if(command=="exit"){
        _this.exit();
      }
    },
    /**
     * 退出登录
     */
    exit() {
      let _this = this;
      _this.$router.push("/");
      _this.$message({
        message: "退出登录成功",
        type: "success"
      });
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
  .pic {
    display: flex;
    justify-content: center;
    position: relative;
    height: 60px;
    line-height: 60px;
    color: #fff;
    p {
      width: 60px;
      height: 60px;
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
  /deep/ .menu_a {
    &.is-active {
      position: relative;
      background: rgba($color: #000000, $alpha: 0.4) !important;
      &::after {
        content: "";
        position: absolute;
        top: 12px;
        right: 0;
        width: 0;
        height: 0;
        border: 13px solid transparent;
        border-right: 13px solid #fff;
      }
    }
  }
}
// 导航栏
.el-header {
  background-color: #545c64;
  color: #fff;
  font-size: 12px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  i {
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
  flex: 1;
  margin: 19px 20px 0;
  overflow: hidden;
  .el-tabs__item {
    color: white;
    &.is-active {
      color: #409eff;
      border-bottom: 3px solid #409eff !important;
    }
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: 0;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    color: #fff;
  }
}
// 侧边栏
.el-aside {
  /deep/ .el_item{
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
    // padding-left: 58px !important;
    margin-left: -29px;
  }
}
</style>
