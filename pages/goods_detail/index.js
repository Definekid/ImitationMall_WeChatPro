/**
 * 1 发送数据获取请求
 * 2 点击轮播图 预览大图功能
 *    1 给轮播图绑定点击事件
 *    2 调用小程序的api previewImage
 * 3 点击加入购物车
 *    1 绑定点击事件
 *    2 获取缓存中的购物车数据 数组格式
 *    3 先判断当前的商品是否已经存在于 购物车
 *    4 已经存在修改购物车数据 执行++ 重新把购物车数组填充回缓存中
 *    5 不存在于购物车数组中 直接给购物车数据增加 新元素 ，带上购买数量数据
 *    6 弹出提示
 */
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },

  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    this.GoodsInfo = goodsObj;
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone 部分手机不识别 webp图片格式
        // 最好找到后台工程师 让他修改
        // 临时自己改，确保后台存在  webp =>  jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics,
      }
    })
  },

  // 点击轮播图 预览大图
  handlePreviewImage(e) {
    // 1 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 2 接收传递过来图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    });
  },


  // 点击加入购物车 
  handleCartAdd() {
    // 1 获取缓存中的购物车 数量
    let cart = wx.getStorageSync("cart") || [];
    // 2 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 不存在
      this.GoodsInfo.num = 1;
      cart.push(this.GoodsInfo);
    } else {
      // 存在
      cart[index].num++;
    }
    // 存入缓存
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // mask 改为true 防止用户手滑 5s
      mask: true,

    });
  }
})