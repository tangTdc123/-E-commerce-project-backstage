<template>
  <div>
    <el-card>
      <el-form label-width="80px">
        <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
        <el-form-item label="SKU名称">
          <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <el-input
            placeholder="价格(元)"
            type="number"
            v-model="skuInfo.price"
          ></el-input>
        </el-form-item>
        <el-form-item label="重量(kg)">
          <el-input placeholder="重量(kg)" v-model="skuInfo.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input
            type="textarea"
            placeholder="规格描述"
            rows="3"
            v-model="skuInfo.skuDesc"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
          <el-form :inline="true" ref="form" label-width="80px">
            <el-form-item
              :label="attr.attrName"
              v-for="attr in AttrInfoList"
              :key="attr.id"
            >
              <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                <el-option
                  :label="attrvalue.valueName"
                  :value="`${attr.id}:${attrvalue.id}`"
                  v-for="attrvalue in attr.attrValueList"
                  :key="attrvalue.id"
                >
                </el-option> </el-select
            ></el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-form :inline="true" label-width="80px">
            <el-form-item
              :label="saleAttr.saleAttrName"
              v-for="saleAttr in SpuSaleAttrList"
              :key="saleAttr.id"
            >
              <el-select
                placeholder="请选择"
                v-model="saleAttr.saleAttrIdAndValueId"
              >
                <el-option
                  :label="spuSaleAttrValue.saleAttrValueName"
                  :value="`${saleAttr.id}:${spuSaleAttrValue.id}`"
                  v-for="spuSaleAttrValue in saleAttr.spuSaleAttrValueList"
                  :key="spuSaleAttrValue.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="图片列表">
          <el-table
            style="width: 100%"
            border
            :data="SpuImageList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column width="80px" type="selection"> </el-table-column>
            <el-table-column label="图片" width="width">
              <template slot-scope="{ row, $index }">
                <img :src="row.imgUrl" style="width: 100px; height: 100px" />
              </template>
            </el-table-column>
            <el-table-column label="名称" width="width" prop="imgName">
            </el-table-column>
            <el-table-column label="操作" width="width">
              <template slot-scope="{ row, $index }">
                <el-button
                  type="primary"
                  v-show="!row.isDefault"
                  @click="changeDefault(row)"
                  >设置默认</el-button
                >
                <el-button v-show="row.isDefault">默认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      SpuImageList: [],
      SpuSaleAttrList: [],
      AttrInfoList: [],
      spu: {},
      imageList: [],
      skuInfo: {
        category3Id: 0,
        weight:'',
        spuId: 0,
        tmId: 0,
        skuName: "",
        price: 0,
        SkuAttrValueList: [],
        skuDefaultImg: "",
        skuDesc: "",
        skuImageList: [],
        skuSaleAttrValueList: [],
      },
    };
  },
  methods: {
    save() {
      const { AttrInfoList, skuInfo, SpuSaleAttrList,imageList} = this;
      skuInfo.SkuAttrValueList = AttrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);

      skuInfo.skuSaleAttrValueList = SpuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.saleAttrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);

      skuInfo.skuImageList = imageList.map((item) => {
          return{
              imgName:item.imgName,
              imgUrl:item.imgUrl,
              isDefault:item.isDefault,
              spuImgId:item.id
          }
      })

        this.$API.spu.reqsaveSkuInfo(this.skuInfo).then((result) => {
            if(result.code == 200){
                this.$message({type:'success',message:"添加成功"})
                Object.assign(this._data, this.$options.data());
                this.$emit('changescene',{scene:0})
                
            }
        }).catch((err) => {
            
        });
    },
    cancel() {
      this.$emit("changescene", { scene: 0 });
      Object.assign(this._data, this.$options.data());
    },
    changeDefault(row) {
      this.SpuImageList.forEach((item) => {
        item.isDefault = 0;
      });

      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    handleSelectionChange(parms) {
      this.imageList = parms;
    },
    async getData(category1id, category2id, row) {
      this.spu = row;
      let result = await this.$API.spu.reqSpuImageList(row.id);
      if (result.code == 200) {
        let List = result.data;
        List.forEach((item) => {
          item.isDefault = 0;
        });
        this.SpuImageList = List;
      }

      let result2 = await this.$API.spu.reqSpuSaleAttrList(row.id);
      if (result2.code == 200) {
        this.SpuSaleAttrList = result2.data;
      }

      let result3 = await this.$API.spu.reqAttrInfoList(
        category1id,
        category2id,
        row.id
      );
      if (result3.code == 200) {
        this.AttrInfoList = result3.data;
      }
    },
  },
};
</script>

<style>
</style>