<template>
  <div>
    <el-card style="margin-bottom: 50px">
      <categoryList
        @getcategoryId="getcategoryId"
        :show="!isshow"
      ></categoryList>
    </el-card>

    <el-card v-show="isshow">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category3id"
        @click="isshow = false"
        >添加属性</el-button
      >
      <el-table style="width: 100%" border :data="AttrInfoList">
        <el-table-column label="序号" type="index" width="80px">
        </el-table-column>
        <el-table-column label="属性名称" width="150px" prop="attrName">
        </el-table-column>
        <el-table-column label="属性列表">
          <template slot-scope="{ row, $index }">
            <el-tag
              type="success"
              v-for="info in row.attrValueList"
              style="margin: 0 20px"
              :key="info.id"
              >{{ info.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateAttr(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-show="!isshow">
      <el-form label-width="80px" :inline="true">
        <el-form-item label="属性名">
          <el-input
            placeholder="请输入属性名"
            v-model="attrInfo.attrName"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttr"
        :disabled="!attrInfo.attrName"
        >添加属性名</el-button
      >
      <el-button type="" @click="deleteattr">取消</el-button>

      <el-table border style="margin: 20px 0" :data="attrInfo.attrValueList">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="属性名称">
          <template slot-scope="{ row, $index }">
            <el-input
              size="mini"
              v-model="row.valueName"
              v-show="row.flag"
              :ref="$index"
              @blur="toLook(row)"
              @keyup.native.enter="toLook(row)"
            ></el-input>
            <span
              v-show="!row.flag"
              style="display: block"
              @click="toEdit(row, $index)"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-popconfirm
              :title="`确定删除${row.valueName}吗？`"
              @onConfirm="deleteAttrValue($index)"
            >
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-button
        type="primary"
        @click="saveAttr"
        :disabled="attrInfo.attrValueList.length < 1"
        >保存</el-button
      >
      <el-button type="" @click="deleteattr">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import categoryList from "@/components/categoryList";
export default {
  name: "Attr",
  data() {
    return {
      isaa: true,
      category1id: "",
      category2id: "",
      category3id: "",
      AttrInfoList: [],
      isshow: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 0,
      },
    };
  },
  components: { categoryList },
  methods: {
    deleteattr() {
      this.attrInfo.attrName = "";
      this.attrInfo.attrValueList = [];
      this.isshow = true;
    },
    getcategoryId({ id, leavl }) {
      switch (leavl) {
        case 1:
          this.category1id = id;
          this.category2id = "";
          this.category3id = "";
          break;

        case 2:
          this.category2id = id;
          this.category3id = "";
          break;

        case 3:
          this.category3id = id;
          this.getAttrInfoList();
          break;
      }
    },
    getAttrInfoList() {
      this.$API.attr
        .reqAttrInfoList(this.category1id, this.category2id, this.category3id)
        .then((result) => {
          if (result.code == 200) {
            this.AttrInfoList = result.data;
          }
        })
        .catch((err) => {
          console.log(err.massage);
        });
    },
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    addAttr() {
      console.log(this.attrInfo.attrValueList[this.attrInfo.attrValueList.length-1].valueName)
      // if(this.attrInfo.attrValueList[this.attrInfo.attrValueList.length-1].valueName != ''){
      this.attrInfo.attrValueList.push({
        attrId: 0,
        valueName: "",
        flag: true,
      });
      // }
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    updateAttr(row) {
      this.isshow = false;
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    toLook(row) {
      if (row.valueName.trim() == "") {
        this.$message("输入正确的的属性值");
        return;
      }
      let ruselt = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (ruselt) {
        this.$message("请不要输入重复的属性名");
        return;
      }
      row.flag = false;
    },
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        console.log();
        this.$refs[index].focus();
      });
    },
    saveAttr() {
      if (this.attrInfo.AttrInfoList.length > 1) {
        this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
          (item) => {
            if (item.valueName != "") {
              delete item.flag;
              return true;
            }
          }
        );
        this.$API.attr.reqAddAttr(this.attrInfo).then(
          (value) => {
            if (value.code == 200) {
              this.$message({ type: "success", message: "保存成功" });
              this.getAttrInfoList();
              this.isshow = true;
              this.attrInfo.attrName = "";
              this.attrInfo.attrValueList = [];
            }
          },
          (err) => {}
        );
      } else {
        this.$message("请输入信息再保存");
      }
    },
  },
};
</script>

<style>
</style>