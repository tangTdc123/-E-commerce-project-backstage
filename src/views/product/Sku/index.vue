<template>
  <div>
    <el-card>
      <el-table border :data="records">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="描述" prop="skuDesc"></el-table-column>
        <el-table-column label="默认图片" width="100px" align="center">
          <template slot-scope="{ row, $index }">
            <img />
          </template>
        </el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column
          label="价格"
          width="80px"
          prop="price"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button
              type="success"
              icon="el-icon-sort-down"
              size="mini"
              v-if="!row.isSale"
              @click="sale(row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-sort-up"
              size="mini"
              v-else
              @click="cancel(row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="$message('正在开发中')"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              @click="getSkuInfo(row)"
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

    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      style="text-align: center"
      :current-page="1"
      :page-sizes="[3, 5, 10]"
      :page-size="3"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="20"
    >
    </el-pagination>

    <el-drawer
      size="50%"
      :visible.sync="show"
      direction="rtl"
      :before-close="handleClose"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16"> {{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16"> {{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格(元)</el-col>
        <el-col :span="16"> {{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="attr in skuInfo.skuAttrValueList"
            style="margin-right: 10px"
            :key="attr.id"
            >{{ attr.attrId }}--{{ attr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel trigger="click" height="300px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="width:300px;height:3000px"/>
            </el-carousel-item>
          </el-carousel></el-col
        >
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      show: false,
      limit: 3,
      records: [],
      total: 0,
      skuInfo: {},
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    getSkuInfo(row) {
      this.$API.sku
        .reqSkuId(row.id)
        .then((result) => {
          if (result.code == 200) {
            this.skuInfo = result.data;
            this.show = true;
          }
        })
        .catch((err) => {});
    },
    cancel(row) {
      this.$API.sku
        .reqCancel(row.id)
        .then((result) => {
          if (result.code == 200) {
            row.isSale = 0;
            this.$message({ type: "success", message: "下架成功" });
          }
        })
        .catch((err) => {});
    },
    sale(row) {
      this.$API.sku
        .reqSale(row.id)
        .then((result) => {
          if (result.code == 200) {
            row.isSale = 1;
            this.$message({ type: "success", message: "上架成功" });
          }
        })
        .catch((err) => {});
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    handleCurrentChange(pages) {
      this.page = pages;
      this.getSkuList();
    },
    getSkuList() {
      this.$API.sku
        .reqSkuList(this.page, this.limit)
        .then((result) => {
          if (result.code == 200) {
            this.total = result.data.total;
            this.records = result.data.records;
          }
        })
        .catch((err) => {});
    },
  },
};
</script>

<style>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px;
}

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

  .el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px;
}
  >>>.el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }
</style>