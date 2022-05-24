<template>
  <div>
    <el-card style="margin-bottom: 50px"
      ><categoryList
        @getcategoryId="getcategoryId"
        :show="scene != 0"
      ></categoryList
    ></el-card>
    <div v-show="scene == 0">
      <el-card>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table border :data="records">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column
            label="SPU名称"
            width="width"
            prop="spuName"
          ></el-table-column>
          <el-table-column
            label="SPU描述"
            width="width"
            prop="description"
          ></el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="addSku(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SKU"
                @click="xiugai(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前SPU全部SPU列表"
                @click="handler(row)"
              >
              </HintButton>

              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                >
                </HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="3"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-card>
    </div>
    <SpuForm v-show="scene == 1" @changescene="changescene" ref="spu"></SpuForm>
    <SkuForm v-show="scene == 2" @changescene="changescene" ref="sku"></SkuForm>
    <el-dialog :title="`${spu.spuName}的SPU列表`" :visible.sync="dialogTableVisible" :before-close="dialogClose" >
      <el-table border style="width:100%" :data="skuList" v-loading="loading">
        <el-table-column label="名称"  prop="skuName" ></el-table-column>
        <el-table-column label="价格"  prop="price"></el-table-column>
        <el-table-column  label="重量" prop="weight"></el-table-column>
        <el-table-column  label="默认图片" >
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
import categoryList from "@/components/categoryList";
export default {
  name: "Spu",
  data() {
    return {
      loading:true,
      category1id: "",
      category2id: "",
      category3id: "",
      records: [],
      scene: 0,
      page: 1,
      limit: 3,
      show: true,
      total: 0,
      dialogTableVisible: false,
      spu:{},
      skuList:[]
    };
  },
  components: { categoryList, SkuForm, SpuForm },
  methods: {
    dialogClose(done){
      this.loading = true
      this.skuList=[]
      done()
    },
    handler(row) {
      this.spu=row
      this.dialogTableVisible = true;
      this.$API.sku.reqSkuList(row.id).then((result) => {
        if(result.code == 200){
          this.skuList=result.data
          this.loading = false

        }
      }).catch((err) => {
        
      });
      
    },
    deleteSpu(row) {
      this.$API.spu
        .reqDeleteSpu(row.id)
        .then((result) => {
          if (result.code == 200) {
            this.$message({ type: "success", message: "删除成功" });
            this.getspuList(
              this.records.length > 1 ? this.page : this.page - 1
            );
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3id);
    },
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getData(this.category1id, this.category2id, row);
    },
    xiugai(row) {
      this.scene = 1;
      this.$refs.spu.getSpuData(row);
    },
    changescene({ scene, flag }) {
      this.scene = scene;
      if (flag == "修改") {
        this.getspuList(this.page);
      } else {
        this.getspuList();
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getspuList();
    },
    handleCurrentChange(page) {
      this.getspuList(page);
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
          this.getspuList();
          break;
      }
    },
    getspuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3id } = this;
      this.$API.spu
        .reqSpuList(page, limit, category3id)
        .then((result) => {
          if (result.code == 200) {
            this.total = result.data.total;
            this.records = result.data.records;
          }
        })
        .catch((err) => {
          console.log(err.massage);
        });
    },
  },
};
</script>

<style>
</style>