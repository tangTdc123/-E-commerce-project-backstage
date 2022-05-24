<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="idFrom">
      <el-form-item label="分类1">
        <el-select
          placeholder=""
          style="margin-right: 50px"
          v-model="idFrom.category1id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="oneList.name"
            v-for="oneList in category1List"
            :value="oneList.id"
            :key="oneList.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类2">
        <el-select
          placeholder=""
          style="margin-right: 50px"
          v-model="idFrom.category2id"
          @change="handler2"
          :disabled="show"
        >
          <p slot="empty" class="el-select-dropdown__empty">请选择一级分类</p>
          <el-option
            :label="twoList.name"
            v-for="twoList in category2List"
            :value="twoList.id"
            :key="twoList.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类3">
        <el-select
          placeholder=""
          value=""
          v-model="idFrom.category3id"
          @change="handler3"
          :disabled="show"
        >
          <p slot="empty" class="el-select-dropdown__empty">请选择二级分类</p>
          <el-option
            :label="threeList.name"
            v-for="threeList in category3List"
            :value="threeList.id"
            :key="threeList.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "categoryList",
  props: ["show"],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      idFrom: {
        category1id: "",
        category2id: "",
        category3id: "",
      },
    };
  },
  mounted() {
    this.getcategoryList();
  },
  methods: {
    getcategoryList() {
      this.$API.attr.reqCategory1List().then(
        (value) => {
          if (value.code == 200) {
            this.category1List = value.data;
          }
        },
        (error) => {
          console.log(error.message);
        }
      );
    },
    handler1() {
      this.category2List = [];
      this.category3List = [];
      this.idFrom.category2id = "";
      this.idFrom.category3id = "";
      this.$API.attr.reqCategory2List(this.idFrom.category1id).then(
        (value) => {
          if (value.code == 200) {
            this.category2List = value.data;
          }
        },
        (error) => {
          console.log(error.message);
        }
      );

      this.$emit("getcategoryId", { id: this.idFrom.category1id, leavl: 1 });
    },
    handler2() {
      this.category3List = [];
      this.idFrom.category3id = "";
      this.$API.attr.reqCategory3List(this.idFrom.category2id).then(
        (value) => {
          if (value.code == 200) {
            this.category3List = value.data;
          }
        },
        (error) => {
          console.log(error.message);
        }
      );

      this.$emit("getcategoryId", { id: this.idFrom.category2id, leavl: 2 });
    },
    handler3() {
      this.$emit("getcategoryId", { id: this.idFrom.category3id, leavl: 3 });
    },
  },
};
</script>

<style>
</style>