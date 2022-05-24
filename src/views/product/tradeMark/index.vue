<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="dialogFormVisible = true"
      >添加</el-button
    >
    <el-table style="width: 100%" border :data="records.records">
      <el-table-column type="index" label="序号" align="center" width="80px">
      </el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTrademark(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="trademark.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
      @close="trademark = {}"
    >
      <el-form :rules="rules" ref="ruleForm" :model="trademark">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            autocomplete="off"
            style="width: 70%"
            v-model="trademark.tmName"
          ></el-input>
        </el-form-item>

        <el-form-item label="LOGO图片" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademark.logoUrl"
              :src="trademark.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="changeTrademark">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination
      style="margim-top: 20px; text-align: center"
      @current-change="getTrademarkInfo"
      @size-change="handleChangeSize"
      :page-sizes="[3, 5, 10]"
      :total="records.total"
      :current-page="records.current"
      :page-size="3"
      :page-count="9"
      layout="prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    var validatePaTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称2-10位"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limt: 3,
      records: {},
      imageUrl: "",
      trademark: {
        tmName: "",
        logoUrl: "",
      },
      dialogFormVisible: false,
      rules: {
        tmName: [
          { required: true, message: "请输入商品品牌", trigger: "blur" },
          { validator: validatePaTmName, trigger: "blur" },
        ],
        logoUrl: [
          { required: true, message: "请上传logo图片", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getTrademarkInfo();
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.trademark.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    getTrademarkInfo(pager = 1) {
      this.page = pager;
      const { page, limt } = this;
      this.$API.trademark.reqgetTradeMark(page, limt).then(
        (value) => {
          if (value.code == 200) this.records = value.data;
        },
        (error) => {
          console.error(error.massage);
        }
      );
    },
    handleChangeSize(limit) {
      this.limt = limit;
      this.getTrademarkInfo();
    },
    changeTrademark() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          if (!this.trademark.id) {
            this.$API.trademark.reqAddTradeMark(this.trademark).then(
              (value) => {
                if (value.code == 200) {
                  this.$message({ message: "品牌添加成功", type: "success" });
                  this.getTrademarkInfo();
                }
              },
              (error) => {
                this.$message(error.message);
              }
            );
          } else {
            this.$API.trademark.reqUpdateTradeMark(this.trademark).then(
              (value) => {
                if (value.code == 200) {
                  this.$message({ message: "品牌修改成功", type: "success" });
                  this.getTrademarkInfo(this.page);
                }
              },
              (error) => {
                this.$message(error.message);
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    updateTrademark(row) {
      this.dialogFormVisible = true;
      this.trademark = { ...row };
    },
    cancel() {
      this.dialogFormVisible = false;
      this.trademark = {};
    },
    deleteTrademark(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$API.trademark.reqDeleteTradeMark(row.id).then(
            (value) => {
              if (value.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
              if(this.records.records.length <= 1){
                this.getTrademarkInfo(this.page - 1)
              }
              this.getTrademarkInfo(this.page)
            },
            (error) => {
              this.$message({
                 type: 'warning',
                message: "删除失败",
              });
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>