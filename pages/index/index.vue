<template>
	<section>
		<section class="top_main">
			<div class="left">
				<el-link type="primary" :underline="false"><i class="el-icon-arrow-left"></i>返回</el-link>
			</div>
			<div class="title">
				<span>当前页面：{{title}}</span>
			</div>
			<div class="right">
				<el-button size="mini" @click="submit" type="primary" plain>保存</el-button>
				<el-button size="mini" type="primary" plain>发布</el-button>
			</div>
		</section>
		<section class="decoration-edit">
			<section class="l">
				<ul id="typeListView">
					<li v-for="(val, key, index) in typeList" :data-type="key" :key="index + 1">
						<span :class="val.icon"></span>
						<p>{{val.name}}</p>
					</li>
				</ul>
			</section>
			<section class="c" id="view-main">
				<!-- header 不可拖拽 -->
				<div class="top-nav" @click="selectType(0)">
					<img src="@/static/images/topNavBlack.png">
					<span class="tit">{{ info.title }}</span>
				</div>
				<div class="view-content" :style="{ backgroundColor: info.backgroundColor }">
					<div id="view-content">
						<template v-for="(item, index) in view">
							<div v-if="index > 0" :data-index="index" :key="index" class="item"
								@click="selectType(index)">
								<template>
									<component :is="typeList[item.type]['com']" :data="item"
										:className="className[item.tabType]">
									</component>
								</template>
								<i @click="deleteItem($event, index)" class="el-icon-error"></i>
							</div>
						</template>
					</div>
				</div>
			</section>
			<section class="r">
				<EditForm :data="props" v-if="isRight"></EditForm>
			</section>
		</section>
	</section>
</template>

<script>
	// import Draggable from 'vuedraggable'
	import Sortable from "sortablejs";
	import EditForm from '@/components/Edit/index'
	import Product from '@/components/View/Product'
	import Images from '@/components/View/Images'
	import Banner from '@/components/View/Banner'
	import UniBanner from '@/components/View/UniBanner';
	export default {
		components: {
			EditForm,
			// Draggable,
			Product,
			Images,
			Banner,
			UniBanner
		},
		data () {
			return {
				drag_type: null,  //拖拽的组件类型
				drag_put_index: null,  // 放置的下标
				typeList: {
					banner: {
						name: '轮播图',
						icon: 'el-icon-picture',
						com: Banner
					},
					product: {
						name: '商品',
						icon: 'el-icon-s-goods',
						com: Product
					},
					images: {
						name: '图片',
						icon: 'el-icon-picture',
						com: Images
					},
					uni_banner: {
						name: 'Uni轮播图',
						icon: 'el-icon-money',
						com: UniBanner
					},
				},
				view: [{
					type: 'info',
					title: '页面标题'
				}],
				title: '首页',

				props: {}, // 传值
				isRight: false,

				className: {
					1: 'one',
					2: 'two',
					3: 'three'
				}
			}
		},
		computed: {
			info () {
				return this.view[0]
			}
		},
		onLoad (options) {
			console.log(options);
			console.log(this.uniAjax);
			console.log(this.api);
			return
			this.uniAjax(this.api.getData, 'get', {}, function (res) {
				if (res.data.code == 0) {
					console.log(res.data);
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						mask: true
					})
				}
			})
		},
		mounted () {
			this.initComponents();
			this.initView();

		},
		methods: {
			// 初始化组件拖拽
			initComponents () {
				let that = this;
				const view = document.querySelector("#typeListView");
				Sortable.create(view, {
					// disabled: false, // 是否禁止拖拽
					// handle: ".sort_icon", //句柄拖拽
					animation: 150, // 拖拽延时，效果更好看
					sort: false,
					group: {
						// 是否开启跨表拖拽
						name: 'name',
						pull: 'clone',
						put: false,
					},
					onEnd: (e) => {
						console.log('放置的下标', e, that.drag_put_index);
						that.drag_type = e.target.children[e.oldIndex].dataset.type;
						// console.log('拖拽的组件类型', that.drag_type);
						if (document.querySelectorAll('#view-content>li').length && e.pullMode == "clone") {
							// 删除拖拽的dom
							document.querySelectorAll('#view-content>li').forEach(el => {
								el.remove();
							})
							// 插入组件到view
							const defaultData = {
								type: this.drag_type, // 组件类型
								data: [], // 数据
								options: {} // 选项操作
							}
							that.view.splice(that.drag_put_index, 0, defaultData)
						}
					},
				});
			},
			// 初始化预览框
			initView () {
				let that = this;
				const view = document.querySelector("#view-content");
				// console.log(view);
				Sortable.create(view, {
					// handle: ".sort_icon", //句柄拖拽
					// animation: 150, // 拖拽延时，效果更好看
					// sort: false,
					group: {
						// 是否开启跨表拖拽
						name: 'name',
						pull: false,
						put: true,
					},
					onEnd: ({ newIndex, oldIndex }) => {
						that.view.splice(newIndex + 1, 0, that.view.splice(oldIndex + 1, 1)[0]);
						let newArray = that.view.slice(0);
						that.view = [{ type: 'info', title: '页面标题' }];
						that.$nextTick(() => {
							that.view = newArray;
							// console.log(this.view);
						});
					},
					// 当拖动元素改变位置时调用
					onChange: function (e) {
						that.drag_put_index = e.newIndex + 1;
					},
				});
			},
			submit () {
				// JSON 转换会丢失 formData
				const form = JSON.parse(JSON.stringify(this.view))

				if (form.length == 1) {
					this.$message.error('请添加模块！')
					return
				}

				for (let i of form) {
					if (i.data && i.data.length == 0) {
						this.$message.error('请填写完整信息！')
						return
					}
					if (i.type === 'product') {
						i.data = i.data.map(val => val.productId).join(',')
					}
				}

				this.$message.success('数据提交成功，请按F12打开控制台查看待提交数据集合！')

				console.log(form) // 提交的数据，根据接口形式修改

				return

				// 上传图片，修改数据字段（兼容接口
				const uploadPromise = {}
				for (let i = 0; i < this.view.length; i++) {
					if (['images', 'banner'].includes(this.view[i].type)) {
						uploadPromise[i] = []
						let list = this.view[i]['data']
						list.forEach((item, index) => {
							uploadPromise[i].push(
								new Promise((resolve, reject) => {
									const link = item.link
									const name = item.name
									imageUpload(item.form).then(res => { // 上传图片接口
										form[i]['data'][index] = {
											url: res.data.url,
											link,
											name
										}
										resolve(res)
									}).catch(err => {
										reject(err)
									})
								})
							)
						})
					}
				}

				let [len, count] = [Object.keys(uploadPromise).length, 0]
				if (len) {
					for (let i in uploadPromise) {
						Promise.all(uploadPromise[i]).then(res => {
							count++
							if (count === len) {
								// 提交数据
							}
						}).catch(err => {
							this.$message.error(err)
						})
					}
				} else {
					// 提交数据
				}
			},
			// 切换视图组件
			selectType (index) {
				this.isRight = false
				this.props = this.view[index]
				this.$nextTick(() => this.isRight = true)
			},
			deleteItem (e, index) {
				e.preventDefault()
				e.stopPropagation()
				this.view.splice(index, 1)
				this.isRight = false
				this.props = {}
			},
			// // 拖拽类型
			// dragStart (e) {
			// 	// console.log(e, 123);
			// 	this.type = e.currentTarget.dataset.type
			// },
			// // 结束拖拽
			// dragEnd (e) {
			// 	console.log(123);
			// 	console.log(this.view[this.index], this.view, this.index);
			// 	this.$delete(this.view[this.index], 'status')
			// 	this.isPush = false
			// 	this.type = null
			// },
			// // 已放置到指定位置
			// drog (e) {
			// 	if (!this.type) { // 内容拖拽
			// 		return
			// 	}
			// 	e.preventDefault()
			// 	e.stopPropagation()
			// 	this.dragEnd()
			// },
			// // 移动中
			// dragOver (e) {
			// 	// console.log(e, this.type, '111');
			// 	if (!this.type) { // 内容拖拽
			// 		return
			// 	}
			// 	e.preventDefault()
			// 	e.stopPropagation()
			// 	console.log(1);

			// 	let className = e.target.className
			// 	let name = className !== 'view-content' ? 'item' : 'view-content'

			// 	const defaultData = {
			// 		type: this.type, // 组件类型
			// 		status: 2, // 默认状态
			// 		data: [], // 数据
			// 		options: {} // 选项操作
			// 	}
			// 	console.log(2, name);

			// 	if (name == 'view-content') {
			// 		if (!this.isPush) {
			// 			this.index = this.view.length
			// 			this.isPush = true
			// 			this.view.push(defaultData)
			// 		}
			// 	} else if (name == 'item') {

			// 		let target = e.target
			// 		let [y, h, curIndex] = [e.offsetY, target.offsetHeight, target.dataset.index]
			// 		let direction = y < (h / 2)

			// 		if (!this.isPush) {
			// 			// Push to Top or Bottom
			// 			if (direction) {
			// 				if (curIndex == 0) {
			// 					this.view.unshift(defaultData)
			// 				} else {
			// 					this.view.splice(curIndex, 0, defaultData)
			// 				}
			// 			} else {
			// 				curIndex = +curIndex + 1
			// 				this.view.splice(curIndex, 0, defaultData)
			// 			}
			// 		} else {
			// 			// Moving
			// 			if (direction) {
			// 				var i = curIndex == 0 ? 0 : curIndex - 1
			// 				var result = this.view[i]['status'] == 2
			// 			} else {
			// 				var i = +curIndex + 1
			// 				var result = this.view.length > i && this.view[i]['status'] == 2
			// 			}

			// 			if (result) return

			// 			const temp = this.view.splice(this.index, 1)
			// 			this.view.splice(curIndex, 0, temp[0])
			// 		}
			// 		this.index = curIndex
			// 		this.isPush = true
			// 	}
			// }
		}
	}
</script>

<style lang="scss">
	.top_main {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 40px;
		background: #ddedff;
		padding: 0 20px;
		box-sizing: border-box;
		.title {
			font-size: 14px;
			color: #6c6c6c;
		}
	}
	.decoration-edit {
		display: flex;
		align-items: center;
		justify-content: space-between;
		// padding: 10px 0;
		background: #f7f8f9;
		height: calc(100vh - 50px);
		position: relative;

		.l,
		.r {
			width: 340px;
			height: 100%;
			// padding: 10px 0;
			background: #fff;
		}

		.l {
			ul {
				margin: 0;
				padding: 0;

				li {
					width: 80px;
					height: 80px;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					cursor: default;
					list-style: none;
					font-size: 14px;
					color: #666;
					float: left;
					margin: 0 10px;
					border-radius: 6px;
					transition: all 0.3s;
					cursor: pointer;

					&:hover {
						background: #efefef;
					}

					span {
						display: block;
						font-size: 40px;
						margin-bottom: 8px;
						color: #999;
					}

					p {
						display: block;
						margin: 0;
						font-size: 12px;
					}
				}
			}
		}

		.c {
			width: auto;
			max-width: 400px;
			position: relative;

			.top-nav {
				position: absolute;
				top: 0;
				background: #fff;
				z-index: 999;
				transition: all 0.3s;

				& * {
					pointer-events: none;
				}

				&:hover {
					transform: scale(0.95);
					border-radius: 10px;
					overflow: hidden;
					box-shadow: 0 0 10px #afafaf;
				}

				.tit {
					position: absolute;
					left: 50%;
					bottom: 10px;
					transform: translateX(-50%);
				}

				img {
					max-width: 100%;
					image-rendering: -moz-crisp-edges;
					image-rendering: -o-crisp-edges;
					image-rendering: -webkit-optimize-contrast;
					image-rendering: crisp-edges;
					-ms-interpolation-mode: nearest-neighbor;
				}
			}
			#view-content {
				width: 100%;
				height: 100%;
			}

			.view-content {
				width: 400px;
				height: 700px;
				background: #f5f5f5;
				overflow-y: auto;
				overflow-x: hidden;
				padding-top: 72px;
				box-shadow: 0 2px 6px #ccc;

				&::-webkit-scrollbar {
					width: 6px;
				}

				&::-webkit-scrollbar-thumb {
					background: #dbdbdb;
				}

				&::-webkit-scrollbar-track {
					background: #f6f6f6;
				}

				.item {
					transition: all 0.3s;
					background: #fff;

					&:hover {
						transform: scale(0.95);
						border-radius: 10px;
						box-shadow: 0 0 10px #afafaf;

						.el-icon-error {
							display: block;
						}
					}

					div {
						pointer-events: none;
					}

					.wait {
						background: #deedff;
						height: 35px;
						text-align: center;
						line-height: 35px;
						font-size: 12px;
						color: #666;
					}

					.el-icon-error {
						position: absolute;
						right: -10px;
						top: -6px;
						color: red;
						font-size: 25px;
						cursor: pointer;
						display: none;
						z-index: 9999;
					}
				}
			}
		}
	}
</style>
