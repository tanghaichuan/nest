
export class nest {

	constructor(options){
		this.options = {
			el : "body", 					// canvas挂载节点
			zIndex : -1,					// 堆叠顺序
			opacity : 1,					// 透明度
			color : "0,0,0",				// 颜色
			count : 50						// 数量
		}
		/*this.frame_func;
		this._line_anima;*/
		this._el;                           // 挂载节点
		this._canvas;						// 画布
		this._random_lines = [];			// 随机线条 			
		this._context;						// 绘画环境(2d)
		this._canWdith = 0;					// canvas默认宽高
		this._canHeight = 0;
		this._currentPoint = {			
			x: null, 						//当前鼠标x
      		y: null, 						//当前鼠标y
     		max: 20000 						// 圈半径的平方
		}

		this._array;						// 缓存随机线及鼠标移动信息
		this._extend(this.options, options);	
		this._init();
	}

	_extend(target, source) {				
		for (let key in source) {
			target[key] = source[key];
		}
	}

	_set_canvas_size() {
		this._el = document.getElementsByTagName(this.options.el)[0];	// 重新获取节点
		this._canWdith = this._el.offsetWidth || this._el.clientWidth;
		this._canHeight = this._el.offsetHeight || this._el.clientWidth;

		//this._canWdith = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		//this._canHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		this._canvas.style.cssText = `position:absolute;top:0;left:0;z-index:${this.options.zIndex};opacity:${this.options.opacity};`;
		// canvas不能在style设置宽高，否在是在默认基础(300px*150px)上进行拉伸
		this._canvas.width = this._canWdith;
		this._canvas.height = this._canHeight;
	}	


	_create_canvas() {
		this._el = document.getElementsByTagName(this.options.el)[0];	// 获取节点
		this._canvas = document.createElement("canvas");
		this._context = this._canvas.getContext("2d");
		
		/*this.frame_func = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(fun) {
			setTimeout(fun, 1000 / 45);
		}*/

		this._el.appendChild(this._canvas);
	}

	_draw_line() {
		for(let i = 0; i < this.options.count; i++){					// 随机生成count条线
			// Math.random返回0-1的一个随机数
			// Math.random()*(max-min+1)+min  max期望最大值 min期望最小值
			this._random_lines.push({
				x : Math.random() * this._canWdith,						// 随机位置				
				y : Math.random() * this._canHeight,
				xa : 2 * Math.random() -1,								// 偏移量
				ya : 2 * Math.random() -1,
				max : 6000												// 粘附距离
			});
		}	
		this._array = this._random_lines.concat([this._currentPoint]);
		//console.log(this._currentPoint)
	}

	_anima_loop() {														// 线条动画
		//window.requestAnimationFrame = this._line_anima();
		requestAnimationFrame(() => this._anima_loop())
		this._context.clearRect(0, 0, this._canWdith, this._canHeight);	// 清空像素
		let e, i, d, x_dist, y_dist, dist;
		this._random_lines.forEach((r, idx) => {
			r.x += r.xa;
			r.y += r.ya;
			r.xa *= r.x > this._canWdith || r.x < 0 ? -1 : 1;
			r.ya *= r.y > this._canHeight || r.y < 0 ? -1 : 1; 			//碰到边界，反向反弹
			
	
			this._context.fillRect(r.x - 0.5, r.y - 0.5, 1, 1); 		//绘制一个宽高为1的点
		
			//从下一个点开始
      for (i = idx + 1; i < this._array.length; i++) {
        e = this._array[i];
        // 当前点存在
        if (null !== e.x && null !== e.y) {
          x_dist = r.x - e.x; //x轴距离 l
          y_dist = r.y - e.y; //y轴距离 n
          dist = x_dist * x_dist + y_dist * y_dist; //总距离, m

          dist < e.max && (
            e === this.currentPoint && dist >= e.max / 2 && (r.x -= 0.03 * x_dist, r.y -= 0.03 * y_dist), //靠近的时候加速
            d = (e.max - dist) / e.max,
            this._context.beginPath(),
            this._context.lineWidth = d / 2,
           
            this._context.moveTo(r.x, r.y),
            this._context.lineTo(e.x, e.y),
            this._context.stroke());
        }
      }
		});
	}

	_listen_point() {
		onmousemove = e => {
			this._currentPoint.x = e.clientX;
			this._currentPoint.y = e.clientY;
		}
		onmouseout = e => {
			this._currentPoint.x = null;
			this._currentPoint.y = null;
		}	
		
	}

	_init() {															// 初始化,封装dom操作
		this._create_canvas();											// 创建画布																	
		this._set_canvas_size();										// 初始化画布大小
		//window.onresize = this._set_canvas_size.bind(this);				// 调整窗口大小时也重置画布大小
		// 监听鼠标移动
		this._listen_point();											// 监听鼠标移动
		
		this._draw_line();

		this._anima_loop();

	}
	getAll(){								
		console.log(this._canWdith,this._canHeight);			
	}

	
}