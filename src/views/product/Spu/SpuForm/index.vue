<template>
  <div>
    <el-card>
      <el-form label-width="80px" :model="spu">
        <el-form-item label="SPU名称">
          <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
          <el-select placeholder="请选择品牌" v-model="spu.tmId">
            <el-option
              :label="tm.tmName"
              :value="tm.id"
              v-for="tm in tradeMarkList"
              :key="tm.id"
            ></el-option> </el-select
        ></el-form-item>
        <el-form-item label="SPU描述">
          <el-input
            type="textarea"
            rows="4"
            placeholder="描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            action="/api/admin/product/fileUpload"
            :file-list="spuImageList"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleupdata"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select
            :placeholder="`还有${unSelectSaleAttr.length}项未选`"
            v-model="attr"
          >
            <el-option
              v-for="unselete in unSelectSaleAttr"
              :key="unselete.id"
              :label="unselete.name"
              :value="`${unselete.id}:${unselete.name}`"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addSaveAttr"
            :disabled="!attr"
            >添加销售属性</el-button
          >
          <el-table border :data="spu.spuSaleAttrList">
            <el-table-column
              label="序号"
              type="index"
              width="80px"
              align="center"
            ></el-table-column>
            <el-table-column
              label="属性名"
              prop="saleAttrName"
            ></el-table-column>
            <el-table-column label="属性值">
              <template slot-scope="{ row, $index }">
                <el-tag
                  :key="tag.id"
                  v-for="tag in row.spuSaleAttrValueList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, row)"
                >
                  {{ tag.saleAttrName }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row, $index }">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
          <el-button @click="fanhui">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  computed: {
    unSelectSaleAttr() {
      let ruselt = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return ruselt;
    },
  },
  data() {
    return {
      attr: "",
      category3Id:'',
      inputVisible: false,
      inputValue: "",
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        category3Id: "",
        description: "",
        spuName: "",
        tmId: "",
        spuSaleAttrList: [],
      },
      spuImageList: [],
      tradeMarkList: [],
      saleAttrList: [],
    };
  },
  methods: {
    addSaveAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attr.split(":");
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attr = "";
    },
    handleClose(tag, row) {
      row.spuSaleAttrValueList.splice(row.spuSaleAttrValueList.indexOf(tag), 1);
    },

    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(row) {
      if (this.inputValue) {
        let ruselt = row.spuSaleAttrValueList.every((item) => {
          return item.saleAttrName != this.inputValue;
        });
        if (ruselt) {
          let newSaleAttrValue = {
            baseSaleAttrId: row.baseSaleAttrId,
            saleAttrName: this.inputValue,
          };
          row.spuSaleAttrValueList.push(newSaleAttrValue);
          row.inputVisible = false;
          this.inputValue = "";
        } else {
          this.$message("请不要输入重复的信息");
        }
      } else {
        this.$message("请输入信息");
      }
    },
    addSpuData(category3id) {
      this.category3Id = category3id;
      this.$API.spu
        .reqTradeMarkList()
        .then((result) => {
          if (result.code == 200) {
            this.tradeMarkList = result.data;
          }
        })
        .catch((err) => {
          console.error(err.massage);
        });

      this.$API.spu
        .reqBaseSaleAttrList()
        .then((result) => {
          if (result.code == 200) {
            this.saleAttrList = result.data;
          }
        })
        .catch((err) => {
          console.error(err.massage);
        });
    },
    getSpuData(row) {
      this.$API.spu
        .reqSpu(row.id)
        .then((result) => {
          if (result.code == 200) {
            this.spu = result.data;
          }
        })
        .catch((err) => {
          console.error(err.massage);
        });

      this.$API.spu
        .reqTradeMarkList()
        .then((result) => {
          if (result.code == 200) {
            this.tradeMarkList = result.data;
          }
        })
        .catch((err) => {
          console.error(err.massage);
        });

      this.$API.spu
        .reqSpuImageList(row.id)
        .then((result) => {
          if (result.code == 200) {
            let list = result.data;
            list.forEach((element) => {
              element.name = element.imgName;
              element.url = element.imgUrl;
            });

            this.spuImageList = list;
          }
        })
        .catch((err) => {
          console.error(err.massage);
        });

      this.$API.spu
        .reqBaseSaleAttrList()
        .then((result) => {
          if (result.code == 200) {
            this.saleAttrList = result.data;
          }
        })
        .catch((err) => {
          console.error(err.massage);
        });
    },
    fanhui() {
      this.$emit("changescene", { scene: 0 });
      Object.assign(this._data, this.$options.data());
    },
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
      console.log(file, fileList);
    },
    handleupdata(response, file, fileList) {
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      this.spu.category3Id = this.category3Id
      this.$API.spu
        .reqAddOrUpdateSpu(this.spu)
        .then((result) => {
          if (result.code == 200) {
            this.$message({ type: "success", message: "保存成功" });
            this.$emit("changescene", {
              scene: 0,
              flag: this.spu.id ? "修改" : "添加",
            });
          }
        })
        .catch((err) => {
          console.error(err.message);
        });
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>